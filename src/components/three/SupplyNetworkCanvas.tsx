"use client";

// ============================================================
// SupplyNetworkCanvas — Three.js 3D supplier network rendered
// inside a <Canvas> (React Three Fiber).
//
// Structure:
//   • 33 nodes scattered across a 3D ellipsoid — matching the
//     real SNOE data (5 plants, 10 T1, 10 T2, 8 T3 suppliers).
//   • 72 edges drawn as Line2 segments connecting tiers.
//   • Every 8 seconds a "disruption" fires: one random node
//     turns red and the risk cascades to its connected nodes.
//   • Mouse movement tilts the entire scene slightly for a
//     parallax depth effect.
// ============================================================

import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import * as THREE from "three";

// ── Data model ──────────────────────────────────────────────

// Node tiers — each maps to a depth layer and color
type Tier = "plant" | "t1" | "t2" | "t3";

interface NetworkNode {
  id: number;
  tier: Tier;
  position: [number, number, number];
  // 0 = healthy, 1 = warning, 2 = critical  (set dynamically)
  riskLevel: number;
}

interface NetworkEdge {
  from: number; // node id
  to: number;
}

// ── Build the node/edge data ─────────────────────────────────

// Creates nodes arranged in concentric ellipsoidal shells:
//   Plants at center, T1 around them, T2 further, T3 outermost.
function buildNetworkData(): { nodes: NetworkNode[]; edges: NetworkEdge[] } {
  const nodes: NetworkNode[] = [];
  let id = 0;

  // Helper — place `count` nodes evenly on a circle at radius r,
  // with a small random z-offset for 3D depth.
  function ring(
    tier: Tier,
    count: number,
    radius: number,
    zSpread: number
  ) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      // Slight random jitter so nodes don't look too mechanical
      const jitter = () => (Math.random() - 0.5) * 0.8;
      nodes.push({
        id: id++,
        tier,
        riskLevel: 0,
        position: [
          Math.cos(angle) * radius + jitter(),
          Math.sin(angle) * radius + jitter(),
          (Math.random() - 0.5) * zSpread,
        ],
      });
    }
  }

  ring("plant",  5,  0,   1);   // 5 plants  — center cluster
  ring("t1",    10,  4,   2);   // 10 Tier-1 — inner ring
  ring("t2",    10,  8,   3);   // 10 Tier-2 — mid ring
  ring("t3",     8, 12,   4);   // 8  Tier-3 — outer ring

  // Connect each plant to ~2 T1 nodes, each T1 to ~1-2 T2, etc.
  const edges: NetworkEdge[] = [];
  const byTier = (t: Tier) => nodes.filter((n) => n.tier === t);

  const plants = byTier("plant");
  const t1s    = byTier("t1");
  const t2s    = byTier("t2");
  const t3s    = byTier("t3");

  // Plant → T1
  plants.forEach((p) => {
    t1s.slice(0, 3).forEach((t) => edges.push({ from: p.id, to: t.id }));
  });
  // T1 → T2
  t1s.forEach((t, i) => {
    const targets = t2s.slice(i % t2s.length, (i % t2s.length) + 2);
    targets.forEach((t2) => edges.push({ from: t.id, to: t2.id }));
  });
  // T2 → T3
  t2s.forEach((t, i) => {
    const target = t3s[i % t3s.length];
    edges.push({ from: t.id, to: target.id });
  });

  return { nodes, edges };
}

// ── Color helpers ────────────────────────────────────────────

// Returns a THREE.Color based on tier (default healthy state)
function tierColor(tier: Tier): THREE.Color {
  switch (tier) {
    case "plant": return new THREE.Color(0x00e5ff); // cyan — plant
    case "t1":    return new THREE.Color(0x7c3aed); // violet — Tier 1
    case "t2":    return new THREE.Color(0x3b82f6); // blue — Tier 2
    case "t3":    return new THREE.Color(0x22c55e); // green — Tier 3
  }
}

// Blends from tier color → amber → red based on riskLevel [0–2]
function riskColor(tier: Tier, risk: number): THREE.Color {
  const base  = tierColor(tier);
  const amber = new THREE.Color(0xf59e0b);
  const red   = new THREE.Color(0xef4444);
  if (risk <= 0) return base;
  if (risk <= 1) return base.clone().lerp(amber, risk);
  return amber.clone().lerp(red, risk - 1);
}

// ── Node mesh component ──────────────────────────────────────

function Node({
  node,
  riskOverride,
}: {
  node: NetworkNode;
  riskOverride: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const color   = riskColor(node.tier, riskOverride);

  // Node size: plants are bigger, T3 are smallest
  const size =
    node.tier === "plant" ? 0.25 :
    node.tier === "t1"    ? 0.18 :
    node.tier === "t2"    ? 0.14 : 0.11;

  // Animate: gentle bob + pulsing scale when risk is elevated
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Slow vertical bob — offset by node id so they don't sync
    meshRef.current.position.y =
      node.position[1] + Math.sin(t * 0.5 + node.id) * 0.06;

    // Scale pulse when critical
    if (riskOverride >= 2) {
      const pulse = 1 + Math.sin(t * 6) * 0.15;
      meshRef.current.scale.setScalar(pulse);
    } else {
      meshRef.current.scale.setScalar(1);
    }
  });

  return (
    <mesh ref={meshRef} position={node.position}>
      {/* Octahedron for plants, sphere for everything else */}
      {node.tier === "plant" ? (
        <octahedronGeometry args={[size, 0]} />
      ) : (
        <sphereGeometry args={[size, 12, 12]} />
      )}
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={riskOverride > 0 ? 1.2 : 0.5}
        roughness={0.3}
        metalness={0.6}
      />
    </mesh>
  );
}

