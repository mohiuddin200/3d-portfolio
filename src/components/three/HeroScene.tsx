"use client";

import { useRef, useMemo, useCallback } from "react";
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
const GOLD = "#FFD700";
const GOLD_VEC = new THREE.Color(GOLD);

// Shape type counts (~225 each)
const SHAPES_PER_TYPE = Math.floor(NODE_COUNT / 4);
const SHAPE_TYPES = 4;

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
// Data pulse type
// ---------------------------------------------------------------------------

interface DataPulse {
  origin: THREE.Vector3;
  startTime: number;
  speed: number;
  maxRadius: number;
}

// ---------------------------------------------------------------------------
// Neural Network (rendered inside the Canvas)
// ---------------------------------------------------------------------------

interface NeuralNetworkProps {
  mouseX: number;
  mouseY: number;
  reducedMotion: boolean;
}

function NeuralNetwork({ mouseX, mouseY, reducedMotion }: NeuralNetworkProps) {
  const groupRef = useRef<THREE.Group>(null);
  const lineSegRef = useRef<THREE.LineSegments>(null);
  const { camera } = useThree();

  // --- Stable data (computed once) ---
  const stableData = useMemo(() => {
    const basePositions = new Float32Array(NODE_COUNT * 3);
    const seeds = new Float32Array(NODE_COUNT * 3);
    const shapeAssignments = new Uint8Array(NODE_COUNT);
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

      shapeAssignments[i] = i % SHAPE_TYPES;
      pulsePhases[i] = Math.random() * Math.PI * 2;
      pulseRates[i] = 0.5 + Math.random() * 1.5;
    }

    return { basePositions, seeds, shapeAssignments, pulsePhases, pulseRates };
  }, []);

  // Current positions (mutated each frame)
  const positions = useMemo(
    () => new Float32Array(stableData.basePositions),
    [stableData]
  );

  // Spatial hash for neighbor lookups
  const spatialHash = useMemo(() => new SpatialHash(CONNECTION_THRESHOLD), []);

  // Per-node scale boost from data pulses (decays each frame)
  const pulseBoost = useMemo(() => new Float32Array(NODE_COUNT), []);

  // Data pulse state
  const pulsesRef = useRef<DataPulse[]>([]);
  const nextPulseTimeRef = useRef(3 + Math.random() * 2);

  // Temp objects for matrix composition (avoid allocation in loop)
  const tmpMatrix = useMemo(() => new THREE.Matrix4(), []);
  const tmpPos = useMemo(() => new THREE.Vector3(), []);
  const tmpScale = useMemo(() => new THREE.Vector3(), []);
  const tmpQuat = useMemo(() => new THREE.Quaternion(), []);
  const mouseWorld = useMemo(() => new THREE.Vector3(), []);
  const tmpDir = useMemo(() => new THREE.Vector3(), []);

  // --- Shape geometries & instanced meshes ---
  const shapeGeos = useMemo(() => {
    const tetra = new THREE.TetrahedronGeometry(0.03, 0);
    const octa = new THREE.OctahedronGeometry(0.025, 0);
    const cross = createCrossGeometry();
    const diamond = createDiamondGeometry();
    return [tetra, octa, cross, diamond];
  }, []);

  const shapeMaterials = useMemo(() => {
    return shapeGeos.map(
      () =>
        new THREE.MeshBasicMaterial({
          color: GOLD_VEC,
          transparent: true,
          opacity: 0.7,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
    );
  }, [shapeGeos]);

  // Refs for the 4 instanced meshes
  const instancedRefs = useRef<(THREE.InstancedMesh | null)[]>([
    null,
    null,
    null,
    null,
  ]);

  // Store ref callback
  const setInstancedRef = useCallback(
    (index: number) => (el: THREE.InstancedMesh | null) => {
      instancedRefs.current[index] = el;
    },
    []
  );

  // --- Connection line geometry (pre-allocated) ---
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

  // Count instances per shape type
  const instanceCounts = useMemo(() => {
    const counts = [0, 0, 0, 0];
    for (let i = 0; i < NODE_COUNT; i++) {
      counts[stableData.shapeAssignments[i]]++;
    }
    return counts;
  }, [stableData]);

  // Map: for each shape type, which global node indices belong to it
  const shapeNodeIndices = useMemo(() => {
    const indices: number[][] = [[], [], [], []];
    for (let i = 0; i < NODE_COUNT; i++) {
      indices[stableData.shapeAssignments[i]].push(i);
    }
    return indices;
  }, [stableData]);

  // ------------------------------------------------------------------
  // Animation loop
  // ------------------------------------------------------------------

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const time = state.clock.elapsedTime;
    const {
      basePositions,
      seeds,
      pulsePhases,
      pulseRates,
    } = stableData;

    // --- 1. Drift animation (skip if reduced motion) ---
    if (!reducedMotion) {
      for (let i = 0; i < NODE_COUNT; i++) {
        const i3 = i * 3;
        const sx = seeds[i3];
        const sy = seeds[i3 + 1];
        const sz = seeds[i3 + 2];
        const drift = 0.15;

        positions[i3] =
          basePositions[i3] +
          Math.sin(time * 0.3 + sx) * drift +
          Math.cos(time * 0.5 + sz) * drift * 0.5;
        positions[i3 + 1] =
          basePositions[i3 + 1] +
          Math.cos(time * 0.4 + sy) * drift +
          Math.sin(time * 0.6 + sx) * drift * 0.5;
        positions[i3 + 2] =
          basePositions[i3 + 2] +
          Math.sin(time * 0.35 + sz) * drift +
          Math.cos(time * 0.45 + sy) * drift * 0.5;
      }
    } else {
      // Static: just use base positions
      positions.set(basePositions);
    }

    // --- 2. Mouse → world position ---
    tmpDir.set(mouseX, mouseY, 0.5).unproject(camera);
    tmpDir.sub(camera.position).normalize();
    const dist = -camera.position.z / tmpDir.z;
    mouseWorld
      .copy(camera.position)
      .add(tmpDir.multiplyScalar(dist));

    // --- 3. Rebuild spatial hash ---
    spatialHash.clear();
    for (let i = 0; i < NODE_COUNT; i++) {
      spatialHash.insert(
        i,
        positions[i * 3],
        positions[i * 3 + 1],
        positions[i * 3 + 2]
      );
    }

    // --- 4. Compute connection lines ---
    const linePosAttr = lineGeo.getAttribute(
      "position"
    ) as THREE.BufferAttribute;
    const lineColAttr = lineGeo.getAttribute("color") as THREE.BufferAttribute;
    const linePos = linePosAttr.array as Float32Array;
    const lineCol = lineColAttr.array as Float32Array;
    let lineCount = 0;

    // Track visited pairs to avoid duplicates
    const visited = new Set<string>();

    for (let i = 0; i < NODE_COUNT && lineCount < MAX_CONNECTIONS; i++) {
      const ix = positions[i * 3];
      const iy = positions[i * 3 + 1];
      const iz = positions[i * 3 + 2];

      // Distance from this node to mouse
      const dxm = ix - mouseWorld.x;
      const dym = iy - mouseWorld.y;
      const dzm = iz - mouseWorld.z;
      const distToMouse = Math.sqrt(dxm * dxm + dym * dym + dzm * dzm);
      const nearMouse = distToMouse < MOUSE_INFLUENCE_RADIUS;

      const threshold = nearMouse
        ? MOUSE_CONNECTION_THRESHOLD
        : CONNECTION_THRESHOLD;

      const neighbors = spatialHash.queryRadius(ix, iy, iz, threshold);

      for (let n = 0; n < neighbors.length && lineCount < MAX_CONNECTIONS; n++) {
        const j = neighbors[n];
        if (j <= i) continue;

        const pairKey = i < j ? `${i},${j}` : `${j},${i}`;
        if (visited.has(pairKey)) continue;

        const jx = positions[j * 3];
        const jy = positions[j * 3 + 1];
        const jz = positions[j * 3 + 2];

        const dx = ix - jx;
        const dy = iy - jy;
        const dz = iz - jz;
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (d > threshold) continue;

        visited.add(pairKey);

        // Alpha based on distance and mouse proximity
        const baseAlpha = 1 - d / threshold;
        const alpha = nearMouse ? baseAlpha * 1.0 : baseAlpha * 0.4;

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
      // Trigger new pulse
      if (time > nextPulseTimeRef.current) {
        const originIdx = Math.floor(Math.random() * NODE_COUNT);
        pulsesRef.current.push({
          origin: new THREE.Vector3(
            positions[originIdx * 3],
            positions[originIdx * 3 + 1],
            positions[originIdx * 3 + 2]
          ),
          startTime: time,
          speed: 2.0,
          maxRadius: 4.0,
        });
        nextPulseTimeRef.current = time + 3 + Math.random() * 2;
      }

      // Process active pulses
      const activePulses: DataPulse[] = [];
      for (const pulse of pulsesRef.current) {
        const elapsed = time - pulse.startTime;
        const radius = elapsed * pulse.speed;
        if (radius > pulse.maxRadius) continue;
        activePulses.push(pulse);

        for (let i = 0; i < NODE_COUNT; i++) {
          const dx = positions[i * 3] - pulse.origin.x;
          const dy = positions[i * 3 + 1] - pulse.origin.y;
          const dz = positions[i * 3 + 2] - pulse.origin.z;
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (Math.abs(d - radius) < 0.3) {
            pulseBoost[i] = Math.max(pulseBoost[i], 1.5);
          }
        }
      }
      pulsesRef.current = activePulses;

      // Decay pulse boost
      for (let i = 0; i < NODE_COUNT; i++) {
        pulseBoost[i] *= 0.95;
        if (pulseBoost[i] < 0.01) pulseBoost[i] = 0;
      }
    }

    // --- 6. Update instanced meshes ---
    for (let s = 0; s < SHAPE_TYPES; s++) {
      const mesh = instancedRefs.current[s];
      if (!mesh) continue;

      const nodeIndices = shapeNodeIndices[s];
      for (let inst = 0; inst < nodeIndices.length; inst++) {
        const ni = nodeIndices[inst];
        const i3 = ni * 3;

        tmpPos.set(positions[i3], positions[i3 + 1], positions[i3 + 2]);

        // Scale: base + synapse pulse + data pulse boost
        const synapsePulse = reducedMotion
          ? 1
          : 0.8 +
            0.4 * Math.sin(time * pulseRates[ni] + pulsePhases[ni]);
        const boost = 1 + pulseBoost[ni];
        const scale = synapsePulse * boost;
        tmpScale.set(scale, scale, scale);

        tmpMatrix.compose(tmpPos, tmpQuat, tmpScale);
        mesh.setMatrixAt(inst, tmpMatrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }

    // --- 7. Mouse parallax on outer group ---
    if (!reducedMotion) {
      const targetRotX = mouseY * 0.15;
      const targetRotY = mouseX * 0.15;
      group.rotation.x += (targetRotX - group.rotation.x) * 2 * delta;
      group.rotation.y += (targetRotY - group.rotation.y) * 2 * delta;
    }

    // --- 8. Slow overall rotation ---
    if (!reducedMotion && lineSegRef.current) {
      // Apply to the inner content group (instanced meshes rotate with lines)
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
            ref={setInstancedRef(idx)}
            args={[geo, shapeMaterials[idx], instanceCounts[idx]]}
            frustumCulled={false}
          />
        ))}

        {/* Connection lines */}
        <lineSegments ref={lineSegRef} geometry={lineGeo} material={lineMat} />
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
  reducedMotion?: boolean;
}

export function HeroScene({
  mouseX = 0,
  mouseY = 0,
  className,
  reducedMotion = false,
}: HeroSceneProps) {
  return (
    <div className={`absolute inset-0 ${className ?? ""}`}>
      <Canvas
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5], fov: 75 }}
      >
        <Lights />
        <NeuralNetwork
          mouseX={mouseX}
          mouseY={mouseY}
          reducedMotion={reducedMotion}
        />
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
      </Canvas>
    </div>
  );
}

export default HeroScene;
