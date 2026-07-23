"use client";

import { motion, useReducedMotion } from "framer-motion";

const variants = {
  dottorato: ["bg-primary", "bg-secondary", "bg-accent"],
  notarile: ["bg-cta", "bg-primary", "bg-secondary"],
  accademia: ["bg-secondary", "bg-accent", "bg-primary"],
} as const;

const layout = [
  { rotate: -12, x: -34, y: 6, h: 92 },
  { rotate: 3, x: 0, y: -8, h: 112 },
  { rotate: 16, x: 34, y: 10, h: 88 },
];

export default function AnimatedBooks({
  variant,
}: {
  variant: keyof typeof variants;
}) {
  const reduceMotion = useReducedMotion();
  const colors = variants[variant];

  return (
    <div className="relative mx-auto h-32 w-56" aria-hidden="true">
      {layout.map((book, i) => (
        <motion.div
          key={i}
          className={`absolute bottom-0 left-1/2 w-14 rounded-md shadow-lg ${colors[i % colors.length]}`}
          style={{ height: book.h, marginLeft: book.x - 28 }}
          initial={{ rotate: book.rotate }}
          animate={
            reduceMotion
              ? { rotate: book.rotate }
              : { rotate: book.rotate, y: [0, -10, 0] }
          }
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        >
          <span className="absolute inset-y-1 left-1 w-1.5 rounded-full bg-background/40" />
        </motion.div>
      ))}
    </div>
  );
}
