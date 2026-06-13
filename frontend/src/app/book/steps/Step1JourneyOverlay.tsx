"use client";

/**
 * Step 1 — Journey (Overlay version)
 *
 * Used when arriving from the Browse Tickets page where the train,
 * route, and class are already known. This step only asks the user to:
 *  • Confirm / change the departure date
 *  • Optionally enable a return journey and pick a return date
 *  • Set the passenger count
 *
 * From/To/Class are shown read-only (pre-filled from the selected train).
 */

import { useState } from "react";
import { MapPin, Flag, Calendar, Users, Train as TrainIcon } from "lucide-react";
import StepCard, { FieldLabel, NavButtons } from "../components/StepCard";
import { BookingState } from "../types";

type Props = {
  state: BookingState;
  setState: (s: Partial<BookingState>) => void;
  onNext: () => void;
  onBack?: () => void;
};

export default function Step1JourneyOverlay({ state, setState, onNext, onBack }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!state.departDate) e.departDate = "Please select a travel date.";
    if (state.returnEnabled && !state.returnDate)
      e.returnDate = "Please select a return date.";
    if (state.returnEnabled && state.returnDate && state.departDate && state.returnDate <= state.departDate)
      e.returnDate = "Return date must be after departure date.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validate()) onNext(); };

  /* ── Locked info row ── */
  function InfoPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
      <div
        className="flex items-center gap-2"
        style={{
          background: "#f8fafc", border: "1px solid #e8ebed",
          borderRadius: "10px", padding: "10px 14px", flex: "1 1 auto",
        }}
      >
        <span style={{ color: "#9ca3af", flexShrink: 0 }}>{icon}</span>
        <div>
          <p style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 700, letterSpacing: "0.05em" }}>{label}</p>
          <p style={{ fontSize: "14px", fontWeight: 600, color: "#181d2a" }}>{value}</p>
        </div>
      </div>
    );
  }

  return (
    <StepCard>
      <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#181d2a", marginBottom: "4px" }}>
        Confirm Your Journey
      </h2>
      <p style={{ fontSize: "14px", color: "#9ca3af", marginBottom: "24px" }}>
        Route and class are pre-selected. Pick your travel date and passenger count.
      </p>

      {/* ── Pre-filled read-only: route + class ── */}
      <div className="flex flex-wrap gap-3 mb-6">
        <InfoPill icon={<MapPin size={15} />} label="FROM"  value={state.from} />
        <InfoPill icon={<Flag size={15} />}   label="TO"    value={state.to} />
        <InfoPill
          icon={<TrainIcon size={15} />}
          label="TRAIN"
          value={`${state.trainName} (${state.trainNumber})`}
        />
        <InfoPill
          icon={<span style={{ fontSize: "13px" }}>🎟</span>}
          label="CLASS"
          value={state.selectedClass ? `${state.selectedClass.label} · ₹${state.selectedClass.price.toLocaleString("en-IN")}` : "—"}
        />
      </div>

      {/* ── Departure date ── */}
      <div className="mb-5">
        <FieldLabel required>Departure Date</FieldLabel>
        <div
          className="flex items-center gap-2"
          style={{
            border: `1.5px solid ${errors.departDate ? "#dc2626" : "#e8ebed"}`,
            borderRadius: "10px", padding: "0 14px", height: "48px",
            background: "#ffffff",
          }}
        >
          <Calendar size={16} style={{ color: "#9ca3af", flexShrink: 0 }} />
          <input
            type="date"
            value={state.departDate}
            onChange={(e) => setState({ departDate: e.target.value })}
            className="flex-1 bg-transparent border-none outline-none focus:ring-0"
            style={{ fontSize: "14px", color: "#181d2a" }}
            aria-label="Departure date"
          />
        </div>
        {errors.departDate && (
          <p style={{ fontSize: "12px", color: "#dc2626", marginTop: "4px" }}>{errors.departDate}</p>
        )}
      </div>

      {/* ── Return journey toggle + date ── */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <FieldLabel>Return Journey</FieldLabel>
          <button
            role="switch"
            aria-checked={state.returnEnabled}
            onClick={() => setState({ returnEnabled: !state.returnEnabled, returnDate: "" })}
            className={`toggle-track focus:outline-none focus-visible:ring-2 ${state.returnEnabled ? "active" : ""}`}
            aria-label="Toggle return journey"
          >
            <div className="toggle-thumb" />
          </button>
        </div>

        {state.returnEnabled && (
          <div>
            <div
              className="flex items-center gap-2"
              style={{
                border: `1.5px solid ${errors.returnDate ? "#dc2626" : "#748efe"}`,
                borderRadius: "10px", padding: "0 14px", height: "48px",
                background: "rgba(116,142,254,0.03)",
              }}
            >
              <Calendar size={16} style={{ color: "#748efe", flexShrink: 0 }} />
              <input
                type="date"
                value={state.returnDate}
                onChange={(e) => setState({ returnDate: e.target.value })}
                className="flex-1 bg-transparent border-none outline-none focus:ring-0"
                style={{ fontSize: "14px", color: "#181d2a" }}
                aria-label="Return date"
              />
            </div>
            {errors.returnDate && (
              <p style={{ fontSize: "12px", color: "#dc2626", marginTop: "4px" }}>{errors.returnDate}</p>
            )}
            <p style={{ fontSize: "12px", color: "#748efe", marginTop: "6px" }}>
              Return journey will be on the same route.
            </p>
          </div>
        )}
      </div>

      {/* ── Passenger count ── */}
      <div className="mb-2">
        <FieldLabel>Number of Passengers</FieldLabel>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setState({ passengers: Math.max(1, state.passengers - 1) })}
            className="flex items-center justify-center focus:outline-none focus-visible:ring-2"
            style={{
              width: "44px", height: "44px", borderRadius: "10px",
              border: "1.5px solid #e8ebed", background: "#ffffff",
              fontSize: "22px", cursor: "pointer", color: "#181d2a",
            }}
            aria-label="Decrease passengers"
          >
            −
          </button>

          <div
            className="flex items-center justify-center gap-2"
            style={{
              flex: 1, height: "44px", borderRadius: "10px",
              border: "1.5px solid #e8ebed", background: "#f8fafc",
              fontSize: "16px", fontWeight: 700, color: "#181d2a",
            }}
          >
            <Users size={16} style={{ color: "#748efe" }} aria-hidden="true" />
            {state.passengers} Adult{state.passengers > 1 ? "s" : ""}
          </div>

          <button
            onClick={() => setState({ passengers: Math.min(6, state.passengers + 1) })}
            className="flex items-center justify-center focus:outline-none focus-visible:ring-2"
            style={{
              width: "44px", height: "44px", borderRadius: "10px",
              border: "1.5px solid #e8ebed", background: "#ffffff",
              fontSize: "22px", cursor: "pointer", color: "#181d2a",
            }}
            aria-label="Increase passengers"
          >
            +
          </button>
        </div>
        <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "6px" }}>
          Maximum 6 passengers per booking.
        </p>
      </div>

      <NavButtons onBack={onBack} onNext={handleNext} nextLabel="Select Seats →" />
    </StepCard>
  );
}
