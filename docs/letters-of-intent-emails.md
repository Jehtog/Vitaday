# Letters of intent: storage and confirmation emails

Reference for what exists outside this repo. The database objects below were
created with direct SQL against Supabase, so they are **not** in Lovable's
migration history. If Lovable ever regenerates migrations or types, check them
against this file.

## Where things live

| Piece | Where | Managed by |
|---|---|---|
| Reservation form | `src/routes/checkout.tsx` | this repo |
| Insert | `recordLetterOfIntent` in `src/lib/signups.ts` | this repo |
| `letters_of_intent` table | Supabase | direct SQL (below) |
| `loi_mailer_config` table | Supabase | direct SQL (below) |
| Insert trigger | Supabase | direct SQL (below) |
| Email sending | Google Apps Script, owned by vitaday.clsbe@gmail.com | Google |

## Flow

Someone signs at `/checkout` -> row inserted into `letters_of_intent` ->
`letters_of_intent_notify` trigger -> `net.http_post` to the Apps Script web
app -> two emails: a confirmation to the signer and an alert to the team.

The trigger swallows its own errors on purpose: a failure to send email must
never roll back the insert, because losing a signature is worse than losing a
notification. The consequence is that mail failures are silent. To check
whether mail is going out, open the Apps Script project and look at
**Executions**, not the website.

## Gotchas that cost time

- The function is `net.http_post`, not `extensions.net_http_post`.
- pg_net rejects any `Content-Type` other than `application/json`.
- In a web app deployed with "Anyone" access, `Session.getActiveUser()`
  returns an empty string. Use `getEffectiveUser()`, or set the address
  explicitly.
- Gmail's free sending limit is 100 recipients per day. Each signature uses
  two, so roughly 50 signatures a day.

## Schema

```sql
create table public.letters_of_intent (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  name text not null,
  items jsonb not null default '[]'::jsonb,
  subscription boolean not null default false,
  amount_cents integer not null default 0,
  reference text
);
alter table public.letters_of_intent enable row level security;

-- Insert only. There is no select policy, so the public key can write a
-- letter but cannot read anyone else's back.
create policy "Anyone can sign a valid letter of intent"
  on public.letters_of_intent for insert to anon, authenticated
  with check (
    char_length(email) >= 3 and char_length(email) <= 255
    and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    and char_length(name) >= 1 and char_length(name) <= 120
    and amount_cents >= 0 and amount_cents <= 1000000
    and (reference is null or char_length(reference) <= 40)
  );

create index letters_of_intent_created_at_idx
  on public.letters_of_intent (created_at desc);
```

## Mailer config

Holds the Apps Script URL and the shared token. RLS is on with **no policies
at all**, so only the service role and SECURITY DEFINER functions can read it.
The token is not in this repo; it lives in this table and in the Apps Script
source.

```sql
create table public.loi_mailer_config (
  id boolean primary key default true check (id),
  endpoint text not null,
  token text not null
);
alter table public.loi_mailer_config enable row level security;
```

## Trigger

```sql
create extension if not exists pg_net;

create or replace function public.notify_letter_of_intent()
returns trigger
language plpgsql
security definer
set search_path = public, net, extensions
as $$
declare
  cfg public.loi_mailer_config%rowtype;
begin
  select * into cfg from public.loi_mailer_config where id limit 1;
  if not found then
    return new;
  end if;

  perform net.http_post(
    url := cfg.endpoint,
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := jsonb_build_object(
      'token', cfg.token,
      'name', new.name,
      'email', new.email,
      'reference', new.reference,
      'subscription', new.subscription,
      'amount_cents', new.amount_cents,
      'items', new.items,
      'created_at', new.created_at
    )
  );
  return new;
exception when others then
  raise warning 'letter of intent email failed: %', sqlerrm;
  return new;
end;
$$;

create trigger letters_of_intent_notify
  after insert on public.letters_of_intent
  for each row execute function public.notify_letter_of_intent();
```
