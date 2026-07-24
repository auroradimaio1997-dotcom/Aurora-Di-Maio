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
        title="Visure"
        breadcrumbs={[
          { label: "Assistente Notarile", href: "/assistente-notarile" },
          { label: "Visure" },
        ]}
      >
        {[
          { label: "Visure camerali", href: "/assistente-notarile/visure-adempimenti/visure-camerali" },
          { label: "Visure ipocatastali", href: "/assistente-notarile/visure-adempimenti/visure-ipocatastali" },
        ]}
      </PagePlaceholder>
    </AppShell>
  );
}
