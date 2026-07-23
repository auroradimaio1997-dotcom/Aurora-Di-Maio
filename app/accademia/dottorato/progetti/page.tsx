import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";
import PagePlaceholder from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = {
  title: "Progetti | Aurora Di Maio",
};

export default function ProgettiPage() {
  return (
    <AppShell>
      <PagePlaceholder
        title="Progetti"
        breadcrumbs={[
          { label: "Accademia", href: "/accademia" },
          { label: "Dottorato", href: "/accademia/dottorato" },
          { label: "Progetti" },
        ]}
      />
    </AppShell>
  );
}
