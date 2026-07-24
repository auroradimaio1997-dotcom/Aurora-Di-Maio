import type { Metadata } from "next";
import WebMailPanel from "@/components/practices/WebMailPanel";

export const metadata: Metadata = {
  title: "Web Mail Notariato | Aurora Di Maio",
};

export default function WebMailNotariatoPage() {
  return <WebMailPanel />;
}
