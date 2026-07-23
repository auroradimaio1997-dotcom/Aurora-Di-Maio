import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";
import PagePlaceholder from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = {
  title: "Societario | Aurora Di Maio",
};

export default function SocietarioPage() {
  return (
    <AppShell>
      <PagePlaceholder
        title="Societario"
        breadcrumbs={[
          { label: "Assistente Notarile", href: "/assistente-notarile" },
          { label: "Redazione Atti", href: "/assistente-notarile/redazione-atti" },
          { label: "Societario" },
        ]}
      />
    </AppShell>
  );
}
