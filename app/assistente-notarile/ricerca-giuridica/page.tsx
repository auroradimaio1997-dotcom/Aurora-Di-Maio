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
        title="Dottrina e Giurisprudenza"
        breadcrumbs={[
          { label: "Assistente Notarile", href: "/assistente-notarile" },
          { label: "Dottrina e Giurisprudenza" },
        ]}
        description="Agente in preparazione."
      />
    </AppShell>
  );
}
