import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SectionHeading, ImageSlot } from "@/components/site/ui-bits";
import { PRODUCTS, PURCHASE_OPTIONS, formatPrice } from "@/lib/catalog";
import { collectionBox, media } from "@/lib/media";
import { useCart } from "@/lib/cart";

const IMG: Record<string, string> = {
  "starter-kit": media.bottlePlinth.src,
  bottle: media.bottleHero.src,
  "refill-7": media.refillBox.src,
  "refill-28": collectionBox.essential,
  "subscription-28": media.ringInsert.src,
};

export const Route = createFileRoute("/shop/")({
  head: () => ({
    meta: [
      { title: "Shop — VITADAY Starter Kit, bottle & Essential refills" },
      { name: "description", content: "Shop the VITADAY Essential Starter Kit, the bottle on its own, 7-day and 28-day refills, or a monthly refill subscription." },
      { property: "og:title", content: "Shop VITADAY" },
      { property: "og:description", content: "Starter Kit €34.99, refills from €5.99, subscription €17.99/month." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { add } = useCart();
  return (
    <section className="section-y">
      <div className="container-page">
        <SectionHeading as="h1" eyebrow="Shop" title="Start your week." text="Begin with the Starter Kit. Keep going with refills." />
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PURCHASE_OPTIONS.map((id) => {
            const p = PRODUCTS[id];
            return (
              <li key={id} className="flex flex-col overflow-hidden rounded-3xl bg-card shadow-soft">
                <Link to="/shop/essential-starter-kit" search={{ option: id }} className="block">
                  <ImageSlot slot={`shop-${id}`} src={IMG[id] ?? media.bottleHero.src} alt={p.name} className="aspect-[4/3] rounded-none" />
                </Link>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-2xl">{p.name}</h2>
                    {p.badge && <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] uppercase tracking-wider text-primary-foreground">{p.badge}</span>}
                  </div>
                  <p className="text-sm text-muted-foreground">{p.note ?? p.short}</p>
                  <p className="mt-4 text-lg">{formatPrice(p.priceCents)}{p.recurring && <span className="text-sm text-muted-foreground">/month</span>}</p>
                  <div className="mt-auto flex gap-2 pt-6">
                    <Button className="flex-1" onClick={() => add(id)}>Add to cart</Button>
                    <Button asChild variant="outline"><Link to="/shop/essential-starter-kit" search={{ option: id }}>Details</Link></Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
