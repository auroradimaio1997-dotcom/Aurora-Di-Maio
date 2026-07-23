"use client";

import CharacterStage from "./CharacterStage";
import ModelCharacter from "./ModelCharacter";
import type { CharacterState } from "./types";

/**
 * The one place that knows which visual currently represents Aurora.
 *
 * Today: ModelCharacter (the .glb Character Design model, lit and animated
 * with React Three Fiber). Before this it was an abstract placeholder.
 * Later, swapping to a refined/definitive model is just replacing the file
 * ModelCharacter loads (see MODEL_URL in ModelCharacter.tsx) or, for a
 * fully different renderer, swapping the import below — nothing else in
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
      <ModelCharacter state={state} />
    </CharacterStage>
  );
}

export type { CharacterState } from "./types";
