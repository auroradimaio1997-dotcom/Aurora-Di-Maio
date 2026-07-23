import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aurora Di Maio | Dottoranda & Assistente Notarile",
  description:
    "Sito professionale di Aurora Di Maio, dottoranda e assistente notarile: servizi, ricerca e contatti.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className="flex min-h-dvh flex-col antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
