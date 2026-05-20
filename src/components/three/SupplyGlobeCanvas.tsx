"use client";

// ============================================================
// SupplyGlobeCanvas — Real 3D Earth globe with animated supply
// route arcs connecting actual supplier countries.
//
// Built with react-globe.gl (wraps three-globe + Three.js).
//
// Visual:
//   • Dark solid sphere (deep-space blue) with cyan atmosphere
//   • Auto-rotates slowly (cinematic feel)
//   • 14 supplier nodes at real lat/lng (USA plants, Japan T1,
//     Taiwan T2, China/Chile/Saudi T3)
//   • Animated arcs flowing T3 → T2 → T1 → Plants
//   • Pulsing rings at critical risk locations
//   • Arc colors: cyan (healthy), amber (warning), red (critical)
// ============================================================

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three";

// react-globe.gl uses WebGL → dynamic import with no SSR (else window crash)
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

// ── Supplier locations (real lat/lng of major facilities) ────

interface SupplierPoint {
  lat:    number;
  lng:    number;
  name:   string;
  tier:   "plant" | "t1" | "t2" | "t3";
  risk:   "healthy" | "warning" | "critical";
  size:   number; // dot size on the globe
}

const SUPPLIERS: SupplierPoint[] = [
  // ── Tier 0: Toyota USA plants ──
  { lat: 37.84,  lng: -84.27,   name: "TMMK · Kentucky",       tier: "plant", risk: "healthy",  size: 0.9 },
  { lat: 40.27,  lng: -86.13,   name: "TMMI · Indiana",        tier: "plant", risk: "healthy",  size: 0.9 },
  { lat: 31.97,  lng: -99.90,   name: "TMMTX · Texas",         tier: "plant", risk: "healthy",  size: 0.9 },
  { lat: 32.35,  lng: -89.40,   name: "TMMMS · Mississippi",   tier: "plant", risk: "healthy",  size: 0.9 },
  { lat: 32.32,  lng: -86.90,   name: "TMMAL · Alabama",       tier: "plant", risk: "healthy",  size: 0.9 },

  // ── Tier 1: Japan (Aichi region) + key partners ──
  { lat: 35.18,  lng: 136.91,   name: "Denso · Aichi",         tier: "t1",    risk: "healthy",  size: 0.7 },
  { lat: 35.07,  lng: 137.16,   name: "Aisin · Aichi",         tier: "t1",    risk: "warning",  size: 0.7 },
  { lat: 34.97,  lng: 138.39,   name: "Yazaki · Shizuoka",     tier: "t1",    risk: "healthy",  size: 0.7 },

  // ── Tier 2: Taiwan + Korea + Germany ──
  { lat: 24.78,  lng: 120.99,   name: "TSMC · Hsinchu",        tier: "t2",    risk: "warning",  size: 0.55 },
  { lat: 35.18,  lng: 129.08,   name: "Renesas · Busan",       tier: "t2",    risk: "warning",  size: 0.55 },
  { lat: 50.94,  lng: 6.96,     name: "Continental · Cologne", tier: "t2",    risk: "healthy",  size: 0.55 },

  // ── Tier 3: Raw materials (China, Chile, Saudi, Australia) ──
  { lat: 31.23,  lng: 121.47,   name: "Rare Earth · Shanghai", tier: "t3",    risk: "critical", size: 0.5 },
  { lat: -33.45, lng: -70.67,   name: "Codelco · Chile",       tier: "t3",    risk: "warning",  size: 0.5 },
  { lat: 24.71,  lng: 46.68,    name: "Aramco · Saudi Arabia", tier: "t3",    risk: "critical", size: 0.5 },
  { lat: 13.76,  lng: 100.50,   name: "Thai Rubber · Bangkok", tier: "t3",    risk: "warning",  size: 0.5 },
];

// ── Color lookup for the markers ─────────────────────────────

function pointColor(p: SupplierPoint): string {
  if (p.risk === "critical") return "#ef4444";
  if (p.risk === "warning")  return "#f59e0b";
  // Healthy — color by tier so plants/T1/T2 are visually distinct
  switch (p.tier) {
    case "plant": return "#00E5FF";
    case "t1":    return "#7C3AED";
    case "t2":    return "#3B82F6";
    default:      return "#22C55E";
  }
}

// ── Supply route arcs (T3 → T2 → T1 → Plant) ─────────────────

interface Arc {
  startLat: number;
  startLng: number;
  endLat:   number;
  endLng:   number;
  color:    [string, string]; // gradient: start color, end color
  stroke:   number;           // arc thickness
  dashLength: number;         // for the moving-dash effect
  dashGap:    number;
}

// Helper — build an arc between two supplier indices
function arc(fromIdx: number, toIdx: number, hot: boolean): Arc {
  const from = SUPPLIERS[fromIdx];
  const to   = SUPPLIERS[toIdx];
  const startColor = pointColor(from);
  const endColor   = pointColor(to);

  return {
    startLat: from.lat,
    startLng: from.lng,
    endLat:   to.lat,
    endLng:   to.lng,
    color:    [startColor, endColor],
    stroke:   hot ? 0.6 : 0.35,
    dashLength: 0.35,
    dashGap:    hot ? 0.4 : 1.2,
  };
}

