import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";
import PagePlaceholder from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = {
  title: "Ricerca giuridica | Aurora Di Maio",
};

export default function RicercaGiuridicaPage() {
  return (
    <AppShell>
      <PagePlaceholder
        title="Ricerca giuridica"
        breadcrumbs={[
          { label: "Assistente Notarile", href: "/assistente-notarile" },
          { label: "Ricerca giuridica" },
        ]}
      >
        {[
          {
            label: "Dottrina e Giurisprudenza",
            href: "/assistente-notarile/ricerca-giuridica/dottrina-giurisprudenza",
          },
        ]}
      </PagePlaceholder>
    </AppShell>
  );
}
