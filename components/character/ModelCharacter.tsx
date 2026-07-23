"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  useGLTF,
  useAnimations,
} from "@react-three/drei";
import * as THREE from "three";
import type { CharacterState } from "./types";

const MODEL_URL = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/models/aurora.glb`;

/**
 * The professional Character Design model, once dropped in as a .glb.
 * Idle motion (breathing + micro-movement + a settle-in turn toward the
 * viewer) is procedural, so it keeps working unchanged no matter what mesh
 * is loaded. If the .glb ships its own animation clips (named after
 * CharacterState values, e.g. "waving", "writing"), those take over
 * automatically for that state — see `useAnimations` below.
 */
function Model({ state }: { state: CharacterState }) {
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions } = useAnimations(animations, scene);
  const group = useRef<THREE.Group>(null);
  const settled = useRef(false);
  const t0 = useRef<number | null>(null);

  useFrame((_, delta) => {
    if (t0.current === null) t0.current = 0;
    t0.current += delta;
    const t = t0.current;

    // A clip named after the current state takes priority; otherwise, if
    // the model only ships a single baked clip, use it as the default
    // ambient motion regardless of its name (asset-authoring tools rarely
    // name clips after our CharacterState vocabulary).
    const clipNames = Object.keys(actions ?? {});
    const clip =
      actions?.[state] ?? (clipNames.length === 1 ? actions?.[clipNames[0]] : undefined);
    if (clip && !clip.isRunning()) {
      Object.values(actions ?? {}).forEach((a) => {
        if (a !== clip) a?.fadeOut(0.3);
      });
      clip.reset().fadeIn(0.3).play();
    }

    if (!group.current) return;

    // Settle-in: a small turn toward the visitor on mount.
    const targetY = settled.current ? 0 : THREE.MathUtils.degToRad(12);
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      targetY + Math.sin(t * 0.6) * 0.03,
      delta * 2
    );
    if (t > 1.2) settled.current = true;

    // Idle breathing.
    const breathe = 1 + Math.sin(t * 1.1) * 0.012;
    group.current.scale.setScalar(breathe);
  });

  return (
    <group ref={group} position={[0, PORTRAIT_Y_OFFSET, 0]}>
      <primitive object={scene} />
    </group>
  );
}

// Shifts the model down so a bust/portrait crop (roughly chest-to-head)
// sits centered in view, instead of the whole body shrunk to fit. Tuned
// for this model's ~1.7–1.8 unit standing height; re-tune if a differently
// scaled model is swapped in later.
const PORTRAIT_Y_OFFSET = -1.42;

export default function ModelCharacter({
  state = "idle",
}: {
  state?: CharacterState;
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ fov: 26, position: [0, 0, 2.6] }}
      gl={{ toneMapping: THREE.ACESFilmicToneMapping, antialias: true }}
    >
      {/* Key light */}
      <directionalLight
        position={[2.5, 4, 3]}
        intensity={2.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0005}
      />
      {/* Fill light, cool */}
      <directionalLight position={[-3, 1.5, -2]} intensity={0.4} color="#9db8ff" />
      {/* Gold rim light for brand warmth */}
      <pointLight position={[-1.5, 2, -3]} intensity={6} color="#d4af37" distance={8} />
      <ambientLight intensity={0.25} />

      <Suspense fallback={null}>
        {/* Procedural studio environment — no external HDRI fetch, so it
            never depends on a third-party CDN being reachable. */}
        <Environment resolution={128}>
          <Lightformer form="rect" intensity={2} color="#ffffff" position={[3, 3, 2]} scale={[3, 3, 1]} />
          <Lightformer form="rect" intensity={1} color="#d4af37" position={[-3, 1, -2]} scale={[2, 2, 1]} />
          <Lightformer form="ring" intensity={1.5} color="#9db8ff" position={[0, 3, -3]} scale={4} />
        </Environment>
        <Model state={state} />
        <ContactShadows
          position={[0, -0.95, 0]}
          opacity={0.55}
          scale={6}
          blur={2.6}
          far={2}
          color="#050810"
        />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);
