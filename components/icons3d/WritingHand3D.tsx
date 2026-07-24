"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Icon3DStage from "./Icon3DStage";

/**
 * A quill pen moving back and forth across a sheet of paper, simulating
 * the act of writing — built from primitives, same style as the other
 * area icons (notary seal, books + laptop).
 */
function WritingHand() {
  const pen = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!pen.current) return;
    const t = clock.getElapsedTime();
    pen.current.position.x = Math.sin(t * 2.2) * 0.42;
    pen.current.position.y = -0.18 + Math.abs(Math.sin(t * 4.4)) * 0.03;
    pen.current.rotation.z = -0.55 + Math.sin(t * 2.2) * 0.06;
  });

  return (
    <group position={[0, -0.05, 0]}>
      {/* paper sheet */}
      <mesh rotation={[-Math.PI / 2.6, 0, 0]} position={[0, -0.35, 0]}>
        <planeGeometry args={[1.7, 2.1]} />
        <meshStandardMaterial color="#f5f1e6" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      {/* faint written lines, revealed progressively is overkill — a few static strokes read as "text" */}
      {[-0.5, -0.25, 0, 0.25].map((y) => (
        <mesh key={y} rotation={[-Math.PI / 2.6, 0, 0]} position={[-0.15, -0.34, y * 0.55]}>
          <planeGeometry args={[0.9, 0.03]} />
          <meshStandardMaterial color="#7a1220" roughness={0.8} />
        </mesh>
      ))}

      {/* pen */}
      <group ref={pen} position={[0, -0.18, 0.35]}>
        <mesh rotation={[Math.PI / 2.4, 0, 0]}>
          <cylinderGeometry args={[0.045, 0.02, 1.05, 16]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.02, 0.48]} rotation={[Math.PI / 2.4, 0, 0]}>
          <coneGeometry args={[0.045, 0.16, 16]} />
          <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.25} />
        </mesh>
      </group>
    </group>
  );
}

export default function WritingHand3D({ size = 64 }: { size?: number }) {
  return (
    <Icon3DStage size={size}>
      <WritingHand />
    </Icon3DStage>
  );
}