// ── Edge (connection line) component ────────────────────────
// Uses drei's <Line> component which has proper R3F TypeScript
// types — avoids the <line> JSX ambiguity with SVG's line element.

function Edge({
  from,
  to,
  riskLevel,
}: {
  from: THREE.Vector3;
  to: THREE.Vector3;
  riskLevel: number;
}) {
  const color =
    riskLevel >= 2 ? "#ef4444" :
    riskLevel >= 1 ? "#f59e0b" :
                     "#00e5ff";

  const opacity = riskLevel > 0 ? 0.7 : 0.18;

  // drei's Line accepts an array of Vector3 points and renders
  // a Three.js Line2 (thick line) without JSX type conflicts.
  return (
    <Line
      points={[from, to]}
      color={color}
      lineWidth={riskLevel > 0 ? 1.2 : 0.5}
      transparent
      opacity={opacity}
    />
  );
}

// ── Mouse parallax scene tilt ────────────────────────────────

// Reads mouse position from the Three.js viewport and gently
// tilts the scene group to create a parallax depth effect.
function ParallaxGroup({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null!);
  const { size } = useThree();

  // Track mouse position in normalized coords [-1, 1]
  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    function onMove(e: MouseEvent) {
      mouse.current.x = (e.clientX / size.width  - 0.5) * 2;
      mouse.current.y = (e.clientY / size.height - 0.5) * 2;
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [size]);

  useFrame(() => {
    // Lerp the group rotation toward the mouse — max ±8°
    groupRef.current.rotation.y +=
      (mouse.current.x * 0.12 - groupRef.current.rotation.y) * 0.04;
    groupRef.current.rotation.x +=
      (-mouse.current.y * 0.08 - groupRef.current.rotation.x) * 0.04;
  });

  return <group ref={groupRef}>{children}</group>;
}

// ── Main scene (nodes + edges + disruption logic) ────────────

function NetworkScene() {
  // Build data once — memo prevents rebuild on re-render
  const { nodes, edges } = useMemo(() => buildNetworkData(), []);

  // Per-node risk levels that the disruption loop mutates
  const [riskLevels, setRiskLevels] = useState<Record<number, number>>(
    () => Object.fromEntries(nodes.map((n) => [n.id, 0]))
  );

  // Node positions as Vector3 for edge rendering
  const positions = useMemo(
    () => Object.fromEntries(
      nodes.map((n) => [n.id, new THREE.Vector3(...n.position)])
    ),
    [nodes]
  );

  // ── Disruption cascade effect ──────────────────────────────
  // Every 8 seconds: pick a random T3 node, mark it critical,
  // then cascade risk up through T2 → T1 → Plant with delays.
  useEffect(() => {
    function fireDisruption() {
      // Reset everything to healthy first
      setRiskLevels(Object.fromEntries(nodes.map((n) => [n.id, 0])));

      // Pick a random T3 starting point
      const t3s = nodes.filter((n) => n.tier === "t3");
      const origin = t3s[Math.floor(Math.random() * t3s.length)];

      // Find edges connected to this node and cascade upward tier by tier
      const cascade = (nodeId: number, risk: number, delay: number) => {
        setTimeout(() => {
          setRiskLevels((prev) => ({ ...prev, [nodeId]: risk }));

          // Find all nodes this one connects to (toward plants)
          const connected = edges
            .filter((e) => e.to === nodeId || e.from === nodeId)
            .map((e) => (e.to === nodeId ? e.from : e.to));

          connected.forEach((cId) => {
            const connNode = nodes.find((n) => n.id === cId);
            // Only cascade "upward" — toward plants (lower tier index)
            if (connNode && connNode.tier !== "t3") {
              cascade(cId, Math.max(risk - 0.5, 1), delay + 600);
            }
          });
        }, delay);
      };

      cascade(origin.id, 2, 0);
    }

    // Fire immediately once, then every 8 seconds
    const timeout = setTimeout(fireDisruption, 1500);
    const interval = setInterval(fireDisruption, 8000);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [nodes, edges]);

  return (
    <ParallaxGroup>
      {/* Ambient + directional light for the 3D depth */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} color="#00e5ff" />
      <pointLight position={[-10, -5, -5]} intensity={0.4} color="#7c3aed" />

      {/* Render all edges first (drawn behind nodes) */}
      {edges.map((edge, i) => {
        const fromPos = positions[edge.from];
        const toPos   = positions[edge.to];
        const risk    = Math.max(riskLevels[edge.from], riskLevels[edge.to]);
        return (
          <Edge key={i} from={fromPos} to={toPos} riskLevel={risk} />
        );
      })}

      {/* Render all nodes on top */}
      {nodes.map((node) => (
        <Node
          key={node.id}
          node={node}
          riskOverride={riskLevels[node.id]}
        />
      ))}
    </ParallaxGroup>
  );
}

// ── Exported canvas wrapper ──────────────────────────────────

export default function SupplyNetworkCanvas() {
  return (
    // Canvas fills whatever container it's placed in
    <Canvas
      camera={{ position: [0, 0, 22], fov: 55 }}
      dpr={[1, 1.5]}               // cap pixel ratio for perf
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <NetworkScene />
      {/* Allow gentle manual orbit on desktop for interactivity */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.4}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </Canvas>
  );
}
