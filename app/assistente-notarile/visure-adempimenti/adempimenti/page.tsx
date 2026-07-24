import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";
import PagePlaceholder from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = {
  title: "Adempimenti | Aurora Di Maio",
};

export default function AdempimentiPage() {
  return (
    <AppShell>
      <PagePlaceholder
        title="Adempimenti"
        breadcrumbs={[
          { label: "Assistente Notarile", href: "/assistente-notarile" },
          { label: "Adempimenti" },
        ]}
        description="Agente in preparazione."
      />
    </AppShell>
  );
}
