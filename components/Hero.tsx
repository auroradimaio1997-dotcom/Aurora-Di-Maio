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
        <div className="inline-flex w-fit items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium text-secondary">
          <Scale size={14} aria-hidden="true" />
          Assistenza notarile &amp; ricerca giuridica
        </div>

        <h1 className="max-w-3xl font-serif text-4xl font-semibold leading-tight tracking-tight text-primary md:text-6xl">
          Rigore giuridico, chiarezza e cura per ogni pratica.
        </h1>

        <p className="max-w-2xl text-lg leading-relaxed text-secondary">
          Sono Aurora Di Maio, dottoranda e assistente notarile. Affianco
          privati, imprese e professionisti nella gestione di atti e pratiche
          notarili, con un approccio preciso e aggiornato, radicato nella
          ricerca accademica.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/contatti"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-semibold text-on-primary transition-colors duration-200 hover:bg-accent/90"
          >
            Richiedi una consulenza
            <ArrowRight size={16} aria-hidden="true" />
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
