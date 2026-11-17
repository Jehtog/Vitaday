import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Clock, PackageOpen, Star, ThumbsUp, CircleHelp } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { COLLECTIONS, PRODUCTS, formatPrice, type CollectionId } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { collectionBox, media } from "@/lib/media";
import { fetchVoteCounts, voteForCollection } from "@/lib/signups";
import type { FaqItem } from "@/lib/faq";
import { cn } from "@/lib/utils";
import { CollectionIcon } from "./CollectionIcon";
import { ImageSlot, SectionHeading, StepNumber } from "./ui-bits";
import { WaitlistDialog } from "./WaitlistDialog";
import { keyIngredients } from "@/lib/ingredients";

export const STEPS = [
  { title: "Open the cap", text: "Lift the cap off your VITADAY bottle.", img: media.stepOpen },
  { title: "Drop in your Weekly Refill Ring", text: "Seven pre-filled chambers click into place — one for every day.", img: media.stepDrop },
  { title: "Rotate to today, press, shake & drink", text: "Turn the ring to today, press to release, shake and enjoy.", img: media.stepRotate },
];

export function HowItWorksSteps({ withImages = true }: { withImages?: boolean }) {
  return (
    <ol className="grid gap-6 md:grid-cols-3">
      {STEPS.map((s, i) => (
        <li key={s.title} className="flex flex-col rounded-2xl bg-card p-5 shadow-soft">
          {withImages && <ImageSlot slot={`step-${i + 1}`} src={s.img.src} alt={s.img.alt} className="mb-5 aspect-[4/3]" />}
          <div className="flex items-start gap-4">
            <StepNumber n={i + 1} />
            <div>
              <h3 className="font-display text-2xl">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function ProblemStrip() {
  const items = [
    { icon: CircleHelp, text: "“Did I take them today?”" },
    { icon: PackageOpen, text: "“One more thing to carry.”" },
    { icon: Clock, text: "“Busy weeks break routines.”" },
  ];
  return (
    <section className="border-y border-border bg-surface" aria-label="Sound familiar?">
      <ul className="container-page grid gap-6 py-10 md:grid-cols-3 md:py-12">
        {items.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-4 md:justify-center">
            <Icon className="h-6 w-6 shrink-0 text-gold-ink" strokeWidth={1.3} aria-hidden="true" />
            <p className="font-display text-2xl italic">{text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Starter Kit card with one-time / subscribe toggle. */
export function StarterKitOffer({ className, showDetailsLink = true }: { className?: string; showDetailsLink?: boolean }) {
  const [mode, setMode] = useState<"once" | "subscribe">("once");
  const { add } = useCart();
  const kit = PRODUCTS["starter-kit"];
  const sub = PRODUCTS["subscription-28"];

  const buy = () => {
    add("starter-kit", 1, { openDrawer: mode === "once" });
    if (mode === "subscribe") add("subscription-28", 1);
  };

  return (
    <div className={cn("grid overflow-hidden rounded-3xl bg-card shadow-lift md:grid-cols-2", className)}>
      <ImageSlot slot="starter-kit" src={media.bottlePlinth.src} alt={media.bottlePlinth.alt} className="aspect-[4/5] rounded-none md:aspect-auto" imgClassName="object-[center_30%]" />
      <div className="flex flex-col justify-center p-6 md:p-10">
        <p className="eyebrow">Starter Kit</p>
        <h3 className="mt-3 font-display text-4xl">VITADAY Essential</h3>
        <p className="mt-3 text-muted-foreground">Glass bottle with the 7-day cap, plus your first Weekly Refill Ring — Lemon & Peach.</p>

        <div role="radiogroup" aria-label="Purchase type" className="mt-6 grid gap-3">
          {([
            { id: "once", title: "One-time purchase", price: formatPrice(kit.priceCents), note: "Bottle + 7-day ring" },
            { id: "subscribe", title: "Subscribe & save 10%", price: `${formatPrice(kit.priceCents)} + ${formatPrice(sub.priceCents)}/mo`, note: "Starter Kit + monthly refills. Pause, skip or cancel anytime." },
          ] as const).map((o) => (
            <button key={o.id} role="radio" aria-checked={mode === o.id} onClick={() => setMode(o.id)}
              className={cn("flex min-h-14 items-center gap-3 rounded-2xl border p-4 text-left transition-colors",
                mode === o.id ? "border-gold bg-gold-soft/40" : "border-border hover:border-foreground/30")}>
              <span className={cn("grid h-5 w-5 shrink-0 place-items-center rounded-full border", mode === o.id ? "border-gold-ink bg-gold-ink" : "border-foreground/30")}>
                {mode === o.id && <span className="h-2 w-2 rounded-full bg-card" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <span className="text-sm font-medium">{o.title}</span>
                  <span className="text-sm">{o.price}</span>
                </span>
                <span className="block text-xs text-muted-foreground">{o.note}</span>
              </span>
            </button>
          ))}
        </div>

        <Button size="lg" className="mt-6" onClick={buy}>
          {mode === "once" ? `Get the Starter Kit – ${formatPrice(kit.priceCents)}` : "Start my subscription"}
        </Button>
        {showDetailsLink && <Link to="/shop/essential-starter-kit" className="mt-4 text-center text-sm text-gold-ink underline-offset-4 hover:underline">See all details</Link>}
      </div>
    </div>
  );
}

export function FaqList({ items, className }: { items: FaqItem[]; className?: string }) {
  return (
    <Accordion type="single" collapsible className={cn("w-full", className)}>
      {items.map((f) => (
        <AccordionItem key={f.q} value={f.q} className="border-border">
          <AccordionTrigger className="min-h-14 py-5 text-left text-base font-normal hover:no-underline">{f.q}</AccordionTrigger>
          <AccordionContent className="pr-8 text-base text-muted-foreground">{f.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function ReviewsEmpty() {
  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-dashed border-gold bg-card p-8 text-center md:p-12">
      <Star className="mx-auto h-7 w-7 text-gold-ink" strokeWidth={1.2} aria-hidden="true" />
      <h3 className="mt-4 font-display text-3xl">Be one of our first reviewers</h3>
      <p className="mx-auto mt-3 max-w-md text-muted-foreground">
        We only show reviews from verified buyers and beta testers. VITADAY is brand new — once our first routines are underway, their honest words will appear here.
      </p>
      <p className="mt-6 eyebrow">Verified reviews only</p>
    </div>
  );
}

type FutureId = Exclude<CollectionId, "essential">;
const VOTED_KEY = "vitaday-voted-v1";

/** Grid of collections. Essential is purchasable; the rest offer waitlist + vote. */
export function CollectionsGrid({ showVotes = false, compact = false }: { showVotes?: boolean; compact?: boolean }) {
  const [waitlist, setWaitlist] = useState<FutureId | null>(null);
  const [voted, setVoted] = useState<string | null>(null);
  const qc = useQueryClient();
  const votes = useQuery({ queryKey: ["collection-votes"], queryFn: fetchVoteCounts, enabled: showVotes });

  useEffect(() => { setVoted(window.localStorage.getItem(VOTED_KEY)); }, []);

  const vote = async (id: FutureId) => {
    try {
      await voteForCollection(id);
      window.localStorage.setItem(VOTED_KEY, id);
      setVoted(id);
      qc.invalidateQueries({ queryKey: ["collection-votes"] });
    } catch { /* keep UI calm */ }
  };

  return (
    <>
      <ul className={cn("grid gap-5", compact ? "grid-cols-2 md:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3")}>
        {COLLECTIONS.map((c) => {
          const future = !c.available;
          return (
            <li key={c.id} className={cn("flex flex-col overflow-hidden rounded-2xl shadow-soft", c.colorClass, compact && c.available && "col-span-2 md:col-span-1")}>
              <div className={cn("relative", future && "opacity-75 saturate-[0.7]")}>
                <Link to={c.available ? "/shop/essential-starter-kit" : "/collections/$id"} params={{ id: c.id }} aria-label={`See ${c.name} details`}>
                  <ImageSlot slot={`collection-${c.id}`} src={collectionBox[c.id]} alt={`VITADAY ${c.name} 7-day refill box`} className="aspect-[4/5] rounded-none" />
                </Link>
                {future && <span className="absolute left-3 top-3 rounded-full bg-card/90 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-foreground">Coming soon</span>}
                {!future && <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-primary-foreground">Available</span>}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-2">
                  <CollectionIcon id={c.id} className="h-5 w-5 text-foreground/80" />
                  <h3 className="font-display text-2xl"><Link to={c.available ? "/shop/essential-starter-kit" : "/collections/$id"} params={{ id: c.id }} className="hover:text-gold-ink">{c.name}</Link></h3>
                </div>
                <p className="text-sm text-muted-foreground">{c.tagline}</p>
                {!compact && <p className="mt-3 text-sm text-foreground/80">{c.description}</p>}
                {!compact && future && <p className="mt-2 text-xs text-muted-foreground">Key ingredients: {keyIngredients(c.id)}, and more.</p>}
                {future && <Link to="/collections/$id" params={{ id: c.id }} className="mt-3 inline-flex min-h-11 items-center text-sm text-gold-ink underline underline-offset-4">See details & ingredients</Link>}
                <div className="mt-auto pt-5">
                  {c.available ? (
                    <Button asChild className="w-full"><Link to="/shop/essential-starter-kit">Shop now</Link></Button>
                  ) : (
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full bg-card/60" onClick={() => setWaitlist(c.id as FutureId)}>Join the waitlist</Button>
                      {showVotes && (
                        <button onClick={() => vote(c.id as FutureId)} disabled={voted !== null}
                          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full text-sm text-foreground/80 hover:text-foreground disabled:cursor-default">
                          {voted === c.id ? <Check className="h-4 w-4 text-gold-ink" /> : <ThumbsUp className="h-4 w-4" strokeWidth={1.4} />}
                          <span>{voted === c.id ? "Voted" : "Vote next"}</span>
                          <span className="text-muted-foreground">· {votes.data?.[c.id] ?? 0}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <WaitlistDialog collection={waitlist} onOpenChange={(o) => !o && setWaitlist(null)} />
    </>
  );
}
