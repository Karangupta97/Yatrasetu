"use client";

import { useRef, useCallback, useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  CalendarDays,
  ArrowRight,
  Check,
} from "lucide-react";
import TimePicker from "./TimePicker";

type TimeVal = { hour: number; minute: number; period: "AM" | "PM" };

export type Filters = {
  seatClasses: string[];
  priceMin: number;
  priceMax: number;
  fromTime: TimeVal;
  toTime: TimeVal;
};

type FilterSidebarProps = {
  filters: Filters;
  onChange: (f: Filters) => void;
  onApply: () => void;
};

const PRICE_BAR_HEIGHTS = [20, 35, 55, 70, 85, 95, 100, 88, 72, 58, 45, 38, 28, 18];
const PRICE_MIN_ABSOLUTE = 1000;
const PRICE_MAX_ABSOLUTE = 5000;
const PRICE_RANGE = PRICE_MAX_ABSOLUTE - PRICE_MIN_ABSOLUTE;
const MIN_GAP = 200;

const SEAT_CLASSES = [
  { key: "Sleeper", label: "Sleeper" },
  { key: "3A",      label: "AC 3 Tier (3A)" },
  { key: "2A",      label: "AC 2 Tier (2A)" },
  { key: "1A",      label: "AC First Class (1A)" },
];

function formatTime(t: TimeVal) {
  return `${String(t.hour).padStart(2, "0")}:${String(t.minute).padStart(2, "0")} ${t.period}`;
}

