import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/shipping-returns")({
  head: () => ({
    meta: [
      { title: "Shipping & returns — VITADAY" },
      {
        name: "description",
        content: "Shipping costs, delivery times and returns for VITADAY orders.",
      },
      { property: "og:title", content: "Shipping & returns — VITADAY" },
      {
        property: "og:description",
        content: "Shipping costs, delivery times and returns for VITADAY orders.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ShippingReturns,
});

function ShippingReturns() {
  return (
    <LegalPage title="Shipping & returns">
      <h2>Nothing ships yet</h2>
      <p>
        VITADAY is a student project and is not on sale. We do not ship anything today, and no
        delivery date on this site is a promise. Reserving records a non-binding letter of intent,
        not an order.
      </p>
      <h2>What would happen at launch</h2>
      <p>
        If VITADAY launches, shipping rates, the countries we can send to and delivery times will be
        published here and shown in full before anyone is asked to pay. We are not able to confirm
        any of them yet.
      </p>
      <h2>Returns and withdrawal</h2>
      <p>
        Consumers in the EU can withdraw from a distance purchase within 14 days of receiving it,
        without giving a reason (in Portugal, Decreto-Lei n.º 24/2014). That right would apply to
        any future VITADAY purchase. Food supplements that have been opened may be excluded on
        hygiene grounds where the law allows it, and we would state clearly which items that applies
        to before you buy.
      </p>
      <p>
        You do not need any of this to change your mind now. A letter of intent can be withdrawn at
        any time by replying to the confirmation email.
      </p>
    </LegalPage>
  );
}
