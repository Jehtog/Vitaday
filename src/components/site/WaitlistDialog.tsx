import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { COLLECTIONS, type CollectionId } from "@/lib/catalog";
import { joinWaitlist } from "@/lib/signups";
import { CollectionIcon } from "./CollectionIcon";

export function WaitlistDialog({ collection, onOpenChange }: {
  collection: Exclude<CollectionId, "essential"> | null;
  onOpenChange: (open: boolean) => void;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const info = COLLECTIONS.find((c) => c.id === collection);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!collection) return;
    setError(null);
    setStatus("saving");
    try {
      await joinWaitlist(email, collection);
      setStatus("done");
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error && "issues" in err ? "Please enter a valid email address." : err instanceof Error ? err.message : "Please try again.");
    }
  };

  return (
    <Dialog open={collection !== null} onOpenChange={(o) => { if (!o) { setStatus("idle"); setEmail(""); setError(null); } onOpenChange(o); }}>
      <DialogContent className="rounded-2xl border-border bg-card sm:max-w-md">
        {info && (
          <>
            <DialogHeader className="text-left">
              <span className={`mb-2 grid h-12 w-12 place-items-center rounded-full ${info.colorClass} text-foreground`}>
                <CollectionIcon id={info.id} />
              </span>
              <DialogTitle className="font-display text-3xl font-normal">VITADAY {info.name}</DialogTitle>
              <DialogDescription>{info.tagline} — coming soon. Be the first to know when it launches.</DialogDescription>
            </DialogHeader>
            {status === "done" ? (
              <div className="flex items-start gap-3 rounded-xl bg-surface p-4 text-sm" role="status">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold-ink" aria-hidden="true" />
                <p>You're on the {info.name} waitlist. We'll only email you about this launch.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4" noValidate>
                <div className="space-y-2">
                  <Label htmlFor="waitlist-email">Email</Label>
                  <Input id="waitlist-email" type="email" required autoComplete="email" value={email}
                    onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="h-11 rounded-xl bg-background" />
                  {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
                </div>
                <label className="flex cursor-pointer items-start gap-2 text-xs text-muted-foreground">
                  <input type="checkbox" className="mt-0.5 h-3.5 w-3.5 shrink-0" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                  <span>I agree that VITADAY may email me when this collection launches.</span>
                </label>
                <Button type="submit" className="w-full" disabled={status === "saving" || !consent}>
                  {status === "saving" ? "Joining…" : "Join the waitlist"}
                </Button>
                <p className="text-xs text-muted-foreground">
                  We store your email only to tell you about this collection, and nothing else.
                  You can withdraw at any time, see our privacy policy for how.
                </p>
              </form>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
