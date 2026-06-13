
import { Train } from "lucide-react";
import React from "react";

const stops = [
  { code: "NDLS", city: "New Delhi" },
  { code: "BPL", city: "Bhopal" },
  { code: "NGP", city: "Nagpur" },
  { code: "PUNE", city: "Pune" },
  { code: "CSMT", city: "Mumbai" },
];

export default function JourneyTimeline() {
  return (
    <div
      style={{
        width: "100%",
        height: "120px",
        background: "#FFFFFF",
        borderRadius: "20px",
        border: "1px solid #EAEFF5",
        boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
        padding: "16px 24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Route */}
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        {/* Blue line */}
        <div
          style={{
            position: "absolute",
            top: "8px",
            left: "40px",
            right: "40px",
            height: "2px",
            background: "#2563EB",
            opacity: 0.25,
            zIndex: 0,
          }}
        />

        {stops.map((stop, index) => (
          <div
            key={stop.code}
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: "60px",
            }}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                background:
                  index === 0 || index === stops.length - 1
                    ? "#2563EB"
                    : "#FFFFFF",
                border: "2px solid #2563EB",
              }}
            />

            <div
              style={{
                marginTop: "6px",
                fontSize: "12px",
                fontWeight: 700,
                color: "#0F172A",
              }}
            >
              {stop.code}
            </div>

            <div
              style={{
                fontSize: "10px",
                color: "#94A3B8",
                marginTop: "2px",
              }}
            >
              {stop.city}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop: "1px solid #EEF2F7",
          paddingTop: "10px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "#2563EB",
            fontWeight: 600,
            fontSize: "13px",
          }}
        >
          <Train size={14} />
          <span>Vande Bharat Express</span>
        </div>

        <div
          style={{
            width: "1px",
            height: "14px",
            background: "#E2E8F0",
          }}
        />

        <div
          style={{
            fontSize: "13px",
            color: "#64748B",
          }}
        >
          <strong style={{ color: "#0F172A" }}>16h 35m</strong>
          <span style={{ marginLeft: "6px" }}>
            Journey Duration
          </span>
        </div>
      </div>
    </div>
  );
}

