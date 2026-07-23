import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";
import PagePlaceholder from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = {
  title: "Redazione Atti | Aurora Di Maio",
};

export default function RedazioneAttiPage() {
  return (
    <AppShell>
      <PagePlaceholder
        title="Redazione Atti"
        breadcrumbs={[
          { label: "Assistente Notarile", href: "/assistente-notarile" },
          { label: "Redazione Atti" },
        ]}
      >
        {[
          { label: "Inter vivos", href: "/assistente-notarile/redazione-atti/inter-vivos" },
          { label: "Mortis causa", href: "/assistente-notarile/redazione-atti/mortis-causa" },
          { label: "Societario", href: "/assistente-notarile/redazione-atti/societario" },
        ]}
      </PagePlaceholder>
    </AppShell>
  );
}
