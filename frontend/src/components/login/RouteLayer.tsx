
export default function RouteLayer() {
  const stations = [
    { x: 120, y: 70, code: "NDLS" },
    { x: 340, y: 105, code: "BPL" },
    { x: 620, y: 45, code: "NGP" },
    { x: 900, y: 85, code: "PUNE" },
    { x: 1120, y: 110, code: "CSMT" },
  ];

  const path = `
    M120 70
    C220 15, 280 120, 340 105
    C450 80, 540 20, 620 45
    C720 65, 820 105, 900 85
    C980 65, 1050 130, 1120 110
  `;

  return (
    <svg
      viewBox="0 0 1200 140"
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={path}
        stroke="#5B7CFA"
        strokeWidth="3"
        strokeDasharray="8 8"
        strokeLinecap="round"
        opacity="0.9"
      />

      {stations.map((station) => (
        <g
          key={station.code}
          transform={`translate(${station.x},${station.y})`}
        >
          <text
            x="0"
            y="-28"
            textAnchor="middle"
            fill="#1E40AF"
            fontSize="13"
            fontWeight="700"
            fontFamily="Inter,sans-serif"
          >
            {station.code}
          </text>

          <path
            d="M0 0
               C-10 0 -10 -20 0 -28
               C10 -20 10 0 0 0 Z"
            fill="#5B7CFA"
          />

          <circle
            cx="0"
            cy="-14"
            r="4"
            fill="white"
          />
        </g>
      ))}
    </svg>
  );
}

