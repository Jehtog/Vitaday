import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/site/LandingPage";
import { media } from "@/lib/media";

export const Route = createFileRoute("/professionals")({
  head: () => ({
    meta: [
      { title: "VITADAY for professionals — vitamins already in your bottle" },
      { name: "description", content: "Back-to-back meetings? Your week of vitamins is already in your bottle. Starter Kit €34.99." },
      { property: "og:title", content: "Back-to-back meetings? Your vitamins are already in your bottle." },
      { property: "og:description", content: "A 7-day vitamin bottle for full calendars." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <LandingPage eyebrow="For professionals" headline="Back-to-back meetings? Your vitamins are already in your bottle."
      sub="One bottle on your desk, seven days ready in the cap. No pill box in your bag, no sachets in your drawer."
      image={media.lifestyleDesk} />
  ),
});
