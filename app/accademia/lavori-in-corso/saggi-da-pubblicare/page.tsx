import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";
import PagePlaceholder from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = {
  title: "Saggi da pubblicare | Aurora Di Maio",
};

export default function SaggiDaPubblicarePage() {
  return (
    <AppShell>
      <PagePlaceholder
        title="Saggi da pubblicare"
        breadcrumbs={[
          { label: "Accademia", href: "/accademia" },
          { label: "Lavori in corso", href: "/accademia/lavori-in-corso" },
          { label: "Saggi da pubblicare" },
        ]}
      />
    </AppShell>
  );
}
