"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { SpatialHash } from "@/lib/spatialHash";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const NODE_COUNT = 500;
const CONNECTION_THRESHOLD = 1.0;
const MOUSE_INFLUENCE_RADIUS = 1.8;
const MOUSE_CONNECTION_THRESHOLD = 1.5;
const MAX_CONNECTIONS = 1500;
const SPREAD_RADIUS = 5.5; // how far particles spread (fills screen)
const CENTER_DEAD_ZONE = 1.8; // no particles within this radius (keeps text clear)
const DRIFT = 0.15;
// Drift never moves a node more than DRIFT * 1.5 from its base position.
const WORLD_BOUND = SPREAD_RADIUS + DRIFT * 1.5 + 0.1;
const GOLD = "#FFD700";
const GOLD_VEC = new THREE.Color(GOLD);

const SHAPE_TYPES = 4;
// Node i is drawn with shape i % SHAPE_TYPES as instance floor(i / SHAPE_TYPES).
const INSTANCE_COUNTS = Array.from({ length: SHAPE_TYPES }, (_, s) =>
  Math.floor((NODE_COUNT - s + SHAPE_TYPES - 1) / SHAPE_TYPES)
);

/** Normalised pointer position (-1..1). Mutated in place, never re-rendered. */
export interface ScenePointer {
  x: number;
  y: number;
}

// ---------------------------------------------------------------------------
// Shape geometries (created once, reused)
// ---------------------------------------------------------------------------

function createCrossGeometry(): THREE.BufferGeometry {
  const arm = 0.03;
  const length = 0.06;
  const x = new THREE.BoxGeometry(length, arm * 0.5, arm * 0.5);
  const y = new THREE.BoxGeometry(arm * 0.5, length, arm * 0.5);
  const z = new THREE.BoxGeometry(arm * 0.5, arm * 0.5, length);
  const merged = mergeGeometries([x, y, z]);
  x.dispose();
  y.dispose();
  z.dispose();
  return merged!;
}

function createDiamondGeometry(): THREE.BufferGeometry {
  const top = new THREE.ConeGeometry(0.02, 0.04, 4);
  const bottom = new THREE.ConeGeometry(0.02, 0.04, 4);
  bottom.rotateX(Math.PI);
  bottom.translate(0, -0.04, 0);
  const merged = mergeGeometries([top, bottom]);
  top.dispose();
  bottom.dispose();
  return merged!;
}

// ---------------------------------------------------------------------------
// Per-frame state. Created lazily on the first frame (it needs Math.random,
// which must not run during render) and mutated in place afterwards so the
// animation loop never allocates.
// ---------------------------------------------------------------------------

interface DataPulse {
  origin: THREE.Vector3;
  startTime: number;
  speed: number;
  maxRadius: number;
}

interface SceneState {
  time: number;
  basePositions: Float32Array;
  positions: Float32Array;
  seeds: Float32Array;
  pulsePhases: Float32Array;
  pulseRates: Float32Array;
  pulseBoost: Float32Array;
  hash: SpatialHash;
  neighbors: Int32Array;
  pulses: DataPulse[];
  nextPulseTime: number;
  // scratch objects
  matrix: THREE.Matrix4;
  pos: THREE.Vector3;
  scale: THREE.Vector3;
  quat: THREE.Quaternion;
  mouseWorld: THREE.Vector3;
  dir: THREE.Vector3;
}

