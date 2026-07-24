import type { Metadata } from "next";
import ResearchTool from "@/components/practices/ResearchTool";

export const metadata: Metadata = {
  title: "Ricerca banche dati notarili | Aurora Di Maio",
};

export default function RicercaBancheDatiNotarilliPage() {
  return (
    <ResearchTool
      title="Ricerca banche dati notarili"
      description="Ricerca approfondita nelle banche dati notarili di riferimento (es. CNN Notizie)."
      promptFrame="Fai una ricerca approfondita orientata alle banche dati notarili italiane (es. CNN Notizie, massimario notarile), citando le fonti quando possibile."
    />
  );
}
