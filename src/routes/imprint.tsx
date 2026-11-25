import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { PRIVACY_EMAIL, privacyMailto } from "@/lib/contact";

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
      <p>
        VITADAY is a student project developed at Católica Lisbon School of Business and Economics
        (Universidade Católica Portuguesa), Palma de Cima, 1649-023 Lisbon, Portugal.
      </p>
      <p>
        It is not a registered company. There is no legal form, no commercial register entry and no
        VAT number, because VITADAY does not trade: nothing on this site is for sale, no payment is
        taken and no goods are shipped. The reservation flow records a non-binding letter of intent
        and nothing more.
      </p>
      <p>
        Responsible for the content of this site: the VITADAY project team. You can reach us at{" "}
        <a href={privacyMailto("VITADAY")}>{PRIVACY_EMAIL}</a>.
      </p>
      <p>
        VITADAY is a student project and is not an offering of Universidade Católica Portuguesa. The
        university is named here only to say where the project comes from.
      </p>
    </LegalPage>
  );
}
