import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";
import PagePlaceholder from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = {
  title: "Lezioni | Aurora Di Maio",
};

export default function LezioniPage() {
  return (
    <AppShell>
      <PagePlaceholder
        title="Lezioni"
        breadcrumbs={[
          { label: "Accademia", href: "/accademia" },
          { label: "Dottorato", href: "/accademia/dottorato" },
          { label: "Lezioni" },
        ]}
      />
    </AppShell>
  );
}
