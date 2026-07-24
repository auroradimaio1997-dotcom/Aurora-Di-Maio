import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import PracticeCenter from "@/components/practices/PracticeCenter";

export const metadata: Metadata = {
  title: "Societario | Aurora Di Maio",
};

/**
 * Full-width, clean workspace — no site sidebar/breadcrumb chrome here on
 * purpose. Once a notary is working a practice, the whole page belongs to
 * the practice list drawer + chat + documents, nothing else competing for
 * space.
 */
export default function SocietarioPage() {
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
        <h1 className="text-sm font-semibold text-foreground">Societario</h1>
      </div>
      <div className="min-h-0 flex-1">
        <PracticeCenter
          practiceType="Societario"
          area="Assistente Notarile"
          agentId="Agente Societario"
        />
      </div>
    </div>
  );
}
