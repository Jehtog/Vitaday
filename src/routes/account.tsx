import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Copy, Gift, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { WeekdayRing } from "@/components/site/WeekdayRing";
import { PRODUCTS, formatPrice } from "@/lib/catalog";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My account — VITADAY" },
      {
        name: "description",
        content:
          "Manage your VITADAY subscription: pause, skip, change interval or cancel in two clicks.",
      },
      { property: "og:title", content: "My VITADAY account" },
      { property: "og:description", content: "Manage your refill subscription." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Account,
});

const fmt = (d: Date) =>
  d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

function Account() {
  const [next, setNext] = useState<Date | null>(null);
  const [status, setStatus] = useState<"active" | "paused" | "cancelled">("active");
  const [interval, setInterval_] = useState("4");
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [reminders, setReminders] = useState({ delivery: true, lowRefill: true });

  useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() + 12);
    setNext(d);
  }, []);

  const skip = () => {
    if (!next) return;
    const d = new Date(next);
    d.setDate(d.getDate() + Number(interval) * 7);
    setNext(d);
    toast("Next delivery skipped", { description: `New date: ${fmt(d)}` });
  };

  return (
    <section className="py-10 md:py-16">
      <div className="container-page">
        <div className="flex items-start gap-3 rounded-2xl border border-dashed border-gold bg-card p-4 text-sm">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-ink" aria-hidden="true" />
          <p>
            Preview of the account area with example data. Sign-in and real subscription data will
            be connected with payments.
          </p>
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="eyebrow">My account</p>
            <h1 className="mt-3 text-5xl">Hello again.</h1>
            <WeekdayRing className="mt-8 w-full max-w-xs" animateOnScroll={false} />
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-card p-6 shadow-soft md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-3xl">{PRODUCTS["subscription-28"].name}</h2>
                <span className="rounded-full bg-gold-soft px-3 py-1 text-xs uppercase tracking-wider text-gold-ink">
                  {status}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                28 portions · Lemon & Peach · {formatPrice(PRODUCTS["subscription-28"].priceCents)}{" "}
                per delivery
              </p>
              {status !== "cancelled" && (
                <p className="mt-6">
                  <span className="eyebrow">Next delivery</span>
                  <br />
                  <span className="font-display text-3xl">
                    {status === "paused" ? "Paused" : next ? fmt(next) : "—"}
                  </span>
                </p>
              )}
              {status === "cancelled" ? (
                <div className="mt-6">
                  <p className="text-muted-foreground">
                    Your subscription is cancelled. No further deliveries or charges.
                  </p>
                  <Button className="mt-4" onClick={() => setStatus("active")}>
                    Restart subscription
                  </Button>
                </div>
              ) : (
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStatus(status === "paused" ? "active" : "paused");
                      toast(status === "paused" ? "Subscription resumed" : "Subscription paused");
                    }}
                  >
                    {status === "paused" ? "Resume" : "Pause"}
                  </Button>
                  <Button variant="outline" onClick={skip} disabled={status === "paused"}>
                    Skip next delivery
                  </Button>
                  <div>
                    <label htmlFor="interval" className="sr-only">
                      Change interval
                    </label>
                    <Select
                      value={interval}
                      onValueChange={(v) => {
                        setInterval_(v);
                        toast("Interval updated", { description: `Every ${v} weeks` });
                      }}
                    >
                      <SelectTrigger id="interval" className="h-11 rounded-full">
                        <SelectValue placeholder="Change interval" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4">Every 4 weeks</SelectItem>
                        <SelectItem value="6">Every 6 weeks</SelectItem>
                        <SelectItem value="8">Every 8 weeks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" disabled title="Available when more collections launch">
                    Change flavour / collection
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-destructive sm:col-span-2"
                    onClick={() => setConfirmCancel(true)}
                  >
                    Cancel subscription
                  </Button>
                </div>
              )}
            </div>

            <div className="rounded-3xl bg-card p-6 shadow-soft md:p-8">
              <h2 className="text-3xl">Order history</h2>
              <p className="mt-1 text-xs text-muted-foreground">Example entries</p>
              <ul className="mt-4 divide-y divide-border text-sm">
                {[
                  ["VD-100231", "Essential Starter Kit", 3499],
                  ["VD-100487", "Essential monthly subscription", 1799],
                ].map(([n, name, c]) => (
                  <li key={n} className="flex justify-between gap-4 py-3">
                    <span>
                      <span className="text-muted-foreground">{n}</span> · {name}
                    </span>
                    <span>{formatPrice(c as number)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-3xl bg-essential p-6">
                <Gift className="h-6 w-6 text-gold-ink" strokeWidth={1.4} aria-hidden="true" />
                <h2 className="mt-3 text-2xl">Refer a friend</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  There is no referral scheme yet. VITADAY is not on sale, so there is nothing to
                  credit. If we launch one, we will say here exactly what it gives you and your
                  friend.
                </p>
                <Button size="sm" variant="outline" className="mt-4 bg-card" disabled>
                  <Copy className="h-4 w-4" aria-hidden="true" /> Not available yet
                </Button>
              </div>
              <div className="rounded-3xl bg-card p-6 shadow-soft">
                <h2 className="text-2xl">Reminders</h2>
                <div className="mt-4 space-y-4 text-sm">
                  <label className="flex items-center justify-between gap-4">
                    Email before each delivery
                    <Switch
                      checked={reminders.delivery}
                      onCheckedChange={(v) => setReminders((r) => ({ ...r, delivery: v }))}
                    />
                  </label>
                  <label className="flex items-center justify-between gap-4">
                    When my ring is almost empty
                    <Switch
                      checked={reminders.lowRefill}
                      onCheckedChange={(v) => setReminders((r) => ({ ...r, lowRefill: v }))}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={confirmCancel} onOpenChange={setConfirmCancel}>
        <AlertDialogContent className="rounded-2xl bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-3xl font-normal">
              Cancel your subscription?
            </AlertDialogTitle>
            <AlertDialogDescription>
              No more deliveries or charges. You can restart anytime.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Keep subscription</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                setStatus("cancelled");
                toast("Subscription cancelled");
              }}
            >
              Yes, cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
