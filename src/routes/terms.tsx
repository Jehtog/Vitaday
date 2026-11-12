import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & conditions — VITADAY" },
      { name: "description", content: "Terms of sale for VITADAY products and subscriptions." },
      { property: "og:title", content: "Terms & conditions — VITADAY" },
      { property: "og:description", content: "Terms of sale for VITADAY products and subscriptions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <LegalPage title="Terms & conditions">
      <p>[Placeholder — terms of sale, subscription terms, right of withdrawal.]</p>
        <h2>Subscriptions</h2>
        <p>Subscriptions can be paused, skipped or cancelled at any time in your account.</p>
    </LegalPage>
  );
}
