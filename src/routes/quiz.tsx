import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/ui-bits";
import { QuizRunner } from "@/components/quiz/QuizRunner";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Find your VITADAY — match your routine in seven questions" },
      {
        name: "description",
        content:
          "Answer seven short questions about your days and we'll point you at the VITADAY collection that fits. No medical advice, no long forms.",
      },
      { property: "og:title", content: "Find your VITADAY" },
      { property: "og:description", content: "Seven short questions, one routine that fits your days." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Quiz,
});

function Quiz() {
  return (
    <section className="daylight section-y">
      <div className="container-page">
        <SectionHeading
          as="h1"
          eyebrow="Product finder"
          title="Find your VITADAY"
          text="Seven short questions about how your days actually go. We'll show the routine that fits best — and one that's close."
        />
        <div className="mt-12">
          <QuizRunner />
        </div>
      </div>
    </section>
  );
}
