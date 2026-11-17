import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ImageSlot } from "@/components/site/ui-bits";
import { NutritionTable } from "@/components/site/NutritionTable";
import { CollectionIcon } from "@/components/site/CollectionIcon";
import { WaitlistDialog } from "@/components/site/WaitlistDialog";
import { COLLECTIONS, type CollectionId } from "@/lib/catalog";
import { MANDATORY_NOTES } from "@/lib/ingredients";
import { collectionBox } from "@/lib/media";

export const Route = createFileRoute("/collections_/$id")({
  loader: ({ params }) => {
    const c = COLLECTIONS.find((x) => x.id === params.id && !x.available);
    if (!c) throw notFound();
    return c;
  },
  head: ({ loaderData }) => {
    const name = loaderData?.name ?? "Collection";
    const text = `VITADAY ${name} — ${loaderData?.tagline ?? ""}. Planned ingredients and waitlist.`;
    return {
      meta: [
        { title: `VITADAY ${name} — coming soon` },
        { name: "description", content: text },
        { property: "og:title", content: `VITADAY ${name}` },
        { property: "og:description", content: text },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CollectionDetail,
});

function CollectionDetail() {
  const c = Route.useLoaderData();
  const [open, setOpen] = useState(false);
  const id = c.id as Exclude<CollectionId, "essential">;
  return (
    <div className="container-page grid gap-10 py-8 md:grid-cols-2 md:py-14">
      <div className={`overflow-hidden rounded-3xl shadow-soft md:sticky md:top-24 md:self-start ${c.colorClass}`}>
        <ImageSlot slot={`collection-detail-${c.id}`} src={collectionBox[c.id]} alt={`VITADAY ${c.name} 7-day refill box`} eager className="aspect-[4/5] rounded-none" />
      </div>
      <div>
        <Link to="/collections" className="text-sm text-gold-ink underline underline-offset-4">← All collections</Link>
        <p className="eyebrow mt-6 flex items-center gap-2"><CollectionIcon id={c.id} className="h-4 w-4" />{c.tagline} · Coming soon</p>
        <h1 className="mt-3 text-5xl md:text-6xl">{c.name}</h1>
        <p className="mt-4 text-muted-foreground">{c.description} It fits the same VITADAY bottle as every other collection.</p>
        <Button size="lg" className="mt-8 w-full sm:w-auto" onClick={() => setOpen(true)}>Join the {c.name} waitlist</Button>
        <div className="mt-10 rounded-3xl bg-card p-6 shadow-soft">
          <h2 className="text-3xl">Ingredients & nutrition facts</h2>
          <p className="mt-2 text-sm text-muted-foreground">Planned formulation — may change before launch.</p>
          <div className="mt-6"><NutritionTable collection={c.id} /></div>
          <ul className="mt-6 list-disc space-y-1 pl-5 text-xs text-muted-foreground">{MANDATORY_NOTES.map((n) => <li key={n}>{n}</li>)}</ul>
        </div>
      </div>
      <WaitlistDialog collection={open ? id : null} onOpenChange={setOpen} />
    </div>
  );
}
