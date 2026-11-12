import { createFileRoute, Link } from "@tanstack/react-router";
import { Droplets, Luggage, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageSlot, SectionHeading, StepNumber, VideoSlot } from "@/components/site/ui-bits";
import { FaqList, STEPS } from "@/components/site/sections";
import { WeekdayRing } from "@/components/site/WeekdayRing";
import { FAQ_GROUPS } from "@/lib/faq";
import { media, videos } from "@/lib/media";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How VITADAY works — open, drop in, rotate & drink" },
      { name: "description", content: "Drop a Weekly Refill Ring into the cap, rotate to today, press, shake and drink. No app, no battery." },
      { property: "og:title", content: "How VITADAY works" },
      { property: "og:description", content: "Three steps to a week of vitamins in your bottle." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HowItWorks,
});

function HowItWorks() {
  return (
    <>
      <section className="daylight section-y">
        <div className="container-page grid items-center gap-10 md:grid-cols-2">
          <SectionHeading as="h1" align="left" eyebrow="How it works" title="A week of vitamins, ready in your cap." text="No app, no electronics, no battery. Just a ring that turns to today." />
          <WeekdayRing className="mx-auto w-full max-w-sm" />
        </div>
      </section>

      <section className="section-y">
        <div className="container-page space-y-16 md:space-y-24">
          {STEPS.map((s, i) => (
            <div key={s.title} className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
              <ImageSlot slot={`hiw-step-${i + 1}`} src={s.img.src} alt={s.img.alt} className={`aspect-[4/3] shadow-soft ${i % 2 ? "md:order-2" : ""}`} />
              <div>
                <StepNumber n={i + 1} />
                <h2 className="mt-5 text-4xl md:text-5xl">{s.title}</h2>
                <p className="mt-4 text-lg text-muted-foreground">{s.text}</p>
              </div>
            </div>
          ))}
          <VideoSlot src={videos.howItWorks} poster={videos.poster} />
        </div>
      </section>

      <section className="section-y bg-surface">
        <div className="container-page grid items-center gap-10 md:grid-cols-2">
          <ImageSlot slot="hiw-freshness" src={media.ringInsert.src} alt={media.ringInsert.alt} className="aspect-square shadow-soft" />
          <div>
            <ShieldCheck className="h-7 w-7 text-gold-ink" strokeWidth={1.3} aria-hidden="true" />
            <h2 className="mt-4 text-4xl">Why the refill ring stays fresh</h2>
            <p className="mt-4 text-muted-foreground">
              Each daily portion sits in its own sealed, moisture-protected chamber, so the other six days stay closed until it's their turn.
              [Placeholder — final details on materials and shelf life will follow product testing.]
            </p>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-card p-8 shadow-soft">
            <Droplets className="h-7 w-7 text-gold-ink" strokeWidth={1.3} aria-hidden="true" />
            <h2 className="mt-4 text-3xl">Cleaning guide</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-muted-foreground">
              <li>Remove the cap and take out the refill ring.</li>
              <li>Rinse the glass bottle with warm water and mild soap.</li>
              <li>Wipe the cap with a damp cloth — keep the ring chamber dry.</li>
              <li>Let everything dry fully before reassembling.</li>
            </ol>
          </div>
          <div className="rounded-3xl bg-card p-8 shadow-soft">
            <Luggage className="h-7 w-7 text-gold-ink" strokeWidth={1.3} aria-hidden="true" />
            <h2 className="mt-4 text-3xl">Travel tips</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
              <li>Your whole week travels in the cap — nothing else to pack.</li>
              <li>Going longer? Pack an extra refill ring in its box.</li>
              <li>Empty the water before security; the vitamins stay sealed.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section-y bg-surface">
        <div className="container-page max-w-3xl">
          <div className="flex items-center gap-3"><Sparkles className="h-5 w-5 text-gold-ink" aria-hidden="true" /><p className="eyebrow">FAQ</p></div>
          <h2 className="mt-3 text-4xl">Still curious?</h2>
          <FaqList items={FAQ_GROUPS[0]?.items ?? []} className="mt-6" />
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild><Link to="/shop/essential-starter-kit">Get the Starter Kit</Link></Button>
            <Button asChild variant="outline"><Link to="/faq">All questions</Link></Button>
          </div>
        </div>
      </section>
    </>
  );
}
