import type { ReactNode } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeading({ eyebrow, title, text, align = "center", as: As = "h2", className }: {
  eyebrow?: string; title: ReactNode; text?: ReactNode; align?: "center" | "left"; as?: "h1" | "h2"; className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" ? "mx-auto text-center" : "", className)}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <As className={cn("mt-3 text-4xl text-foreground md:text-5xl", As === "h1" && "md:text-6xl")}>{title}</As>
      <span className={cn("gold-rule mt-6", align === "center" && "mx-auto")} />
      {text && <p className="mt-6 text-base text-muted-foreground md:text-lg">{text}</p>}
    </div>
  );
}

/** A replaceable product image. data-image-slot marks it for swapping in final renders. */
export function ImageSlot({ src, alt, slot, className, imgClassName, eager }: {
  src: string; alt: string; slot: string; className?: string; imgClassName?: string; eager?: boolean;
}) {
  return (
    <div data-image-slot={slot} className={cn("overflow-hidden rounded-2xl bg-surface", className)}>
      <img src={src} alt={alt} loading={eager ? "eager" : "lazy"} className={cn("h-full w-full object-cover", imgClassName)} />
    </div>
  );
}

/** Clearly marked placeholder for a product video. */
export function VideoSlot({ label = "How it works — 15 sec video", className }: { label?: string; className?: string }) {
  return (
    <div data-video-slot={label} className={cn("relative flex aspect-video flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gold bg-card text-center", className)}>
      <span className="grid h-16 w-16 place-items-center rounded-full border border-gold text-gold-ink">
        <Play className="ml-1 h-6 w-6" aria-hidden="true" />
      </span>
      <p className="text-sm text-foreground">{label}</p>
      <p className="eyebrow text-[0.62rem]">Video slot</p>
    </div>
  );
}

export function StepNumber({ n }: { n: number }) {
  return (
    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold font-display text-xl text-primary-foreground">{n}</span>
  );
}
