import { GraduationCap, Scale, BookOpen } from "lucide-react";
import Hero from "@/components/Hero";
import AreaCard from "@/components/AreaCard";
import Reveal from "@/components/Reveal";

const areas = [
  {
    href: "/dottorato",
    icon: GraduationCap,
    title: "Dottorato",
    description:
      "Percorso di dottorato: bibliografia, capitoli di tesi, appunti di seminari e ricerca in corso.",
  },
  {
    href: "/assistente-notarile",
    icon: Scale,
    title: "Assistente Notarile",
    description:
      "Lavoro in studio: modulistica, procedure pratiche e normativa di riferimento.",
  },
  {
    href: "/accademia",
    icon: BookOpen,
    title: "Accademia",
    description: "Tesi, saggi e monografie: materiali e progressi di scrittura.",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <Reveal className="max-w-2xl">
          <h2 className="font-serif text-3xl font-semibold text-foreground">
            Le mie aree
          </h2>
          <p className="mt-3 text-secondary">
            Ogni area avrà il proprio agent dedicato, pensato per quel tipo
            di lavoro.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {areas.map((area, index) => (
            <Reveal key={area.href} delay={index * 100}>
              <AreaCard {...area} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
