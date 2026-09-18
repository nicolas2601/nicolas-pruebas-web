"use client";

import { NEXT_STEPS } from "@/lib/content";
import { Stagger, StaggerItem } from "./Reveal";

export function NextSteps() {
  return (
    <Stagger className="grid gap-3 md:grid-cols-2">
      {NEXT_STEPS.map((s, i) => (
        <StaggerItem key={s.title}>
          <div className="flex h-full gap-4 rounded-xl border border-border bg-surface p-4 card-hover">
            <span className="mono text-sm text-amber">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3 className="text-base font-medium">{s.title}</h3>
              <p className="mt-1 text-sm text-muted">{s.body}</p>
            </div>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
