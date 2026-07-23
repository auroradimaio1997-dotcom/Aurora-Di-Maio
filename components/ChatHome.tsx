"use client";

import Link from "next/link";

type QuickAction = {
  emoji: string;
  label: string;
  href?: string;
};

const QUICK_ACTIONS: QuickAction[] = [
  { emoji: "⚖️", label: "Redigi un atto", href: "/assistente-notarile/redazione-atti" },
  { emoji: "📖", label: "Ricerca notarile", href: "/assistente-notarile/ricerca-notarile" },
  { emoji: "📚", label: "Ricerca giuridica", href: "/assistente-notarile/ricerca-giuridica" },
  { emoji: "🎓", label: "Dottorato", href: "/accademia/dottorato" },
  { emoji: "✍️", label: "Scrivi un saggio", href: "/accademia/lavori-in-corso/saggi-da-pubblicare" },
  { emoji: "📄", label: "Analizza un documento" },
  { emoji: "💬", label: "Nuova conversazione" },
];

/**
 * The chat landing view shown once the visitor clicks "Entra
 * nell'assistente". Layout + routing only for now, per brief — quick
 * actions with a matching sidebar destination are real links; the other
 * two (no destination defined yet) are present but inert.
 */
export default function ChatHome() {
  return (
    <div>
      <h2 className="font-serif text-3xl font-semibold text-foreground md:text-4xl">
        Buongiorno Aurora 👋
      </h2>
      <p className="mt-2 text-lg text-secondary">
        Cosa dobbiamo fare in questo momento?
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {QUICK_ACTIONS.map((action) =>
          action.href ? (
            <Link
              key={action.label}
              href={action.href}
              className="group flex items-center gap-4 rounded-xl border bg-background p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/5"
            >
              <span className="text-2xl" aria-hidden="true">
                {action.emoji}
              </span>
              <span className="font-serif text-base font-semibold text-foreground group-hover:text-gold">
                {action.label}
              </span>
            </Link>
          ) : (
            <button
              key={action.label}
              type="button"
              className="flex items-center gap-4 rounded-xl border bg-background p-5 text-left opacity-60"
            >
              <span className="text-2xl" aria-hidden="true">
                {action.emoji}
              </span>
              <span className="font-serif text-base font-semibold text-foreground">
                {action.label}
              </span>
            </button>
          )
        )}
      </div>
    </div>
  );
}
