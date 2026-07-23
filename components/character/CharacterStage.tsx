"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { CharacterState } from "./types";

/**
 * The animation "shell" for the Aurora character — everything about how the
 * character moves, glows, and transitions between places on the page.
 * None of it depends on what's actually being rendered inside; swap the
 * `children` for a different visual (placeholder today, a real Character
 * Design asset later) and every animation below keeps working unchanged.
 */

const ringVariants: Variants = {
  idle: {
    scale: [1, 1.015, 1],
    boxShadow: "0 0 0 0 rgb(var(--color-gold) / 0)",
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
  },
  walking: {
    y: [0, -4, 0],
    transition: { duration: 0.9, repeat: Infinity, ease: "easeInOut" },
  },
  waving: {
    rotate: [0, 3, -2, 0],
    boxShadow: [
      "0 0 0 0 rgb(var(--color-gold) / 0.4)",
      "0 0 0 16px rgb(var(--color-gold) / 0)",
    ],
    transition: { duration: 1.2, repeat: Infinity, ease: "easeOut" },
  },
  smiling: {
    scale: [1, 1.03, 1],
    boxShadow: [
      "0 0 0 0 rgb(var(--color-gold) / 0.3)",
      "0 0 0 12px rgb(var(--color-gold) / 0)",
    ],
    transition: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
  },
  thinking: {
    rotate: [0, -3, 0],
    transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
  },
  reading: {
    scale: [1, 1.008, 1],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
  writing: {
    x: [0, 1.5, -1.5, 0],
    transition: { duration: 0.4, repeat: Infinity, ease: "easeInOut" },
  },
  signing: {
    scale: [1, 0.97, 1.02, 1],
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
  stamping: {
    scale: [1, 0.94, 1.05, 1],
    boxShadow: [
      "0 0 0 0 rgb(var(--color-gold) / 0)",
      "0 0 0 22px rgb(var(--color-gold) / 0.25)",
      "0 0 0 0 rgb(var(--color-gold) / 0)",
    ],
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function CharacterStage({
  state = "idle",
  size = 220,
  layoutId,
  children,
}: {
  state?: CharacterState;
  size?: number;
  layoutId?: string;
  children: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      layoutId={layoutId}
      layout
      style={{ width: size, height: size }}
      className="relative shrink-0"
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
    >
      <motion.div
        variants={ringVariants}
        animate={reduceMotion ? "idle" : state}
        className="glass h-full w-full overflow-hidden rounded-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
