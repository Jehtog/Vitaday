import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { PRIVACY_EMAIL } from "@/lib/contact";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy policy — VITADAY" },
      {
        name: "description",
        content: "How VITADAY collects, uses and protects your personal data.",
      },
      { property: "og:title", content: "Privacy policy — VITADAY" },
      {
        property: "og:description",
        content: "How VITADAY collects, uses and protects your personal data.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <LegalPage title="Privacy policy">
      <p>
        VITADAY is a student project at Católica Lisbon School of Business and Economics. It is not
        a registered company and nothing on this site is for sale. This page explains what we store
        and how to get it removed.
      </p>
      <h2>What we store</h2>
      <p>
        If you sign up for our newsletter, join a collection waitlist, ask us to email you a quiz
        result, or record a letter of intent, we store your email address. For waitlists we also
        store which collection you chose, for quiz results the collections you matched with, and for
        a letter of intent the fact that you recorded one. We use it only to send you the updates
        you asked for, and we do not sell it or share it with anyone outside the project team.
      </p>
      <h2>Letters of intent</h2>
      <p>
        A letter of intent records that you intend to buy at launch. It is not an order and not a
        contract, no payment is taken, and neither you nor VITADAY is obliged to buy or supply.
      </p>
      <h2>How to unsubscribe or have your data deleted</h2>
      <p>
        Email <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a> and we will remove you. You
        can ask us at any time to access, correct or delete what we hold, and to withdraw a letter
        of intent, and we will do it without asking for a reason.
      </p>
    </LegalPage>
  );
}
