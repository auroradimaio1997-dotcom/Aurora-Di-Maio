import type { Metadata } from "next";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import BooksAndLaptop3D from "@/components/icons3d/BooksAndLaptop3D";
import { NAV } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Ricerca scientifica approfondita | Aurora Di Maio",
};

/**
 * Same animated card treatment as the parent Assistente Notarile hub —
 * pulled from the same NAV data so the two never show different
 * children again.
 */
export default function RicercaScientificaPage() {
  const group = NAV.find((s) => s.href === "/assistente-notarile")!.groups.find(
    (g) => g.href === "/assistente-notarile/ricerca-scientifica"
  )!;

  return (
    <AppShell>
      <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1 text-xs text-secondary">
        <Link href="/assistente-notarile" className="hover:text-foreground">
          Assistente Notarile
        </Link>
        <span>/</span>
        <span>Fai una ricerca scientifica approfondita</span>
      </nav>

      <h1 className="font-serif text-3xl font-semibold text-foreground md:text-4xl">
        Fai una ricerca scientifica approfondita
      </h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {group.children.map((child) => (
          <Link
            key={child.href}
            href={child.href}
            className="group flex flex-col items-center gap-3 rounded-xl border bg-background p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-xl hover:shadow-gold/10"
          >
            <div className="transition-transform duration-300 group-hover:scale-110">
              <BooksAndLaptop3D size={72} />
            </div>
            <span className="font-serif text-base font-semibold text-foreground">
              {child.label}
            </span>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
