import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { PRIVACY_EMAIL, privacyMailto } from "@/lib/contact";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & conditions — VITADAY" },
      { name: "description", content: "Terms of sale for VITADAY products and subscriptions." },
      { property: "og:title", content: "Terms & conditions — VITADAY" },
      {
        property: "og:description",
        content: "Terms of sale for VITADAY products and subscriptions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <LegalPage title="Terms & conditions">
      <p>
        VITADAY is a student project at Católica Lisbon School of Business and Economics. Nothing on
        this site is for sale. These terms cover what the site does today, which is collect letters
        of intent.
      </p>
      <h2>No sale, no contract</h2>
      <p>
        Prices shown are indicative launch prices, not offers. Adding something to your reservation
        and signing a letter of intent does not create a contract of sale, does not oblige you to
        buy and does not oblige us to supply. No payment is taken and nothing is shipped.
      </p>
      <h2>Letters of intent</h2>
      <p>
        A letter of intent records that you would like to buy a product when it becomes available,
        at roughly the price shown. It is not binding on either side. The price, the contents of the
        product and the launch date may all change, and the project may not launch at all. You can
        withdraw your letter of intent at any time, without giving a reason, by replying to the
        confirmation email we send you or by writing to{" "}
        <a href={privacyMailto("Withdraw my letter of intent")}>{PRIVACY_EMAIL}</a>.
      </p>
      <h2>Subscriptions</h2>
      <p>
        The monthly refill plan shown on the site is part of what you can express interest in. It is
        not active, nothing is billed and no subscription exists yet. If VITADAY does launch, a
        subscription would be pausable, skippable and cancellable at any time, and we would set out
        the full terms before anyone signs up to one.
      </p>
      <h2>If we ever start selling</h2>
      <p>
        Consumers in the EU have a right to withdraw from a distance purchase within 14 days of
        receiving it (in Portugal, Decreto-Lei n.º 24/2014). Those rights would apply to any future
        sale and are not affected by a letter of intent. Terms of sale will be published here before
        any sale takes place.
      </p>
      <h2>This site</h2>
      <p>
        We try to keep the information here accurate, but the product is still in development and
        details change. Nothing on this site is medical advice. If you take medication, are pregnant
        or breastfeeding, or have a health condition, speak to a pharmacist or doctor before taking
        a food supplement.
      </p>
    </LegalPage>
  );
}
