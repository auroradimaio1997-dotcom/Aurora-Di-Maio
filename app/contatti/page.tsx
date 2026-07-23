import type { Metadata } from "next";
import { Mail, MapPin, Clock } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contatti | Aurora Di Maio",
};

export default function ContattiPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="max-w-2xl">
        <h1 className="font-serif text-4xl font-semibold text-primary">
          Contatti
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-secondary">
          Raccontami la tua pratica: ti risponderò con i prossimi passi.
        </p>
      </div>

      <div className="mt-14 grid gap-12 md:grid-cols-2">
        <ContactForm />

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Mail size={20} aria-hidden="true" />
            </span>
            <div>
              <p className="font-medium text-primary">Email</p>
              <a
                href="mailto:aurora.dimaio@unisalento.it"
                className="text-sm text-secondary hover:text-accent"
              >
                aurora.dimaio@unisalento.it
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <MapPin size={20} aria-hidden="true" />
            </span>
            <div>
              <p className="font-medium text-primary">Dove</p>
              <p className="text-sm text-secondary">Lecce, Italia</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Clock size={20} aria-hidden="true" />
            </span>
            <div>
              <p className="font-medium text-primary">Tempi di risposta</p>
              <p className="text-sm text-secondary">
                Solitamente entro 1-2 giorni lavorativi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
