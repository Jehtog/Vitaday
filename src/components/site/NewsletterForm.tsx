import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { joinNewsletter } from "@/lib/signups";
import { cn } from "@/lib/utils";

export function NewsletterForm({ source, className }: { source: string; className?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
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
      <p className="mt-3 text-xs text-muted-foreground">By signing up you agree to receive emails from VITADAY. Unsubscribe anytime. See our Privacy policy.</p>
    </form>
  );
}
