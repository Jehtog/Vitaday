import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/site/LandingPage";
import { media } from "@/lib/media";

export const Route = createFileRoute("/students")({
  head: () => ({
    meta: [
      { title: "VITADAY for students — vitamins ready between lectures" },
      { name: "description", content: "Your week of vitamins lives in the cap of your water bottle. Starter Kit €34.99." },
      { property: "og:title", content: "Your vitamins, ready between lectures." },
      { property: "og:description", content: "A 7-day vitamin bottle for busy study weeks." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <LandingPage eyebrow="For students" headline="Your vitamins, ready between lectures."
      sub="Seven days in the cap of the bottle you already carry to campus. Turn, press, shake — back to your notes."
      image={media.bottleInHand} />
  ),
});
