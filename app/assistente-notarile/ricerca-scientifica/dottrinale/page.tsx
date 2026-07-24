import type { Metadata } from "next";
import ResearchTool from "@/components/practices/ResearchTool";

export const metadata: Metadata = {
  title: "Ricerca dottrinale | Aurora Di Maio",
};

export default function RicercaDottrinalePage() {
  return (
    <ResearchTool
      title="Ricerca dottrinale"
      description="Ricerca approfondita nella dottrina giuridica, con riferimenti ad autori e fonti autorevoli."
      promptFrame="Fai una ricerca dottrinale approfondita, citando autori e fonti autorevoli quando possibile."
    />
  );
}
