"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useMemo, useRef, useState } from "react";

export type Series = { name: string; color: string; points: [number, number][] };

type Props = {
  series: Series[];
  title: string;
  subtitle?: string;
  xLabel: string;
  formatY?: (v: number) => string;
  yDomain?: [number, number];
  reference?: { value: number; label: string };
  height?: number;
};

const W = 640;
const PAD = { top: 16, right: 16, bottom: 32, left: 52 };

export function LineChart({ series, title, subtitle, xLabel, formatY = (v) => v.toFixed(2), yDomain, reference, height = 260 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<number | null>(null);

  const { xs, ys, xTicks, yTicks } = useMemo(() => {
    const all = series.flatMap((s) => s.points);
    const xMin = Math.min(...all.map((p) => p[0]));
    const xMax = Math.max(...all.map((p) => p[0]));
    let yMin = yDomain?.[0] ?? Math.min(...all.map((p) => p[1]), reference?.value ?? Infinity);
    let yMax = yDomain?.[1] ?? Math.max(...all.map((p) => p[1]), reference?.value ?? -Infinity);
    if (!yDomain) {
      const padY = (yMax - yMin || 1) * 0.12;
      yMin -= padY;
      yMax += padY;
    }
    const xs = (x: number) => PAD.left + ((x - xMin) / (xMax - xMin || 1)) * (W - PAD.left - PAD.right);
    const ys = (y: number) => height - PAD.bottom - ((y - yMin) / (yMax - yMin || 1)) * (height - PAD.top - PAD.bottom);
    const xTicks = Array.from({ length: 5 }, (_, i) => xMin + ((xMax - xMin) * i) / 4);
    const yTicks = Array.from({ length: 4 }, (_, i) => yMin + ((yMax - yMin) * i) / 3);
    return { xs, ys, xTicks, yTicks };
  }, [series, yDomain, reference, height]);

  const path = (pts: [number, number][]) => pts.map((p, i) => `${i ? "L" : "M"}${xs(p[0]).toFixed(1)},${ys(p[1]).toFixed(1)}`).join(" ");
  const main = series[0];
  const hoverPoint = hover !== null ? main.points[hover] : null;

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    let best = 0;
    let bestD = Infinity;
    main.points.forEach((p, i) => {
      const d = Math.abs(xs(p[0]) - x);
      if (d < bestD) { bestD = d; best = i; }
    });
    setHover(best);
  };

  return (
    <div ref={ref} className="rounded-xl border border-border bg-surface p-4 card-hover">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium text-fg">{title}</h3>
          {subtitle ? <p className="text-xs text-muted">{subtitle}</p> : null}
        </div>
        <div className="mono text-xs text-muted">
          {hoverPoint ? `${xLabel} ${hoverPoint[0]} · ${formatY(hoverPoint[1])}` : `${xLabel} → `}
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${height}`} className="w-full" onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
        {yTicks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={ys(t)} y2={ys(t)} stroke="rgba(255,255,255,0.06)" />
            <text x={PAD.left - 8} y={ys(t) + 4} textAnchor="end" className="mono" fontSize="12" fill="#8f8f98">{formatY(t)}</text>
          </g>
        ))}
        {xTicks.map((t) => (
          <text key={t} x={xs(t)} y={height - 10} textAnchor="middle" className="mono" fontSize="12" fill="#8f8f98">{Math.round(t)}</text>
        ))}
        {reference ? (
          <g>
            <line x1={PAD.left} x2={W - PAD.right} y1={ys(reference.value)} y2={ys(reference.value)} stroke="#8f8f98" strokeDasharray="4 4" />
            <text x={W - PAD.right} y={ys(reference.value) - 5} textAnchor="end" fontSize="11" fill="#8f8f98">{reference.label}</text>
          </g>
        ) : null}
        {series.map((s) => (
          <motion.path
            key={s.name}
            d={path(s.points)}
            fill="none"
            stroke={s.color}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
            initial={{ pathLength: reduce ? 1 : 0, opacity: reduce ? 1 : 0.4 }}
            animate={inView ? { pathLength: 1, opacity: 1 } : undefined}
            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
          />
        ))}
        {hoverPoint ? (
          <g>
            <line x1={xs(hoverPoint[0])} x2={xs(hoverPoint[0])} y1={PAD.top} y2={height - PAD.bottom} stroke="rgba(255,255,255,0.18)" />
            <circle cx={xs(hoverPoint[0])} cy={ys(hoverPoint[1])} r={4} fill={main.color} stroke="#09090b" strokeWidth={2} />
          </g>
        ) : null}
      </svg>
      {series.length > 1 ? (
        <div className="mt-2 flex flex-wrap gap-3">
          {series.map((s) => (
            <span key={s.name} className="flex items-center gap-1.5 text-xs text-muted">
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: s.color }} />
              {s.name}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
