import Link from "next/link";
import { FileText, Landmark, Search, ArrowRight } from "lucide-react";
import Hero from "@/components/Hero";
import ServiceCard from "@/components/ServiceCard";
import AssistantSlot from "@/components/AssistantSlot";

const services = [
  {
    icon: FileText,
    title: "Predisposizione atti",
    description:
      "Supporto nella preparazione e verifica della documentazione per atti notarili, con attenzione a precisione e conformità normativa.",
  },
  {
    icon: Landmark,
    title: "Pratiche immobiliari e societarie",
    description:
      "Assistenza in compravendite, costituzioni societarie e adempimenti connessi, in coordinamento con il notaio titolare.",
  },
  {
    icon: Search,
    title: "Ricerca giuridica",
    description:
      "Approfondimenti normativi e dottrinali a supporto delle pratiche, con un metodo maturato nel percorso di dottorato.",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="max-w-2xl">
          <h2 className="font-serif text-3xl font-semibold text-primary">
            Come posso aiutarti
          </h2>
          <p className="mt-3 text-secondary">
            Un supporto puntuale per privati, imprese e colleghi, dalla
            singola pratica alla ricerca approfondita.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/servizi"
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
          >
            Tutti i servizi
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <AssistantSlot />

      <section className="mx-auto max-w-6xl px-6 py-16 text-center md:py-24">
        <h2 className="font-serif text-3xl font-semibold text-primary">
          Parliamo della tua pratica
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-secondary">
          Scrivimi per una prima valutazione: ti risponderò con i prossimi
          passi e la documentazione necessaria.
        </p>
        <Link
          href="/contatti"
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-semibold text-on-primary transition-colors duration-200 hover:bg-accent/90"
        >
          Contattami
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>
    </>
  );
}
