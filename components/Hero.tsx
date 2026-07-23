"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import AvatarStoryPlayer from "@/components/remotion/AvatarStoryPlayer";

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
    <section className="relative flex min-h-[calc(100dvh-65px)] items-center overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/30 blur-3xl"
          animate={reduceMotion ? undefined : { x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-0 top-10 h-80 w-80 rounded-full bg-accent/20 blur-3xl"
          animate={reduceMotion ? undefined : { x: [0, -25, 0], y: [0, 25, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto flex max-w-5xl flex-col items-center gap-12 px-6 py-16 text-center"
      >
        <motion.h1
          variants={item}
          className="font-serif text-6xl font-semibold leading-[1.05] tracking-tight md:text-8xl"
        >
          <span className="text-accent">AI</span>{" "}
          <span className="text-foreground">AURORA STUDIO</span>
        </motion.h1>

        <motion.div variants={item}>
          <AvatarStoryPlayer
            avatarSrc={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/avatar/aurora.jpg`}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
