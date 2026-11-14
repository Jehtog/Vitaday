import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { scoreQuiz, type QuizOutcome } from "@/lib/quiz/scoring";
import { visibleQuestions, type AnswerMap, type QuizOption, type QuizQuestion } from "@/lib/quiz/questions";
import { QuizResult } from "./QuizResult";

/** Pause after an answer so the next card can fade in. */
const AUTO_ADVANCE_MS = 260;
/** The short "finding your match" animation before the result. */
const RESULT_DELAY_MS = 1500;

type Phase = "questions" | "loading" | "result";

export function QuizRunner() {
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<Phase>("questions");
  const [outcome, setOutcome] = useState<QuizOutcome | null>(null);
  const timer = useRef<number | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const started = useRef(false);

  const questions = visibleQuestions(answers);
  const question = questions[step];
  const total = questions.length;

  const clearTimer = () => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  };

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    track("quiz_started", { questions: visibleQuestions({}).length });
  }, []);

  // Keep the keyboard on the question that just appeared.
  useEffect(() => {
    if (phase === "questions") heading.current?.focus({ preventScroll: true });
  }, [phase, step, question?.id]);

  useEffect(() => clearTimer, []);

  const finish = (next: AnswerMap) => {
    setPhase("loading");
    timer.current = window.setTimeout(() => {
      const result = scoreQuiz(next);
      setOutcome(result);
      setPhase("result");
      track("quiz_completed", { primary: result.primary, secondary: result.secondary ?? "" });
    }, RESULT_DELAY_MS);
  };

  const answer = (question: QuizQuestion, option: QuizOption) => {
    if (phase !== "questions") return;
    clearTimer();
    const next: AnswerMap = { ...answers, [question.id]: option.id };
    setAnswers(next);
    track("question_answered", { question: question.id, answer: option.id });
    if (option.next === "result") {
      finish(next);
      return;
    }
    timer.current = window.setTimeout(() => setStep((s) => s + 1), AUTO_ADVANCE_MS);
  };

  const back = () => {
    clearTimer();
    setStep((s) => Math.max(0, s - 1));
  };

  const retake = () => {
    clearTimer();
    setAnswers({});
    setStep(0);
    setOutcome(null);
    setPhase("questions");
    track("quiz_started", { questions: visibleQuestions({}).length, retake: true });
  };

  if (phase === "result" && outcome) {
    return <QuizResult outcome={outcome} onRetake={retake} />;
  }

  if (phase === "loading") {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-5 rounded-3xl bg-card p-10 text-center shadow-soft" role="status">
        <svg viewBox="0 0 48 48" className="h-12 w-12 animate-spin text-gold" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <circle cx="24" cy="24" r="19" strokeOpacity="0.25" />
          <path d="M24 5a19 19 0 0 1 19 19" strokeLinecap="round" />
        </svg>
        <p className="font-display text-3xl">Finding your match…</p>
        <p className="text-sm text-muted-foreground">Just a moment — we're weighing your answers.</p>
      </div>
    );
  }

  if (!question) return null;

  const chosen = answers[question.id];
  const percent = Math.round(((step + 1) / total) * 100);

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="flex items-center justify-between gap-4">
        <p className="eyebrow">
          Question {step + 1} of {total}
        </p>
        {step > 0 && (
          <button
            type="button"
            onClick={back}
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            Back
          </button>
        )}
      </div>

      <div
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={step + 1}
        aria-label={`Question ${step + 1} of ${total}`}
        className="mt-3 h-1 w-full overflow-hidden rounded-full bg-surface"
      >
        <div className="h-full rounded-full bg-gold transition-[width] duration-500" style={{ width: `${percent}%` }} />
      </div>

      <div key={question.id} className="animate-in fade-in duration-500 mt-8 rounded-3xl bg-card p-6 shadow-soft md:p-8">
        <h2
          ref={heading}
          id="quiz-question"
          tabIndex={-1}
          className="font-display text-3xl outline-none md:text-4xl"
        >
          {question.prompt}
        </h2>

        <div role="group" aria-labelledby="quiz-question" className="mt-6 grid gap-3">
          {question.options.map((option) => {
            const selected = chosen === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => answer(question, option)}
                aria-pressed={selected}
                className={cn(
                  "flex min-h-14 w-full items-center gap-3 rounded-2xl border p-4 text-left text-base transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  selected
                    ? "border-gold bg-gold-soft/40"
                    : "border-border bg-background hover:border-foreground/30 hover:bg-surface",
                )}
              >
                <span
                  className={cn(
                    "grid h-5 w-5 shrink-0 place-items-center rounded-full border",
                    selected ? "border-gold-ink bg-gold-ink" : "border-foreground/30",
                  )}
                  aria-hidden="true"
                >
                  {selected && <span className="h-2 w-2 rounded-full bg-card" />}
                </span>
                <span className="min-w-0 flex-1">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-5 text-center text-xs text-muted-foreground">
        Tap an answer to move on. Nothing here is medical advice.
      </p>
    </div>
  );
}
