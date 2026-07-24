import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";
import PagePlaceholder from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = {
  title: "Ricerca scientifica approfondita | Aurora Di Maio",
};

export default function RicercaScientificaPage() {
  return (
    <AppShell>
      <PagePlaceholder
        title="Fai una ricerca scientifica approfondita"
        breadcrumbs={[
          { label: "Assistente Notarile", href: "/assistente-notarile" },
          { label: "Fai una ricerca scientifica approfondita" },
        ]}
      >
        {[
          { label: "Ricerca dottrinale", href: "/assistente-notarile/ricerca-scientifica/dottrinale" },
          { label: "Ricerca giurisprudenziale", href: "/assistente-notarile/ricerca-scientifica/giurisprudenziale" },
          {
            label: "Ricerca banche dati notarili",
            href: "/assistente-notarile/ricerca-scientifica/banche-dati-notarili",
          },
        ]}
      </PagePlaceholder>
    </AppShell>
  );
}