function createSceneState(): SceneState {
  const basePositions = new Float32Array(NODE_COUNT * 3);
  const seeds = new Float32Array(NODE_COUNT * 3);
  const pulsePhases = new Float32Array(NODE_COUNT);
  const pulseRates = new Float32Array(NODE_COUNT);

  for (let i = 0; i < NODE_COUNT; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    // Distribute between dead zone and spread radius (ring/shell, not center)
    const r =
      CENTER_DEAD_ZONE +
      Math.cbrt(Math.random()) * (SPREAD_RADIUS - CENTER_DEAD_ZONE);

    basePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    basePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    basePositions[i * 3 + 2] = r * Math.cos(phi);

    seeds[i * 3] = Math.random() * 100;
    seeds[i * 3 + 1] = Math.random() * 100;
    seeds[i * 3 + 2] = Math.random() * 100;

    pulsePhases[i] = Math.random() * Math.PI * 2;
    pulseRates[i] = 0.5 + Math.random() * 1.5;
  }

  return {
    time: 0,
    basePositions,
    positions: new Float32Array(basePositions),
    seeds,
    pulsePhases,
    pulseRates,
    pulseBoost: new Float32Array(NODE_COUNT),
    hash: new SpatialHash(CONNECTION_THRESHOLD, -WORLD_BOUND, WORLD_BOUND, NODE_COUNT),
    neighbors: new Int32Array(NODE_COUNT),
    pulses: [],
    nextPulseTime: 3 + Math.random() * 2,
    matrix: new THREE.Matrix4(),
    pos: new THREE.Vector3(),
    scale: new THREE.Vector3(),
    quat: new THREE.Quaternion(),
    mouseWorld: new THREE.Vector3(),
    dir: new THREE.Vector3(),
  };
}

// ---------------------------------------------------------------------------
// Neural Network (rendered inside the Canvas)
// ---------------------------------------------------------------------------

interface NeuralNetworkProps {
  pointer: RefObject<ScenePointer>;
  reducedMotion: boolean;
}

