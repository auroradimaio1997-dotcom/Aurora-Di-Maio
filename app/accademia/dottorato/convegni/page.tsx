import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";
import PagePlaceholder from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = {
  title: "Convegni | Aurora Di Maio",
};

export default function ConvegniPage() {
  return (
    <AppShell>
      <PagePlaceholder
        title="Convegni"
        breadcrumbs={[
          { label: "Accademia", href: "/accademia" },
          { label: "Dottorato", href: "/accademia/dottorato" },
          { label: "Convegni" },
        ]}
      />
    </AppShell>
  );
}
