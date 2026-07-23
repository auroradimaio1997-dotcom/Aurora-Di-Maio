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
          { label: "Ricerca giuridica — Banche dati notarili", href: "/assistente-notarile/ricerca-notarile" },
          { label: "Ricerca giuridica — Dottrina e Giurisprudenza", href: "/assistente-notarile/ricerca-giuridica" },
          { label: "Visure e Adempimenti", href: "/assistente-notarile/visure-adempimenti" },
        ]}
      </PagePlaceholder>
    </AppShell>
  );
}