export default function FilterSidebar({ filters, onChange, onApply }: FilterSidebarProps) {
  const [timeOpen, setTimeOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [classOpen, setClassOpen] = useState(true);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const fromBtnRef = useRef<HTMLButtonElement>(null);
  const toBtnRef   = useRef<HTMLButtonElement>(null);

  /* ── Responsive dual-thumb slider via pointer events ── */
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<"min" | "max" | null>(null);

  const pctToPrice = (pct: number) =>
    Math.round((PRICE_MIN_ABSOLUTE + (pct / 100) * PRICE_RANGE) / 100) * 100;

  const getPct = useCallback((clientX: number) => {
    if (!trackRef.current) return 0;
    const { left, width } = trackRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(100, ((clientX - left) / width) * 100));
  }, []);

  const onPointerDown = (thumb: "min" | "max") => (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragging.current = thumb;
  };

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      const pct = getPct(e.clientX);
      const price = pctToPrice(pct);
      if (dragging.current === "min") {
        if (price < filters.priceMax - MIN_GAP)
          onChange({ ...filters, priceMin: price });
      } else {
        if (price > filters.priceMin + MIN_GAP)
          onChange({ ...filters, priceMax: price });
      }
    },
    [filters, onChange, getPct]
  );

  const onPointerUp = useCallback(() => {
    dragging.current = null;
  }, []);

  const minPct = ((filters.priceMin - PRICE_MIN_ABSOLUTE) / PRICE_RANGE) * 100;
  const maxPct = ((filters.priceMax - PRICE_MIN_ABSOLUTE) / PRICE_RANGE) * 100;

  /* active bar count based on priceMax */
  const activeBarCount = Math.round((maxPct / 100) * PRICE_BAR_HEIGHTS.length);

  const toggleClass = (key: string) => {
    const next = filters.seatClasses.includes(key)
      ? filters.seatClasses.filter((c) => c !== key)
      : [...filters.seatClasses, key];
    onChange({ ...filters, seatClasses: next });
  };

  const resetFilters = () => {
    onChange({
      seatClasses: [],
      priceMin: PRICE_MIN_ABSOLUTE,
      priceMax: PRICE_MAX_ABSOLUTE,
      fromTime: { hour: 7, minute: 0, period: "AM" },
      toTime:   { hour: 6, minute: 0, period: "PM" },
    });
  };

  return (
    <aside
      style={{
        width: "260px",
        background: "#ffffff",
        borderRadius: "12px",
        border: "1px solid #e8ebed",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
      }}
      aria-label="Search filters"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-4">
        <span style={{ fontSize: "16px", fontWeight: 600, color: "#181d2a" }}>Filters</span>
        <button
          onClick={resetFilters}
          className="focus:outline-none focus-visible:ring-2 rounded"
          style={{ fontSize: "14px", color: "#748efe", fontWeight: 500 }}
          aria-label="Reset all filters"
        >
          Reset
        </button>
      </div>

      {/* ── TIME ── */}
      <div>
        <button
          className="flex items-center justify-between w-full py-2 focus:outline-none focus-visible:ring-2 rounded"
          onClick={() => setTimeOpen((v) => !v)}
          aria-expanded={timeOpen}
        >
          <span style={{ fontSize: "14px", fontWeight: 600, color: "#181d2a" }}>Time</span>
          {timeOpen
            ? <ChevronUp size={16} style={{ color: "#9ca3af" }} />
            : <ChevronDown size={16} style={{ color: "#9ca3af" }} />}
        </button>

        {timeOpen && (
          <div style={{ marginTop: "8px", marginBottom: "12px" }}>
            <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "8px" }}>
              Departure date
            </p>
            <div className="flex items-center gap-2">
              {/* From chip */}
              <div className="flex-1">
                <button
                  ref={fromBtnRef}
                  onClick={() => { setShowFromPicker((v) => !v); setShowToPicker(false); }}
                  className="flex items-center gap-1.5 w-full focus:outline-none hover:bg-gray-50 transition-colors"
                  style={{
                    border: "1px solid #e8ebed", borderRadius: "8px",
                    height: "36px", padding: "0 8px",
                    fontSize: "12px", color: "#181d2a", fontWeight: 500,
                    background: "#ffffff",
                  }}
                  aria-label={`From: ${formatTime(filters.fromTime)}`}
                  aria-expanded={showFromPicker}
                  aria-haspopup="dialog"
                >
                  <CalendarDays size={12} style={{ color: "#9ca3af", flexShrink: 0 }} />
                  <span>{formatTime(filters.fromTime)}</span>
                </button>
                {showFromPicker && (
                  <TimePicker
                    value={filters.fromTime}
                    onChange={(v) => onChange({ ...filters, fromTime: v })}
                    onClose={() => setShowFromPicker(false)}
                    triggerRef={fromBtnRef}
                  />
                )}
              </div>

              <ArrowRight size={14} style={{ color: "#9ca3af", flexShrink: 0 }} />

              {/* To chip */}
              <div className="flex-1">
                <button
                  ref={toBtnRef}
                  onClick={() => { setShowToPicker((v) => !v); setShowFromPicker(false); }}
                  className="flex items-center gap-1.5 w-full focus:outline-none hover:bg-gray-50 transition-colors"
                  style={{
                    border: "1px solid #e8ebed", borderRadius: "8px",
                    height: "36px", padding: "0 8px",
                    fontSize: "12px", color: "#181d2a", fontWeight: 500,
                    background: "#ffffff",
                  }}
                  aria-label={`To: ${formatTime(filters.toTime)}`}
                  aria-expanded={showToPicker}
                  aria-haspopup="dialog"
                >
                  <CalendarDays size={12} style={{ color: "#9ca3af", flexShrink: 0 }} />
                  <span>{formatTime(filters.toTime)}</span>
                </button>
                {showToPicker && (
                  <TimePicker
                    value={filters.toTime}
                    onChange={(v) => onChange({ ...filters, toTime: v })}
                    onClose={() => setShowToPicker(false)}
                    triggerRef={toBtnRef}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ height: "1px", background: "#e8ebed", margin: "4px 0 8px" }} />

      {/* ── PRICE RANGE ── */}
      <div>
        <button
          className="flex items-center justify-between w-full py-2 focus:outline-none focus-visible:ring-2 rounded"
          onClick={() => setPriceOpen((v) => !v)}
          aria-expanded={priceOpen}
        >
          <span style={{ fontSize: "14px", fontWeight: 600, color: "#181d2a" }}>Price range</span>
          {priceOpen
            ? <ChevronUp size={16} style={{ color: "#9ca3af" }} />
            : <ChevronDown size={16} style={{ color: "#9ca3af" }} />}
        </button>

        {priceOpen && (
          <div style={{ marginTop: "8px", marginBottom: "12px" }}>

            {/* Bar chart */}
            <div
              className="flex items-end gap-[3px] mb-3"
              style={{ height: "52px" }}
              aria-hidden="true"
            >
              {PRICE_BAR_HEIGHTS.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm transition-colors duration-200"
                  style={{
                    height: `${h}%`,
                    background: i < activeBarCount ? "#748efe" : "#e8ebed",
                    minWidth: "6px",
                  }}
                />
              ))}
            </div>

            {/* Price labels */}
            <div className="flex justify-between mb-3">
              <span style={{ fontSize: "11px", color: "#9ca3af" }}>
                ₹{filters.priceMin.toLocaleString("en-IN")}
              </span>
              <span style={{ fontSize: "11px", color: "#9ca3af" }}>
                ₹{filters.priceMax.toLocaleString("en-IN")}
              </span>
            </div>

            {/*
              ── Responsive single-line dual-thumb slider ──
              Uses pointer events on the track + two draggable thumb divs.
              No stacked <input type="range"> — fully responsive to container width.
            */}
            <div
              ref={trackRef}
              className="relative"
              style={{ height: "24px", display: "flex", alignItems: "center", cursor: "default" }}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
              role="group"
              aria-label="Price range slider"
            >
              {/* Grey base track */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute", left: 0, right: 0,
                  height: "4px", borderRadius: "9999px",
                  background: "#e8ebed",
                }}
              />

              {/* Indigo active fill */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: `${minPct}%`,
                  width: `${maxPct - minPct}%`,
                  height: "4px", borderRadius: "9999px",
                  background: "#748efe",
                  pointerEvents: "none",
                }}
              />

              {/* MIN thumb */}
              <div
                role="slider"
                tabIndex={0}
                aria-label="Minimum price"
                aria-valuemin={PRICE_MIN_ABSOLUTE}
                aria-valuemax={PRICE_MAX_ABSOLUTE}
                aria-valuenow={filters.priceMin}
                onPointerDown={onPointerDown("min")}
                onKeyDown={(e) => {
                  const step = e.shiftKey ? 500 : 100;
                  if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                    e.preventDefault();
                    const v = Math.max(PRICE_MIN_ABSOLUTE, filters.priceMin - step);
                    if (v < filters.priceMax - MIN_GAP) onChange({ ...filters, priceMin: v });
                  }
                  if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                    e.preventDefault();
                    const v = Math.min(filters.priceMax - MIN_GAP, filters.priceMin + step);
                    onChange({ ...filters, priceMin: v });
                  }
                }}
                style={{
                  position: "absolute",
                  left: `${minPct}%`,
                  transform: "translateX(-50%)",
                  width: "18px", height: "18px",
                  borderRadius: "50%",
                  background: "#ffffff",
                  border: "2.5px solid #748efe",
                  boxShadow: "0 1px 4px rgba(116,142,254,0.4)",
                  cursor: "grab",
                  zIndex: 3,
                  touchAction: "none",
                  transition: "box-shadow 0.15s",
                }}
                className="focus:outline-none focus-visible:ring-2 hover:shadow-[0_0_0_5px_rgba(116,142,254,0.18)]"
              />

              {/* MAX thumb */}
              <div
                role="slider"
                tabIndex={0}
                aria-label="Maximum price"
                aria-valuemin={PRICE_MIN_ABSOLUTE}
                aria-valuemax={PRICE_MAX_ABSOLUTE}
                aria-valuenow={filters.priceMax}
                onPointerDown={onPointerDown("max")}
                onKeyDown={(e) => {
                  const step = e.shiftKey ? 500 : 100;
                  if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                    e.preventDefault();
                    const v = Math.max(filters.priceMin + MIN_GAP, filters.priceMax - step);
                    onChange({ ...filters, priceMax: v });
                  }
                  if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                    e.preventDefault();
                    const v = Math.min(PRICE_MAX_ABSOLUTE, filters.priceMax + step);
                    onChange({ ...filters, priceMax: v });
                  }
                }}
                style={{
                  position: "absolute",
                  left: `${maxPct}%`,
                  transform: "translateX(-50%)",
                  width: "18px", height: "18px",
                  borderRadius: "50%",
                  background: "#ffffff",
                  border: "2.5px solid #748efe",
                  boxShadow: "0 1px 4px rgba(116,142,254,0.4)",
                  cursor: "grab",
                  zIndex: 4,
                  touchAction: "none",
                  transition: "box-shadow 0.15s",
                }}
                className="focus:outline-none focus-visible:ring-2 hover:shadow-[0_0_0_5px_rgba(116,142,254,0.18)]"
              />
            </div>

          </div>
        )}
      </div>

      <div style={{ height: "1px", background: "#e8ebed", margin: "4px 0 8px" }} />

      {/* ── SEAT CLASS (replaces Facilities) ── */}
      <div style={{ marginBottom: "16px" }}>
        <button
          className="flex items-center justify-between w-full py-2 focus:outline-none focus-visible:ring-2 rounded"
          onClick={() => setClassOpen((v) => !v)}
          aria-expanded={classOpen}
        >
          <span style={{ fontSize: "14px", fontWeight: 600, color: "#181d2a" }}>Seat Class</span>
          {classOpen
            ? <ChevronUp size={16} style={{ color: "#9ca3af" }} />
            : <ChevronDown size={16} style={{ color: "#9ca3af" }} />}
        </button>

        {classOpen && (
          <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {SEAT_CLASSES.map(({ key, label }) => {
              const isChecked = filters.seatClasses.includes(key);
              return (
                <label
                  key={key}
                  className="flex items-center gap-2.5 cursor-pointer select-none"
                  style={{ minHeight: "28px" }}
                >
                  <button
                    role="checkbox"
                    aria-checked={isChecked}
                    onClick={() => toggleClass(key)}
                    className="focus:outline-none focus-visible:ring-2 flex items-center justify-center flex-shrink-0"
                    style={{
                      width: "18px", height: "18px",
                      borderRadius: "4px",
                      border: isChecked ? "none" : "1.5px solid #e8ebed",
                      background: isChecked ? "#748efe" : "transparent",
                      transition: "all 0.15s ease",
                      cursor: "pointer",
                    }}
                    aria-label={`Filter by ${label}`}
                  >
                    {isChecked && <Check size={11} color="white" strokeWidth={3} />}
                  </button>
                  <span style={{ fontSize: "14px", color: "#181d2a", lineHeight: "1.3" }}>
                    {label}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Apply Filters ── */}
      <button
        onClick={onApply}
        className="w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-opacity hover:opacity-90 active:scale-[0.98]"
        style={{
          background: "#181d2a", color: "#ffffff",
          borderRadius: "12px", height: "44px",
          fontSize: "14px", fontWeight: 600,
          marginTop: "auto", cursor: "pointer",
        }}
        aria-label="Apply filters"
      >
        Apply Filters
      </button>
    </aside>
  );
}
