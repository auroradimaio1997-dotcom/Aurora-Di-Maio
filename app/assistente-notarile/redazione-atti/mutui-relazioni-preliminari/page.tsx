import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import PracticeCenter from "@/components/practices/PracticeCenter";

export const metadata: Metadata = {
  title: "Mutui e relazioni preliminari | Aurora Di Maio",
};

/**
 * Full-width, clean workspace — same pattern as Inter vivos/Mortis
 * causa/Societario: no site sidebar/breadcrumb chrome, the whole page
 * belongs to the practice drawer + chat + documents.
 */
export default function MutuiRelazioniPreliminariPage() {
  return (
    <div className="flex h-[calc(100dvh-65px)] flex-col">
      <div className="flex items-center gap-2 border-b px-4 py-2">
        <Link
          href="/assistente-notarile/redazione-atti"
          className="flex items-center gap-1 text-xs text-secondary hover:text-foreground"
        >
          <ChevronLeft size={14} aria-hidden="true" />
          Redazione Atti
        </Link>
        <span className="text-xs text-secondary">/</span>
        <h1 className="text-sm font-semibold text-foreground">Mutui e relazioni preliminari</h1>
      </div>
      <div className="min-h-0 flex-1">
        <PracticeCenter
          practiceType="Mutui e Relazioni Preliminari"
          area="Assistente Notarile"
          agentId="Agente Mutui e Relazioni Preliminari"
        />
      </div>
    </div>
  );
}
