"use client";

import { useEffect, useState } from "react";
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
 * Owns the character for the whole homepage lifetime — it's rendered here
 * once and never unmounts, even after `entered` becomes true (it just gets
 * re-styled into the fixed bottom-right corner by the parent). Unmounting
 * and remounting a fresh <AuroraCharacter> used to recreate the WebGL
 * canvas on every scene change and on entering, causing a blank flash.
 */
export default function CinematicIntro({
  entered,
  cornerState,
  onEnter,
  onCornerClick,
}: {
  entered: boolean;
  cornerState: CharacterState;
  onEnter: () => void;
  onCornerClick: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const [sceneIndex, setSceneIndex] = useState(0);
  const [phase, setPhase] = useState<"scenes" | "greeting">("scenes");

  useEffect(() => {
    if (entered || phase !== "scenes") return;
    if (reduceMotion) {
      setPhase("greeting");
      return;
    }
    if (sceneIndex >= SCENES.length - 1) {
      const t = setTimeout(() => setPhase("greeting"), SCENE_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setSceneIndex((i) => i + 1), SCENE_MS);
    return () => clearTimeout(t);
  }, [sceneIndex, phase, reduceMotion, entered]);

  const scene = SCENES[sceneIndex];
  const preEnterState: CharacterState = phase === "greeting" ? "waving" : scene.state;

  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center gap-8 text-center">
      <div
        className={
          entered
            ? "fixed bottom-6 right-6 z-50 cursor-pointer"
            : "cursor-default"
        }
        onClick={entered ? onCornerClick : undefined}
        role={entered ? "button" : undefined}
        tabIndex={entered ? 0 : undefined}
        aria-label={entered ? "Aurora, il tuo assistente" : undefined}
        onKeyDown={
          entered
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") onCornerClick();
              }
            : undefined
        }
      >
        <AuroraCharacter
          state={entered ? cornerState : preEnterState}
          size={entered ? 84 : 200}
        />
      </div>

      {!entered && (
        <AnimatePresence mode="wait">
          {phase === "scenes" ? (
            <motion.div
              key={scene.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-6"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                {scene.label}
              </span>

              <div className="space-y-1">
                {scene.lines.map((line, i) => (
                  <p
                    key={i}
                    className={
                      i === scene.lines.length - 1 && scene.key === "notaio"
                        ? "font-serif text-2xl font-semibold tracking-wide text-gold md:text-3xl"
                        : "text-base text-secondary md:text-lg"
                    }
                  >
                    {line}
                  </p>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="greeting"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-8"
            >
              <div>
                <h1 className="font-serif text-5xl font-semibold tracking-tight text-foreground md:text-7xl">
                  <span className="text-gold">AI</span> AURORA STUDIO
                </h1>
                <p className="mt-4 text-lg text-secondary md:text-xl">
                  L&apos;Intelligenza Artificiale al servizio del Notariato.
                </p>
              </div>

              <motion.button
                type="button"
                onClick={onEnter}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="glass rounded-full px-8 py-3 text-sm font-semibold uppercase tracking-wide text-gold transition-colors hover:bg-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                Entra nell&apos;assistente
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
