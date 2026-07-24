import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const avatarIcon = `${basePath}/avatar/aurora-disney-icon.png`;
const avatarOg = `${basePath}/avatar/aurora-disney.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL("https://aurora-di-maio.vercel.app"),
  title: "Aurora Di Maio | Spazio di lavoro personale",
  description:
    "Spazio di lavoro personale di Aurora Di Maio per dottorato, assistenza notarile e ricerca accademica.",
  icons: {
    icon: avatarIcon,
    apple: avatarIcon,
  },
  openGraph: {
    title: "Aurora Di Maio",
    description:
      "Spazio di lavoro personale di Aurora Di Maio per dottorato, assistenza notarile e ricerca accademica.",
    images: [avatarOg],
  },
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
