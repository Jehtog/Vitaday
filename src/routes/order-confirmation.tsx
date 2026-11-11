import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { RingProgress, WeekdayRing } from "@/components/site/WeekdayRing";

export const Route = createFileRoute("/order-confirmation")({
  head: () => ({
    meta: [
      { title: "Thank you — your first week starts now | VITADAY" },
      { name: "description", content: "Your VITADAY order is confirmed." },
      { property: "og:title", content: "Order confirmed — VITADAY" },
      { property: "og:description", content: "Your first week starts now." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Confirmation,
});

function Confirmation() {
  const [order, setOrder] = useState<{ number: string; subscription: boolean; email: string } | null>(null);
  useEffect(() => {
    const raw = window.sessionStorage.getItem("vitaday-last-order");
    if (raw) try { setOrder(JSON.parse(raw)); } catch { /* ignore */ }
  }, []);

  return (
    <section className="daylight section-y">
      <div className="container-page grid items-center gap-12 md:grid-cols-2">
        <div>
          <RingProgress steps={["Cart", "Details", "Payment", "Done"]} current={3} />
          <h1 className="mt-8 text-5xl md:text-6xl">Your first week starts now.</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Thank you{order ? ` — order ${order.number} is confirmed` : ""}. {order?.email ? `We'll send updates to ${order.email}.` : ""}
          </p>
          {order?.subscription && <p className="mt-2 text-muted-foreground">You can pause, skip or cancel your subscription anytime in your account.</p>}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg"><Link to="/how-it-works">Watch the how-to video</Link></Button>
            {order?.subscription && <Button asChild size="lg" variant="outline"><Link to="/account">Manage subscription</Link></Button>}
          </div>
        </div>
        <WeekdayRing className="mx-auto w-full max-w-sm" animateOnScroll={false} />
      </div>
    </section>
  );
}
