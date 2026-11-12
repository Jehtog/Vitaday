import { Button } from "@/components/ui/button";
import { FaqList, HowItWorksSteps, StarterKitOffer } from "./sections";
import { ImageSlot, SectionHeading } from "./ui-bits";
import { FAQ_PREVIEW } from "@/lib/faq";
import { PRODUCTS, formatPrice } from "@/lib/catalog";

/** Ad landing page: hero, 3 steps, Starter Kit offer, FAQ — one CTA throughout. */
export function LandingPage({ eyebrow, headline, sub, image }: { eyebrow: string; headline: string; sub: string; image: { src: string; alt: string } }) {
  const cta = `Get the Starter Kit – ${formatPrice(PRODUCTS["starter-kit"].priceCents)}`;
  return (
    <>
      <section className="daylight">
        <div className="container-page grid items-center gap-10 py-10 md:grid-cols-2 md:py-20">
          <div className="reveal">
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="mt-4 text-5xl leading-[1.05] md:text-6xl">{headline}</h1>
            <p className="mt-6 max-w-md text-lg text-muted-foreground">{sub}</p>
            <Button asChild size="lg" className="mt-8"><a href="#offer">{cta}</a></Button>
          </div>
          <ImageSlot slot="landing-hero" src={image.src} alt={image.alt} eager className="aspect-[4/3] shadow-lift" />
        </div>
      </section>
      <section className="section-y">
        <div className="container-page">
          <SectionHeading eyebrow="How it works" title="Three steps. That's the routine." />
          <div className="mt-12"><HowItWorksSteps /></div>
        </div>
      </section>
      <section id="offer" className="section-y scroll-mt-20 bg-surface">
        <div className="container-page"><StarterKitOffer showDetailsLink={false} /></div>
      </section>
      <section className="section-y">
        <div className="container-page max-w-3xl">
          <SectionHeading eyebrow="FAQ" title="Quick answers" />
          <FaqList items={FAQ_PREVIEW} className="mt-8" />
        </div>
      </section>
      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} VITADAY · <a href="/imprint" className="underline">Imprint</a> · <a href="/privacy" className="underline">Privacy</a>
      </footer>
    </>
  );
}
