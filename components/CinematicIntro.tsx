"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { GraduationCap, Library, Stamp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import PremiumAvatar, { type AvatarState } from "./PremiumAvatar";

type Scene = {
  key: string;
  icon: LucideIcon;
  title: string;
  lines: string[];
  avatarState: AvatarState;
};

const SCENES: Scene[] = [
  {
    key: "laurea",
    icon: GraduationCap,
    title: "Laurea",
    lines: ["La corona d'alloro.", "La pergamena. Il primo traguardo."],
    avatarState: "smiling",
  },
  {
    key: "dottorato",
    icon: Library,
    title: "Dottorato",
    lines: ["Biblioteca, notte fonda.", "Ricerca, scrittura, riferimenti giuridici."],
    avatarState: "writing",
  },
  {
    key: "notaio",
    icon: Stamp,
    title: "Notaio",
    lines: ["La firma. Il sigillo.", "ATTO AUTENTICATO"],
    avatarState: "thinking",
  },
];

const SCENE_MS = 3400;

export default function CinematicIntro({
  onEnter,
}: {
  onEnter: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const [sceneIndex, setSceneIndex] = useState(0);
  const [phase, setPhase] = useState<"scenes" | "greeting">("scenes");

  useEffect(() => {
    if (phase !== "scenes") return;
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
  }, [sceneIndex, phase, reduceMotion]);

  const scene = SCENES[sceneIndex];

  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center gap-8 text-center">
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
            <PremiumAvatar layoutId="hero-avatar" state={scene.avatarState} size={200} />

            <div className="flex items-center gap-2 text-gold">
              <scene.icon size={18} aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                {scene.title}
              </span>
            </div>

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
            <PremiumAvatar layoutId="hero-avatar" state="waving" size={200} />

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
    </div>
  );
}
