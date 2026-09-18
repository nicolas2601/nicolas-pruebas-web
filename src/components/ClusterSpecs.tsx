"use client";

import { CLUSTER_SPECS } from "@/lib/content";
import { Stagger, StaggerItem } from "./Reveal";

const ACCENT = { amber: "text-amber", sky: "text-sky" } as const;

export function ClusterSpecs() {
  return (
    <Stagger className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {CLUSTER_SPECS.map((s) => (
        <StaggerItem key={s.label}>
          <div className="h-full rounded-xl border border-border bg-surface p-4 card-hover">
            <div className="text-xs text-muted">{s.label}</div>
            <div className={`mt-1 text-lg font-medium tracking-tight ${s.accent ? ACCENT[s.accent] : "text-fg"}`}>{s.value}</div>
            {s.detail ? <div className="mt-1 text-xs text-muted-2">{s.detail}</div> : null}
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
