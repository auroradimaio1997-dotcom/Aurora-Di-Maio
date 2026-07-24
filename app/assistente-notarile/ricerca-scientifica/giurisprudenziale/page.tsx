import type { Metadata } from "next";
import ResearchTool from "@/components/practices/ResearchTool";

export const metadata: Metadata = {
  title: "Ricerca giurisprudenziale | Aurora Di Maio",
};

export default function RicercaGiurisprudenzialePage() {
  return (
    <ResearchTool
      title="Ricerca giurisprudenziale"
      description="Ricerca approfondita di sentenze e orientamenti giurisprudenziali rilevanti."
      promptFrame="Fai una ricerca giurisprudenziale approfondita, citando sentenze e orientamenti rilevanti quando possibile."
    />
  );
}
