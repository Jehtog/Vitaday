import { useEffect, useState } from "react";
import { WEEKDAYS, weekdayIndex } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const FULL = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const SEG = 360 / 7;

function arcPath(cx: number, cy: number, r1: number, r2: number, a0: number, a1: number) {
  const rad = (a: number) => ((a - 90) * Math.PI) / 180;
  const p = (r: number, a: number) => `${cx + r * Math.cos(rad(a))} ${cy + r * Math.sin(rad(a))}`;
  return `M ${p(r2, a0)} A ${r2} ${r2} 0 0 1 ${p(r2, a1)} L ${p(r1, a1)} A ${r1} ${r1} 0 0 0 ${p(r1, a0)} Z`;
}

/**
 * Signature motif: the cap's weekday ring. On scroll it rotates so today's chamber
 * sits under the pointer. Today's weekday is read in the browser after hydration.
 */
export function WeekdayRing({ className, animateOnScroll = true }: { className?: string; animateOnScroll?: boolean }) {
  const [today, setToday] = useState<number | null>(null);
  const [progress, setProgress] = useState(animateOnScroll ? 0 : 1);

  useEffect(() => {
    setToday(weekdayIndex(new Date()));
    if (!animateOnScroll) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setProgress(1);
      return;
    }
    const onScroll = () => setProgress(Math.min(1, window.scrollY / 260));
    onScroll();
    // Also settle gently after a moment so visitors who don't scroll still see today.
    const t = window.setTimeout(() => setProgress((p) => Math.max(p, 1)), 2600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(t);
    };
  }, [animateOnScroll]);

  const day = today ?? 0;
  const target = -day * SEG;
  const rotation = target + (1 - progress) * 3 * SEG;
  const settled = today !== null && progress >= 0.98;

  return (
    <figure className={cn("relative aspect-square select-none", className)} aria-label={today !== null ? `Weekday ring set to ${FULL[day]}` : "Weekday ring"}>
      <svg viewBox="0 0 320 320" className="h-full w-full drop-shadow-[0_18px_30px_oklch(0.38_0.018_57_/_0.12)]" role="img" aria-hidden="true">
        <circle cx="160" cy="160" r="156" className="fill-card stroke-border" strokeWidth="1" />
        <g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: "160px 160px", transition: "transform 900ms cubic-bezier(0.22,1,0.36,1)" }}>
          {WEEKDAYS.map((label, i) => {
            const a0 = i * SEG - SEG / 2 + 1.2;
            const a1 = i * SEG + SEG / 2 - 1.2;
            const active = settled && i === day;
            return (
              <g key={label}>
                <path
                  d={arcPath(160, 160, 104, 148, a0, a1)}
                  className={cn("transition-colors duration-700", active ? "fill-gold-soft stroke-gold" : "fill-background stroke-border")}
                  strokeWidth={active ? 1.5 : 1}
                />
                <text
                  x="160"
                  y="36"
                  transform={`rotate(${i * SEG} 160 160)`}
                  textAnchor="middle"
                  className={cn("font-sans text-[13px] tracking-[0.18em]", active ? "fill-gold-ink" : "fill-muted-foreground")}
                >
                  {label}
                </text>
              </g>
            );
          })}
        </g>
        <circle cx="160" cy="160" r="96" className="fill-background stroke-gold" strokeWidth="0.8" />
        <path d="M152 4 L160 13 L168 4" className="fill-none stroke-gold-ink" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <figcaption className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="eyebrow">Today</span>
        <span className="mt-1 font-display text-3xl text-foreground md:text-4xl">{today !== null ? FULL[day] : "\u00a0"}</span>
        <span className="mt-1 text-xs text-muted-foreground">ready in your cap</span>
      </figcaption>
    </figure>
  );
}

/** Small ring mark used as the account icon. */
export function RingIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-5 w-5", className)} aria-hidden="true" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.1" />
      {Array.from({ length: 7 }).map((_, i) => {
        const a = ((i * 360) / 7 - 90) * (Math.PI / 180);
        return (
          <line key={i} x1={12 + 4.6 * Math.cos(a)} y1={12 + 4.6 * Math.sin(a)} x2={12 + 8 * Math.cos(a)} y2={12 + 8 * Math.sin(a)}
            stroke="currentColor" strokeWidth={i === 0 ? 1.8 : 0.9} className={i === 0 ? "text-gold" : undefined} />
        );
      })}
    </svg>
  );
}

/** Checkout progress styled as a ring: Cart → Details → Payment → Done. */
export function RingProgress({ steps, current }: { steps: string[]; current: number }) {
  const n = steps.length;
  const seg = 360 / n;
  return (
    <div className="flex items-center gap-5">
      <svg viewBox="0 0 64 64" className="h-16 w-16 shrink-0" aria-hidden="true">
        {steps.map((s, i) => (
          <path key={s} d={arcPath(32, 32, 22, 30, i * seg + 3, (i + 1) * seg - 3)}
            className={cn("transition-colors duration-500", i <= current ? "fill-gold" : "fill-surface")} />
        ))}
        <text x="32" y="36" textAnchor="middle" className="fill-foreground font-sans text-[11px]">{Math.min(current + 1, n)}/{n}</text>
      </svg>
      <ol className="flex flex-wrap gap-x-4 gap-y-1 text-xs uppercase tracking-[0.18em]" aria-label="Checkout progress">
        {steps.map((s, i) => (
          <li key={s} aria-current={i === current ? "step" : undefined}
            className={cn(i === current ? "text-gold-ink" : i < current ? "text-foreground" : "text-muted-foreground")}>
            {s}
          </li>
        ))}
      </ol>
    </div>
  );
}
