import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { joinNewsletter } from "@/lib/signups";
import { cn } from "@/lib/utils";

export function NewsletterForm({ source, className }: { source: string; className?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done">("idle");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!consent) {
      setError("Please tick the box so we know you agree.");
      return;
    }
    setStatus("saving");
    try {
      await joinNewsletter(email, source);
      setStatus("done");
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error && "issues" in err ? "Please enter a valid email address." : "Something went wrong. Please try again.");
    }
  };

  if (status === "done") {
    return <p className={cn("text-sm text-foreground", className)} role="status">Thank you — you're on the list.</p>;
  }

  return (
    <form onSubmit={submit} className={cn("w-full", className)} noValidate>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor={`nl-${source}`} className="sr-only">Email address</label>
        <Input id={`nl-${source}`} type="email" required autoComplete="email" placeholder="Your email" value={email}
          onChange={(e) => setEmail(e.target.value)} className="h-11 flex-1 rounded-full bg-card px-5" />
        <Button type="submit" disabled={status === "saving"}>{status === "saving" ? "Signing up…" : "Sign up"}</Button>
      </div>
      {error && <p className="mt-2 text-sm text-destructive" role="alert">{error}</p>}
      <label className="mt-3 flex cursor-pointer items-start gap-2 text-xs text-muted-foreground">
        <input type="checkbox" className="mt-0.5 h-3.5 w-3.5 shrink-0" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <span>
          I agree that VITADAY may email me news and launch updates. You can withdraw at any time, see{" "}
          <Link to="/privacy" className="underline underline-offset-2">how to unsubscribe</Link> in our privacy policy.
        </span>
      </label>
    </form>
  );
}
