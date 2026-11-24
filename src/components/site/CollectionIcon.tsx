import { Dumbbell, Droplet, GraduationCap, Leaf, Sparkles } from "lucide-react";
import type { CollectionId } from "@/lib/catalog";
import { cn } from "@/lib/utils";

function Stones({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className={className} aria-hidden="true">
      <ellipse cx="12" cy="18" rx="7" ry="2.8" />
      <ellipse cx="12" cy="12.2" rx="5" ry="2.3" />
      <ellipse cx="12" cy="7" rx="3.2" ry="1.8" />
    </svg>
  );
}

export function CollectionIcon({ id, className }: { id: CollectionId; className?: string }) {
  const cls = cn("h-6 w-6", className);
  switch (id) {
    case "essential": return <Leaf className={cls} strokeWidth={1.4} aria-hidden="true" />;
    case "glow": return <Sparkles className={cls} strokeWidth={1.4} aria-hidden="true" />;
    case "balance": return <Stones className={cls} />;
    case "active": return <Dumbbell className={cls} strokeWidth={1.4} aria-hidden="true" />;
    case "focus": return <GraduationCap className={cls} strokeWidth={1.4} aria-hidden="true" />;
    case "cycle": return <Droplet className={cls} strokeWidth={1.4} aria-hidden="true" />;
  }
}
