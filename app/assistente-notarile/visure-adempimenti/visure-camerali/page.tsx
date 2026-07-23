import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";
import PagePlaceholder from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = {
  title: "Visure camerali | Aurora Di Maio",
};

export default function VisureCameraliPage() {
  return (
    <AppShell>
      <PagePlaceholder
        title="Visure camerali"
        breadcrumbs={[
          { label: "Assistente Notarile", href: "/assistente-notarile" },
          { label: "Visure e Adempimenti", href: "/assistente-notarile/visure-adempimenti" },
          { label: "Visure camerali" },
        ]}
      />
    </AppShell>
  );
}
