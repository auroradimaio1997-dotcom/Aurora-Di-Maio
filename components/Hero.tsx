import Link from "next/link";
import { ArrowRight, GraduationCap, Scale } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_theme(colors.accent/12%),_transparent_60%)]"
      />

      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-20 md:py-28">
        <div className="animate-fade-up inline-flex w-fit items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium text-secondary">
          <Scale size={14} aria-hidden="true" />
          Assistenza notarile &amp; ricerca giuridica
        </div>

        <h1 className="animate-fade-up max-w-3xl font-serif text-4xl font-semibold leading-tight tracking-tight text-primary [animation-delay:100ms] md:text-6xl">
          Rigore giuridico, chiarezza e cura per ogni pratica.
        </h1>

        <p className="animate-fade-up max-w-2xl text-lg leading-relaxed text-secondary [animation-delay:200ms]">
          Sono Aurora Di Maio, dottoranda e assistente notarile. Affianco
          privati, imprese e professionisti nella gestione di atti e pratiche
          notarili, con un approccio preciso e aggiornato, radicato nella
          ricerca accademica.
        </p>

        <div className="animate-fade-up flex flex-wrap items-center gap-4 [animation-delay:300ms]">
          <Link
            href="/contatti"
            className="group inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-semibold text-on-primary transition-all duration-200 hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/20"
          >
            Richiedi una consulenza
            <ArrowRight
              size={16}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
          <Link
            href="/chi-sono"
            className="inline-flex items-center gap-2 rounded-md border px-6 py-3 text-sm font-semibold text-primary transition-colors duration-200 hover:bg-muted"
          >
            <GraduationCap size={16} aria-hidden="true" />
            Percorso accademico
          </Link>
        </div>
      </div>
    </section>
  );
}
