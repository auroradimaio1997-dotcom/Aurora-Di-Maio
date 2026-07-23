import type { Metadata } from "next";
import { GraduationCap, PenLine, BookMarked } from "lucide-react";
import ResourceCard from "@/components/ResourceCard";
import AgentSlot from "@/components/AgentSlot";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Accademia | Aurora Di Maio",
};

const resources = [
  {
    icon: GraduationCap,
    title: "Tesi",
    description: "Materiali, bozze e stato di avanzamento della tesi.",
  },
  {
    icon: PenLine,
    title: "Saggi",
    description: "Saggi in scrittura o pubblicati, con note e revisioni.",
  },
  {
    icon: BookMarked,
    title: "Monografie",
    description: "Monografie di riferimento e progetti editoriali.",
  },
];

export default function AccademiaPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <Reveal className="max-w-2xl">
        <h1 className="font-serif text-4xl font-semibold text-primary">
          Accademia
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-secondary">
          Tesi, saggi e monografie: materiali e progressi della scrittura
          accademica.
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
          title="Agent Accademia, in arrivo"
          description="Uno spazio riservato all'agent dedicato alla scrittura accademica: supporto su tesi, saggi e monografie."
        />
      </Reveal>
    </section>
  );
}
