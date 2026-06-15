"use client";

import { useState, useEffect } from "react";
import { Train as TrainIcon, CreditCard } from "lucide-react";
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
      <div className="flex items-center justify-between" style={{ marginBottom: "8px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.01em" }}>
          Select Coach
        </h2>
        <span
          style={{
            fontSize: "12px", fontWeight: 700, color: "#5b6efe",
            background: "rgba(91,110,254,0.08)", border: "1px solid rgba(91,110,254,0.15)",
            borderRadius: "9999px", padding: "5px 14px",
          }}
        >
          {selectedCount}/{required} seat{required !== 1 ? "s" : ""}
        </span>
      </div>
      <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "24px", lineHeight: 1.5 }}>
        {state.selectedClass?.label} · {state.from} → {state.to}
      </p>

      {/* Coach tabs */}
      <div
        className="flex items-center gap-2 overflow-x-auto pb-2"
        style={{ marginBottom: "24px", scrollbarWidth: "none" }}
      >
        {MOCK_COACHES.map((c) => {
          const isActive = activeCoach === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setActiveCoach(c.id)}
              className="flex-shrink-0 focus:outline-none focus-visible:ring-2 transition-all"
              style={{
                padding: "10px 18px", borderRadius: "12px",
                fontSize: "13px", fontWeight: 600,
                border: isActive ? "2px solid #5b6efe" : "1.5px solid #e2e8f0",
                background: isActive ? "rgba(91,110,254,0.06)" : "#ffffff",
                color: isActive ? "#5b6efe" : "#64748b",
                cursor: "pointer",
                boxShadow: isActive ? "0 2px 8px rgba(91,110,254,0.15)" : "0 1px 3px rgba(0,0,0,0.04)",
              }}
              aria-pressed={isActive}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <TrainIcon size={13} />
                {c.name} · {c.type}
              </span>
            </button>
          );
        })}
      </div>

      {/* Fare summary */}
      {state.selectedClass && (
        <div
          style={{
            background: "linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)",
            border: "1px solid #e0e7ff",
            borderRadius: "14px", padding: "18px 20px",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  background: "rgba(91,110,254,0.08)", border: "1px solid #e0e7ff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <CreditCard size={16} style={{ color: "#5b6efe" }} />
              </div>
              <div>
                <p style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600 }}>Total Fare</p>
                <p style={{ fontSize: "13px", color: "#64748b" }}>
                  {selectedCount} seat{selectedCount !== 1 ? "s" : ""} × ₹{state.selectedClass.price.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
            <span style={{ fontSize: "20px", fontWeight: 800, color: "#5b6efe" }}>
              ₹{(selectedCount * state.selectedClass.price).toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      )}

      <NavButtons onBack={onBack} onNext={handleNext} nextLabel="Continue →" />
    </StepCard>
  );
}
