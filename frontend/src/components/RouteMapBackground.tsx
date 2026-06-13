"use client";

/**
 * RouteMapBackground v3
 * Matches reference: curved dashed route lines with map-pin station markers,
 * faint city silhouette panorama, subtle landmark shapes.
 * Pure #748efe at 5–18% opacity only.
 */
export default function RouteMapBackground({ className = "" }: { className?: string }) {
  // Stations shown as floating pins above train (reference image layout)
  const pins = [
    { x: 95,  y: 62,  code: "NDLS" },
    { x: 222, y: 108, code: "BPL"  },
    { x: 400, y: 72,  code: "NGP"  },
    { x: 530, y: 96,  code: "PUNE" },
    { x: 648, y: 148, code: "CSMT" },
  ];

  return (
    <svg
      viewBox="0 0 860 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
      style={{ width: "100%", height: "100%" }}
    >
      <defs>
        <radialGradient id="bgGlow" cx="42%" cy="55%" r="50%">
          <stop offset="0%"   stopColor="#748efe" stopOpacity="0.10" />
          <stop offset="70%"  stopColor="#748efe" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#748efe" stopOpacity="0"    />
        </radialGradient>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#dce6ff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#dce6ff" stopOpacity="0"    />
        </linearGradient>
      </defs>

      {/* ── Background radial glow ── */}
      <rect width="860" height="480" fill="url(#skyGrad)" />
      <ellipse cx="360" cy="280" rx="380" ry="220" fill="url(#bgGlow)" />

      {/* ══════════════════════════════════════════
          CITY SKYLINE SILHOUETTE
          Faint panorama: India Gate, mosque domes,
          minaret, colonial building, tower
      ══════════════════════════════════════════ */}
      <g opacity="0.055" fill="#748efe">

        {/* ── India Gate (centre-right) ── */}
        <g transform="translate(560 280)">
          <rect x="-38" y="90" width="76" height="8" rx="1" />
          <rect x="-28" y="82" width="56" height="10" rx="1" />
          <rect x="-18" y="10" width="36" height="72" />
          <rect x="-22" y="6"  width="44" height="8"  rx="1" />
          <rect x="-26" y="2"  width="52" height="6"  rx="1" />
          {/* arch cutout */}
          <rect x="-10" y="28" width="20" height="54" fill="#edf1ff" />
          {/* legs */}
          <rect x="-18" y="10" width="8"  height="72" />
          <rect x="10"  y="10" width="8"  height="72" />
        </g>

        {/* ── Mosque with domes (left area) ── */}
        <g transform="translate(80 300)">
          {/* Central dome */}
          <path d="M30 50 Q30 20 50 20 Q70 20 70 50 Z" />
          <rect x="30" y="50" width="40" height="48" rx="1" />
          {/* Side domes */}
          <path d="M5 56 Q5 36 18 36 Q31 36 31 56 Z" />
          <rect x="5" y="56" width="26" height="42" rx="1" />
          <path d="M69 56 Q69 36 82 36 Q95 36 95 56 Z" />
          <rect x="69" y="56" width="26" height="42" rx="1" />
          {/* Minarets */}
          <rect x="0"   y="30" width="6" height="70" rx="2" />
          <rect x="94"  y="30" width="6" height="70" rx="2" />
          <path d="M0 30 Q3 20 6 30 Z" />
          <path d="M94 30 Q97 20 100 30 Z" />
          {/* Base */}
          <rect x="-5" y="96" width="110" height="6" rx="1" />
        </g>

        {/* ── Victorian railway terminus (far left) ── */}
        <g transform="translate(0 310)">
          <rect x="0"   y="50" width="110" height="50" />
          {/* Gothic windows */}
          <path d="M10 52 Q10 40 18 40 Q26 40 26 52 Z" fill="#edf1ff" />
          <path d="M30 52 Q30 40 38 40 Q46 40 46 52 Z" fill="#edf1ff" />
          <path d="M50 52 Q50 40 58 40 Q66 40 66 52 Z" fill="#edf1ff" />
          <path d="M70 52 Q70 40 78 40 Q86 40 78 52 Z" fill="#edf1ff" />
          {/* Clock tower */}
          <rect x="40" y="0" width="22" height="52" />
          <path d="M40 0 Q51 -10 62 0 Z" />
          <circle cx="51" cy="24" r="9" fill="#edf1ff" />
          {/* Roof ridge */}
          <rect x="0" y="46" width="110" height="6" rx="1" />
        </g>

        {/* ── Gateway of India (right) ── */}
        <g transform="translate(680 310)">
          <rect x="-8" y="80" width="96" height="8" rx="1" />
          <rect x="-2" y="72" width="84" height="10" rx="1" />
          {/* Main body */}
          <path d="M8 72 L8 28 Q8 0 40 0 Q72 0 72 28 L72 72 Z" />
          {/* Arch cutout */}
          <path d="M18 72 L18 32 Q18 10 40 10 Q62 10 62 32 L62 72 Z" fill="#edf1ff" />
          {/* Side towers */}
          <rect x="-2" y="20" width="12" height="54" rx="1" />
          <rect x="70" y="20" width="12" height="54" rx="1" />
          <circle cx="4"  cy="18" r="7" />
          <circle cx="76" cy="18" r="7" />
        </g>

        {/* ── Simple tower / minaret (centre) ── */}
        <g transform="translate(380 320)">
          <rect x="12" y="0" width="12" height="60" rx="2" />
          <path d="M10 0 Q18 -12 26 0 Z" />
          <rect x="8" y="58" width="20" height="5" rx="1" />
        </g>

      </g>

      {/* ══════════════════════════════════════════
          ROUTE LINES — curved dashed paths
          Matching reference: wavy dashes across top half
      ══════════════════════════════════════════ */}

      {/* Primary route: NDLS → BPL → NGP → PUNE → CSMT */}
      <path
        d="M95 80 Q158 55 222 115 Q310 85 400 85 Q465 90 530 108 Q590 125 648 162"
        stroke="#748efe" strokeWidth="1.8" strokeDasharray="6 5"
        strokeLinecap="round" opacity="0.45" fill="none"
      />

      {/* Secondary branch curving south */}
      <path
        d="M95 80 Q120 160 140 240 Q160 310 175 380"
        stroke="#748efe" strokeWidth="1.2" strokeDasharray="5 6"
        strokeLinecap="round" opacity="0.20" fill="none"
      />

      {/* Eastern branch */}
      <path
        d="M400 85 Q430 160 450 240 Q460 300 455 360"
        stroke="#748efe" strokeWidth="1.2" strokeDasharray="5 6"
        strokeLinecap="round" opacity="0.18" fill="none"
      />

      {/* ══════════════════════════════════════════
          STATION MAP-PIN MARKERS
          Reference style: drop-pin icon + code above
      ══════════════════════════════════════════ */}
      {pins.map((p) => (
        <g key={p.code} transform={`translate(${p.x} ${p.y})`}>
          {/* Pin body */}
          <path
            d="M0 -18 Q-9 -18 -9 -9 Q-9 0 0 8 Q9 0 9 -9 Q9 -18 0 -18 Z"
            fill="#748efe"
            opacity="0.65"
          />
          {/* Pin inner circle */}
          <circle cx="0" cy="-9" r="3.5" fill="white" opacity="0.9" />
          {/* Station code */}
          <text
            x="0" y="-26"
            textAnchor="middle"
            fill="#748efe"
            fontSize="9"
            fontWeight="700"
            fontFamily="Inter, sans-serif"
            opacity="0.75"
            letterSpacing="0.05em"
          >
            {p.code}
          </text>
        </g>
      ))}

      {/* ══════════════════════════════════════════
          RAILWAY TRACK at bottom
      ══════════════════════════════════════════ */}
      <g opacity="0.14">
        <path d="M-10 418 Q250 408 430 405 Q620 402 870 410"
          stroke="#748efe" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M-10 432 Q250 422 430 419 Q620 416 870 424"
          stroke="#748efe" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {Array.from({ length: 24 }).map((_, i) => (
          <line
            key={i}
            x1={i * 37} y1={414 - i * 0.2}
            x2={i * 37} y2={436 - i * 0.2}
            stroke="#748efe" strokeWidth="2.2"
            strokeLinecap="round" opacity="0.6"
          />
        ))}
      </g>
    </svg>
  );
}
