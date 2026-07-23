"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ParticleField from "./ParticleField";
import CinematicIntro from "./CinematicIntro";
import AppShell from "./layout/AppShell";
import ChatHome from "./ChatHome";
import type { CharacterState } from "./character/AuroraCharacter";

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
        >
          <AppShell>
            <ChatHome />
          </AppShell>
        </motion.div>
      )}
    </div>
  );
}
