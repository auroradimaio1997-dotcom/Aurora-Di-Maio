import type { Metadata } from "next";
import { FileText, ClipboardCheck, Landmark } from "lucide-react";
import ResourceCard from "@/components/ResourceCard";
import AgentSlot from "@/components/AgentSlot";
import AreaStoryPlayer from "@/components/remotion/AreaStoryPlayer";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Assistente Notarile | Aurora Di Maio",
};

const resources = [
  {
    icon: FileText,
    iconName: "FileText" as const,
    title: "Modulistica",
    description: "Modelli e bozze di atti e documenti usati in studio.",
  },
  {
    icon: ClipboardCheck,
    iconName: "ClipboardCheck" as const,
    title: "Procedure pratiche",
    description: "Passaggi e checklist per la gestione delle pratiche.",
  },
  {
    icon: Landmark,
    iconName: "Landmark" as const,
    title: "Normativa di riferimento",
    description: "Riferimenti normativi e aggiornamenti utili al lavoro.",
  },
];

export default function AssistenteNotarilePage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <Reveal className="flex flex-col items-center gap-10 text-center md:flex-row md:text-left">
        <div className="max-w-2xl">
          <h1 className="font-serif text-4xl font-semibold text-foreground">
            Assistente Notarile
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-secondary">
            Modulistica, procedure pratiche e normativa di riferimento per il
            lavoro quotidiano in studio.
          </p>
        </div>
        <AreaStoryPlayer
          theme="notarile"
          scenes={resources.map((r) => ({
            iconName: r.iconName,
            label: r.title,
            sub: r.description,
          }))}
        />
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
