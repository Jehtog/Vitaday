import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/imprint")({
  head: () => ({
    meta: [
      { title: "Imprint — VITADAY" },
      { name: "description", content: "Legal notice and company details for VITADAY." },
      { property: "og:title", content: "Imprint — VITADAY" },
      { property: "og:description", content: "Legal notice and company details for VITADAY." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Imprint,
});

function Imprint() {
  return (
    <LegalPage title="Imprint">
      <p>[Placeholder — company name, legal form, registered address, registration number, VAT ID, managing director and contact email.]</p>
    </LegalPage>
  );
}
