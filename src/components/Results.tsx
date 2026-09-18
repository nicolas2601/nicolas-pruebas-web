"use client";

import scalars from "@/data/scalars_ddp10.json";
import { LineChart, type Series } from "./LineChart";
import { Stagger, StaggerItem } from "./Reveal";

type Scalars = Record<string, [number, number][]>;
const S = scalars as unknown as Scalars;

const series = (tag: string, name: string, color: string): Series => ({ name, color, points: S[tag] });
const last = (tag: string) => S[tag][S[tag].length - 1][1];
const min = (tag: string) => Math.min(...S[tag].map((p) => p[1]));
const max = (tag: string) => Math.max(...S[tag].map((p) => p[1]));
const mean = (tag: string) => S[tag].reduce((a, p) => a + p[1], 0) / S[tag].length;

const READINGS = [
  { label: "kNN top-1 antes de entrenar", value: S["eval/knn_top1"][0][1].toFixed(4), note: "DINOv2 congelado ya es muy bueno en Imagenette" },
  { label: "kNN top-1 máximo", value: max("eval/knn_top1").toFixed(4), note: "época 2; después oscila en ±0,003" },
  { label: "Loss final", value: last("train/loss").toFixed(3), note: "mínimo teórico −1: las vistas ya casi coinciden" },
  { label: "collapse_ratio mínimo", value: min("train/collapse_ratio").toFixed(2), note: "1,0 = sano; 0 = todas las imágenes al mismo vector" },
  { label: "Throughput medio", value: `${Math.round(mean("perf/img_per_s"))} img/s`, note: "2 GPUs, limitado por CPU (workers=0)" },
  { label: "VRAM pico por GPU", value: `${max("perf/vram_gb").toFixed(1)} GB`, note: "de 24 GB: hay 6x de margen para batch o resolución" },
];

export function Results() {
  return (
    <div className="space-y-6">
      <Stagger className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {READINGS.map((r) => (
          <StaggerItem key={r.label}>
            <div className="h-full rounded-xl border border-border bg-surface p-4 card-hover">
              <div className="text-xs text-muted">{r.label}</div>
              <div className="mono mt-1 text-2xl font-semibold tracking-tight text-fg">{r.value}</div>
              <div className="mt-1 text-xs text-muted-2">{r.note}</div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
      <div className="grid gap-4 lg:grid-cols-2">
        <LineChart
          title="Pérdida SimSiam"
          subtitle="−cos(p, stopgrad(z)), promedio de las dos direcciones"
          xLabel="paso"
          series={[series("train/loss", "loss", "#f5a524")]}
          reference={{ value: -1, label: "mínimo −1" }}
          yDomain={[-1.05, -0.2]}
        />
        <LineChart
          title="Indicador de colapso"
          subtitle="std por dimensión de z normalizado, sobre 1/√d"
          xLabel="paso"
          series={[series("train/collapse_ratio", "collapse_ratio", "#22c55e")]}
          reference={{ value: 1, label: "sano" }}
          yDomain={[0, 1.15]}
        />
        <LineChart
          title="kNN top-1 con backbone congelado"
          subtitle="k=20, Imagenette val (3 925 imágenes), evaluado cada 2 épocas"
          xLabel="época"
          series={[series("eval/knn_top1", "knn", "#38bdf8")]}
          formatY={(v) => v.toFixed(3)}
          yDomain={[0.97, 0.99]}
        />
        <LineChart
          title="Throughput y VRAM"
          subtitle="imágenes por segundo en las 2 GPUs; VRAM pico en GB (rank 0)"
          xLabel="paso"
          series={[series("perf/img_per_s", "img/s", "#f5a524"), { name: "VRAM GB ×100", color: "#38bdf8", points: S["perf/vram_gb"].map(([x, y]) => [x, y * 100]) }]}
          formatY={(v) => v.toFixed(0)}
        />
      </div>
      <p className="max-w-3xl text-sm text-muted">
        Lectura honesta: el backbone preentrenado ya resolvía Imagenette al 97,6 % antes de que entrenáramos nada, así
        que la ganancia de kNN es pequeña por diseño. El resultado que importa es que el pipeline completo del método
        propuesto corre en las dos GPUs, converge (loss cerca de −1) y <em>no colapsa</em> (collapse_ratio ≈ 1), que es
        el riesgo declarado de SimSiam sobre un ViT.
      </p>
    </div>
  );
}
