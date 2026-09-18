"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { Counter } from "./Counter";

const EASE = [0.23, 1, 0.32, 1] as const;

const STATS = [
  { label: "GPUs en paralelo", value: 2, decimals: 0, suffix: "" },
  { label: "img/s con DDP", value: 420, decimals: 0, suffix: "" },
  { label: "kNN top-1 final", value: 0.983, decimals: 3, suffix: "" },
  { label: "minutos, 10 épocas", value: 5, decimals: 0, suffix: "" },
];

export function Hero() {
  const reduce = useReducedMotion() ?? false;
  const item = (i: number) => ({
    initial: { opacity: 0, transform: reduce ? "none" : "translateY(12px)" },
    animate: { opacity: 1, transform: "translateY(0px)" },
    transition: { duration: 0.5, delay: 0.08 * i, ease: EASE },
  });

  return (
    <section id="top" className="relative overflow-hidden">
      <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(245,165,36,0.35), rgba(56,189,248,0.12) 60%, transparent)" }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-24 md:pt-32">
        <motion.p {...item(0)} className="badge">
          <span className="h-1.5 w-1.5 rounded-full bg-green" /> Clúster UNABIA · 17 de septiembre de 2026
        </motion.p>
        <motion.h1 {...item(1)} className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
          Probamos las dos GPUs del clúster con el método propuesto.
        </motion.h1>
        <motion.p {...item(2)} className="mt-5 max-w-2xl text-lg text-muted">
          SimSiam sobre DINOv2 ViT-S/14, entrenado en paralelo con DistributedDataParallel y bf16 sobre las dos
          RTX PRO 4000. Esta página documenta qué corrimos, qué se rompió, por qué, y qué números dio.
        </motion.p>
        <motion.div {...item(3)} className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-surface/70 p-4 card-hover">
              <div className="text-3xl font-semibold tracking-tight text-fg md:text-4xl">
                <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} />
              </div>
              <div className="mt-1 text-xs text-muted">{s.label}</div>
            </div>
          ))}
        </motion.div>
        <motion.a
          {...item(4)}
          href="#cluster"
          className="pressable mt-10 inline-flex items-center gap-2 rounded-md border border-border bg-surface-2 px-3.5 py-2 text-sm text-fg hover:border-border-strong"
        >
          Ver el recorrido <ArrowDown size={14} className="text-muted" />
        </motion.a>
      </div>
    </section>
  );
}
