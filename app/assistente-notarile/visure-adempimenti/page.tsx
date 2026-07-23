import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";
import PagePlaceholder from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = {
  title: "Visure e Adempimenti | Aurora Di Maio",
};

export default function VisureAdempimentiPage() {
  return (
    <AppShell>
      <PagePlaceholder
        title="Visure e Adempimenti"
        breadcrumbs={[
          { label: "Assistente Notarile", href: "/assistente-notarile" },
          { label: "Visure e Adempimenti" },
        ]}
      >
        {[
          { label: "Visure camerali", href: "/assistente-notarile/visure-adempimenti/visure-camerali" },
          { label: "Visure ipocatastali", href: "/assistente-notarile/visure-adempimenti/visure-ipocatastali" },
          { label: "Adempimenti", href: "/assistente-notarile/visure-adempimenti/adempimenti" },
          { label: "Tassazione", href: "/assistente-notarile/visure-adempimenti/tassazione" },
        ]}
      </PagePlaceholder>
    </AppShell>
  );
}
