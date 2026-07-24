"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import AuroraCharacter, { type CharacterState } from "./character/AuroraCharacter";

type Scene = {
  key: string;
  label: string;
  lines: string[];
  state: CharacterState;
};

const SCENES: Scene[] = [
  {
    key: "laurea",
    label: "Laurea",
    lines: ["La corona d'alloro.", "La pergamena. Il primo traguardo."],
    state: "smiling",
  },
  {
    key: "dottorato",
    label: "Dottorato",
    lines: ["Biblioteca, notte fonda.", "Ricerca, scrittura, riferimenti giuridici."],
    state: "writing",
  },
  {
    key: "notaio",
    label: "Notaio",
    lines: ["La firma. Il sigillo.", "ATTO AUTENTICATO"],
    state: "stamping",
  },
];

const SCENE_MS = 3400;

/**
 * The Home hero. Title, subtitle and the two primary actions are visible
 * and clickable from the first frame — the scene captions underneath are
 * pure decoration that rotates in the background, never gating anything.
 */
export default function CinematicIntro() {
  const reduceMotion = useReducedMotion();
  const [sceneIndex, setSceneIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const t = setTimeout(
      () => setSceneIndex((i) => (i + 1) % SCENES.length),
      SCENE_MS
    );
    return () => clearTimeout(t);
  }, [sceneIndex, reduceMotion]);

  const scene = SCENES[sceneIndex];

  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center gap-10 text-center">
      <AuroraCharacter state={scene.state} size={200} />

      <div>
        <h1 className="font-serif text-5xl font-semibold tracking-tight text-foreground md:text-7xl">
          <span className="text-gold">AI</span> AURORA STUDIO
        </h1>
        <p className="mt-4 text-lg text-secondary md:text-xl">
          L&apos;Intelligenza Artificiale per la Ricerca e la Professione.
        </p>
      </div>

      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Link href="/chat">
          <motion.span
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block rounded-full bg-gold px-8 py-3 text-sm font-semibold uppercase tracking-wide text-navy transition-colors hover:bg-gold/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            Lavora con AI Aurora Studio
          </motion.span>
        </Link>

        <Link href="/aree-di-ricerca-e-lavoro">
          <motion.span
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block rounded-full border px-8 py-3 text-sm font-semibold uppercase tracking-wide text-foreground transition-colors hover:border-gold/40 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Aree di Ricerca e Lavoro
          </motion.span>
        </Link>
      </div>

      <div className="h-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={scene.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-1"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
              {scene.label}
            </span>
            <p className="text-sm text-secondary">{scene.lines[0]}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
