import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";
import PracticeCenter from "@/components/practices/PracticeCenter";

export const metadata: Metadata = {
  title: "Inter vivos | Aurora Di Maio",
};

export default function InterVivosPage() {
  return (
    <AppShell>
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-secondary">
        <a href="/assistente-notarile" className="hover:text-foreground">
          Assistente Notarile
        </a>
        {" / "}
        <a href="/assistente-notarile/redazione-atti" className="hover:text-foreground">
          Redazione Atti
        </a>
        {" / "}
        <span>Inter vivos</span>
      </nav>
      <h1 className="mb-4 font-serif text-2xl font-semibold text-foreground md:text-3xl">
        Inter vivos
      </h1>
      <PracticeCenter practiceType="Inter vivos" area="Assistente Notarile" agentId="Agente Inter vivos" />
    </AppShell>
  );
}
