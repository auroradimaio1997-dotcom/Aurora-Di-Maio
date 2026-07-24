import type { Metadata } from "next";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import WritingHand3D from "@/components/icons3d/WritingHand3D";
import BooksAndLaptop3D from "@/components/icons3d/BooksAndLaptop3D";
import { NAV } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Assistente Notarile | Aurora Di Maio",
};

const GROUP_ICON: Record<string, React.ComponentType<{ size?: number }>> = {
  "Redazione Atti": WritingHand3D,
  "Fai una ricerca scientifica approfondita": BooksAndLaptop3D,
};

/**
 * Mirrors the sidebar (lib/nav.ts) exactly — this page has no content of
 * its own, it's generated from the same NAV data so the two never drift
 * apart again. Groups with an animated 3D icon (Redazione Atti, Fai una
 * ricerca scientifica approfondita) get a richer card grid; the rest
 * render as simple links.
 */
export default function AssistenteNotarilePage() {
  const section = NAV.find((s) => s.href === "/assistente-notarile")!;

  return (
    <AppShell>
      <h1 className="font-serif text-3xl font-semibold text-foreground md:text-4xl">
        Assistente Notarile
      </h1>
      <p className="mt-3 max-w-xl text-secondary">
        Redazione atti e ricerca giuridica per il lavoro quotidiano in studio.
      </p>

      <div className="mt-10 space-y-10">
        {section.groups.map((group) => {
          const Icon = GROUP_ICON[group.label];

          if (group.children.length === 0) {
            return (
              <Link
                key={group.href}
                href={group.href}
                className="group flex items-center gap-4 rounded-xl border bg-background p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/5"
              >
                <span className="font-serif text-lg font-semibold text-foreground">
                  {group.label}
                </span>
              </Link>
            );
          }

          return (
            <div key={group.href}>
              <h2 className="mb-4 font-serif text-xl font-semibold text-foreground">
                {group.label}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="group flex flex-col items-center gap-3 rounded-xl border bg-background p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-xl hover:shadow-gold/10"
                  >
                    {Icon && (
                      <div className="transition-transform duration-300 group-hover:scale-110">
                        <Icon size={72} />
                      </div>
                    )}
                    <span className="font-serif text-base font-semibold text-foreground">
                      {child.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
