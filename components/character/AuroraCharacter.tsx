"use client";

import CharacterStage from "./CharacterStage";
import VideoCharacter from "./VideoCharacter";
import type { CharacterState } from "./types";

/**
 * The one place that knows which visual currently represents Aurora.
 *
 * Today: VideoCharacter (the looping Disney/Pixar-style avatar video —
 * laurea → dottorato → notaio — generated with the ai-avatar-generation
 * skill). Before this it was the .glb Character Design model rendered with
 * React Three Fiber (still available as ModelCharacter). Swapping the
 * visual again later is just swapping the import below — nothing else in
 * the app needs to change. Every screen renders <AuroraCharacter state=.../>
 * and never touches the visual directly.
 */
export default function AuroraCharacter({
  state = "idle",
  size = 220,
  layoutId,
}: {
  state?: CharacterState;
  size?: number;
  layoutId?: string;
}) {
  return (
    <CharacterStage state={state} size={size} layoutId={layoutId}>
      <VideoCharacter />
    </CharacterStage>
  );
}

export type { CharacterState } from "./types";
