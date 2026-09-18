"use client";

import { GitBranch } from "lucide-react";
import { REPO_URL } from "@/lib/content";

const LINKS = [
  ["cluster", "Clúster"],
  ["modelo", "Modelo"],
  ["cronologia", "Cronología"],
  ["resultados", "Resultados"],
  ["artefactos", "Pesos"],
  ["siguiente", "Siguiente"],
] as const;

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-md">
      <nav className="mx-auto flex h-12 max-w-6xl items-center justify-between px-5">
        <a href="#top" className="text-sm font-medium tracking-tight">
          UNABIA <span className="text-muted">/ prueba GPU</span>
        </a>
        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map(([id, label]) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className="pressable rounded-md px-2.5 py-1 text-xs text-muted transition-colors hover:bg-surface-2 hover:text-fg"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href={REPO_URL}
          target="_blank"
          rel="noreferrer"
          className="pressable flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-muted hover:border-border-strong hover:text-fg"
        >
          <GitBranch size={14} /> Repo
        </a>
      </nav>
    </header>
  );
}
