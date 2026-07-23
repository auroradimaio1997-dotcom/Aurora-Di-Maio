import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";
import PagePlaceholder from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = {
  title: "Dottrina e Giurisprudenza | Aurora Di Maio",
};

export default function DottrinaGiurisprudenzaPage() {
  return (
    <AppShell>
      <PagePlaceholder
        title="Dottrina e Giurisprudenza"
        breadcrumbs={[
          { label: "Assistente Notarile", href: "/assistente-notarile" },
          { label: "Ricerca giuridica", href: "/assistente-notarile/ricerca-giuridica" },
          { label: "Dottrina e Giurisprudenza" },
        ]}
      />
    </AppShell>
  );
}
