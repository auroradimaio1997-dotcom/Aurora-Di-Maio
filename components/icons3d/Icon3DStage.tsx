"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";

/**
 * Shared Canvas/lighting rig for the small interactive 3D area icons
 * (notary seal, books + laptop, ...). Mirrors ModelCharacter's studio
 * setup at a cheaper resolution, since these render much smaller.
 */
export default function Icon3DStage({
  size = 64,
  children,
}: {
  size?: number;
  children: React.ReactNode;
}) {
  return (
    <div style={{ width: size, height: size }} className="shrink-0">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ fov: 30, position: [0, 0.35, 3.6] }}
        gl={{ antialias: true }}
      >
        <directionalLight position={[2.5, 3, 3]} intensity={2} />
        <directionalLight position={[-3, 1, -2]} intensity={0.35} color="#9db8ff" />
        <ambientLight intensity={0.35} />
        <Suspense fallback={null}>
          <Environment resolution={64}>
            <Lightformer form="rect" intensity={2} color="#ffffff" position={[3, 3, 2]} scale={[3, 3, 1]} />
            <Lightformer form="rect" intensity={1} color="#d4af37" position={[-3, 1, -2]} scale={[2, 2, 1]} />
          </Environment>
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
}
