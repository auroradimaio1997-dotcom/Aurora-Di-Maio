"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/30 blur-3xl"
          animate={
            reduceMotion
              ? undefined
              : { x: [0, 30, 0], y: [0, 20, 0] }
          }
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-0 top-10 h-80 w-80 rounded-full bg-accent/20 blur-3xl"
          animate={
            reduceMotion
              ? undefined
              : { x: [0, -25, 0], y: [0, 25, 0] }
          }
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-24 md:py-32"
      >
        <motion.div
          variants={item}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-border px-4 py-1.5 text-xs font-medium tracking-wide text-secondary"
        >
          Spazio di lavoro personale
        </motion.div>

        <motion.h1
          variants={item}
          className="font-serif text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl"
        >
          <span className="text-accent">AI</span>{" "}
          <span className="text-foreground">AURORA STUDIO</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="max-w-2xl text-lg leading-relaxed text-secondary"
        >
          Il mio spazio per studiare, lavorare e fare ricerca: dottorato,
          assistenza notarile e scrittura accademica, ciascuno con il proprio
          agent dedicato.
        </motion.p>
      </motion.div>
    </section>
  );
}
