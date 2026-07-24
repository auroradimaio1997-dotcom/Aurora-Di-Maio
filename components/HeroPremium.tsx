import ParticleField from "./ParticleField";
import CinematicIntro from "./CinematicIntro";

/**
 * Home: institutional / visual only. Usable from the first second — no
 * gating animation before the two primary actions appear. The chat lives
 * at its own route (/chat); this page never renders it.
 */
export default function HeroPremium() {
  return (
    <section className="relative flex min-h-[calc(100dvh-65px)] items-center justify-center overflow-hidden bg-navy">
      <ParticleField />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,_rgb(var(--color-gold)_/_0.08),_transparent_60%)]"
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-16">
        <CinematicIntro />
      </div>
    </section>
  );
}
