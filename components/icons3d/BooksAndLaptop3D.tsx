"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Icon3DStage from "./Icon3DStage";

/**
 * A small stack of books leaning against an open laptop, built from
 * primitives. Slowly turns in place so it reads as a real 3D object.
 */
function BooksAndLaptop() {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.5;
  });

  const bookColors = ["#7a4a24", "#5c1f2e", "#8a5a2b"];

  return (
    <group ref={group} position={[-0.11, 0.02, 0]} scale={0.58}>
      {bookColors.map((color, i) => (
        <mesh
          key={color}
          position={[-0.55 + i * 0.32, -0.3, 0]}
          rotation={[0, 0, THREE.MathUtils.degToRad(-6)]}
        >
          <boxGeometry args={[0.26, 1, 0.75]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
      ))}

      {/* laptop base */}
      <mesh position={[0.55, -0.62, 0.05]} rotation={[0, 0, 0]}>
        <boxGeometry args={[1, 0.06, 0.7]} />
        <meshStandardMaterial color="#c7c9cf" metalness={0.6} roughness={0.35} />
      </mesh>
      {/* laptop screen, tilted open */}
      <mesh position={[0.55, -0.15, -0.28]} rotation={[THREE.MathUtils.degToRad(-25), 0, 0]}>
        <boxGeometry args={[1, 0.65, 0.05]} />
        <meshStandardMaterial color="#d7d9de" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh
        position={[0.55, -0.15, -0.255]}
        rotation={[THREE.MathUtils.degToRad(-25), 0, 0]}
      >
        <planeGeometry args={[0.86, 0.5]} />
        <meshStandardMaterial color="#0f1420" emissive="#274b7a" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

export default function BooksAndLaptop3D({ size = 64 }: { size?: number }) {
  return (
    <Icon3DStage size={size}>
      <BooksAndLaptop />
    </Icon3DStage>
  );
}
