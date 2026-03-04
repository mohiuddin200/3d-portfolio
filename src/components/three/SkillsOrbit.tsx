"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import * as THREE from "three";

const GOLD = "#FFD700";

function RotatingIcosahedron() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.3;
    meshRef.current.rotation.y += delta * 0.5;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.8, 1]} />
      <meshStandardMaterial
        color={GOLD}
        wireframe
        emissive={GOLD}
        emissiveIntensity={0.3}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color={GOLD} />
      <pointLight position={[-5, -3, 2]} intensity={0.4} color="#ffffff" />
    </>
  );
}

interface SkillsOrbitProps {
  className?: string;
}

export default function SkillsOrbit({ className }: SkillsOrbitProps) {
  return (
    <div className={`w-full h-full ${className ?? ""}`}>
      <Canvas
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5], fov: 60 }}
      >
        <Lights />
        <RotatingIcosahedron />
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
      </Canvas>
    </div>
  );
}
