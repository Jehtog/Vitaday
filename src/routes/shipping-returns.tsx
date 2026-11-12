import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/shipping-returns")({
  head: () => ({
    meta: [
      { title: "Shipping & returns — VITADAY" },
      { name: "description", content: "Shipping costs, delivery times and returns for VITADAY orders." },
      { property: "og:title", content: "Shipping & returns — VITADAY" },
      { property: "og:description", content: "Shipping costs, delivery times and returns for VITADAY orders." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ShippingReturns,
});

function ShippingReturns() {
  return (
    <LegalPage title="Shipping & returns">
      <h2>Shipping</h2>
        <p>Shipping costs are always shown in your cart before checkout. [Placeholder — rates, countries and delivery times.]</p>
        <h2>Returns</h2>
        <p>[Placeholder — return window and conditions. Note: opened food supplements may be excluded for hygiene reasons.]</p>
    </LegalPage>
  );
}
