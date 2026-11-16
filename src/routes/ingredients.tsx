import { useState, type ReactNode } from "react";
import { COLLECTIONS, type CollectionId } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Leaf, MapPin, Citrus } from "lucide-react";
import { SectionHeading, ImageSlot } from "@/components/site/ui-bits";
import { NutritionTable } from "@/components/site/NutritionTable";
import { HEALTH_CLAIMS, MANDATORY_NOTES } from "@/lib/ingredients";
import { media } from "@/lib/media";

export const Route = createFileRoute("/ingredients")({
  head: () => ({
    meta: [
      { title: "Ingredients — VITADAY Essential" },
      { name: "description", content: "What's in VITADAY Essential: vitamins C, B6, B12 and selected B vitamins, Lemon & Peach flavour. Full transparency." },
      { property: "og:title", content: "VITADAY Essential ingredients" },
      { property: "og:description", content: "Transparent ingredients, origin and allergen information." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Ingredients,
});

function Ingredients() {
  const [col, setCol] = useState<CollectionId>("essential");
  return (
    <>
      <section className="section-y bg-essential">
        <div className="container-page grid items-center gap-10 md:grid-cols-2">
          <SectionHeading as="h1" align="left" eyebrow="Ingredients" title="Nothing hidden. Here's what's inside." text="VITADAY Essential is a daily multivitamin food supplement in Lemon & Peach." />
          <ImageSlot slot="ingredients-powder" src={media.powderRelease.src} alt={media.powderRelease.alt} eager className="aspect-[2/1] shadow-soft" />
        </div>
      </section>

      <section className="section-y">
        <div className="container-page grid gap-10 md:grid-cols-[1.4fr_1fr]">
          <div className="min-w-0 rounded-3xl bg-card p-6 shadow-soft md:p-10">
            <h2 className="text-3xl">Nutrition facts</h2>
            <div role="tablist" aria-label="Collection" className="mt-5 flex flex-wrap gap-2">
              {COLLECTIONS.map((c) => (
                <button key={c.id} role="tab" aria-selected={c.id === col} onClick={() => setCol(c.id)}
                  className={cn("min-h-11 rounded-full border px-4 text-sm", c.id === col ? "border-gold bg-surface" : "border-border")}>
                  {c.name}{!c.available && <span className="ml-1 text-xs text-muted-foreground">· soon</span>}
                </button>
              ))}
            </div>
            <div className="mt-6"><NutritionTable collection={col} /></div>
          </div>
          <div className="space-y-5">
            <Info icon={<Leaf className="h-5 w-5" />} title="Key vitamins">Vitamin C, vitamin B6, vitamin B12 and selected B vitamins.</Info>
            <Info icon={<Citrus className="h-5 w-5" />} title="Flavour">Lemon & Peach. [Placeholder — natural flavourings to be confirmed.]</Info>
            <Info icon={<MapPin className="h-5 w-5" />} title="Origin">[Placeholder — where our vitamins are sourced and the refills are filled.]</Info>
            <Info icon={<AlertTriangle className="h-5 w-5" />} title="Allergens">[Placeholder — allergen statement for the final formulation.]</Info>
          </div>
        </div>
      </section>

      <section className="section-y bg-surface">
        <div className="container-page grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-3xl">What vitamins do</h2>
            <p className="mt-2 text-sm text-muted-foreground">We only use EU-authorised health claims.</p>
            <ul className="mt-6 space-y-3">
              {HEALTH_CLAIMS.map((c) => <li key={c} className="rounded-2xl bg-card p-4 text-sm shadow-soft">{c}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="text-3xl">Please note</h2>
            <ul className="mt-6 space-y-3">
              {MANDATORY_NOTES.map((n) => (
                <li key={n} className="flex gap-3 rounded-2xl border border-gold/60 bg-card p-4 text-sm">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-gold-ink" aria-hidden="true" />{n}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

function Info({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="flex gap-4 rounded-2xl bg-card p-5 shadow-soft">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold-soft text-gold-ink">{icon}</span>
      <div><h3 className="font-sans text-sm font-medium">{title}</h3><p className="mt-1 text-sm text-muted-foreground">{children}</p></div>
    </div>
  );
}
