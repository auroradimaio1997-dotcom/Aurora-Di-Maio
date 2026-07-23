import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";
import PagePlaceholder from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = {
  title: "Tesi di dottorato | Aurora Di Maio",
};

export default function TesiPage() {
  return (
    <AppShell>
      <PagePlaceholder
        title="Tesi di dottorato"
        breadcrumbs={[
          { label: "Accademia", href: "/accademia" },
          { label: "Dottorato", href: "/accademia/dottorato" },
          { label: "Tesi di dottorato" },
        ]}
      />
    </AppShell>
  );
}
