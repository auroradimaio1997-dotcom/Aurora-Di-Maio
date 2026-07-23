import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";
import PagePlaceholder from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = {
  title: "Inter vivos | Aurora Di Maio",
};

export default function InterVivosPage() {
  return (
    <AppShell>
      <PagePlaceholder
        title="Inter vivos"
        breadcrumbs={[
          { label: "Assistente Notarile", href: "/assistente-notarile" },
          { label: "Redazione Atti", href: "/assistente-notarile/redazione-atti" },
          { label: "Inter vivos" },
        ]}
      />
    </AppShell>
  );
}
