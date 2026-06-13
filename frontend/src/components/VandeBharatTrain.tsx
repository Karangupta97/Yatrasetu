"use client";

/**
 * VandeBharatTrain — Premium SVG illustration of the Vande Bharat Express
 * White body · Indigo Blue stripe · Saffron accent · Aerodynamic nose
 * YatraSetu Design System v1.0
 */
export default function VandeBharatTrain({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 900 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Vande Bharat Express train illustration"
    >
      {/* ── Track / Rail ── */}
      <g opacity="0.35">
        {/* Rail ties */}
        {Array.from({ length: 28 }).map((_, i) => (
          <rect
            key={i}
            x={20 + i * 32}
            y={282}
            width={18}
            height={6}
            rx={2}
            fill="#748efe"
            opacity="0.5"
          />
        ))}
        {/* Top rail */}
        <rect x={10} y={278} width={880} height={3} rx={1.5} fill="#748efe" />
        {/* Bottom rail */}
        <rect x={10} y={288} width={880} height={3} rx={1.5} fill="#748efe" />
      </g>

      {/* ── Soft ground shadow ── */}
      <ellipse cx={460} cy={296} rx={380} ry={14} fill="#181d2a" opacity="0.09" />

      {/* ═══════════════════════════════════════════
          LOCOMOTIVE (left, aerodynamic nose)
      ═══════════════════════════════════════════ */}

      {/* Locomotive body */}
      <path
        d="M60 235
           C60 235 52 232 46 222
           C38 208 36 195 40 180
           C44 162 55 148 70 138
           C82 130 100 126 118 124
           L280 124
           L280 250
           L72 250
           Z"
        fill="white"
        stroke="#e8ebed"
        strokeWidth="1.5"
      />

      {/* Locomotive — Indigo Blue main stripe */}
      <path
        d="M68 155
           C68 155 60 162 56 172
           C53 180 53 190 55 198
           C58 207 64 214 72 218
           L280 218
           L280 155
           Z"
        fill="#748efe"
      />

      {/* Locomotive — Saffron accent stripe */}
      <path
        d="M75 148
           C75 148 68 153 64 160
           L280 160
           L280 155
           L75 155
           Z"
        fill="#f4632a"
      />

      {/* Windshield / cab window */}
      <path
        d="M80 136
           C86 130 98 126 112 126
           L210 126
           L210 150
           L80 150
           Z"
        fill="#d0e4ff"
        opacity="0.9"
        stroke="#748efe"
        strokeWidth="1.2"
      />
      {/* Windshield glare */}
      <path
        d="M90 130 L200 130 L200 135 L90 140 Z"
        fill="white"
        opacity="0.45"
      />

      {/* Cab window frame top border */}
      <path
        d="M80 136 C86 130 98 126 112 126 L210 126"
        stroke="#748efe"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Headlight cluster */}
      <ellipse cx={52} cy={186} rx={7} ry={5} fill="#f59e0b" opacity="0.95" />
      <ellipse cx={52} cy={186} rx={4} ry={3} fill="white" opacity="0.9" />
      {/* Headlight glow */}
      <ellipse cx={48} cy={186} rx={14} ry={8} fill="#f59e0b" opacity="0.18" />

      {/* Lower headlight */}
      <ellipse cx={56} cy={205} rx={5} ry={3.5} fill="#f59e0b" opacity="0.85" />
      <ellipse cx={56} cy={205} rx={3} ry={2} fill="white" opacity="0.9" />

      {/* Front coupler / bumper */}
      <path
        d="M38 230 L48 225 L55 240 L40 245 Z"
        fill="#e8ebed"
        stroke="#c5cacd"
        strokeWidth="1"
      />
      <rect x={40} y={236} width={14} height={4} rx={2} fill="#748efe" opacity="0.7" />

      {/* Locomotive — coach number plate */}
      <rect x={155} y={128} width={55} height={18} rx={4} fill="#181d2a" />
      <text x={182} y={141} textAnchor="middle" fill="white" fontSize="8" fontWeight="700" fontFamily="sans-serif">
        VB-01
      </text>

      {/* Vande Bharat Hindi text on body */}
      <text x={145} y={190} fill="white" fontSize="11" fontWeight="700" fontFamily="sans-serif" opacity="0.9">
        वन्दे भारत
      </text>
      <text x={148} y={204} fill="white" fontSize="8" fontWeight="400" fontFamily="sans-serif" opacity="0.7">
        EXPRESS
      </text>

      {/* Locomotive wheels */}
      <circle cx={110} cy={252} r={16} fill="#181d2a" />
      <circle cx={110} cy={252} r={10} fill="#2d3748" />
      <circle cx={110} cy={252} r={5} fill="#748efe" />
      <circle cx={110} cy={252} r={2} fill="white" />

      <circle cx={160} cy={252} r={16} fill="#181d2a" />
      <circle cx={160} cy={252} r={10} fill="#2d3748" />
      <circle cx={160} cy={252} r={5} fill="#748efe" />
      <circle cx={160} cy={252} r={2} fill="white" />

      <circle cx={240} cy={252} r={16} fill="#181d2a" />
      <circle cx={240} cy={252} r={10} fill="#2d3748" />
      <circle cx={240} cy={252} r={5} fill="#748efe" />
      <circle cx={240} cy={252} r={2} fill="white" />

      {/* ═══════════════════════════════════════════
          COACH 1
      ═══════════════════════════════════════════ */}
      <rect x={282} y={124} width={190} height={126} rx={2} fill="white" stroke="#e8ebed" strokeWidth="1.5" />
      {/* Indigo stripe */}
      <rect x={282} y={155} width={190} height={63} fill="#748efe" />
      {/* Saffron accent */}
      <rect x={282} y={150} width={190} height={5} fill="#f4632a" />

      {/* Coach 1 windows */}
      {[310, 355, 400, 435].map((x) => (
        <g key={x}>
          <rect x={x} y={130} width={30} height={20} rx={3} fill="#d0e4ff" stroke="#748efe" strokeWidth="1" />
          <rect x={x + 2} y={132} width={12} height={16} rx={2} fill="#d0e4ff" opacity="0.6" />
          <rect x={x + 16} y={132} width={12} height={16} rx={2} fill="#d0e4ff" opacity="0.6" />
          {/* window glare */}
          <path d={`M${x+2} 132 L${x+14} 132 L${x+12} 136 L${x+2} 134 Z`} fill="white" opacity="0.4" />
        </g>
      ))}

      {/* Coach 1 door */}
      <rect x={460} y={158} width={8} height={40} rx={1} fill="#5a7aee" />

      {/* Coach 1 wheels */}
      <circle cx={320} cy={252} r={16} fill="#181d2a" />
      <circle cx={320} cy={252} r={10} fill="#2d3748" />
      <circle cx={320} cy={252} r={5} fill="#748efe" />
      <circle cx={320} cy={252} r={2} fill="white" />

      <circle cx={430} cy={252} r={16} fill="#181d2a" />
      <circle cx={430} cy={252} r={10} fill="#2d3748" />
      <circle cx={430} cy={252} r={5} fill="#748efe" />
      <circle cx={430} cy={252} r={2} fill="white" />

      {/* ═══════════════════════════════════════════
          COACH 2
      ═══════════════════════════════════════════ */}
      <rect x={474} y={124} width={190} height={126} rx={2} fill="white" stroke="#e8ebed" strokeWidth="1.5" />
      <rect x={474} y={155} width={190} height={63} fill="#748efe" />
      <rect x={474} y={150} width={190} height={5} fill="#f4632a" />

      {[500, 545, 590, 630].map((x) => (
        <g key={x}>
          <rect x={x} y={130} width={30} height={20} rx={3} fill="#d0e4ff" stroke="#748efe" strokeWidth="1" />
          <rect x={x + 2} y={132} width={12} height={16} rx={2} fill="#d0e4ff" opacity="0.6" />
          <rect x={x + 16} y={132} width={12} height={16} rx={2} fill="#d0e4ff" opacity="0.6" />
          <path d={`M${x+2} 132 L${x+14} 132 L${x+12} 136 L${x+2} 134 Z`} fill="white" opacity="0.4" />
        </g>
      ))}

      <rect x={652} y={158} width={8} height={40} rx={1} fill="#5a7aee" />

      <circle cx={510} cy={252} r={16} fill="#181d2a" />
      <circle cx={510} cy={252} r={10} fill="#2d3748" />
      <circle cx={510} cy={252} r={5} fill="#748efe" />
      <circle cx={510} cy={252} r={2} fill="white" />

      <circle cx={625} cy={252} r={16} fill="#181d2a" />
      <circle cx={625} cy={252} r={10} fill="#2d3748" />
      <circle cx={625} cy={252} r={5} fill="#748efe" />
      <circle cx={625} cy={252} r={2} fill="white" />

      {/* ═══════════════════════════════════════════
          COACH 3 (partial, fading)
      ═══════════════════════════════════════════ */}
      <rect x={666} y={124} width={190} height={126} rx={2} fill="white" stroke="#e8ebed" strokeWidth="1.5" />
      <rect x={666} y={155} width={190} height={63} fill="#748efe" />
      <rect x={666} y={150} width={190} height={5} fill="#f4632a" />

      {[692, 737, 782, 820].map((x) => (
        <g key={x}>
          <rect x={x} y={130} width={30} height={20} rx={3} fill="#d0e4ff" stroke="#748efe" strokeWidth="1" />
          <rect x={x + 2} y={132} width={12} height={16} rx={2} fill="#d0e4ff" opacity="0.6" />
          <rect x={x + 16} y={132} width={12} height={16} rx={2} fill="#d0e4ff" opacity="0.6" />
          <path d={`M${x+2} 132 L${x+14} 132 L${x+12} 136 L${x+2} 134 Z`} fill="white" opacity="0.4" />
        </g>
      ))}

      <circle cx={700} cy={252} r={16} fill="#181d2a" />
      <circle cx={700} cy={252} r={10} fill="#2d3748" />
      <circle cx={700} cy={252} r={5} fill="#748efe" />
      <circle cx={700} cy={252} r={2} fill="white" />

      <circle cx={820} cy={252} r={16} fill="#181d2a" />
      <circle cx={820} cy={252} r={10} fill="#2d3748" />
      <circle cx={820} cy={252} r={5} fill="#748efe" />
      <circle cx={820} cy={252} r={2} fill="white" />

      {/* Fade-out gradient mask for right edge */}
      <defs>
        <linearGradient id="trainFade" x1="750" y1="0" x2="900" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="100%" stopColor="#f0f2f5" stopOpacity="1" />
        </linearGradient>
      </defs>
      <rect x={750} y={100} width={160} height={180} fill="url(#trainFade)" />

      {/* ── Pantograph (on roof) ── */}
      <g stroke="#748efe" strokeWidth="2" fill="none" opacity="0.7">
        <line x1={340} y1={124} x2={330} y2={108} />
        <line x1={330} y1={108} x2={350} y2={100} />
        <line x1={350} y1={100} x2={370} y2={108} />
        <line x1={370} y1={108} x2={360} y2={124} />
        <line x1={320} y1={100} x2={380} y2={100} />
      </g>

      {/* ── Speed lines (motion effect) ── */}
      {[145, 162, 178, 194].map((y, i) => (
        <line
          key={i}
          x1={10}
          y1={y}
          x2={36 + i * 4}
          y2={y}
          stroke="#748efe"
          strokeWidth={i === 1 ? 2 : 1}
          strokeLinecap="round"
          opacity={0.3 - i * 0.04}
        />
      ))}
    </svg>
  );
}
