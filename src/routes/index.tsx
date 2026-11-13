import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WeekdayRing } from "@/components/site/WeekdayRing";
import { ImageSlot, SectionHeading, VideoSlot } from "@/components/site/ui-bits";
import { CollectionsGrid, FaqList, HowItWorksSteps, ProblemStrip, ReviewsEmpty, StarterKitOffer } from "@/components/site/sections";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { media, videos } from "@/lib/media";
import { FAQ_PREVIEW } from "@/lib/faq";
import { PRODUCTS, formatPrice } from "@/lib/catalog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VITADAY — Your daily vitamins, made simple" },
      { name: "description", content: "Seven days of vitamins, built into the bottle you already carry. Get the VITADAY Essential Starter Kit for €34.99." },
      { property: "og:title", content: "VITADAY — Your daily vitamins, made simple" },
      { property: "og:description", content: "Seven days of vitamins, built into the bottle you already carry." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const kit = PRODUCTS["starter-kit"];
  return (
    <>
      {/* HERO */}
      <section className="daylight overflow-hidden">
        <div className="container-page grid items-center gap-10 pb-16 pt-10 md:grid-cols-[1.05fr_1fr] md:pb-24 md:pt-16">
          <div className="reveal">
            <p className="eyebrow">7-day vitamin water bottle</p>
            <h1 className="mt-4 text-5xl leading-[1.02] text-foreground sm:text-6xl lg:text-7xl">
              Your daily vitamins, <em className="text-gold-ink">made simple.</em>
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted-foreground">Seven days of vitamins, built into the bottle you already carry.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg"><Link to="/shop/essential-starter-kit">Get the Starter Kit – {formatPrice(kit.priceCents)}</Link></Button>
              <Button asChild size="lg" variant="outline"><Link to="/how-it-works">See how it works</Link></Button>
            </div>
            <p className="mt-6 text-xs uppercase tracking-[0.2em] text-muted-foreground">No app · No battery · No electronics</p>
          </div>
          <div className="relative mx-auto w-full max-w-[20rem] md:max-w-md">
            <ImageSlot slot="hero-bottle" eager src={media.bottleHero.src} alt={media.bottleHero.alt} className="aspect-[460/1024] max-h-[640px] w-[62%] shadow-lift md:w-[64%]" />
            <WeekdayRing className="absolute -right-2 bottom-10 w-[58%] md:-right-6 md:bottom-16" />
          </div>
        </div>
      </section>

      <ProblemStrip />

      {/* HOW IT WORKS */}
      <section className="section-y">
        <div className="container-page">
          <SectionHeading eyebrow="How it works" title="Three steps. Then just drink." text="Your whole week lives in the cap. Every morning, turn it to today." />
          <div className="mt-14"><HowItWorksSteps /></div>
          <div className="mt-10 grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
            <VideoSlot src={videos.howItWorks} poster={videos.poster} />
            <div>
              <p className="font-display text-3xl">Watch a whole routine in 26 seconds.</p>
              <Link to="/how-it-works" className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm text-gold-ink hover:underline underline-offset-4">
                Full guide <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="section-y bg-surface">
        <div className="container-page">
          <SectionHeading eyebrow="Less to carry" title="One bottle instead of three things." />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <div className="rounded-3xl border border-border bg-background p-8">
              <p className="eyebrow text-muted-foreground">The usual way</p>
              <h3 className="mt-3 font-display text-3xl">Pill box + bottle + sachets</h3>
              <ul className="mt-6 space-y-3 text-muted-foreground">
                {["Three things to pack every day", "Easy to forget whether you took them", "Sachets to tear, measure and mix"].map((t) => (
                  <li key={t} className="flex gap-3"><X className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />{t}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-gold bg-card p-8 shadow-lift">
              <p className="eyebrow">VITADAY</p>
              <h3 className="mt-3 font-display text-3xl">One bottle, seven days ready</h3>
              <ul className="mt-6 space-y-3">
                {["Your week pre-portioned in the cap", "The ring shows today at a glance", "Press, shake, drink — that's it"].map((t) => (
                  <li key={t} className="flex gap-3"><Check className="mt-1 h-4 w-4 shrink-0 text-gold-ink" aria-hidden="true" />{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* STARTER KIT */}
      <section className="section-y">
        <div className="container-page">
          <SectionHeading eyebrow="Start here" title="The Essential Starter Kit" />
          <StarterKitOffer className="mt-12" />
        </div>
      </section>

      {/* WHAT'S INSIDE */}
      <section className="section-y bg-essential">
        <div className="container-page grid items-center gap-10 md:grid-cols-2">
          <ImageSlot slot="refill-box" src={media.refillBox.src} alt={media.refillBox.alt} className="aspect-[4/5] max-w-md shadow-soft" />
          <div>
            <SectionHeading align="left" eyebrow="What's inside Essential" title="Everyday vitamins, gently flavoured." />
            <ul className="mt-8 grid grid-cols-2 gap-3">
              {["Vitamin C", "Vitamin B6", "Vitamin B12", "Selected B vitamins"].map((v) => (
                <li key={v} className="rounded-2xl bg-card px-4 py-4 text-sm shadow-soft">{v}</li>
              ))}
            </ul>
            <p className="mt-6 text-muted-foreground">Flavour: <span className="text-foreground">Lemon & Peach</span></p>
            <p className="mt-2 text-sm text-muted-foreground">Vitamin C contributes to the normal function of the immune system.</p>
            <Button asChild variant="outline" className="mt-8"><Link to="/ingredients">See all ingredients</Link></Button>
          </div>
        </div>
      </section>

      {/* COLLECTIONS */}
      <section className="section-y">
        <div className="container-page">
          <SectionHeading eyebrow="Collections" title="One bottle. Every routine." text="Essential is here today. Tell us which collection you'd like next — all of them fit the same bottle." />
          <div className="mt-12"><CollectionsGrid compact /></div>
          <div className="mt-8 text-center"><Button asChild variant="outline"><Link to="/collections">Explore all collections</Link></Button></div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section-y bg-surface">
        <div className="container-page">
          <SectionHeading eyebrow="Reviews" title="Honest words, coming soon." />
          <div className="mt-12"><ReviewsEmpty /></div>
        </div>
      </section>

      {/* FAQ + NEWSLETTER */}
      <section className="section-y">
        <div className="container-page grid gap-14 md:grid-cols-2">
          <div>
            <SectionHeading align="left" eyebrow="FAQ" title="Good questions." />
            <FaqList items={FAQ_PREVIEW} className="mt-8" />
            <Link to="/faq" className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm text-gold-ink hover:underline underline-offset-4">All questions <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
          <div className="self-start rounded-3xl bg-card p-8 shadow-soft md:p-10">
            <ImageSlot slot="newsletter-lifestyle" src={media.lifestyleDesk.src} alt={media.lifestyleDesk.alt} className="mb-8 aspect-[3/2]" />
            <h2 className="font-display text-4xl">Get your routine started</h2>
            <p className="mt-2 text-muted-foreground">News and launch updates.</p>
            <NewsletterForm source="home" className="mt-6" />
          </div>
        </div>
      </section>
    </>
  );
}
