import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";
import PagePlaceholder from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = {
  title: "Dottorato | Aurora Di Maio",
};

export default function DottoratoPage() {
  return (
    <AppShell>
      <PagePlaceholder
        title="Dottorato"
        breadcrumbs={[{ label: "Accademia", href: "/accademia" }, { label: "Dottorato" }]}
      >
        {[
          { label: "Lezioni", href: "/accademia/dottorato/lezioni" },
          { label: "Tesi di dottorato", href: "/accademia/dottorato/tesi" },
          { label: "Progetti", href: "/accademia/dottorato/progetti" },
          { label: "Convegni", href: "/accademia/dottorato/convegni" },
        ]}
      </PagePlaceholder>
    </AppShell>
  );
}
