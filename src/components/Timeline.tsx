"use client";

import { Check, Clock, X } from "lucide-react";
import { TIMELINE, type TimelineItem } from "@/lib/content";
import { Reveal } from "./Reveal";

const STATUS = {
  ok: { icon: Check, ring: "border-green/60 text-green", label: "Funcionó" },
  fail: { icon: X, ring: "border-red/60 text-red", label: "Se rompió" },
  pending: { icon: Clock, ring: "border-amber/60 text-amber", label: "Pendiente" },
} as const;

function Item({ item, index }: { item: TimelineItem; index: number }) {
  const s = STATUS[item.status];
  const Icon = s.icon;
  return (
    <Reveal as="li" className="relative pl-12" delay={Math.min(index * 0.03, 0.15)}>
      <span className={`absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border bg-surface ${s.ring}`}>
        <Icon size={14} />
      </span>
      <div className="rounded-xl border border-border bg-surface p-4 card-hover">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mono text-xs text-muted">{item.time}</span>
          <span className={`text-xs ${s.ring.split(" ")[1]}`}>{s.label}</span>
          <h3 className="w-full text-base font-medium text-fg sm:w-auto">{item.title}</h3>
        </div>
        <dl className="mt-3 grid gap-3 text-sm md:grid-cols-3">
          <div>
            <dt className="text-xs text-muted-2">Síntoma</dt>
            <dd className="mt-0.5 text-muted">{item.symptom}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-2">Causa raíz</dt>
            <dd className="mt-0.5 text-muted">{item.cause}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-2">Qué hicimos</dt>
            <dd className="mt-0.5 text-fg/90">{item.fix}</dd>
          </div>
        </dl>
      </div>
    </Reveal>
  );
}

export function Timeline() {
  return (
    <ol className="relative space-y-4 before:absolute before:bottom-4 before:left-4 before:top-4 before:w-px before:bg-border">
      {TIMELINE.map((item, i) => (
        <Item key={item.title} item={item} index={i} />
      ))}
    </ol>
  );
}
