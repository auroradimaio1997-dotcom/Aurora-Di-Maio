import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";
import PagePlaceholder from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = {
  title: "Lavori in corso | Aurora Di Maio",
};

export default function LavoriInCorsoPage() {
  return (
    <AppShell>
      <PagePlaceholder
        title="Lavori in corso"
        breadcrumbs={[{ label: "Accademia", href: "/accademia" }, { label: "Lavori in corso" }]}
      >
        {[{ label: "Saggi da pubblicare", href: "/accademia/lavori-in-corso/saggi-da-pubblicare" }]}
      </PagePlaceholder>
    </AppShell>
  );
}
