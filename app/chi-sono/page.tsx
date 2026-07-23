import type { Metadata } from "next";
import { GraduationCap, Scale, BookOpen } from "lucide-react";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Chi Sono | Aurora Di Maio",
};

const milestones = [
  {
    icon: GraduationCap,
    title: "Dottorato di ricerca",
    description:
      "Percorso di dottorato con focus su diritto e prassi notarile, tra approfondimento dottrinale e casi applicativi.",
  },
  {
    icon: Scale,
    title: "Assistente notarile",
    description:
      "Attività di supporto a uno studio notarile: predisposizione atti, gestione pratiche e rapporto con clienti ed enti.",
  },
  {
    icon: BookOpen,
    title: "Ricerca e pubblicazioni",
    description:
      "Studio e approfondimento continuo delle evoluzioni normative, a beneficio della qualità del servizio offerto.",
  },
];

export default function ChiSonoPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <Reveal className="max-w-2xl">
        <h1 className="font-serif text-4xl font-semibold text-primary">
          Chi sono
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-secondary">
          Sono Aurora Di Maio, dottoranda e assistente notarile. Il mio
          percorso unisce la pratica quotidiana in studio alla ricerca
          accademica, con l&apos;obiettivo di offrire un supporto preciso,
          aggiornato e attento alle persone.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-8 md:grid-cols-3">
        {milestones.map((item, index) => (
          <Reveal key={item.title} delay={index * 100}>
            <div className="group rounded-xl border p-6 transition-all duration-200 hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg hover:shadow-primary/5">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent transition-transform duration-200 group-hover:scale-110">
                <item.icon size={22} aria-hidden="true" />
              </span>
              <h2 className="mt-4 font-serif text-lg font-semibold text-primary">
                {item.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-secondary">
                {item.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
