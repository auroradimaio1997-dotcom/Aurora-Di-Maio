import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";
import PagePlaceholder from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = {
  title: "Accademia | Aurora Di Maio",
};

export default function AccademiaPage() {
  return (
    <AppShell>
      <PagePlaceholder
        title="Accademia"
        description="Dottorato, ricerca, lavori in corso e monografia."
      >
        {[
          { label: "Dottorato", href: "/accademia/dottorato" },
          { label: "Ricerca", href: "/accademia/ricerca" },
          { label: "Lavori in corso", href: "/accademia/lavori-in-corso" },
          { label: "Monografia", href: "/accademia/monografia" },
        ]}
      </PagePlaceholder>
    </AppShell>
  );
}
