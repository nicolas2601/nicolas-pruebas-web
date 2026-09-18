"use client";

import { PipelineDiagram } from "./PipelineDiagram";
import { Stagger, StaggerItem } from "./Reveal";

const WHY = [
  {
    title: "Por qué SimSiam",
    body: "Es el objetivo auto-supervisado más simple que da señal: dos vistas, un encoder, un predictor, y stop-gradient en la rama objetivo. Sin negativos, sin teacher con EMA. Es también el método propuesto de la tesis sobre DINOv2, así que la prueba del clúster ya ejercita el código real.",
  },
  {
    title: "Por qué DINOv2 ViT-S/14",
    body: "Backbone preentrenado sin etiquetas sobre 142M de imágenes, 22M de parámetros: cabe cómodo en 24 GB y se entrena rápido. Entrada a 112 px (8×8 parches de 14) para que 10 épocas duren minutos, no horas.",
  },
  {
    title: "Por qué Imagenette y no piel",
    body: "El objetivo era probar el clúster, no producir un resultado de la tesis. Imagenette pesa 99 MB, baja en segundos y tiene un split de validación etiquetado para medir con kNN si el encoder mejora o colapsa.",
  },
  {
    title: "Cómo sabemos que no colapsó",
    body: "SimSiam sin teacher puede mandar todas las imágenes al mismo vector. Medimos la desviación estándar por dimensión de z normalizado: cerca de 1/√d es sano, cerca de 0 es colapso. Se registra en TensorBoard cada 20 pasos.",
  },
];

export function ModelExplainer() {
  return (
    <div className="space-y-6">
      <PipelineDiagram />
      <Stagger className="grid gap-3 md:grid-cols-2">
        {WHY.map((w) => (
          <StaggerItem key={w.title}>
            <div className="h-full rounded-xl border border-border bg-surface p-4 card-hover">
              <h3 className="text-base font-medium">{w.title}</h3>
              <p className="mt-1 text-sm text-muted">{w.body}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
      <div className="rounded-xl border border-border bg-surface p-4">
        <h3 className="text-sm font-medium">Receta exacta del run ddp10</h3>
        <div className="mono mt-3 grid gap-x-6 gap-y-1 text-xs text-muted sm:grid-cols-2 lg:grid-cols-3">
          <span>batch 128 por GPU (256 efectivo)</span>
          <span>resolución 112 px</span>
          <span>precisión bf16 autocast</span>
          <span>AdamW, wd 1e-4</span>
          <span>lr backbone 1e-5 · cabezas 1e-3</span>
          <span>warmup 100 pasos + coseno</span>
          <span>10 épocas, 360 pasos</span>
          <span>kNN k=20 cada 2 épocas</span>
          <span>seed 42, torchrun nproc 2</span>
        </div>
      </div>
    </div>
  );
}
