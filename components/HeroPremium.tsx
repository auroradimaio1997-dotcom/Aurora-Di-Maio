"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, Landmark, Scale } from "lucide-react";
import ParticleField from "./ParticleField";
import CinematicIntro from "./CinematicIntro";
import type { CharacterState } from "./character/AuroraCharacter";

const AREAS = [
  {
    href: "/dottorato",
    icon: GraduationCap,
    title: "Dottorato",
    description: "Materiali, bozze e stato di avanzamento della tesi.",
  },
  {
    href: "/assistente-notarile",
    icon: Landmark,
    title: "Assistente Notarile",
    description: "Modulistica, procedure e l'agent per la ricerca notarile.",
  },
  {
    href: "/accademia",
    icon: Scale,
    title: "Accademia",
    description: "Tesi, saggi e l'agent di ricerca giuridica.",
  },
];

export default function HeroPremium() {
  const [entered, setEntered] = useState(false);
  const [cornerState, setCornerState] = useState<CharacterState>("idle");

  return (
    <div className="relative">
      <section className="relative flex min-h-[calc(100dvh-65px)] items-center justify-center overflow-hidden bg-navy">
        <ParticleField />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,_rgb(var(--color-gold)_/_0.08),_transparent_60%)]"
        />

        <div className="relative z-10 mx-auto max-w-4xl px-6 py-16">
          <CinematicIntro
            entered={entered}
            cornerState={cornerState}
            onEnter={() => setEntered(true)}
            onCornerClick={() =>
              setCornerState((s) => (s === "waving" ? "idle" : "waving"))
            }
          />
        </div>
      </section>

      {entered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mx-auto max-w-6xl px-6 py-16 md:py-24"
        >
          <div className="text-center">
            <h2 className="font-serif text-3xl font-semibold text-foreground md:text-4xl">
              Esplora lo studio
            </h2>
            <p className="mt-3 text-secondary">
              Dottorato, assistenza notarile e ricerca accademica — con gli
              agent già collegati in ogni area.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {AREAS.map((area) => (
              <Link
                key={area.href}
                href={area.href}
                onMouseEnter={() => setCornerState("thinking")}
                onMouseLeave={() => setCornerState("idle")}
                className="group rounded-xl border bg-background p-6 transition-all duration-200 hover:-translate-y-1 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/5"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-gold/10 text-gold transition-transform duration-200 group-hover:scale-110">
                  <area.icon size={22} aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-serif text-lg font-semibold text-foreground">
                  {area.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-secondary">
                  {area.description}
                </p>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
