"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Brain, BookOpen, PenLine, Sparkles, Hand } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type AvatarState =
  | "idle"
  | "thinking"
  | "reading"
  | "writing"
  | "smiling"
  | "waving";

const BADGES: Partial<Record<AvatarState, LucideIcon>> = {
  thinking: Brain,
  reading: BookOpen,
  writing: PenLine,
  smiling: Sparkles,
  waving: Hand,
};

const ringVariants: Variants = {
  idle: { boxShadow: "0 0 0 0 rgb(var(--color-gold) / 0)" },
  active: {
    boxShadow: [
      "0 0 0 0 rgb(var(--color-gold) / 0.35)",
      "0 0 0 14px rgb(var(--color-gold) / 0)",
    ],
    transition: { duration: 1.8, repeat: Infinity, ease: "easeOut" },
  },
};

/**
 * A stylized, illustrated 2D avatar (not photorealistic) — flat vector
 * shapes animated with Framer Motion. Communicates presence and reaction
 * through subtle motion (head tilt, blink, badge, glow) rather than a
 * realistic face.
 */
export default function PremiumAvatar({
  state = "idle",
  size = 220,
  layoutId,
}: {
  state?: AvatarState;
  size?: number;
  layoutId?: string;
}) {
  const reduceMotion = useReducedMotion();
  const Badge = BADGES[state];
  const tilt = state === "waving" ? 6 : state === "thinking" ? -4 : 0;

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
        animate={reduceMotion ? "idle" : "active"}
        className="absolute inset-0 rounded-full"
      />

      <motion.div
        animate={{ rotate: reduceMotion ? 0 : tilt }}
        transition={{ type: "spring", stiffness: 90, damping: 12 }}
        className="glass relative h-full w-full overflow-hidden rounded-full"
      >
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <defs>
            <radialGradient id="skin" cx="45%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#f3d9c4" />
              <stop offset="100%" stopColor="#e3b992" />
            </radialGradient>
            <linearGradient id="hair" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3a2a20" />
              <stop offset="100%" stopColor="#1f150f" />
            </linearGradient>
          </defs>

          {/* background wash */}
          <rect width="200" height="200" fill="rgb(var(--color-navy))" opacity="0.6" />

          {/* hair back */}
          <path
            d="M40 120 Q30 60 100 45 Q170 60 160 120 Q165 160 150 175 Q140 140 130 150 Q120 165 100 165 Q80 165 70 150 Q60 140 50 175 Q35 160 40 120Z"
            fill="url(#hair)"
          />

          {/* neck + shoulders */}
          <rect x="85" y="120" width="30" height="30" rx="10" fill="#e3b992" />
          <path
            d="M40 200 Q100 160 160 200 L160 200 L40 200Z"
            fill="rgb(var(--color-gold))"
            opacity="0.85"
          />

          {/* face */}
          <ellipse cx="100" cy="98" rx="42" ry="48" fill="url(#skin)" />

          {/* hair front / fringe */}
          <path
            d="M58 80 Q65 40 100 38 Q135 40 142 80 Q120 60 100 62 Q80 60 58 80Z"
            fill="url(#hair)"
          />

          {/* eyes */}
          <g className="animate-blink">
            <ellipse cx="82" cy="98" rx="5.5" ry={state === "reading" ? 3 : 6} fill="#2b1c14" />
            <ellipse cx="118" cy="98" rx="5.5" ry={state === "reading" ? 3 : 6} fill="#2b1c14" />
          </g>

          {/* brows */}
          <path
            d={
              state === "thinking"
                ? "M74 84 Q82 78 90 84"
                : "M74 86 Q82 82 90 86"
            }
            stroke="#3a2a20"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={
              state === "thinking"
                ? "M110 84 Q118 78 126 84"
                : "M110 86 Q118 82 126 86"
            }
            stroke="#3a2a20"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* mouth */}
          <path
            d={
              state === "smiling" || state === "waving"
                ? "M84 118 Q100 132 116 118"
                : state === "thinking"
                  ? "M90 120 Q100 116 110 120"
                  : "M88 119 Q100 124 112 119"
            }
            stroke="#a9573f"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />

          {/* blush */}
          <ellipse cx="70" cy="110" rx="7" ry="4" fill="#e8a08a" opacity="0.5" />
          <ellipse cx="130" cy="110" rx="7" ry="4" fill="#e8a08a" opacity="0.5" />
        </svg>

        {state === "waving" && (
          <motion.div
            initial={{ rotate: -20, opacity: 0 }}
            animate={{ rotate: [-20, 15, -10, 8, 0], opacity: 1 }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
            className="absolute bottom-3 right-3 text-2xl"
            aria-hidden="true"
          >
            👋
          </motion.div>
        )}
      </motion.div>

      {Badge && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-navy bg-gold text-navy shadow-lg"
        >
          <Badge size={18} aria-hidden="true" />
        </motion.span>
      )}
    </motion.div>
  );
}
