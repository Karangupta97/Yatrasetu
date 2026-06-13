"use client";

import { useState } from "react";
import { MapPin, Flag, Calendar, Users, ArrowLeftRight, Train, Bus } from "lucide-react";
import StepCard, { FieldLabel, FieldInput, NavButtons } from "../components/StepCard";
import { BookingState, SEAT_CLASSES, SeatClass } from "../types";

const CITIES = [
  "New Delhi", "Mumbai CSMT", "Chennai Central", "Kolkata Howrah",
  "Bengaluru", "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
  "Bhopal", "Nagpur", "Surat", "Vadodara", "Kota Jn",
];

export default function Step1Journey({
  state, setState, onNext, onBack,
}: {
  state: BookingState;
  setState: (s: Partial<BookingState>) => void;
  onNext: () => void;
  onBack?: () => void;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [swapAnim, setSwapAnim] = useState(false);

  const handleSwap = () => {
    setSwapAnim(true);
    setState({ from: state.to, to: state.from });
    setTimeout(() => setSwapAnim(false), 300);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!state.from.trim())        e.from = "Please select a departure city";
    if (!state.to.trim())          e.to   = "Please select a destination city";
    if (state.from === state.to && state.from) e.to = "Destination must differ from departure";
    if (!state.departDate)         e.departDate = "Please select a travel date";
    if (!state.selectedClass)      e.seatClass  = "Please select a seat class";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validate()) onNext(); };

  return (
    <StepCard>
      <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#181d2a", marginBottom: "6px" }}>
        Plan your journey
      </h2>
      <p style={{ fontSize: "14px", color: "#9ca3af", marginBottom: "24px" }}>
        Tell us where you're going and we'll find the best options.
      </p>

      {/* Transport type */}
      <div className="mb-5">
        <FieldLabel>Transport Type</FieldLabel>
        <div className="flex gap-3">
          {(["train", "bus"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setState({ transportType: t })}
              className="flex items-center gap-2 flex-1 focus:outline-none focus-visible:ring-2 transition-all"
              style={{
                padding: "12px 16px", borderRadius: "10px",
                border: `2px solid ${state.transportType === t ? "#748efe" : "#e8ebed"}`,
                background: state.transportType === t ? "rgba(116,142,254,0.06)" : "#ffffff",
                cursor: "pointer", fontSize: "14px", fontWeight: 600,
                color: state.transportType === t ? "#748efe" : "#6b7280",
              }}
              aria-pressed={state.transportType === t}
            >
              {t === "train" ? <Train size={16} /> : <Bus size={16} />}
              {t === "train" ? "Train" : "Bus"}
            </button>
          ))}
        </div>
      </div>

      {/* From / Swap / To */}
      <div className="flex items-end gap-3 mb-4 flex-col sm:flex-row">
        <div className="flex-1 w-full">
          <FieldLabel required>From</FieldLabel>
          <div style={{ position: "relative" }}>
            <div
              className="flex items-center gap-2"
              style={{
                border: `1.5px solid ${errors.from ? "#dc2626" : "#e8ebed"}`,
                borderRadius: "10px", padding: "0 14px", height: "48px", background: "#ffffff",
              }}
            >
              <MapPin size={16} style={{ color: "#9ca3af", flexShrink: 0 }} />
              <input
                list="from-cities"
                value={state.from}
                onChange={(e) => setState({ from: e.target.value })}
                placeholder="Departure city"
                className="flex-1 bg-transparent border-none outline-none focus:ring-0"
                style={{ fontSize: "14px", color: "#181d2a" }}
                aria-label="Departure city"
              />
              <datalist id="from-cities">
                {CITIES.map((c) => <option key={c} value={c} />)}
              </datalist>
            </div>
            {errors.from && <p style={{ fontSize: "12px", color: "#dc2626", marginTop: "4px" }}>{errors.from}</p>}
          </div>
        </div>

        {/* Swap */}
        <div className="flex-shrink-0 pb-1">
          <button
            onClick={handleSwap}
            className="flex items-center justify-center focus:outline-none focus-visible:ring-2 hover:opacity-85 active:scale-95"
            style={{
              width: "40px", height: "40px", borderRadius: "50%",
              background: "#181d2a", color: "white",
              transform: swapAnim ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
            aria-label="Swap departure and destination"
          >
            <ArrowLeftRight size={16} />
          </button>
        </div>

        <div className="flex-1 w-full">
          <FieldLabel required>To</FieldLabel>
          <div style={{ position: "relative" }}>
            <div
              className="flex items-center gap-2"
              style={{
                border: `1.5px solid ${errors.to ? "#dc2626" : "#e8ebed"}`,
                borderRadius: "10px", padding: "0 14px", height: "48px", background: "#ffffff",
              }}
            >
              <Flag size={16} style={{ color: "#9ca3af", flexShrink: 0 }} />
              <input
                list="to-cities"
                value={state.to}
                onChange={(e) => setState({ to: e.target.value })}
                placeholder="Destination city"
                className="flex-1 bg-transparent border-none outline-none focus:ring-0"
                style={{ fontSize: "14px", color: "#181d2a" }}
                aria-label="Destination city"
              />
              <datalist id="to-cities">
                {CITIES.map((c) => <option key={c} value={c} />)}
              </datalist>
            </div>
            {errors.to && <p style={{ fontSize: "12px", color: "#dc2626", marginTop: "4px" }}>{errors.to}</p>}
          </div>
        </div>
      </div>

      {/* Dates row */}
      <div className="flex gap-4 mb-4 flex-col sm:flex-row">
        <div className="flex-1">
          <FieldLabel required>Departure Date</FieldLabel>
          <FieldInput
            type="date"
            value={state.departDate}
            onChange={(v) => setState({ departDate: v })}
            error={errors.departDate}
            icon={<Calendar size={16} />}
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <FieldLabel>Return Date</FieldLabel>
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <button
                role="switch"
                aria-checked={state.returnEnabled}
                onClick={() => setState({ returnEnabled: !state.returnEnabled })}
                className={`toggle-track focus:outline-none ${state.returnEnabled ? "active" : ""}`}
                style={{ transform: "scale(0.85)" }}
              >
                <div className="toggle-thumb" />
              </button>
              <span style={{ fontSize: "12px", color: "#6b7280" }}>Return</span>
            </label>
          </div>
          <FieldInput
            type="date"
            value={state.returnDate}
            onChange={(v) => setState({ returnDate: v })}
            disabled={!state.returnEnabled}
            icon={<Calendar size={16} />}
          />
        </div>
      </div>

      {/* Passengers */}
      <div className="mb-5">
        <FieldLabel>Passengers</FieldLabel>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setState({ passengers: Math.max(1, state.passengers - 1) })}
            style={{
              width: "40px", height: "40px", borderRadius: "10px",
              border: "1.5px solid #e8ebed", background: "#ffffff",
              fontSize: "20px", cursor: "pointer", color: "#181d2a",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
            aria-label="Decrease passenger count"
          >−</button>
          <span className="flex items-center gap-2" style={{ fontSize: "16px", fontWeight: 600, color: "#181d2a", minWidth: "80px", justifyContent: "center" }}>
            <Users size={16} style={{ color: "#9ca3af" }} />
            {state.passengers} Adult{state.passengers > 1 ? "s" : ""}
          </span>
          <button
            onClick={() => setState({ passengers: Math.min(6, state.passengers + 1) })}
            style={{
              width: "40px", height: "40px", borderRadius: "10px",
              border: "1.5px solid #e8ebed", background: "#ffffff",
              fontSize: "20px", cursor: "pointer", color: "#181d2a",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
            aria-label="Increase passenger count"
          >+</button>
        </div>
      </div>

      {/* Seat class */}
      <div className="mb-2">
        <FieldLabel required>Seat Class</FieldLabel>
        {errors.seatClass && (
          <p style={{ fontSize: "12px", color: "#dc2626", marginBottom: "6px" }}>{errors.seatClass}</p>
        )}
        <div className="grid grid-cols-2 gap-3">
          {SEAT_CLASSES.map((cls) => {
            const selected = state.selectedClass?.code === cls.code;
            const low = cls.available <= 5;
            return (
              <button
                key={cls.code}
                onClick={() => setState({ selectedClass: cls })}
                className="flex flex-col text-left focus:outline-none focus-visible:ring-2 transition-all"
                style={{
                  padding: "14px 16px", borderRadius: "12px",
                  border: `2px solid ${selected ? "#748efe" : "#e8ebed"}`,
                  background: selected ? "rgba(116,142,254,0.06)" : "#ffffff",
                  cursor: "pointer",
                }}
                aria-pressed={selected}
                aria-label={`${cls.label} — ₹${cls.price}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#181d2a" }}>{cls.code}</span>
                  {low && (
                    <span style={{ fontSize: "10px", fontWeight: 600, color: "#d97706", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "9999px", padding: "1px 7px" }}>
                      {cls.available} left
                    </span>
                  )}
                </div>
                <span style={{ fontSize: "11px", color: "#6b7280", marginBottom: "6px" }}>{cls.label}</span>
                <span style={{ fontSize: "16px", fontWeight: 700, color: selected ? "#748efe" : "#181d2a" }}>
                  ₹{cls.price.toLocaleString("en-IN")}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <NavButtons onBack={onBack} onNext={handleNext} nextLabel="Search Trains →" />
    </StepCard>
  );
}
