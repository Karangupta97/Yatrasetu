"use client";

import { Stop } from "../data/trains";

type RouteTimelineProps = {
  stops: Stop[];
  compact?: boolean;
};

export default function RouteTimeline({ stops, compact = false }: RouteTimelineProps) {
  if (stops.length === 0) return null;

  const dotSize = 8;
  const rowHeight = compact ? 52 : 64;
  // Vertical center of the dot row (accounts for labels above + dot + labels below)
  const labelAboveH = compact ? 16 : 20;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: `${rowHeight}px`,
        display: "flex",
        alignItems: "center",
      }}
      role="list"
      aria-label="Route stops"
    >
      {/* Fix 6: Connector line — 1.5px solid #e8ebed, centered vertically on dots */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: `${labelAboveH + dotSize / 2}px`,
          height: "1.5px",
          background: "#e8ebed",
          zIndex: 0,
        }}
      />

      {/* Stops row */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        {stops.map((stop, idx) => (
          <div
            key={idx}
            role="listitem"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "3px",
              maxWidth: compact ? "56px" : "72px",
            }}
          >
            {/* Fix 6: city name — 12px #181d2a above dot */}
            <span
              style={{
                fontSize: compact ? "10px" : "12px",
                color: "#181d2a",
                fontWeight: 500,
                textAlign: "center",
                lineHeight: "1.2",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: compact ? "56px" : "72px",
                display: "block",
                height: compact ? "14px" : "18px",
              }}
              title={stop.city}
            >
              {stop.city}
            </span>

            {/* Fix 6: dot — 8px filled circle, #748efe */}
            <div
              aria-hidden="true"
              style={{
                width: `${dotSize}px`,
                height: `${dotSize}px`,
                borderRadius: "50%",
                background: "#748efe",
                flexShrink: 0,
                /* ring to lift dot above line */
                boxShadow: "0 0 0 2px #ffffff",
                zIndex: 2,
              }}
            />

            {/* Fix 6: time/date below dot — 11px #6b7280 */}
            <span
              style={{
                fontSize: compact ? "10px" : "11px",
                color: "#6b7280",
                textAlign: "center",
                lineHeight: "1.2",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: compact ? "56px" : "72px",
                display: "block",
              }}
            >
              {stop.time ?? stop.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
