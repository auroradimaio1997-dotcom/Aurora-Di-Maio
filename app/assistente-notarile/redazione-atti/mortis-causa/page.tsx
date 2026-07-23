import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";
import PagePlaceholder from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = {
  title: "Mortis causa | Aurora Di Maio",
};

export default function MortisCausaPage() {
  return (
    <AppShell>
      <PagePlaceholder
        title="Mortis causa"
        breadcrumbs={[
          { label: "Assistente Notarile", href: "/assistente-notarile" },
          { label: "Redazione Atti", href: "/assistente-notarile/redazione-atti" },
          { label: "Mortis causa" },
        ]}
      />
    </AppShell>
  );
}
