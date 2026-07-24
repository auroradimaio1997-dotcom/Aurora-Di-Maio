"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, type TargetAndTransition } from "framer-motion";
import {
  BookOpen,
  FolderKanban,
  GraduationCap,
  Menu,
  MessagesSquare,
  PenLine,
  Presentation,
  Search,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/aree-di-ricerca-e-lavoro", label: "Aree di Ricerca e Lavoro" },
];

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type Activity = "write" | "search" | "read" | "idle";

// Checked in order — first match wins — so the badge reflects the title
// of the section actually open, not a static "Online". Nested/specific
// routes are listed before their parent so they win the match.
const STATUS_BY_PATH: { match: string; status: string; icon: LucideIcon; activity: Activity }[] = [
  // Assistente Notarile — Redazione Atti
  { match: "/assistente-notarile/redazione-atti/inter-vivos", status: "Sta scrivendo un atto Inter Vivos", icon: PenLine, activity: "write" },
  { match: "/assistente-notarile/redazione-atti/mortis-causa", status: "Sta scrivendo un atto Mortis Causa", icon: PenLine, activity: "write" },
  { match: "/assistente-notarile/redazione-atti/societario", status: "Sta scrivendo un atto Societario", icon: PenLine, activity: "write" },
  { match: "/assistente-notarile/redazione-atti/mutui-relazioni-preliminari", status: "Sta scrivendo Mutui e relazioni preliminari", icon: PenLine, activity: "write" },
  { match: "/assistente-notarile/redazione-atti", status: "Sta scrivendo atti", icon: PenLine, activity: "write" },
  // Assistente Notarile — Ricerca scientifica
  { match: "/assistente-notarile/ricerca-scientifica/banche-dati-notarili", status: "Sta cercando nelle banche dati notarili", icon: Search, activity: "search" },
  { match: "/assistente-notarile/ricerca-scientifica/dottrinale", status: "Sta facendo ricerca dottrinale", icon: Search, activity: "search" },
  { match: "/assistente-notarile/ricerca-scientifica/giurisprudenziale", status: "Sta facendo ricerca giurisprudenziale", icon: Search, activity: "search" },
  { match: "/assistente-notarile/ricerca-scientifica", status: "Sta facendo una ricerca scientifica approfondita", icon: Search, activity: "search" },
  { match: "/assistente-notarile", status: "È nell'Assistente Notarile", icon: Sparkles, activity: "idle" },
  // Accademia — Dottorato
  { match: "/accademia/dottorato/convegni", status: "Sta preparando i convegni", icon: Presentation, activity: "read" },
  { match: "/accademia/dottorato/lezioni", status: "Sta preparando le lezioni", icon: GraduationCap, activity: "read" },
  { match: "/accademia/dottorato/progetti", status: "Sta lavorando ai progetti", icon: FolderKanban, activity: "read" },
  { match: "/accademia/dottorato/tesi", status: "Sta scrivendo la tesi di dottorato", icon: PenLine, activity: "write" },
  { match: "/accademia/dottorato", status: "Sta facendo dottorato", icon: BookOpen, activity: "read" },
  // Accademia — Lavori in corso / Monografia / Ricerca
  { match: "/accademia/lavori-in-corso/saggi-da-pubblicare", status: "Sta scrivendo saggi da pubblicare", icon: PenLine, activity: "write" },
  { match: "/accademia/lavori-in-corso", status: "Ha lavori in corso", icon: FolderKanban, activity: "read" },
  { match: "/accademia/monografia", status: "Sta scrivendo la monografia", icon: PenLine, activity: "write" },
  { match: "/accademia/ricerca/saggi-pubblicati", status: "Sta consultando i saggi pubblicati", icon: BookOpen, activity: "read" },
  { match: "/accademia/ricerca", status: "Sto facendo ricerca", icon: Search, activity: "search" },
  { match: "/accademia", status: "È in Accademia", icon: GraduationCap, activity: "idle" },
  // Everything else
  { match: "/aree-di-ricerca-e-lavoro", status: "Sta scegliendo un'area di lavoro", icon: Sparkles, activity: "idle" },
  { match: "/chat", status: "In chat con te", icon: MessagesSquare, activity: "read" },
];

const DEFAULT_STATUS = { status: "Online", icon: null, activity: "idle" as Activity };

function statusForPath(pathname: string) {
  return STATUS_BY_PATH.find(({ match }) => pathname.startsWith(match)) ?? DEFAULT_STATUS;
}

// Per-activity micro-motion for the little badge next to the avatar, so it
// visibly "does" what the status text says instead of just sitting there.
const ACTIVITY_MOTION: Record<Activity, TargetAndTransition> = {
  write: { rotate: [-14, 10, -14], transition: { duration: 0.9, repeat: Infinity, ease: "easeInOut" } },
  search: { x: [-1.5, 1.5, -1.5], scale: [1, 1.12, 1], transition: { duration: 1.4, repeat: Infinity, ease: "easeInOut" } },
  read: { y: [0, -1.5, 0], transition: { duration: 1.6, repeat: Infinity, ease: "easeInOut" } },
  idle: { scale: [1, 1.08, 1], transition: { duration: 2, repeat: Infinity, ease: "easeInOut" } },
};

/**
 * Persistent header shown on every page. The single place that carries
 * brand identity (logo + avatar + online status) so it never has to be
 * rebuilt per-route.
 */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { status, icon: ActivityIcon, activity } = statusForPath(pathname ?? "/");

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative shrink-0">
            <Image
              src={`${BASE_PATH}/avatar/aurora-disney-icon.png`}
              alt="Aurora"
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover ring-1 ring-gold/40"
            />
            {ActivityIcon ? (
              <motion.span
                key={activity + status}
                animate={ACTIVITY_MOTION[activity]}
                className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-navy ring-2 ring-background"
                aria-hidden="true"
              >
                <ActivityIcon size={10} strokeWidth={2.5} />
              </motion.span>
            ) : (
              <span
                className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-background"
                aria-hidden="true"
              />
            )}
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-serif text-base font-semibold tracking-tight text-foreground">
              AI Aurora Studio
            </span>
            <span className="text-[11px] font-medium text-secondary">{status}</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-secondary transition-colors duration-200 hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          aria-label={open ? "Chiudi menu" : "Apri menu"}
          aria-expanded={open}
          className="flex h-11 w-11 items-center justify-center rounded-md text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <ul className="flex flex-col gap-1 border-t px-6 py-4 md:hidden">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-3 text-base font-medium text-secondary hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
