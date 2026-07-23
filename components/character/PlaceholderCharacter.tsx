"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Temporary stand-in for the Aurora Character Design, until the
 * professional asset (illustration, 3D model, or Lottie rig) is ready to
 * drop in. Deliberately abstract — a soft silhouette and monogram, not a
 * face — so it reads as "reserved space", not a cheap placeholder icon.
 *
 * === HOW TO REPLACE ===
 * Swap this component out inside `components/character/AuroraCharacter.tsx`
 * (the single import to change). This file, CharacterStage, and every
 * screen using <AuroraCharacter /> stay untouched — they only ever pass a
 * `state` from `CharacterState` and a `size`.
 */
export default function PlaceholderCharacter() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_50%_30%,rgb(var(--color-navy)/0.4),rgb(var(--color-navy)/0.85))]">
      <motion.div
        animate={reduceMotion ? undefined : { opacity: [0.55, 0.75, 0.55] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute h-[68%] w-[46%] rounded-[50%] bg-[radial-gradient(circle,rgb(var(--color-gold)/0.16),transparent_75%)] blur-xl"
        style={{ bottom: "6%" }}
        aria-hidden="true"
      />

      <span className="relative font-serif text-2xl tracking-[0.15em] text-gold/70">
        A
      </span>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-gold/25"
      />
    </div>
  );
}
