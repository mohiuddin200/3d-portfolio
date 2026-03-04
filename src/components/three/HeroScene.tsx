"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  PointMaterial,
  Float,
  AdaptiveDpr,
  AdaptiveEvents,
} from "@react-three/drei";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PARTICLE_COUNT = 1500;
const GOLD = "#FFD700";

// ---------------------------------------------------------------------------
// Particle cloud (rendered inside the Canvas)
// ---------------------------------------------------------------------------

interface ParticleCloudProps {
  mouseX: number;
  mouseY: number;
}

function ParticleCloud({ mouseX, mouseY }: ParticleCloudProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Store the base (initial) positions so the animation can oscillate around
  // them without accumulating drift.
  const basePositions = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Sphere distribution using rejection sampling for uniformity
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      // Cube-root for uniform volume distribution
      const r = Math.cbrt(Math.random()) * 2.5;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }

    return positions;
  }, []);

  // Per-particle random seeds so every particle moves uniquely.
  const seeds = useMemo(() => {
    const s = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < s.length; i++) {
      s[i] = Math.random() * 100;
    }
    return s;
  }, []);

  // Create the geometry once.
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    // Clone base positions so the attribute has its own buffer to mutate.
    const positions = new Float32Array(basePositions);
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    return geo;
  }, [basePositions]);

  // ------------------------------------------------------------------
  // Animation loop
  // ------------------------------------------------------------------

  useFrame((_state, delta) => {
    const points = pointsRef.current;
    const group = groupRef.current;
    if (!points || !group) return;

    // --- Mouse parallax on the outer group ---
    const targetRotX = mouseY * 0.15;
    const targetRotY = mouseX * 0.15;
    group.rotation.x += (targetRotX - group.rotation.x) * 2 * delta;
    group.rotation.y += (targetRotY - group.rotation.y) * 2 * delta;

    // --- Particle morphing / swirling ---
    const posAttr = points.geometry.getAttribute(
      "position"
    ) as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    const time = _state.clock.elapsedTime;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const sx = seeds[i3];
      const sy = seeds[i3 + 1];
      const sz = seeds[i3 + 2];

      // Organic displacement using layered sin/cos at different frequencies
      const drift = 0.15;
      arr[i3] =
        basePositions[i3] +
        Math.sin(time * 0.3 + sx) * drift +
        Math.cos(time * 0.5 + sz) * drift * 0.5;
      arr[i3 + 1] =
        basePositions[i3 + 1] +
        Math.cos(time * 0.4 + sy) * drift +
        Math.sin(time * 0.6 + sx) * drift * 0.5;
      arr[i3 + 2] =
        basePositions[i3 + 2] +
        Math.sin(time * 0.35 + sz) * drift +
        Math.cos(time * 0.45 + sy) * drift * 0.5;
    }

    posAttr.needsUpdate = true;

    // Slow overall rotation for the galaxy swirl
    points.rotation.y += delta * 0.04;
    points.rotation.x += delta * 0.015;
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <points ref={pointsRef} geometry={geometry}>
          <PointMaterial
            transparent
            color={GOLD}
            size={0.025}
            sizeAttenuation
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </Float>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Lights
// ---------------------------------------------------------------------------

function Lights() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[5, 5, 5]} intensity={0.6} color={GOLD} />
      <pointLight position={[-5, -3, 2]} intensity={0.3} color="#ffffff" />
    </>
  );
}

// ---------------------------------------------------------------------------
// Exported HeroScene wrapper
// ---------------------------------------------------------------------------

interface HeroSceneProps {
  mouseX?: number;
  mouseY?: number;
  className?: string;
}

export function HeroScene({
  mouseX = 0,
  mouseY = 0,
  className,
}: HeroSceneProps) {
  return (
    <div className={`absolute inset-0 ${className ?? ""}`}>
      <Canvas
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5], fov: 75 }}
      >
        <Lights />
        <ParticleCloud mouseX={mouseX} mouseY={mouseY} />
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
      </Canvas>
    </div>
  );
}

export default HeroScene;
