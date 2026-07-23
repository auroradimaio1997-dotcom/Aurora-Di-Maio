import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";
import PagePlaceholder from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = {
  title: "Monografia | Aurora Di Maio",
};

export default function MonografiaPage() {
  return (
    <AppShell>
      <PagePlaceholder
        title="Monografia"
        breadcrumbs={[{ label: "Accademia", href: "/accademia" }, { label: "Monografia" }]}
      />
    </AppShell>
  );
}
