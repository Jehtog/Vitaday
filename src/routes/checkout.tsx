import { useState, type ChangeEvent, type FormEvent, type InputHTMLAttributes } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FileSignature } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RingProgress } from "@/components/site/WeekdayRing";
import { useCart } from "@/lib/cart";
import { PRODUCTS, formatPrice } from "@/lib/catalog";
import { recordLetterOfIntent } from "@/lib/signups";
import { cn } from "@/lib/utils";

const STEPS = ["Review", "Your details", "Letter of intent", "Done"];

const detailsSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  name: z.string().trim().min(2, "Enter your full name").max(100),
});

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Reserve your VITADAY — letter of intent" },
      { name: "description", content: "Record a non-binding letter of intent for VITADAY. No payment is taken." },
      { property: "og:title", content: "Reserve your VITADAY" },
      { property: "og:description", content: "A non-binding letter of intent. No payment is taken." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Reserve,
});

function Reserve() {
  const { lines, totals, clear } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ email: "", name: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreed, setAgreed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submitDetails = (e: FormEvent) => {
    e.preventDefault();
    const res = detailsSchema.safeParse(form);
    const errs: Record<string, string> = {};
    if (!res.success) for (const issue of res.error.issues) errs[String(issue.path[0])] = issue.message;
    setErrors(errs);
    if (Object.keys(errs).length === 0) setStep(2);
  };

  const signLetter = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      await recordLetterOfIntent(form.email);
      const record = {
        number: `VD-LOI-${Math.floor(100000 + Math.random() * 900000)}`,
        subscription: totals.hasSubscription,
        email: form.email,
        name: form.name,
        amountCents: totals.totalCents,
      };
      window.sessionStorage.setItem("vitaday-last-intent", JSON.stringify(record));
      clear();
      navigate({ to: "/order-confirmation" });
    } catch {
      setSaveError("We couldn't save your letter of intent. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (lines.length === 0) {
    return (
      <section className="section-y">
        <div className="container-page max-w-lg text-center">
          <h1 className="text-5xl">You haven&rsquo;t reserved anything yet</h1>
          <p className="mt-4 text-muted-foreground">Start with the Essential Starter Kit.</p>
          <Button asChild size="lg" className="mt-8"><Link to="/shop/essential-starter-kit">Reserve the Starter Kit</Link></Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 md:py-16">
      <div className="container-page grid gap-10 md:grid-cols-[1.3fr_1fr]">
        <div>
          <h1 className="text-5xl">Reserve your VITADAY</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            VITADAY is a student project at Cat&oacute;lica Lisbon and is not on sale yet. This records a
            non-binding letter of intent. No payment is taken and nothing ships.
          </p>
          <div className="mt-6"><RingProgress steps={STEPS} current={step} /></div>

          {step === 0 && (
            <div className="mt-10">
              <h2 className="text-3xl">What you&rsquo;re reserving</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                The prices shown are the intended launch prices. They are indicative and may change before launch.
              </p>
              <Button size="lg" className="mt-8" onClick={() => setStep(1)}>Continue</Button>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={submitDetails} className="mt-10 grid gap-4" noValidate>
              <h2 className="text-3xl">Your details</h2>
              <p className="-mt-2 text-sm text-muted-foreground">
                We only ask for a name and an email. We don&rsquo;t need an address, because nothing is being shipped.
              </p>
              <Field id="name" label="Full name" autoComplete="name" value={form.name} onChange={set("name")} error={errors["name"]} />
              <Field id="email" label="Email" type="email" autoComplete="email" value={form.email} onChange={set("email")} error={errors["email"]} />
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setStep(0)}>Back</Button>
                <Button type="submit" size="lg" className="flex-1">Continue</Button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="mt-10">
              <h2 className="text-3xl">Letter of intent</h2>
              <div className="mt-6 rounded-2xl border border-border bg-card p-6 text-sm leading-relaxed">
                <p>
                  I, <span className="font-medium">{form.name || "—"}</span>, confirm that I intend to purchase the
                  following from VITADAY when it becomes available, at the indicated launch price of{" "}
                  <span className="font-medium">{formatPrice(totals.totalCents)}</span>:
                </p>
                <ul className="mt-3 list-disc pl-5">
                  {lines.map((line) => {
                    const p = PRODUCTS[line.id];
                    return <li key={line.id}>{p?.name ?? line.id} &times; {line.qty}</li>;
                  })}
                </ul>
                <p className="mt-4 text-muted-foreground">
                  This letter of intent records my interest only. It is <span className="font-medium">not an order and not a contract</span>.
                  Neither I nor VITADAY is under any obligation to buy or to supply, no payment is taken now, and the price
                  and launch date may change. I can withdraw this letter of intent at any time by replying to the email
                  VITADAY sends me.
                </p>
              </div>

              <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm">
                <input type="checkbox" className="mt-1 h-4 w-4 accent-[var(--col-gold-ink,#8a6d2f)]"
                  checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                <span>I have read the letter of intent above and confirm it reflects my intention.</span>
              </label>

              {saveError && <p className="mt-4 text-sm text-destructive">{saveError}</p>}

              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button size="lg" className="flex-1" disabled={!agreed || saving} onClick={signLetter}>
                  <FileSignature className="h-4 w-4" aria-hidden="true" />
                  {saving ? "Saving…" : "Record my letter of intent"}
                </Button>
              </div>
            </div>
          )}
        </div>

        <aside className="self-start rounded-3xl bg-card p-6 shadow-soft">
          <h2 className="font-display text-2xl">Summary</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {lines.map((line) => {
              const p = PRODUCTS[line.id];
              return (
                <li key={line.id} className="flex justify-between gap-4">
                  <span>{p?.name ?? line.id} &times; {line.qty}</span>
                  <span>{formatPrice((p?.priceCents ?? 0) * line.qty)}</span>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 flex justify-between border-t border-border pt-4 text-sm font-medium">
            <span>Indicative total</span><span>{formatPrice(totals.totalCents)}</span>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Indicative launch price. No payment is taken.</p>
        </aside>
      </div>
    </section>
  );
}

function Field({ id, label, error, ...rest }: { id: string; label: string; error?: string | undefined } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} className={cn("mt-1", error && "border-destructive")} aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined} {...rest} />
      {error && <p id={`${id}-error`} className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
