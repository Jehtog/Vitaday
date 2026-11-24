import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { RingProgress, WeekdayRing } from "@/components/site/WeekdayRing";

export const Route = createFileRoute("/order-confirmation")({
  head: () => ({
    meta: [
      { title: "Letter of intent recorded | VITADAY" },
      { name: "description", content: "Your non-binding letter of intent has been recorded." },
      { property: "og:title", content: "Letter of intent recorded — VITADAY" },
      { property: "og:description", content: "We will email you when VITADAY launches." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Confirmation,
});

function Confirmation() {
  const [order, setOrder] = useState<{ number: string; subscription: boolean; email: string; name?: string } | null>(null);
  useEffect(() => {
    const raw = window.sessionStorage.getItem("vitaday-last-intent");
    if (raw) try { setOrder(JSON.parse(raw)); } catch { /* ignore */ }
  }, []);

  return (
    <section className="daylight section-y">
      <div className="container-page grid items-center gap-12 md:grid-cols-2">
        <div>
          <RingProgress steps={["Review", "Your details", "Letter of intent", "Done"]} current={3} />
          <h1 className="mt-8 text-5xl md:text-6xl">Thank you. Your letter of intent is recorded.</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {order ? `Reference ${order.number}.` : ""} We have not taken any payment and nothing is on its way.
            We will email you when VITADAY is available, and you can withdraw at any time by replying to that email.
          </p>
          {order?.subscription && <p className="mt-2 text-muted-foreground">Your letter of intent includes the monthly refill plan. It is not a subscription and nothing is charged.</p>}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg"><Link to="/how-it-works">Watch the how-to video</Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/">Back to the site</Link></Button>
          </div>
        </div>
        <WeekdayRing className="mx-auto w-full max-w-sm" animateOnScroll={false} />
      </div>
    </section>
  );
}
