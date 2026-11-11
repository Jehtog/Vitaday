import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading, ImageSlot } from "@/components/site/ui-bits";
import { CollectionsGrid } from "@/components/site/sections";
import { media } from "@/lib/media";

export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: [
      { title: "VITADAY Collections — Essential, Glow, Balance, Active & more" },
      { name: "description", content: "Essential is available now. Join the waitlist for Glow, Balance, Active, Focus, Cycle and Junior — all fit the same bottle." },
      { property: "og:title", content: "VITADAY Collections" },
      { property: "og:description", content: "Seven refill collections, one bottle. Vote for what comes next." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Collections,
});

function Collections() {
  return (
    <>
      <section className="daylight pt-12 md:pt-20">
        <div className="container-page">
          <SectionHeading as="h1" eyebrow="Collections" title="One bottle. Seven routines." text="Essential is available today. The others are in development — join a waitlist or vote for the one you'd like next." />
          <p className="mt-6 text-center text-sm text-gold-ink">All collections fit the same bottle.</p>
          <ImageSlot slot="collections-lineup" src={media.collectionsLineup.src} alt={media.collectionsLineup.alt} eager className="mt-12 aspect-[1536/794] shadow-lift" />
        </div>
      </section>
      <section className="section-y">
        <div className="container-page"><CollectionsGrid showVotes /></div>
      </section>
    </>
  );
}
