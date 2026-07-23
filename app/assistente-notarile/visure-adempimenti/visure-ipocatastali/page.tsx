import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";
import PagePlaceholder from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = {
  title: "Visure ipocatastali | Aurora Di Maio",
};

export default function VisureIpocatastaliPage() {
  return (
    <AppShell>
      <PagePlaceholder
        title="Visure ipocatastali"
        breadcrumbs={[
          { label: "Assistente Notarile", href: "/assistente-notarile" },
          { label: "Visure e Adempimenti", href: "/assistente-notarile/visure-adempimenti" },
          { label: "Visure ipocatastali" },
        ]}
      />
    </AppShell>
  );
}
