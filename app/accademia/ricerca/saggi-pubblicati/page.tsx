import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";
import PagePlaceholder from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = {
  title: "Saggi pubblicati | Aurora Di Maio",
};

export default function SaggiPubblicatiPage() {
  return (
    <AppShell>
      <PagePlaceholder
        title="Saggi pubblicati"
        breadcrumbs={[
          { label: "Accademia", href: "/accademia" },
          { label: "Ricerca", href: "/accademia/ricerca" },
          { label: "Saggi pubblicati" },
        ]}
      />
    </AppShell>
  );
}
