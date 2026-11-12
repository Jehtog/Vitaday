import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy policy — VITADAY" },
      { name: "description", content: "How VITADAY collects, uses and protects your personal data." },
      { property: "og:title", content: "Privacy policy — VITADAY" },
      { property: "og:description", content: "How VITADAY collects, uses and protects your personal data." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <LegalPage title="Privacy policy">
      <p>[Placeholder — full GDPR privacy policy to be provided by your legal advisor.]</p>
        <h2>What we store</h2>
        <p>When you sign up for our newsletter or a collection waitlist, we store your email address and, for waitlists, the collection you chose. We use it only to send you the updates you asked for.</p>
        <h2>Your rights</h2>
        <p>You can ask us to access, correct or delete your data at any time. [Placeholder — contact email.]</p>
    </LegalPage>
  );
}
