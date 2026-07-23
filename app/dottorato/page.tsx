import type { Metadata } from "next";
import { Library, FileStack, NotebookPen } from "lucide-react";
import ResourceCard from "@/components/ResourceCard";
import AgentSlot from "@/components/AgentSlot";
import AreaStoryPlayer from "@/components/remotion/AreaStoryPlayer";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Dottorato | Aurora Di Maio",
};

const resources = [
  {
    icon: Library,
    iconName: "Library" as const,
    title: "Bibliografia",
    description: "Fonti, articoli e testi raccolti per la ricerca di dottorato.",
  },
  {
    icon: FileStack,
    iconName: "FileStack" as const,
    title: "Capitoli di tesi",
    description: "Stato di avanzamento e bozze dei capitoli in lavorazione.",
  },
  {
    icon: NotebookPen,
    iconName: "NotebookPen" as const,
    title: "Appunti seminari",
    description: "Note da seminari, convegni e incontri di dottorato.",
  },
];

export default function DottoratoPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <Reveal className="flex flex-col items-center gap-10 text-center md:flex-row md:text-left">
        <div className="max-w-2xl">
          <h1 className="font-serif text-4xl font-semibold text-foreground">
            Dottorato
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-secondary">
            Bibliografia, capitoli di tesi, appunti di seminari e ricerca in
            corso per il percorso di dottorato.
          </p>
        </div>
        <AreaStoryPlayer
          theme="dottorato"
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
          title="Agent Dottorato, in arrivo"
          description="Uno spazio riservato all'agent dedicato alla ricerca di dottorato: ricerca bibliografica, revisione capitoli e organizzazione degli appunti."
        />
      </Reveal>
    </section>
  );
}
