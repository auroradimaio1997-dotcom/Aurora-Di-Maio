import { Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_theme(colors.accent/12%),_transparent_60%)]"
      />

      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-20 md:py-28">
        <div className="animate-fade-up inline-flex w-fit items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium text-secondary">
          <Sparkles size={14} aria-hidden="true" />
          Spazio di lavoro personale
        </div>

        <h1 className="animate-fade-up max-w-3xl font-serif text-4xl font-semibold leading-tight tracking-tight text-primary [animation-delay:100ms] md:text-6xl">
          Il mio spazio per studiare, lavorare e fare ricerca.
        </h1>

        <p className="animate-fade-up max-w-2xl text-lg leading-relaxed text-secondary [animation-delay:200ms]">
          Sono Aurora Di Maio. Qui organizzo dottorato, lavoro come
          assistente notarile e ricerca accademica, in tre aree pensate per
          ospitare gli agent che sto costruendo per ciascun ambito.
        </p>
      </div>
    </section>
  );
}
