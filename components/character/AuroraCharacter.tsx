"use client";

import CharacterStage from "./CharacterStage";
import PlaceholderCharacter from "./PlaceholderCharacter";
import type { CharacterState } from "./types";

/**
 * The one place that knows which visual currently represents Aurora.
 *
 * Today: PlaceholderCharacter (an elegant silhouette placeholder).
 * Later: replace the import/usage below with the real Character Design
 * asset (illustration, rigged 3D model, or Lottie file) — nothing else in
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
      <PlaceholderCharacter />
    </CharacterStage>
  );
}

export type { CharacterState } from "./types";
