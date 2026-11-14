import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageSlot } from "@/components/site/ui-bits";
import { track } from "@/lib/analytics";
import { saveQuizResult } from "@/lib/signups";
import { INGREDIENTS_PLACEHOLDER, PRESETS, presetShopUrl } from "@/lib/quiz/presets";
import type { QuizOutcome } from "@/lib/quiz/scoring";

const SAFETY_NOTE =
  "VITADAY supplements are dietary supplements and not a substitute for a balanced diet. If you are pregnant, take medication or have a medical condition, please consult a doctor first.";

export function QuizResult({ outcome, onRetake }: { outcome: QuizOutcome; onRetake: () => void }) {
  const main = PRESETS[outcome.primary];
  const second = outcome.secondary ? PRESETS[outcome.secondary] : null;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <p className="eyebrow text-center">Your result</p>
      <h2 className="mt-3 text-center font-display text-4xl md:text-5xl">Your best match: {main.name}</h2>
      <span className="gold-rule mx-auto mt-6" />

      <section className="mt-8 overflow-hidden rounded-3xl bg-card shadow-lift" aria-labelledby="quiz-main-match">
        <ImageSlot
          slot={`quiz-result-${main.id}`}
          src={main.image}
          alt={main.imageAlt}
          className={main.colorClass}
          imgClassName="object-contain p-6"
        />
        <div className="p-6 md:p-8">
          <div className={main.colorClass + " inline-flex rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-foreground"}>
            {main.name}
          </div>
          <h3 id="quiz-main-match" className="mt-4 font-display text-3xl">VITADAY {main.name}</h3>
          <p className="mt-2 text-muted-foreground">{main.blurb}</p>

          <p className="mt-6 eyebrow">Ingredients</p>
          {main.ingredients ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              {main.ingredients.map((ingredient) => (
                <li key={ingredient} className="rounded-full bg-surface px-3 py-1 text-sm">
                  {ingredient}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">{INGREDIENTS_PLACEHOLDER}</p>
          )}

          <Button asChild size="lg" className="mt-8 w-full">
            <a href={presetShopUrl(main.id)} onClick={() => track("result_cta_clicked", { preset: main.name, link: main.shopUrl })}>
              Get {main.name} now
            </a>
          </Button>
        </div>
      </section>

      {second && (
        <section className="mt-5 flex flex-col gap-5 rounded-3xl border border-border bg-card p-5 sm:flex-row sm:items-center" aria-labelledby="quiz-second-match">
          <ImageSlot
            slot={`quiz-result-${second.id}`}
            src={second.image}
            alt={second.imageAlt}
            className={second.colorClass + " w-full shrink-0 sm:w-32"}
            imgClassName="object-contain p-3"
          />
          <div className="min-w-0 flex-1">
            <h3 id="quiz-second-match" className="font-display text-2xl">Also a good fit: {second.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{second.blurb}</p>
          </div>
          <Button asChild variant="outline" className="shrink-0">
            <a href={presetShopUrl(second.id)} onClick={() => track("result_cta_clicked", { preset: second.name, link: second.shopUrl })}>
              View {second.name}
            </a>
          </Button>
        </section>
      )}

      <div className="mt-8 flex flex-col items-center gap-4 text-center">
        <Link to="/shop" className="inline-flex min-h-11 items-center gap-2 text-sm text-gold-ink underline-offset-4 hover:underline">
          Browse all presets <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <Button variant="outline" onClick={onRetake}>
          Retake the quiz
        </Button>
      </div>

      <EmailCapture primary={outcome.primary} secondary={outcome.secondary} />

      <p className="mx-auto mt-8 max-w-xl text-center text-xs leading-relaxed text-muted-foreground">{SAFETY_NOTE}</p>
    </div>
  );
}

function EmailCapture({ primary, secondary }: { primary: QuizOutcome["primary"]; secondary: QuizOutcome["secondary"] }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!consent) {
      setError("Please tick the box so we can email your result.");
      return;
    }
    setStatus("saving");
    try {
      await saveQuizResult(email, primary, secondary);
      setStatus("done");
    } catch (err) {
      setStatus("idle");
      setError(
        err instanceof Error && "issues" in err
          ? "Please enter a valid email address."
          : err instanceof Error
            ? err.message
            : "Please try again.",
      );
    }
  };

  return (
    <section className="mt-8 rounded-3xl border border-border bg-card p-6" aria-labelledby="quiz-email-title">
      <h3 id="quiz-email-title" className="font-display text-2xl">Send me my result by email</h3>
      <p className="mt-1 text-sm text-muted-foreground">Optional — the button above works without this.</p>

      {status === "done" ? (
        <div className="mt-4 flex items-start gap-3 rounded-xl bg-surface p-4 text-sm" role="status">
          <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold-ink" aria-hidden="true" />
          <p>Saved. We'll only use this address to send you your result.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-4 space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="quiz-email">Email</Label>
            <Input
              id="quiz-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-11 rounded-xl bg-background"
            />
            {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="quiz-consent"
              checked={consent}
              onCheckedChange={(value) => setConsent(value === true)}
              className="mt-1 border-foreground/30 data-[state=checked]:bg-gold-ink data-[state=checked]:border-gold-ink"
            />
            <Label htmlFor="quiz-consent" className="text-sm font-normal text-muted-foreground">
              I agree that VITADAY may email me this result. Unsubscribe anytime.
            </Label>
          </div>

          <Button type="submit" variant="secondary" disabled={status === "saving"}>
            {status === "saving" ? "Saving…" : "Send my result"}
          </Button>
        </form>
      )}
    </section>
  );
}
