import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/ui-bits";
import { FaqList } from "@/components/site/sections";
import { FAQ_GROUPS } from "@/lib/faq";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — VITADAY" },
      { name: "description", content: "Answers about using VITADAY, freshness, cleaning, subscriptions, shipping, payment and safety." },
      { property: "og:title", content: "VITADAY FAQ" },
      { property: "og:description", content: "Everything you'd like to know about your 7-day vitamin bottle." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Faq,
});

function Faq() {
  return (
    <section className="section-y">
      <div className="container-page max-w-3xl">
        <SectionHeading as="h1" eyebrow="FAQ" title="Questions & answers" />
        <nav className="mt-10 flex flex-wrap justify-center gap-2" aria-label="FAQ topics">
          {FAQ_GROUPS.map((g) => (
            <a key={g.title} href={`#${slug(g.title)}`} className="inline-flex min-h-11 items-center rounded-full border border-border px-4 text-sm hover:border-gold">{g.title}</a>
          ))}
        </nav>
        <div className="mt-12 space-y-14">
          {FAQ_GROUPS.map((g) => (
            <div key={g.title} id={slug(g.title)} className="scroll-mt-24">
              <h2 className="text-3xl">{g.title}</h2>
              <FaqList items={g.items} className="mt-4" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z]+/g, "-");
