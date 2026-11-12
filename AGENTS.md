<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules

- Prices, product list, collections and shipping live in `src/lib/catalog.ts` (cents); cart maths in `src/lib/pricing.ts` with tests in `pricing.test.ts` — keep money logic in one tested place.
- All product images are referenced through `src/lib/media.ts` (image slots, `data-image-slot`) so renders can be swapped in one file.
- Shared UI strings live in `src/i18n/en.ts`; add sibling locale files with the same keys for translations.
- Cart is client-only state (React context + localStorage); checkout is a frontend mock until a payment provider is connected.
- Waitlist, newsletter and collection votes are inserted from the browser into insert-only tables (no anon reads); vote totals come from a security-definer count function.
- Ad landing pages (`/students`, `/professionals`) render without the main header/footer via `LANDING_PATHS` in `__root.tsx`.
