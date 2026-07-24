"use client";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Animated Pixar/Disney-style avatar: a short looping video showing
 * Aurora's journey (laurea → dottorato → notaio), generated with the
 * ai-avatar-generation skill (each::sense). Rendered inside CharacterStage's
 * circular frame, same slot ModelCharacter used to occupy.
 *
 * WebM/VP9 is listed first (universally supported, no license concerns);
 * MP4/H.264 is the fallback for the rare browser build without VP9.
 */
export default function VideoCharacter() {
  return (
    <video className="h-full w-full object-cover" autoPlay loop muted playsInline>
      <source src={`${BASE_PATH}/avatar/aurora-journey.webm`} type="video/webm" />
      <source src={`${BASE_PATH}/avatar/aurora-journey.mp4`} type="video/mp4" />
    </video>
  );
}