function NeuralNetwork({ pointer, reducedMotion }: NeuralNetworkProps) {
  const groupRef = useRef<THREE.Group>(null);
  const instancedRefs = useRef<(THREE.InstancedMesh | null)[]>(
    Array.from({ length: SHAPE_TYPES }, () => null)
  );
  const stateRef = useRef<SceneState | null>(null);
  const { camera } = useThree();

  // --- GPU resources (deterministic, so safe to create during render) ---
  const shapeGeos = useMemo(
    () => [
      new THREE.TetrahedronGeometry(0.03, 0),
      new THREE.OctahedronGeometry(0.025, 0),
      createCrossGeometry(),
      createDiamondGeometry(),
    ],
    []
  );

  const shapeMaterials = useMemo(
    () =>
      shapeGeos.map(
        () =>
          new THREE.MeshBasicMaterial({
            color: GOLD_VEC,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          })
      ),
    [shapeGeos]
  );

  const lineGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const posArr = new Float32Array(MAX_CONNECTIONS * 2 * 3);
    const colArr = new Float32Array(MAX_CONNECTIONS * 2 * 3);
    geo.setAttribute("position", new THREE.Float32BufferAttribute(posArr, 3));
    geo.setAttribute("color", new THREE.Float32BufferAttribute(colArr, 3));
    geo.setDrawRange(0, 0);
    return geo;
  }, []);

  const lineMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  useEffect(
    () => () => {
      shapeGeos.forEach((g) => g.dispose());
      shapeMaterials.forEach((m) => m.dispose());
      lineGeo.dispose();
      lineMat.dispose();
    },
    [shapeGeos, shapeMaterials, lineGeo, lineMat]
  );

  // ------------------------------------------------------------------
  // Animation loop
  // ------------------------------------------------------------------

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const s = (stateRef.current ??= createSceneState());
    // Own clock: R3F resets its clock whenever the frameloop is toggled, and a
    // capped delta means a paused tab never produces a jump.
    const dt = Math.min(delta, 0.1);
    s.time += dt;
    const time = s.time;
    const {
      basePositions,
      positions,
      seeds,
      pulsePhases,
      pulseRates,
      pulseBoost,
      neighbors,
      mouseWorld,
    } = s;

    // --- 1. Drift animation (skip if reduced motion) ---
    if (!reducedMotion) {
      for (let i = 0; i < NODE_COUNT; i++) {
        const i3 = i * 3;
        const sx = seeds[i3];
        const sy = seeds[i3 + 1];
        const sz = seeds[i3 + 2];

        positions[i3] =
          basePositions[i3] +
          Math.sin(time * 0.3 + sx) * DRIFT +
          Math.cos(time * 0.5 + sz) * DRIFT * 0.5;
        positions[i3 + 1] =
          basePositions[i3 + 1] +
          Math.cos(time * 0.4 + sy) * DRIFT +
          Math.sin(time * 0.6 + sx) * DRIFT * 0.5;
        positions[i3 + 2] =
          basePositions[i3 + 2] +
          Math.sin(time * 0.35 + sz) * DRIFT +
          Math.cos(time * 0.45 + sy) * DRIFT * 0.5;
      }
    } else {
      positions.set(basePositions);
    }

    // --- 2. Mouse → world position (on the z = 0 plane) ---
    const mouseX = pointer.current?.x ?? 0;
    const mouseY = pointer.current?.y ?? 0;
    s.dir.set(mouseX, mouseY, 0.5).unproject(camera);
    s.dir.sub(camera.position).normalize();
    const dist = -camera.position.z / s.dir.z;
    mouseWorld.copy(camera.position).add(s.dir.multiplyScalar(dist));

    // --- 3. Rebuild spatial hash ---
    s.hash.build(positions, NODE_COUNT);

    // --- 4. Compute connection lines ---
    const linePosAttr = lineGeo.getAttribute("position") as THREE.BufferAttribute;
    const lineColAttr = lineGeo.getAttribute("color") as THREE.BufferAttribute;
    const linePos = linePosAttr.array as Float32Array;
    const lineCol = lineColAttr.array as Float32Array;
    const mouseRadiusSq = MOUSE_INFLUENCE_RADIUS * MOUSE_INFLUENCE_RADIUS;
    let lineCount = 0;

    for (let i = 0; i < NODE_COUNT && lineCount < MAX_CONNECTIONS; i++) {
      const i3 = i * 3;
      const ix = positions[i3];
      const iy = positions[i3 + 1];
      const iz = positions[i3 + 2];

      const dxm = ix - mouseWorld.x;
      const dym = iy - mouseWorld.y;
      const dzm = iz - mouseWorld.z;
      const nearMouse = dxm * dxm + dym * dym + dzm * dzm < mouseRadiusSq;

      const threshold = nearMouse
        ? MOUSE_CONNECTION_THRESHOLD
        : CONNECTION_THRESHOLD;
      const thresholdSq = threshold * threshold;

      // Each node lives in exactly one cell and every cell is visited once, so
      // a neighbour can only appear once per query; `j <= i` removes mirrors.
      const n = s.hash.queryRadius(ix, iy, iz, threshold, neighbors);

      for (let k = 0; k < n && lineCount < MAX_CONNECTIONS; k++) {
        const j = neighbors[k];
        if (j <= i) continue;

        const j3 = j * 3;
        const jx = positions[j3];
        const jy = positions[j3 + 1];
        const jz = positions[j3 + 2];

        const dx = ix - jx;
        const dy = iy - jy;
        const dz = iz - jz;
        const dSq = dx * dx + dy * dy + dz * dz;
        if (dSq > thresholdSq) continue;

        // Alpha based on distance and mouse proximity
        const baseAlpha = 1 - Math.sqrt(dSq) / threshold;
        const alpha = nearMouse ? baseAlpha : baseAlpha * 0.4;

        const r = GOLD_VEC.r * alpha;
        const g = GOLD_VEC.g * alpha;
        const b = GOLD_VEC.b * alpha;

        const off = lineCount * 6;
        linePos[off] = ix;
        linePos[off + 1] = iy;
        linePos[off + 2] = iz;
        linePos[off + 3] = jx;
        linePos[off + 4] = jy;
        linePos[off + 5] = jz;

        lineCol[off] = r;
        lineCol[off + 1] = g;
        lineCol[off + 2] = b;
        lineCol[off + 3] = r;
        lineCol[off + 4] = g;
        lineCol[off + 5] = b;

        lineCount++;
      }
    }

    lineGeo.setDrawRange(0, lineCount * 2);
    linePosAttr.needsUpdate = true;
    lineColAttr.needsUpdate = true;

    // --- 5. Data pulse waves (skip if reduced motion) ---
    if (!reducedMotion) {
      if (time > s.nextPulseTime) {
        const originIdx = Math.floor(Math.random() * NODE_COUNT);
        s.pulses.push({
          origin: new THREE.Vector3(
            positions[originIdx * 3],
            positions[originIdx * 3 + 1],
            positions[originIdx * 3 + 2]
          ),
          startTime: time,
          speed: 2.0,
          maxRadius: 4.0,
        });
        s.nextPulseTime = time + 3 + Math.random() * 2;
      }

      // Process active pulses, compacting finished ones out in place
      let live = 0;
      for (let p = 0; p < s.pulses.length; p++) {
        const pulse = s.pulses[p];
        const radius = (time - pulse.startTime) * pulse.speed;
        if (radius > pulse.maxRadius) continue;
        s.pulses[live++] = pulse;

        const ox = pulse.origin.x;
        const oy = pulse.origin.y;
        const oz = pulse.origin.z;
        for (let i = 0; i < NODE_COUNT; i++) {
          const i3 = i * 3;
          const dx = positions[i3] - ox;
          const dy = positions[i3 + 1] - oy;
          const dz = positions[i3 + 2] - oz;
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (Math.abs(d - radius) < 0.3 && pulseBoost[i] < 1.5) {
            pulseBoost[i] = 1.5;
          }
        }
      }
      s.pulses.length = live;

      // Decay pulse boost
      for (let i = 0; i < NODE_COUNT; i++) {
        pulseBoost[i] *= 0.95;
        if (pulseBoost[i] < 0.01) pulseBoost[i] = 0;
      }
    }

    // --- 6. Update instanced meshes ---
    for (let shape = 0; shape < SHAPE_TYPES; shape++) {
      const mesh = instancedRefs.current[shape];
      if (!mesh) continue;

      const count = INSTANCE_COUNTS[shape];
      for (let inst = 0; inst < count; inst++) {
        const ni = inst * SHAPE_TYPES + shape;
        const i3 = ni * 3;

        s.pos.set(positions[i3], positions[i3 + 1], positions[i3 + 2]);

        // Scale: base + synapse pulse + data pulse boost
        const synapsePulse = reducedMotion
          ? 1
          : 0.8 + 0.4 * Math.sin(time * pulseRates[ni] + pulsePhases[ni]);
        const scale = synapsePulse * (1 + pulseBoost[ni]);
        s.scale.set(scale, scale, scale);

        s.matrix.compose(s.pos, s.quat, s.scale);
        mesh.setMatrixAt(inst, s.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }

    // --- 7. Mouse parallax on outer group ---
    if (!reducedMotion) {
      const targetRotX = mouseY * 0.15;
      const targetRotY = mouseX * 0.15;
      group.rotation.x += (targetRotX - group.rotation.x) * 2 * dt;
      group.rotation.y += (targetRotY - group.rotation.y) * 2 * dt;
    }
  });

  return (
    <group ref={groupRef}>
      <Float
        speed={reducedMotion ? 0 : 1.5}
        rotationIntensity={reducedMotion ? 0 : 0.2}
        floatIntensity={reducedMotion ? 0 : 0.3}
      >
        {/* Instanced shape meshes */}
        {shapeGeos.map((geo, idx) => (
          <instancedMesh
            key={idx}
            ref={(el) => {
              instancedRefs.current[idx] = el;
            }}
            args={[geo, shapeMaterials[idx], INSTANCE_COUNTS[idx]]}
            frustumCulled={false}
          />
        ))}

        {/* Connection lines */}
        <lineSegments geometry={lineGeo} material={lineMat} />
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
  /** Shared, mutable pointer position so mouse moves never re-render React. */
  pointer: RefObject<ScenePointer>;
  /**
   * When false the scene renders only when something changes (a resize, the
   * initial frame) instead of every animation frame. Used while the scene is
   * hidden behind the loading screen or scrolled out of view.
   */
  active?: boolean;
  className?: string;
  reducedMotion?: boolean;
}

export function HeroScene({
  pointer,
  active = true,
  className,
  reducedMotion = false,
}: HeroSceneProps) {
  return (
    <div className={`absolute inset-0 ${className ?? ""}`}>
      <Canvas
        frameloop={active ? "always" : "demand"}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5], fov: 75 }}
      >
        <Lights />
        <NeuralNetwork pointer={pointer} reducedMotion={reducedMotion} />
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
      </Canvas>
    </div>
  );
}

export default HeroScene;
