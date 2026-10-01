"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import * as THREE from "three";
import type { ScenePointer } from "@/components/three/HeroScene";

const DEBRIS_COUNT = 140;
const SPREAD = 7;
const MOUSE_SCATTER_RADIUS = 2.2;
const MOUSE_SCATTER_FORCE = 1.4;
const GOLD = "#FFD700";
const GOLD_VEC = new THREE.Color(GOLD);

// Created lazily on the first frame (Math.random must not run during render)
// and mutated in place afterwards.
interface DebrisState {
  base: Float32Array;
  seeds: Float32Array;
  rotSeeds: Float32Array;
  scales: Float32Array;
  offsets: Float32Array;
  matrix: THREE.Matrix4;
  pos: THREE.Vector3;
  quat: THREE.Quaternion;
  scale: THREE.Vector3;
  euler: THREE.Euler;
  mouseWorld: THREE.Vector3;
  dir: THREE.Vector3;
}

function createDebrisState(): DebrisState {
  const base = new Float32Array(DEBRIS_COUNT * 3);
  const seeds = new Float32Array(DEBRIS_COUNT * 3);
  const rotSeeds = new Float32Array(DEBRIS_COUNT * 3);
  const scales = new Float32Array(DEBRIS_COUNT);
  for (let i = 0; i < DEBRIS_COUNT; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 2.2 + Math.cbrt(Math.random()) * (SPREAD - 2.2);
    base[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    base[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    base[i * 3 + 2] = r * Math.cos(phi);
    seeds[i * 3] = Math.random() * 100;
    seeds[i * 3 + 1] = Math.random() * 100;
    seeds[i * 3 + 2] = Math.random() * 100;
    rotSeeds[i * 3] = Math.random() * Math.PI * 2;
    rotSeeds[i * 3 + 1] = Math.random() * Math.PI * 2;
    rotSeeds[i * 3 + 2] = Math.random() * Math.PI * 2;
    scales[i] = 0.6 + Math.random() * 0.9;
  }
  return {
    base,
    seeds,
    rotSeeds,
    scales,
    offsets: new Float32Array(DEBRIS_COUNT * 3),
    matrix: new THREE.Matrix4(),
    pos: new THREE.Vector3(),
    quat: new THREE.Quaternion(),
    scale: new THREE.Vector3(),
    euler: new THREE.Euler(),
    mouseWorld: new THREE.Vector3(),
    dir: new THREE.Vector3(),
  };
}

interface DebrisFieldProps {
  pointer: RefObject<ScenePointer>;
  reducedMotion: boolean;
}

function DebrisField({ pointer, reducedMotion }: DebrisFieldProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const stateRef = useRef<DebrisState | null>(null);
  const { camera } = useThree();

  const geo = useMemo(() => new THREE.TetrahedronGeometry(0.08, 0), []);
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: GOLD_VEC,
        emissive: GOLD_VEC,
        emissiveIntensity: 0.6,
        metalness: 0.4,
        roughness: 0.3,
        transparent: true,
        opacity: 0.85,
      }),
    []
  );

  useEffect(
    () => () => {
      geo.dispose();
      mat.dispose();
    },
    [geo, mat]
  );

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const s = (stateRef.current ??= createDebrisState());
    const time = state.clock.elapsedTime;
    const { base, seeds, rotSeeds, scales, offsets, mouseWorld } = s;

    const mouseX = pointer.current?.x ?? 0;
    const mouseY = pointer.current?.y ?? 0;
    s.dir.set(mouseX, mouseY, 0.5).unproject(camera);
    s.dir.sub(camera.position).normalize();
    const dist = -camera.position.z / s.dir.z;
    mouseWorld.copy(camera.position).add(s.dir.multiplyScalar(dist));

    for (let i = 0; i < DEBRIS_COUNT; i++) {
      const i3 = i * 3;
      const sx = seeds[i3];
      const sy = seeds[i3 + 1];
      const sz = seeds[i3 + 2];

      let bx = base[i3];
      let by = base[i3 + 1];
      let bz = base[i3 + 2];

      if (!reducedMotion) {
        const drift = 0.2;
        bx += Math.sin(time * 0.3 + sx) * drift;
        by += Math.cos(time * 0.4 + sy) * drift;
        bz += Math.sin(time * 0.35 + sz) * drift * 0.6;
      }

      let ox = offsets[i3];
      let oy = offsets[i3 + 1];
      let oz = offsets[i3 + 2];

      if (!reducedMotion) {
        const cx = bx + ox;
        const cy = by + oy;
        const cz = bz + oz;
        const dx = cx - mouseWorld.x;
        const dy = cy - mouseWorld.y;
        const dz = cz - mouseWorld.z;
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (d < MOUSE_SCATTER_RADIUS && d > 0.001) {
          const strength =
            (1 - d / MOUSE_SCATTER_RADIUS) * MOUSE_SCATTER_FORCE * delta * 4;
          ox += (dx / d) * strength;
          oy += (dy / d) * strength;
          oz += (dz / d) * strength;
        }

        const springBack = Math.min(1, delta * 1.6);
        ox += -ox * springBack;
        oy += -oy * springBack;
        oz += -oz * springBack;

        offsets[i3] = ox;
        offsets[i3 + 1] = oy;
        offsets[i3 + 2] = oz;
      }

      s.pos.set(bx + ox, by + oy, bz + oz);

      if (!reducedMotion) {
        s.euler.set(
          rotSeeds[i3] + time * 0.3,
          rotSeeds[i3 + 1] + time * 0.4,
          rotSeeds[i3 + 2] + time * 0.2
        );
      } else {
        s.euler.set(rotSeeds[i3], rotSeeds[i3 + 1], rotSeeds[i3 + 2]);
      }
      s.quat.setFromEuler(s.euler);

      const sc = scales[i];
      s.scale.set(sc, sc, sc);
      s.matrix.compose(s.pos, s.quat, s.scale);
      mesh.setMatrixAt(i, s.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <Float
      speed={reducedMotion ? 0 : 1.2}
      rotationIntensity={reducedMotion ? 0 : 0.2}
      floatIntensity={reducedMotion ? 0 : 0.4}
    >
      <instancedMesh
        ref={meshRef}
        args={[geo, mat, DEBRIS_COUNT]}
        frustumCulled={false}
      />
    </Float>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color={GOLD} />
      <pointLight position={[-5, -3, 2]} intensity={0.4} color="#ffffff" />
    </>
  );
}

interface Lost404SceneProps {
  /** Shared, mutable pointer position so mouse moves never re-render React. */
  pointer: RefObject<ScenePointer>;
  reducedMotion?: boolean;
}

export function Lost404Scene({
  pointer,
  reducedMotion = false,
}: Lost404SceneProps) {
  return (
    <div className="absolute inset-0">
      <Canvas
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 8], fov: 60 }}
      >
        <Lights />
        <DebrisField pointer={pointer} reducedMotion={reducedMotion} />
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
      </Canvas>
    </div>
  );
}

export default Lost404Scene;
