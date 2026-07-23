/**
 * The full cue vocabulary for the Aurora character, independent of whatever
 * visual currently renders it (placeholder today, a professional Character
 * Design asset later). Every animation in the product is built against
 * this list, never against a specific visual implementation.
 */
export type CharacterState =
  | "idle"
  | "walking"
  | "waving"
  | "smiling"
  | "thinking"
  | "reading"
  | "writing"
  | "signing"
  | "stamping";

export const CHARACTER_STATES: CharacterState[] = [
  "idle",
  "walking",
  "waving",
  "smiling",
  "thinking",
  "reading",
  "writing",
  "signing",
  "stamping",
];
