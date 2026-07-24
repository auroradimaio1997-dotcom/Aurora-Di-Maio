"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Icon3DStage from "./Icon3DStage";

/**
 * A wax notary seal built from primitives — a ribbed disc of "wax" with a
 * raised ring and star, hanging from two ribbon tails. Slowly turns in
 * place so it reads as a real 3D object, not a flat icon.
 */
function Seal() {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.6;
  });

  const wax = (
    <meshStandardMaterial color="#7a1220" metalness={0.15} roughness={0.35} />
  );
  const gold = (
    <meshStandardMaterial color="#d4af37" metalness={0.7} roughness={0.3} />
  );
  const ribbon = (
    <meshStandardMaterial color="#8c1c3a" roughness={0.6} side={THREE.DoubleSide} />
  );

  return (
    <group ref={group}>
      {/* ribbon tails behind the seal */}
      <mesh position={[-0.35, -0.9, -0.15]} rotation={[0, 0, 0.35]}>
        <planeGeometry args={[0.4, 1.2]} />
        {ribbon}
      </mesh>
      <mesh position={[0.35, -0.9, -0.15]} rotation={[0, 0, -0.35]}>
        <planeGeometry args={[0.4, 1.2]} />
        {ribbon}
      </mesh>

      {/* wax disc */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1, 1, 0.3, 48]} />
        {wax}
      </mesh>
      {/* raised rim */}
      <mesh position={[0, 0, 0.16]}>
        <torusGeometry args={[0.85, 0.08, 16, 48]} />
        {gold}
      </mesh>
      {/* central star emblem */}
      <mesh position={[0, 0, 0.2]}>
        <coneGeometry args={[0.32, 0.18, 5]} />
        {gold}
      </mesh>
    </group>
  );
}

export default function NotarySeal3D({ size = 64 }: { size?: number }) {
  return (
    <Icon3DStage size={size}>
      <Seal />
    </Icon3DStage>
  );
}
