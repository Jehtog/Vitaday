import type { ReactNode } from "react";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="section-y">
      <div className="container-page max-w-3xl">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-3 text-5xl">{title}</h1>
        <span className="gold-rule mt-6" />
        <div className="mt-8 space-y-4 text-muted-foreground [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:text-foreground">{children}</div>
      </div>
    </section>
  );
}
