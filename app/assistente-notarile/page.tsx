import type { Metadata } from "next";
import { FileText, ClipboardCheck, Landmark } from "lucide-react";
import ResourceCard from "@/components/ResourceCard";
import AgentSlot from "@/components/AgentSlot";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Assistente Notarile | Aurora Di Maio",
};

const resources = [
  {
    icon: FileText,
    title: "Modulistica",
    description: "Modelli e bozze di atti e documenti usati in studio.",
  },
  {
    icon: ClipboardCheck,
    title: "Procedure pratiche",
    description: "Passaggi e checklist per la gestione delle pratiche.",
  },
  {
    icon: Landmark,
    title: "Normativa di riferimento",
    description: "Riferimenti normativi e aggiornamenti utili al lavoro.",
  },
];

export default function AssistenteNotarilePage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <Reveal className="max-w-2xl">
        <h1 className="font-serif text-4xl font-semibold text-primary">
          Assistente Notarile
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-secondary">
          Modulistica, procedure pratiche e normativa di riferimento per il
          lavoro quotidiano in studio.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {resources.map((resource, index) => (
          <Reveal key={resource.title} delay={index * 100}>
            <ResourceCard {...resource} />
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-14">
        <AgentSlot
          title="Agent Assistente Notarile, in arrivo"
          description="Uno spazio riservato all'agent dedicato al lavoro in studio: supporto sulla modulistica, verifica pratiche e ricerca normativa."
        />
      </Reveal>
    </section>
  );
}
