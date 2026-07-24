"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const SECTIONS = [
  { href: "/accademia/dottorato", label: "Dottorato" },
  { href: "/assistente-notarile", label: "Assistente Notarile" },
  { href: "/accademia", label: "Accademia" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t bg-navy">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,_rgb(var(--color-gold)_/_0.06),_transparent_55%)]"
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        transition={{ staggerChildren: 0.12 }}
        className="relative mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2"
      >
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link href="/" className="inline-flex items-center gap-3">
            <Image
              src={`${BASE_PATH}/avatar/aurora-disney-icon.png`}
              alt=""
              aria-hidden="true"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover ring-1 ring-gold/40"
            />
            <span className="font-serif text-2xl font-semibold tracking-tight text-foreground">
              <span className="text-gold">AI</span> Aurora Studio
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-secondary">
            Spazio di lavoro personale: dottorato, assistenza notarile e
            ricerca accademica.
          </p>
        </motion.div>

        <motion.nav
          variants={fadeUp}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Link rapidi"
          className="text-sm"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
            Sezioni
          </p>
          <ul className="space-y-3">
            {SECTIONS.map((section) => (
              <li key={section.href}>
                <Link
                  href={section.href}
                  className="group inline-flex items-center gap-0 text-secondary transition-colors duration-200 hover:text-gold"
                >
                  <span>{section.label}</span>
                  <span className="ml-1 h-px w-0 bg-gold transition-all duration-300 group-hover:w-4" />
                </Link>
              </li>
            ))}
          </ul>
        </motion.nav>
      </motion.div>

      <div className="relative border-t px-6 py-6 text-center text-xs uppercase tracking-[0.15em] text-secondary">
        © {new Date().getFullYear()} <span className="text-gold">Aurora Di Maio</span>
      </div>
    </footer>
  );
}
