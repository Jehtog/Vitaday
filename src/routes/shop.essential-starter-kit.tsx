import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Repeat, Truck } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ImageSlot, VideoSlot } from "@/components/site/ui-bits";
import { HowItWorksSteps } from "@/components/site/sections";
import { FLAVORS, PRODUCTS, PURCHASE_OPTIONS, formatPrice, type ProductId } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { media } from "@/lib/media";
import { deliveryWindow, fmtDay } from "@/lib/delivery";
import { NUTRITION_ROWS, MANDATORY_NOTES } from "@/lib/ingredients";
import { cn } from "@/lib/utils";

const GALLERY = [
  { ...media.bottleHero, slot: "pdp-product" },
  { ...media.ringInsert, slot: "pdp-refill-ring" },
  { ...media.bottleInHand, slot: "pdp-size-in-hand" },
  { ...media.lifestyleDesk, slot: "pdp-lifestyle" },
  { ...media.capCloseup, slot: "pdp-cap" },
];

export const Route = createFileRoute("/shop/essential-starter-kit")({
  validateSearch: (search: Record<string, unknown>): { option?: ProductId } =>
    typeof search["option"] === "string" && (PURCHASE_OPTIONS as string[]).includes(search["option"])
      ? { option: search["option"] as ProductId }
      : {},
  head: () => ({
    meta: [
      { title: "VITADAY Essential Starter Kit — €34.99" },
      { name: "description", content: "Glass bottle with a 7-day vitamin cap plus your first Essential Weekly Refill Ring in Lemon & Peach." },
      { property: "og:title", content: "VITADAY Essential Starter Kit" },
      { property: "og:description", content: "Bottle + 7-day Essential ring for €34.99. Refills from €5.99." },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const search = Route.useSearch();
  const [option, setOption] = useState<ProductId>(search.option ?? "starter-kit");
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [window_, setWindow] = useState<[Date, Date] | null>(null);
  const { add } = useCart();
  const current = GALLERY[active] ?? GALLERY[0]!;

  useEffect(() => setWindow(deliveryWindow(new Date())), []);
  useEffect(() => { if (search.option) setOption(search.option); }, [search.option]);

  const product = PRODUCTS[option];

  return (
    <>
      <div className="container-page grid gap-10 py-8 md:grid-cols-2 md:py-14">
        {/* Gallery */}
        <div className="md:sticky md:top-24 md:self-start">
          <ImageSlot slot={current.slot} src={current.src} alt={current.alt} eager className="aspect-[4/5] shadow-soft" />
          <div className="mt-3 grid grid-cols-6 gap-2">
            {GALLERY.map((g, i) => (
              <button key={g.slot} onClick={() => setActive(i)} aria-label={`Show image: ${g.alt}`}
                className={cn("aspect-square overflow-hidden rounded-xl border-2 transition-colors", i === active ? "border-gold" : "border-transparent")}>
                <img src={g.src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
            <a href="#video" className="grid aspect-square place-items-center rounded-xl border border-dashed border-gold text-[10px] uppercase tracking-widest text-gold-ink">Video</a>
          </div>
        </div>

        {/* Buy box */}
        <div>
          <p className="eyebrow">VITADAY Essential</p>
          <h1 className="mt-3 text-5xl md:text-6xl">Essential Starter Kit</h1>
          <p className="mt-4 text-2xl">{formatPrice(PRODUCTS["starter-kit"].priceCents)}</p>
          <p className="mt-4 text-muted-foreground">
            Your whole week of vitamins, ready in the cap. Turn to today, press, shake and drink — no pill box, no sachets, no forgetting whether you already did.
          </p>

          <fieldset className="mt-8">
            <legend className="eyebrow">Choose your option</legend>
            <div role="radiogroup" className="mt-3 grid gap-3">
              {PURCHASE_OPTIONS.map((id) => {
                const p = PRODUCTS[id];
                const on = id === option;
                return (
                  <button key={id} role="radio" aria-checked={on} onClick={() => setOption(id)}
                    className={cn("flex min-h-16 items-center gap-4 rounded-2xl border p-4 text-left transition-all",
                      on ? "border-gold bg-card shadow-soft" : "border-border hover:border-foreground/30")}>
                    <span className={cn("grid h-5 w-5 shrink-0 place-items-center rounded-full border", on ? "border-gold-ink bg-gold-ink" : "border-foreground/30")}>
                      {on && <span className="h-2 w-2 rounded-full bg-card" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium">{p.name}</span>
                        {p.badge && <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] uppercase tracking-wider text-primary-foreground">{p.badge}</span>}
                      </span>
                      <span className="block text-xs text-muted-foreground">{p.note ?? p.short}</span>
                    </span>
                    <span className="shrink-0 text-sm">{formatPrice(p.priceCents)}{p.recurring && <span className="text-muted-foreground">/month</span>}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {option !== "bottle" && (
            <fieldset className="mt-6">
              <legend className="eyebrow">Flavour</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {FLAVORS.map((f) => (
                  <button key={f.id} disabled={!f.available} aria-pressed={f.available}
                    className={cn("min-h-11 rounded-full border px-5 text-sm", f.available ? "border-gold bg-card" : "border-dashed border-border text-muted-foreground")}>
                    {f.name}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          <div className="mt-8 flex items-center gap-3">
            <div className="flex h-13 items-center rounded-full border border-border bg-card">
              <button className="grid h-12 w-12 place-items-center" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity"><Minus className="h-4 w-4" /></button>
              <span className="w-8 text-center" aria-live="polite">{qty}</span>
              <button className="grid h-12 w-12 place-items-center" onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity"><Plus className="h-4 w-4" /></button>
            </div>
            <Button size="lg" className="flex-1" onClick={() => add(option, qty)}>
              Add to cart · {formatPrice(product.priceCents * qty)}{product.recurring ? "/mo" : ""}
            </Button>
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Truck className="h-4 w-4 text-gold-ink" aria-hidden="true" />
            Estimated delivery: {window_ ? `${fmtDay(window_[0])} – ${fmtDay(window_[1])}` : "3–5 business days"}
          </p>

          <div className="mt-8 rounded-2xl bg-surface p-5">
            <p className="eyebrow">What's in the box</p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>1 × VITADAY glass bottle with 7-day cap and carry loop</li>
              <li>1 × Essential Weekly Refill Ring (7 daily portions, Lemon & Peach)</li>
              <li>1 × Quick-start card</li>
            </ul>
          </div>

          <Accordion type="single" collapsible className="mt-8">
            <PdpSection title="How it works">
              <ol className="list-decimal space-y-1 pl-5">
                <li>Open the cap.</li><li>Drop in your Weekly Refill Ring.</li><li>Rotate to today, press, shake and drink.</li>
              </ol>
            </PdpSection>
            <PdpSection title="Ingredients & nutrition facts">
              <NutritionTable />
            </PdpSection>
            <PdpSection title="Allergens">
              <p>Allergen information will be confirmed with the final formulation. [Placeholder — add allergen statement.]</p>
            </PdpSection>
            <PdpSection title="Directions & warnings">
              <p>Take one portion (one chamber) per day dissolved in water.</p>
              <ul className="mt-3 list-disc space-y-1 pl-5">{MANDATORY_NOTES.map((n) => <li key={n}>{n}</li>)}</ul>
            </PdpSection>
            <PdpSection title="Cleaning & care">
              <p>Remove the cap and ring, rinse the glass with warm water and mild soap, and let everything dry before reassembling.</p>
            </PdpSection>
            <PdpSection title="Shipping & returns">
              <p>Shipping costs are shown in your cart before checkout. <Link to="/shipping-returns" className="text-gold-ink underline underline-offset-4">Read our shipping & returns policy</Link>.</p>
            </PdpSection>
          </Accordion>
        </div>
      </div>

      <section id="video" className="container-page scroll-mt-24 pb-16">
        <VideoSlot label="Essential Starter Kit — product video" />
      </section>

      <section className="bg-surface section-y">
        <div className="container-page">
          <h2 className="text-center text-4xl">Three steps, every day</h2>
          <div className="mt-10"><HowItWorksSteps /></div>
        </div>
      </section>

      {/* Cross-sell */}
      <section className="section-y">
        <div className="container-page">
          <div className="grid items-center gap-8 rounded-3xl bg-card p-6 shadow-lift md:grid-cols-[1fr_1.4fr] md:p-10">
            <ImageSlot slot="crosssell-refill" src={media.refillBox.src} alt={media.refillBox.alt} className="aspect-square" />
            <div>
              <Repeat className="h-6 w-6 text-gold-ink" strokeWidth={1.4} aria-hidden="true" />
              <h2 className="mt-4 text-4xl">Never run out — subscribe to refills</h2>
              <p className="mt-3 text-muted-foreground">28 Essential portions every month for {formatPrice(PRODUCTS["subscription-28"].priceCents)}. Pause, skip or cancel anytime in 2 clicks.</p>
              <Button className="mt-6" onClick={() => add("subscription-28", 1)}>Add subscription</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function PdpSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <AccordionItem value={title} className="border-border">
      <AccordionTrigger className="min-h-14 text-base font-normal hover:no-underline">{title}</AccordionTrigger>
      <AccordionContent className="text-sm text-muted-foreground">{children}</AccordionContent>
    </AccordionItem>
  );
}

export function NutritionTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[320px] text-left text-sm">
        <caption className="pb-3 text-left text-xs text-muted-foreground">Per daily portion (1 chamber). Values are placeholders until the final formulation.</caption>
        <thead>
          <tr className="border-b border-border text-foreground">
            <th scope="col" className="py-2 font-medium">Nutrient</th>
            <th scope="col" className="py-2 font-medium">Amount</th>
            <th scope="col" className="py-2 font-medium">% NRV*</th>
          </tr>
        </thead>
        <tbody>
          {NUTRITION_ROWS.map((r) => (
            <tr key={r.name} className="border-b border-border/60">
              <td className="py-2">{r.name}</td><td className="py-2">[__ {r.unit}]</td><td className="py-2">[__ %]</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-xs text-muted-foreground">*NRV = Nutrient Reference Value</p>
    </div>
  );
}
