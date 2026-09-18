import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

type Props = { id: string; kicker: string; title: string; intro?: string; children: ReactNode };

export function Section({ id, kicker, title, intro, children }: Props) {
  return (
    <section id={id} className="scroll-mt-16 border-t border-border">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <Reveal>
          <p className="mono text-xs uppercase tracking-[0.18em] text-amber">{kicker}</p>
          <h2 className="mt-2 max-w-2xl text-2xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {intro ? <p className="mt-4 max-w-2xl text-base text-muted">{intro}</p> : null}
        </Reveal>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
