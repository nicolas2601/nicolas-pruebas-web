import { ClusterSpecs } from "@/components/ClusterSpecs";
import { Downloads } from "@/components/Downloads";
import { Hero } from "@/components/Hero";
import { ModelExplainer } from "@/components/ModelExplainer";
import { Nav } from "@/components/Nav";
import { NextSteps } from "@/components/NextSteps";
import { Results } from "@/components/Results";
import { Section } from "@/components/Section";
import { Timeline } from "@/components/Timeline";

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Section
          id="cluster"
          kicker="01 · El clúster"
          title="Dos RTX PRO 4000 en un pod de Kubernetes con JupyterHub."
          intro="Medido desde adentro del pod el 17 de septiembre. Las GPUs se piden al arrancar el server (CPU, 1 GPU o 2 GPUs); las 2 reducen el cupo de los demás, así que se usan solo para entrenar."
        >
          <ClusterSpecs />
        </Section>
        <Section
          id="modelo"
          kicker="02 · Qué entrenamos"
          title="SimSiam sobre DINOv2: el método propuesto, en versión de bolsillo."
          intro="Mismo objetivo y mismo backbone que la tesis, con un dataset pequeño y resolución baja para que cada iteración del experimento dure minutos."
        >
          <ModelExplainer />
        </Section>
        <Section
          id="cronologia"
          kicker="03 · Cronología"
          title="Qué se rompió, por qué, y qué hicimos."
          intro="Seis fallas en dos horas. Ninguna fue del modelo: todas fueron del entorno, y todas quedaron o resueltas en código o documentadas con la causa raíz."
        >
          <Timeline />
        </Section>
        <Section
          id="resultados"
          kicker="04 · Resultados"
          title="Los números del run ddp10, directo de TensorBoard."
          intro="Escalares exportados del event file. Pasá el mouse por las curvas para ver cada punto."
        >
          <Results />
        </Section>
        <Section
          id="artefactos"
          kicker="05 · Pesos y artefactos"
          title="Todo lo del run es descargable y reproducible."
        >
          <Downloads />
        </Section>
        <Section
          id="siguiente"
          kicker="06 · Qué sigue"
          title="De la prueba al v6 del proyecto de grado."
        >
          <NextSteps />
        </Section>
      </main>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-5 py-8 text-xs text-muted-2">
          <span>Nicolás Moreno · Proyecto de grado UNAB · Clúster UNABIA</span>
          <span className="mono">run ddp10 · seed 42 · 2026-09-17</span>
        </div>
      </footer>
    </>
  );
}
