import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";
import PagePlaceholder from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = {
  title: "Banche dati notarili | Aurora Di Maio",
};

export default function BancheDatiNotarailiPage() {
  return (
    <AppShell>
      <PagePlaceholder
        title="Banche dati notarili"
        breadcrumbs={[
          { label: "Assistente Notarile", href: "/assistente-notarile" },
          { label: "Ricerca giuridica", href: "/assistente-notarile/ricerca-notarile" },
          { label: "Banche dati notarili" },
        ]}
      />
    </AppShell>
  );
}
