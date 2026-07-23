import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  Landmark,
  Search,
  Users,
  ClipboardCheck,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Servizi | Aurora Di Maio",
};

const services = [
  {
    icon: FileText,
    title: "Predisposizione e verifica atti",
    description:
      "Raccolta della documentazione, controllo di conformità e preparazione delle bozze in vista della stipula.",
  },
  {
    icon: Landmark,
    title: "Pratiche immobiliari",
    description:
      "Supporto in compravendite, mutui e successioni, con verifica della documentazione catastale e ipotecaria.",
  },
  {
    icon: Users,
    title: "Pratiche societarie",
    description:
      "Costituzioni, modifiche statutarie e adempimenti camerali, in coordinamento con il notaio titolare.",
  },
  {
    icon: Search,
    title: "Ricerca e consulenza giuridica",
    description:
      "Approfondimenti normativi e dottrinali su questioni specifiche, a supporto di professionisti e studi.",
  },
  {
    icon: ClipboardCheck,
    title: "Gestione pratica end-to-end",
    description:
      "Accompagnamento dalla raccolta documenti fino alla stipula, con aggiornamenti chiari in ogni fase.",
  },
];

export default function ServiziPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="max-w-2xl">
        <h1 className="font-serif text-4xl font-semibold text-primary">
          Servizi
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-secondary">
          Un supporto puntuale e su misura per ogni fase della pratica
          notarile.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {services.map((service) => (
          <div
            key={service.title}
            className="rounded-xl border bg-background p-6"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <service.icon size={22} aria-hidden="true" />
            </span>
            <h2 className="mt-4 font-serif text-lg font-semibold text-primary">
              {service.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-secondary">
              {service.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-14 rounded-xl bg-primary px-8 py-10 text-center">
        <h2 className="font-serif text-2xl font-semibold text-on-primary">
          Non trovi quello che cerchi?
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-on-primary/70">
          Scrivimi comunque: valutiamo insieme la soluzione più adatta alla
          tua pratica.
        </p>
        <Link
          href="/contatti"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-on-primary px-6 py-3 text-sm font-semibold text-primary transition-colors duration-200 hover:bg-on-primary/90"
        >
          Contattami
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
