import { useState, type ChangeEvent, type FormEvent, type InputHTMLAttributes } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RingProgress } from "@/components/site/WeekdayRing";
import { useCart } from "@/lib/cart";
import { PRODUCTS, formatPrice } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const STEPS = ["Cart", "Details", "Payment", "Done"];
const PAYMENT_METHODS = ["Card", "PayPal", "Apple Pay", "MB WAY", "Multibanco"] as const;

const detailsSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  name: z.string().trim().min(2, "Enter your full name").max(100),
  address: z.string().trim().min(3, "Enter your street address").max(200),
  postcode: z.string().trim().min(3, "Enter your postcode").max(20),
  city: z.string().trim().min(2, "Enter your city").max(100),
  country: z.string().trim().min(2).max(60),
});

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — VITADAY" },
      { name: "description", content: "Secure checkout for your VITADAY order. Guest checkout, shipping shown upfront." },
      { property: "og:title", content: "Checkout — VITADAY" },
      { property: "og:description", content: "Complete your VITADAY order." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const { lines, totals, clear } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ email: "", name: "", address: "", postcode: "", city: "", country: "Portugal", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [payment, setPayment] = useState<(typeof PAYMENT_METHODS)[number]>("Card");

  const set = (k: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submitDetails = (e: FormEvent) => {
    e.preventDefault();
    const res = detailsSchema.safeParse(form);
    const errs: Record<string, string> = {};
    if (!res.success) for (const issue of res.error.issues) errs[String(issue.path[0])] = issue.message;
    if (totals.hasSubscription && form.password.length < 8) errs["password"] = "Use at least 8 characters";
    setErrors(errs);
    if (Object.keys(errs).length === 0) setStep(2);
  };

  const placeOrder = () => {
    const order = { number: `VD-${Math.floor(100000 + Math.random() * 900000)}`, subscription: totals.hasSubscription, email: form.email };
    window.sessionStorage.setItem("vitaday-last-order", JSON.stringify(order));
    clear();
    navigate({ to: "/order-confirmation" });
  };

  if (lines.length === 0) {
    return (
      <section className="section-y">
        <div className="container-page max-w-lg text-center">
          <h1 className="text-5xl">Your cart is empty</h1>
          <p className="mt-4 text-muted-foreground">Start with the Essential Starter Kit.</p>
          <Button asChild size="lg" className="mt-8"><Link to="/shop/essential-starter-kit">Get the Starter Kit</Link></Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 md:py-16">
      <div className="container-page grid gap-10 md:grid-cols-[1.3fr_1fr]">
        <div>
          <h1 className="text-5xl">Checkout</h1>
          <div className="mt-6"><RingProgress steps={STEPS} current={step} /></div>

          {step === 0 && (
            <div className="mt-10">
              <h2 className="text-3xl">Review your cart</h2>
              <p className="mt-2 text-sm text-muted-foreground">Checking out as a guest. {totals.hasSubscription ? "Your subscription needs a password so you can manage it." : "No account needed."}</p>
              <Button size="lg" className="mt-8" onClick={() => setStep(1)}>Continue to details</Button>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={submitDetails} className="mt-10 grid gap-4" noValidate>
              <h2 className="text-3xl">Your details</h2>
              <Field id="email" label="Email" type="email" autoComplete="email" value={form.email} onChange={set("email")} error={errors["email"]} />
              <Field id="name" label="Full name" autoComplete="name" value={form.name} onChange={set("name")} error={errors["name"]} />
              <Field id="address" label="Street address" autoComplete="street-address" value={form.address} onChange={set("address")} error={errors["address"]} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="postcode" label="Postcode" autoComplete="postal-code" value={form.postcode} onChange={set("postcode")} error={errors["postcode"]} />
                <Field id="city" label="City" autoComplete="address-level2" value={form.city} onChange={set("city")} error={errors["city"]} />
              </div>
              <Field id="country" label="Country" autoComplete="country-name" value={form.country} onChange={set("country")} error={errors["country"]} />
              {totals.hasSubscription && (
                <div className="rounded-2xl bg-surface p-4">
                  <Field id="password" label="Create a password to manage your subscription" type="password" autoComplete="new-password" value={form.password} onChange={set("password")} error={errors["password"]} />
                  <p className="mt-2 text-xs text-muted-foreground">We only create an account for subscriptions.</p>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setStep(0)}>Back</Button>
                <Button type="submit" size="lg" className="flex-1">Continue to payment</Button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="mt-10">
              <h2 className="text-3xl">Payment</h2>
              <div role="radiogroup" aria-label="Payment method" className="mt-6 grid gap-3">
                {PAYMENT_METHODS.map((m) => (
                  <button key={m} role="radio" aria-checked={payment === m} onClick={() => setPayment(m)}
                    className={cn("flex min-h-14 items-center gap-3 rounded-2xl border px-4 text-left", payment === m ? "border-gold bg-card shadow-soft" : "border-border hover:border-foreground/30")}>
                    <span className={cn("grid h-5 w-5 place-items-center rounded-full border", payment === m ? "border-gold-ink bg-gold-ink" : "border-foreground/30")}>
                      {payment === m && <span className="h-2 w-2 rounded-full bg-card" />}
                    </span>
                    <span className="text-sm">{m}</span>
                  </button>
                ))}
              </div>
              <p className="mt-4 rounded-xl bg-surface p-3 text-xs text-muted-foreground">Demo checkout — no payment is taken yet. Payments will be connected before launch.</p>
              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button size="lg" className="flex-1" onClick={placeOrder}><Lock className="h-4 w-4" aria-hidden="true" />Place order · {formatPrice(totals.totalCents)}</Button>
              </div>
            </div>
          )}
        </div>

        <aside className="self-start rounded-3xl bg-card p-6 shadow-soft md:sticky md:top-24">
          <h2 className="font-display text-2xl">Order summary</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {lines.map((l) => {
              const p = PRODUCTS[l.id];
              return (
                <li key={l.id} className="flex justify-between gap-4">
                  <span>{l.qty} × {p.name}</span>
                  <span className="shrink-0">{formatPrice(p.priceCents * l.qty)}{p.recurring && "/mo"}</span>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(totals.subtotalCents)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{formatPrice(totals.shippingCents)}</span></div>
            <div className="flex justify-between text-base font-medium"><span>Total today</span><span>{formatPrice(totals.totalCents)}</span></div>
            {totals.hasSubscription && <p className="text-xs text-muted-foreground">Then {formatPrice(totals.recurringCents)}/month. Pause, skip or cancel anytime in 2 clicks.</p>}
          </div>
        </aside>
      </div>
    </section>
  );
}

function Field({ id, label, error, ...props }: { id: string; label: string; error?: string | undefined } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} className="h-11 rounded-xl bg-card" {...props} />
      {error && <p id={`${id}-err`} className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
