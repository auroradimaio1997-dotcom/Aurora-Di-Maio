import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";
import PagePlaceholder from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = {
  title: "Assistente Notarile | Aurora Di Maio",
};

export default function AssistenteNotarilePage() {
  return (
    <AppShell>
      <PagePlaceholder
        title="Assistente Notarile"
        description="Redazione atti e ricerca giuridica per il lavoro quotidiano in studio."
      >
        {[
          { label: "Redazione Atti", href: "/assistente-notarile/redazione-atti" },
          {
            label: "Fai una ricerca scientifica approfondita",
            href: "/assistente-notarile/ricerca-scientifica",
          },
          { label: "Tassazione", href: "/assistente-notarile/visure-adempimenti/tassazione" },
          { label: "Adempimenti", href: "/assistente-notarile/visure-adempimenti/adempimenti" },
          { label: "Visure", href: "/assistente-notarile/visure-adempimenti" },
        ]}
      </PagePlaceholder>
    </AppShell>
  );
}
