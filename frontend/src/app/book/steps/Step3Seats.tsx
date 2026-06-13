"use client";

import { useState, useEffect } from "react";
import StepCard, { NavButtons } from "../components/StepCard";
import { BookingState, Seat, SeatStatus, Coach } from "../types";

// Generate mock coach data
function makeCoach(id: string, name: string, type: string): Coach {
  const types = ["Lower", "Middle", "Upper", "Side Lower", "Side Upper"] as const;
  const seeds: SeatStatus[] = [
    "available", "available", "available", "occupied",
    "available", "ladies",    "available", "available",
    "occupied",  "available",
  ];
  const seats: Seat[] = Array.from({ length: 72 }, (_, i) => ({
    id:     `${id}-${i + 1}`,
    number: String(i + 1),
    type:   types[i % 5],
    status: seeds[i % seeds.length],
    price:  845,
  }));
  return { id, name, type, seats };
}

const MOCK_COACHES: Coach[] = [
  makeCoach("S1", "S1", "Sleeper"),
  makeCoach("S2", "S2", "Sleeper"),
  makeCoach("S3", "S3", "Sleeper"),
  makeCoach("B1", "B1", "AC 3 Tier"),
  makeCoach("B2", "B2", "AC 3 Tier"),
];

export default function Step3Seats({
  state, setState, onNext, onBack,
}: {
  state: BookingState;
  setState: (s: Partial<BookingState>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [activeCoach, setActiveCoach] = useState(MOCK_COACHES[0].id);

  const coach = MOCK_COACHES.find((c) => c.id === activeCoach) ?? MOCK_COACHES[0];
  const required     = state.passengers;
  const selectedCount = state.selectedSeats.length;

  // Auto-assign seats whenever coach or required count changes
  // so the "Continue" button is never blocked by the missing grid.
  useEffect(() => {
    const available = coach.seats.filter((s) => s.status === "available");
    const assigned  = available.slice(0, required).map((s) => ({
      ...s,
      status: "selected" as SeatStatus,
    }));
    setState({ selectedSeats: assigned, selectedCoach: activeCoach });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCoach, required]);

  const handleNext = () => onNext();

  return (
    <StepCard>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#181d2a" }}>Select Seats</h2>
        <span
          style={{
            fontSize: "13px", color: "#6b7280",
            background: "#f0f2f5", borderRadius: "9999px", padding: "4px 12px",
          }}
        >
          {selectedCount}/{required} selected
        </span>
      </div>
      <p style={{ fontSize: "14px", color: "#9ca3af", marginBottom: "20px" }}>
        {state.selectedClass?.label} · {state.from} → {state.to}
      </p>

      {/* Coach tabs */}
      <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
        {MOCK_COACHES.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCoach(c.id)}
            className="flex-shrink-0 focus:outline-none focus-visible:ring-2 rounded-lg transition-all"
            style={{
              padding: "8px 16px", borderRadius: "10px",
              fontSize: "13px", fontWeight: 600,
              border: `2px solid ${activeCoach === c.id ? "#748efe" : "#e8ebed"}`,
              background: activeCoach === c.id ? "rgba(116,142,254,0.08)" : "#ffffff",
              color: activeCoach === c.id ? "#748efe" : "#6b7280",
              cursor: "pointer",
            }}
            aria-pressed={activeCoach === c.id}
          >
            {c.name} · {c.type}
          </button>
        ))}
      </div>

      {/* Auto-assigned seats summary */}
      {state.selectedSeats.length > 0 && (
        <div
          style={{
            background: "#f0fdf4", border: "1px solid #bbf7d0",
            borderRadius: "10px", padding: "14px 16px", marginBottom: "16px",
          }}
        >
          <p style={{ fontSize: "12px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.05em", marginBottom: "8px" }}>
            ASSIGNED SEATS
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {state.selectedSeats.map((s) => (
              <span
                key={s.id}
                style={{
                  background: "#748efe", color: "white",
                  borderRadius: "8px", padding: "4px 10px",
                  fontSize: "12px", fontWeight: 700,
                }}
              >
                {s.number} ({s.type})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Fare update */}
      {state.selectedClass && (
        <div
          style={{
            background: "#f8faff", border: "1px solid #dbeafe",
            borderRadius: "10px", padding: "12px 16px",
          }}
        >
          <div className="flex items-center justify-between">
            <span style={{ fontSize: "13px", color: "#6b7280" }}>
              {selectedCount} seat{selectedCount !== 1 ? "s" : ""} × ₹{state.selectedClass.price.toLocaleString("en-IN")}
            </span>
            <span style={{ fontSize: "16px", fontWeight: 700, color: "#748efe" }}>
              ₹{(selectedCount * state.selectedClass.price).toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      )}

      <NavButtons onBack={onBack} onNext={handleNext} nextLabel="Confirm →" />
    </StepCard>
  );
}
