import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";
import PagePlaceholder from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = {
  title: "Ricerca | Aurora Di Maio",
};

export default function RicercaPage() {
  return (
    <AppShell>
      <PagePlaceholder
        title="Ricerca"
        breadcrumbs={[{ label: "Accademia", href: "/accademia" }, { label: "Ricerca" }]}
      >
        {[{ label: "Saggi pubblicati", href: "/accademia/ricerca/saggi-pubblicati" }]}
      </PagePlaceholder>
    </AppShell>
  );
}
