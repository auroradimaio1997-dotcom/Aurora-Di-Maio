import type { Metadata } from "next";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import NotarySeal3D from "@/components/icons3d/NotarySeal3D";
import BooksAndLaptop3D from "@/components/icons3d/BooksAndLaptop3D";

export const metadata: Metadata = {
  title: "Aree di Ricerca e Lavoro | AI Aurora Studio",
};

const AREAS = [
  {
    label: "Assistente Notarile",
    href: "/assistente-notarile",
    description: "Redazione atti, ricerca giuridica, dottrina, tassazione e adempimenti.",
    Icon: NotarySeal3D,
  },
  {
    label: "Accademia",
    href: "/accademia",
    description: "Dottorato, ricerca, lavori in corso e monografia.",
    Icon: BooksAndLaptop3D,
  },
];

/**
 * Extensible hub of operational areas — new specialist areas are added
 * here as their own card, never mixed into the general chat.
 */
export default function AreeDiRicercaELavoroPage() {
  return (
    <AppShell>
      <h1 className="font-serif text-3xl font-semibold text-foreground md:text-4xl">
        Aree di Ricerca e Lavoro
      </h1>
      <p className="mt-3 max-w-xl text-secondary">
        Scegli l&apos;area specialistica su cui vuoi lavorare.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {AREAS.map((area) => (
          <Link
            key={area.href}
            href={area.href}
            className="group flex flex-col gap-2 rounded-xl border bg-background p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/5"
          >
            <area.Icon size={64} />
            <span className="font-serif text-lg font-semibold text-foreground">
              {area.label}
            </span>
            <p className="text-sm text-secondary">{area.description}</p>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
