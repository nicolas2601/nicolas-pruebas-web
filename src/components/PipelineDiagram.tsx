"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

const EASE = [0.23, 1, 0.32, 1] as const;

type Box = { id: string; x: number; y: number; w: number; label: string; sub?: string; color: string };

const BOXES: Box[] = [
  { id: "img", x: 20, y: 96, w: 110, label: "Imagen", sub: "Imagenette 160px", color: "#8f8f98" },
  { id: "v1", x: 170, y: 36, w: 120, label: "Vista 1", sub: "crop, flip, jitter, blur", color: "#38bdf8" },
  { id: "v2", x: 170, y: 156, w: 120, label: "Vista 2", sub: "otra aumentación", color: "#38bdf8" },
  { id: "bb", x: 340, y: 96, w: 150, label: "DINOv2 ViT-S/14", sub: "22M params, compartido", color: "#f5a524" },
  { id: "proj", x: 540, y: 96, w: 120, label: "Projector", sub: "MLP 384→2048", color: "#f5a524" },
  { id: "pred", x: 710, y: 36, w: 120, label: "Predictor", sub: "MLP 2048→512→2048", color: "#22c55e" },
  { id: "sg", x: 710, y: 156, w: 120, label: "stop-grad", sub: "sin gradiente", color: "#f43f5e" },
  { id: "loss", x: 880, y: 96, w: 100, label: "−cos(p, z)", sub: "loss simétrica", color: "#ededef" },
];

const EDGES: [string, string][] = [
  ["img", "v1"], ["img", "v2"], ["v1", "bb"], ["v2", "bb"], ["bb", "proj"],
  ["proj", "pred"], ["proj", "sg"], ["pred", "loss"], ["sg", "loss"],
];

const H = 48;
const byId = Object.fromEntries(BOXES.map((b) => [b.id, b]));
const right = (b: Box) => ({ x: b.x + b.w, y: b.y + H / 2 });
const left = (b: Box) => ({ x: b.x, y: b.y + H / 2 });

function edgePath(a: Box, b: Box) {
  const p = right(a);
  const q = left(b);
  const c = (q.x - p.x) / 2;
  return `M${p.x},${p.y} C${p.x + c},${p.y} ${q.x - c},${q.y} ${q.x},${q.y}`;
}

export function PipelineDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion() ?? false;

  return (
    <div ref={ref} className="overflow-x-auto rounded-xl border border-border bg-surface p-4">
      <svg viewBox="0 0 1000 250" className="min-w-[760px] w-full">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="rgba(255,255,255,0.35)" />
          </marker>
        </defs>
        {EDGES.map(([a, b], i) => (
          <motion.path
            key={`${a}-${b}`}
            d={edgePath(byId[a], byId[b])}
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={1.5}
            markerEnd="url(#arrow)"
            initial={{ pathLength: reduce ? 1 : 0 }}
            animate={inView ? { pathLength: 1 } : undefined}
            transition={{ duration: 0.6, delay: 0.25 + i * 0.07, ease: EASE }}
          />
        ))}
        {!reduce ? (
          <motion.circle
            r={3.5}
            fill="#38bdf8"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: [0, 1, 1, 0] } : undefined}
            transition={{ duration: 2.4, delay: 1.2, repeat: Infinity, repeatDelay: 1.5, ease: "linear" }}
          >
            <animateMotion dur="2.4s" begin="1.2s" repeatCount="indefinite" path={edgePath(byId.img, byId.v1) + " " + edgePath(byId.v1, byId.bb).replace(/^M[^ ]+ /, "L")} />
          </motion.circle>
        ) : null}
        {BOXES.map((b, i) => (
          <motion.g
            key={b.id}
            initial={{ opacity: 0, transform: reduce ? "none" : "translateY(8px)" }}
            animate={inView ? { opacity: 1, transform: "translateY(0px)" } : undefined}
            transition={{ duration: 0.4, delay: i * 0.06, ease: EASE }}
          >
            <rect x={b.x} y={b.y} width={b.w} height={H} rx={8} fill="#17171a" stroke={b.color} strokeOpacity={0.55} />
            <text x={b.x + b.w / 2} y={b.y + 20} textAnchor="middle" fontSize="12" fontWeight={600} fill={b.color}>{b.label}</text>
            {b.sub ? <text x={b.x + b.w / 2} y={b.y + 36} textAnchor="middle" fontSize="9.5" fill="#8f8f98">{b.sub}</text> : null}
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
