"use client";

/**
 * Step 1 — Journey (Overlay version)
 *
 * Used when arriving from the Browse Tickets page where the train,
 * route, and class are already known. This step only asks the user to:
 *  • Confirm / change the departure date (min: today)
 *  • Optionally enable a return journey and pick a return date
 *  • Set the passenger count
 *
 * From/To/Class are shown read-only (pre-filled from the selected train).
 */

import { useState, useMemo } from "react";
import {
  MapPin, Flag, Calendar, Users, Train as TrainIcon,
  ArrowRight, Minus, Plus, RotateCcw,
} from "lucide-react";
import StepCard, { FieldLabel, NavButtons } from "../components/StepCard";
import { BookingState } from "../types";

type Props = {
  state: BookingState;
  setState: (s: Partial<BookingState>) => void;
  onNext: () => void;
  onBack?: () => void;
};

/* Helper: today's date as YYYY-MM-DD */
function todayISO() {
  return new Date().toISOString().split("T")[0];
}

/* Helper: format date for display */
function fmtDate(iso: string) {
  if (!iso) return "";
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });
}

export default function Step1JourneyOverlay({ state, setState, onNext, onBack }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const today = useMemo(() => todayISO(), []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!state.departDate) e.departDate = "Please select a travel date.";
    else if (state.departDate < today) e.departDate = "Departure date cannot be in the past.";
    if (state.returnEnabled && !state.returnDate)
      e.returnDate = "Please select a return date.";
    if (state.returnEnabled && state.returnDate && state.departDate && state.returnDate <= state.departDate)
      e.returnDate = "Return date must be after departure date.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validate()) onNext(); };

  return (
    <StepCard>
      {/* ── Header ── */}
      <div style={{ marginBottom: "28px" }}>
        <h2 style={{
          fontSize: "24px", fontWeight: 800, color: "#0f172a",
          marginBottom: "8px", letterSpacing: "-0.01em",
        }}>
          Confirm Your Journey
        </h2>
        <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.6 }}>
          Route and class are pre-selected. Pick your travel date and passenger count.
        </p>
      </div>

      {/* ── Route summary card ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)",
          border: "1px solid #e0e7ff",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "32px",
        }}
      >
        {/* From → To */}
        <div className="flex items-center gap-4" style={{ marginBottom: "20px" }}>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              style={{
                width: "40px", height: "40px", borderRadius: "10px",
                background: "#ffffff", border: "1.5px solid #e0e7ff",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}
            >
              <MapPin size={17} style={{ color: "#5b6efe" }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "2px" }}>FROM</p>
              <p style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{state.from}</p>
            </div>
          </div>

          <div
            style={{
              width: "36px", height: "36px", borderRadius: "50%",
              background: "linear-gradient(135deg, #5b6efe, #748efe)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, boxShadow: "0 3px 10px rgba(91,110,254,0.3)",
            }}
          >
            <ArrowRight size={15} color="white" strokeWidth={2.5} />
          </div>

          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              style={{
                width: "40px", height: "40px", borderRadius: "10px",
                background: "#ffffff", border: "1.5px solid #e0e7ff",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}
            >
              <Flag size={17} style={{ color: "#5b6efe" }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "2px" }}>TO</p>
              <p style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{state.to}</p>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div style={{ height: "1px", background: "#e0e7ff", marginBottom: "16px" }} />

        {/* Train + Class row */}
        <div className="flex items-center gap-3 flex-wrap">
          <div
            className="flex items-center gap-2"
            style={{
              background: "#ffffff", border: "1.5px solid #e0e7ff",
              borderRadius: "9999px", padding: "8px 16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            }}
          >
            <TrainIcon size={14} style={{ color: "#5b6efe" }} />
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>
              {state.trainName} ({state.trainNumber})
            </span>
          </div>
          <div
            className="flex items-center gap-2"
            style={{
              background: "#ffffff", border: "1.5px solid #e0e7ff",
              borderRadius: "9999px", padding: "8px 16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            }}
          >
            <span style={{ fontSize: "13px" }}>🎟</span>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>
              {state.selectedClass ? `${state.selectedClass.label} · ₹${state.selectedClass.price.toLocaleString("en-IN")}` : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Departure date ── */}
      <div style={{ marginBottom: "24px" }}>
        <FieldLabel required>Departure Date</FieldLabel>
        <div
          style={{
            border: `1.5px solid ${errors.departDate ? "#dc2626" : "#e2e8f0"}`,
            borderRadius: "12px", padding: "0 16px", height: "52px",
            background: "#ffffff",
            display: "flex", alignItems: "center", gap: "12px",
            transition: "border-color 0.2s, box-shadow 0.2s",
            boxShadow: errors.departDate ? "0 0 0 3px rgba(220,38,38,0.08)" : "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              width: "34px", height: "34px", borderRadius: "8px",
              background: errors.departDate ? "rgba(220,38,38,0.06)" : "rgba(91,110,254,0.06)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Calendar size={16} style={{ color: errors.departDate ? "#dc2626" : "#5b6efe" }} />
          </div>
          <input
            type="date"
            value={state.departDate}
            min={today}
            onChange={(e) => { setState({ departDate: e.target.value }); setErrors(prev => ({ ...prev, departDate: "" })); }}
            className="flex-1 bg-transparent border-none outline-none focus:ring-0"
            style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}
            aria-label="Departure date"
          />
          {state.departDate && (
            <span style={{ fontSize: "12px", color: "#64748b", whiteSpace: "nowrap", flexShrink: 0 }}>
              {fmtDate(state.departDate)}
            </span>
          )}
        </div>
        {errors.departDate && (
          <p style={{ fontSize: "12px", color: "#dc2626", marginTop: "6px", fontWeight: 500 }}>{errors.departDate}</p>
        )}
      </div>

      {/* ── Return journey toggle + date ── */}
      <div style={{ marginBottom: "24px" }}>
        <div className="flex items-center justify-between" style={{ marginBottom: "12px" }}>
          <div className="flex items-center gap-2">
            <RotateCcw size={14} style={{ color: "#64748b" }} />
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>Return Journey</span>
          </div>
          <button
            role="switch"
            aria-checked={state.returnEnabled}
            onClick={() => setState({ returnEnabled: !state.returnEnabled, returnDate: "" })}
            style={{
              width: "44px", height: "24px", borderRadius: "12px",
              background: state.returnEnabled ? "#5b6efe" : "#e2e8f0",
              border: "none", cursor: "pointer", position: "relative",
              transition: "background 0.2s",
              boxShadow: state.returnEnabled ? "0 2px 8px rgba(91,110,254,0.3)" : "none",
            }}
            aria-label="Toggle return journey"
          >
            <div
              style={{
                width: "18px", height: "18px", borderRadius: "50%",
                background: "#ffffff",
                position: "absolute", top: "3px",
                left: state.returnEnabled ? "23px" : "3px",
                transition: "left 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
              }}
            />
          </button>
        </div>

        {state.returnEnabled && (
          <div style={{ animation: "ys-slideDown 0.2s ease" }}>
            <div
              style={{
                border: `1.5px solid ${errors.returnDate ? "#dc2626" : "#5b6efe"}`,
                borderRadius: "12px", padding: "0 16px", height: "52px",
                background: "rgba(91,110,254,0.02)",
                display: "flex", alignItems: "center", gap: "12px",
                boxShadow: "0 0 0 3px rgba(91,110,254,0.06)",
              }}
            >
              <div
                style={{
                  width: "34px", height: "34px", borderRadius: "8px",
                  background: "rgba(91,110,254,0.06)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Calendar size={16} style={{ color: "#5b6efe" }} />
              </div>
              <input
                type="date"
                value={state.returnDate}
                min={state.departDate || today}
                onChange={(e) => { setState({ returnDate: e.target.value }); setErrors(prev => ({ ...prev, returnDate: "" })); }}
                className="flex-1 bg-transparent border-none outline-none focus:ring-0"
                style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}
                aria-label="Return date"
              />
              {state.returnDate && (
                <span style={{ fontSize: "12px", color: "#64748b", whiteSpace: "nowrap", flexShrink: 0 }}>
                  {fmtDate(state.returnDate)}
                </span>
              )}
            </div>
            {errors.returnDate && (
              <p style={{ fontSize: "12px", color: "#dc2626", marginTop: "6px", fontWeight: 500 }}>{errors.returnDate}</p>
            )}
            <p style={{ fontSize: "12px", color: "#5b6efe", marginTop: "8px", fontWeight: 500 }}>
              Return journey will be on the same route.
            </p>
          </div>
        )}
      </div>

      {/* ── Divider ── */}
      <div style={{ height: "1px", background: "#f1f5f9", margin: "4px 0 24px" }} />

      {/* ── Passenger count ── */}
      <div style={{ marginBottom: "8px" }}>
        <FieldLabel>Number of Passengers</FieldLabel>
        <div className="flex items-center gap-3" style={{ marginTop: "8px" }}>
          <button
            onClick={() => setState({ passengers: Math.max(1, state.passengers - 1) })}
            className="flex items-center justify-center focus:outline-none focus-visible:ring-2 transition-all"
            style={{
              width: "48px", height: "48px", borderRadius: "12px",
              border: "1.5px solid #e2e8f0", background: "#ffffff",
              cursor: state.passengers <= 1 ? "not-allowed" : "pointer",
              opacity: state.passengers <= 1 ? 0.4 : 1,
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
            disabled={state.passengers <= 1}
            aria-label="Decrease passengers"
          >
            <Minus size={18} style={{ color: "#334155" }} />
          </button>

          <div
            className="flex items-center justify-center gap-2"
            style={{
              flex: 1, height: "48px", borderRadius: "12px",
              border: "1.5px solid #e2e8f0", background: "#f8fafc",
              fontSize: "16px", fontWeight: 700, color: "#0f172a",
            }}
          >
            <Users size={16} style={{ color: "#5b6efe" }} aria-hidden="true" />
            {state.passengers} Adult{state.passengers > 1 ? "s" : ""}
          </div>

          <button
            onClick={() => setState({ passengers: Math.min(6, state.passengers + 1) })}
            className="flex items-center justify-center focus:outline-none focus-visible:ring-2 transition-all"
            style={{
              width: "48px", height: "48px", borderRadius: "12px",
              border: "1.5px solid #e2e8f0", background: "#ffffff",
              cursor: state.passengers >= 6 ? "not-allowed" : "pointer",
              opacity: state.passengers >= 6 ? 0.4 : 1,
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
            disabled={state.passengers >= 6}
            aria-label="Increase passengers"
          >
            <Plus size={18} style={{ color: "#334155" }} />
          </button>
        </div>
        <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "8px" }}>
          Maximum 6 passengers per booking.
        </p>
      </div>

      <NavButtons onBack={onBack} onNext={handleNext} nextLabel="Select Seats →" />

      <style>{`
        @keyframes ys-slideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </StepCard>
  );
}
