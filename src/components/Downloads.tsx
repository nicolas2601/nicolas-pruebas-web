"use client";

import { Download, FileJson, GitBranch, Package } from "lucide-react";
import facts from "@/data/cluster_facts.json";
import { EXPORT_URL, RELEASE_URL, REPO_URL, WEIGHTS_URL } from "@/lib/content";
import { Stagger, StaggerItem } from "./Reveal";

const ITEMS = [
  {
    icon: Package,
    title: "Pesos del backbone",
    desc: `DINOv2 ViT-S/14 tras 11 épocas de SimSiam. state_dict, ${(facts.backbone_params / 1e6).toFixed(2)}M parámetros, 88 MB.`,
    href: WEIGHTS_URL,
    cta: "Descargar .pt",
  },
  {
    icon: FileJson,
    title: "Escalares, logs y resumen",
    desc: "Los mismos datos de esta página: TensorBoard exportado a JSON, log.txt, summary.json y hechos del clúster.",
    href: EXPORT_URL,
    cta: "Descargar .tar.gz",
  },
  {
    icon: GitBranch,
    title: "Código",
    desc: "Loop DDP, pérdida, probe kNN, tracking y 17 tests unitarios en CPU. Reproducible con setup_env.sh + run_2gpu.sh.",
    href: REPO_URL,
    cta: "Ver repositorio",
  },
];

const LOAD_SNIPPET = `import torch
backbone = torch.hub.load("facebookresearch/dinov2", "dinov2_vits14", pretrained=False)
backbone.load_state_dict(torch.load("dinov2_vits14_simsiam_imagenette_backbone.pt", map_location="cpu"))
backbone.eval()  # forward(x) -> embedding CLS de 384 dims`;

const TB_SNIPPET = `# en el pod (o con el tar descargado)
tensorboard --logdir runs --port 6006 --bind_all
# URL cuando Alfredo agregue jupyter-server-proxy a la imagen:
# https://jupyter.unabia.unab.edu.co/user/nmoreno534/proxy/6006/`;

export function Downloads() {
  return (
    <div className="space-y-6">
      <Stagger className="grid gap-3 md:grid-cols-3">
        {ITEMS.map((it) => (
          <StaggerItem key={it.title}>
            <a
              href={it.href}
              target="_blank"
              rel="noreferrer"
              className="pressable card-hover flex h-full flex-col rounded-xl border border-border bg-surface p-4"
            >
              <it.icon size={18} className="text-amber" />
              <h3 className="mt-3 text-base font-medium">{it.title}</h3>
              <p className="mt-1 flex-1 text-sm text-muted">{it.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-sky">
                <Download size={14} /> {it.cta}
              </span>
            </a>
          </StaggerItem>
        ))}
      </Stagger>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-4">
          <h3 className="text-sm font-medium">Cargar los pesos</h3>
          <pre className="mono mt-3 overflow-x-auto rounded-lg bg-bg p-3 text-xs leading-relaxed text-muted">{LOAD_SNIPPET}</pre>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <h3 className="text-sm font-medium">TensorBoard</h3>
          <pre className="mono mt-3 overflow-x-auto rounded-lg bg-bg p-3 text-xs leading-relaxed text-muted">{TB_SNIPPET}</pre>
          <p className="mt-2 text-xs text-muted-2">
            Release completo:{" "}
            <a className="text-sky underline-offset-2 hover:underline" href={RELEASE_URL} target="_blank" rel="noreferrer">
              v0.1.0-ddp10
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
