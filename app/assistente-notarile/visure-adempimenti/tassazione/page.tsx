import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";
import PagePlaceholder from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = {
  title: "Tassazione | Aurora Di Maio",
};

export default function TassazionePage() {
  return (
    <AppShell>
      <PagePlaceholder
        title="Tassazione"
        breadcrumbs={[
          { label: "Assistente Notarile", href: "/assistente-notarile" },
          { label: "Tassazione" },
        ]}
        description="Agente in preparazione."
      />
    </AppShell>
  );
}