const ARCS: Arc[] = [
  // T3 → T2
  arc(11, 8, true),   // Rare Earth Shanghai → TSMC
  arc(11, 9, true),   // Rare Earth → Renesas
  arc(12, 10, false), // Codelco → Continental
  arc(13, 8, true),   // Saudi Aramco → TSMC (petrochems)
  arc(14, 5, false),  // Thai Rubber → Denso

  // T2 → T1
  arc(8, 5, true),    // TSMC → Denso
  arc(9, 6, true),    // Renesas → Aisin
  arc(10, 7, false),  // Continental → Yazaki

  // T1 → Plants (Japan → USA)
  arc(5, 0, true),    // Denso → Kentucky
  arc(5, 2, false),   // Denso → Texas
  arc(6, 1, true),    // Aisin → Indiana
  arc(6, 3, false),   // Aisin → Mississippi
  arc(7, 4, false),   // Yazaki → Alabama
  arc(7, 0, false),   // Yazaki → Kentucky
];

// ── Pulsing rings on critical hot-spots ──────────────────────

const RINGS = SUPPLIERS.filter((p) => p.risk === "critical").map((p) => ({
  lat:        p.lat,
  lng:        p.lng,
  maxR:       4,    // max ring radius in degrees
  propSpeed:  3,    // ring propagation speed
  repeatPeriod: 1400,
  color:      "#ef4444",
}));

// ── Exported globe component ─────────────────────────────────

export default function SupplyGlobeCanvas() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeRef     = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track the actual pixel size of our parent container so we can pass
  // explicit width/height to <Globe>. Without this, react-globe.gl falls
  // back to its 800×600 default and the globe overflows the container.
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // Initial measurement
    const measure = () => {
      const rect = containerRef.current!.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
    };
    measure();

    // Re-measure on any container resize (window resize, layout shifts)
    const observer = new ResizeObserver(measure);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Configure globe interaction once it mounts
  useEffect(() => {
    if (!globeRef.current) return;
    const globe = globeRef.current;

    // Auto-rotation + lock zoom
    const controls = globe.controls();
    controls.autoRotate      = true;
    controls.autoRotateSpeed = 0.45;
    controls.enableZoom      = false;
    controls.minPolarAngle   = Math.PI / 3.2;
    controls.maxPolarAngle   = Math.PI - Math.PI / 3.2;

    // Pull the camera further back so the FULL globe is visible
    // (altitude 2.4 was too close — globe overflowed the container)
    globe.pointOfView({ lat: 20, lng: -60, altitude: 2.8 }, 0);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        // Hide overflow so the atmosphere glow doesn't bleed past the card
        overflow: "hidden",
        // Center the globe inside the container
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Only render the Globe once we know our container size — prevents
          the initial 800×600 default from flashing on mount */}
      {size.width > 0 && size.height > 0 && (
      <Globe
        ref={globeRef}

        // ── Sizing ──
        width={size.width}
        height={size.height}
        backgroundColor="rgba(0,0,0,0)"

        // ── Globe surface (no texture — solid dark + atmosphere) ──
        showGlobe={true}
        showGraticules={true}      // faint meridian/parallel lines
        globeMaterial={
          new THREE.MeshPhongMaterial({
            color:     "#050a1a",
            emissive:  "#0a1228",
            shininess: 6,
            opacity:   0.97,
            transparent: true,
          })
        }

        // ── Atmosphere glow ──
        showAtmosphere={true}
        atmosphereColor="#00E5FF"
        atmosphereAltitude={0.18}

        // ── Supplier points ──
        pointsData={SUPPLIERS}
        pointLat="lat"
        pointLng="lng"
        pointColor={(d: object) => pointColor(d as SupplierPoint)}
        pointAltitude={0.012}
        pointRadius={(d: object) => (d as SupplierPoint).size}
        pointLabel={(d: object) =>
          `<div style="
            background: rgba(5,8,16,0.92);
            border: 1px solid rgba(0,229,255,0.3);
            border-radius: 6px;
            padding: 6px 10px;
            color: #E2E8F0;
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            letter-spacing: 0.05em;
          ">
            <div style="color: ${pointColor(d as SupplierPoint)}; font-weight: 700;">
              ${(d as SupplierPoint).name}
            </div>
            <div style="color: #94A3B8; margin-top: 2px;">
              ${(d as SupplierPoint).tier.toUpperCase()} · ${(d as SupplierPoint).risk}
            </div>
          </div>`
        }

        // ── Animated supply route arcs ──
        arcsData={ARCS}
        arcStartLat="startLat"
        arcStartLng="startLng"
        arcEndLat="endLat"
        arcEndLng="endLng"
        arcColor="color"
        arcStroke={(d: object) => (d as Arc).stroke}
        arcDashLength={(d: object) => (d as Arc).dashLength}
        arcDashGap={(d: object) => (d as Arc).dashGap}
        arcDashAnimateTime={2400}   // ms for one dash to traverse the arc
        arcAltitudeAutoScale={0.5}  // arc arch height
        arcsTransitionDuration={0}

        // ── Pulsing rings on critical locations ──
        ringsData={RINGS}
        ringLat="lat"
        ringLng="lng"
        ringColor={() => (t: number) => `rgba(239,68,68,${1 - t})`}
        ringMaxRadius="maxR"
        ringPropagationSpeed="propSpeed"
        ringRepeatPeriod="repeatPeriod"
      />
      )}

      {/* Subtle inner vignette so the globe edges blend into the card */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(5,8,16,0.6) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
