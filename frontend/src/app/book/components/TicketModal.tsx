"use client";

import { X, Download, Share2 } from "lucide-react";
import { BookingState } from "../types";

/* ── Barcode SVG strip ────────────────────────────────────── */
function Barcode() {
  const bars = [3,1,2,1,3,2,1,2,1,3,1,2,3,1,2,1,3,1,2,1,1,3,2,1,3,1,2,1,3,2,1,1,2,3,1];
  let x = 0;
  return (
    <svg width="56" height="120" viewBox="0 0 56 120" aria-label="Barcode" role="img">
      {bars.map((w, i) => {
        const bar = (
          <rect key={i} x={x} y={0} width={w} height={120}
            fill={i % 2 === 0 ? "#ffffff" : "transparent"} />
        );
        x += w + 1;
        return bar;
      })}
      <rect x={0} y={0} width={56} height={120} fill="none" />
      {/* simplified real-looking bars */}
      {Array.from({ length: 28 }, (_, i) => (
        <rect key={`b${i}`} x={i * 2} y={0} width={i % 3 === 0 ? 2 : 1} height={120}
          fill={i % 2 === 0 ? "#ffffff" : "#1e2a3a"} opacity={i % 5 === 0 ? 1 : 0.85} />
      ))}
    </svg>
  );
}

/* ── Train SVG illustration (simplified modern train) ────── */
function TrainIllustration() {
  return (
    <svg width="180" height="90" viewBox="0 0 180 90" fill="none" aria-hidden="true">
      {/* Body */}
      <rect x="10" y="30" width="150" height="42" rx="12" fill="#4a7fc1" />
      {/* Nose */}
      <ellipse cx="160" cy="51" rx="20" ry="18" fill="#5b8fd1" />
      <path d="M140 33 Q175 33 178 51 Q175 69 140 69 Z" fill="#5b8fd1" />
      {/* Roof */}
      <rect x="15" y="20" width="120" height="14" rx="6" fill="#3a6aaa" />
      {/* Windows */}
      <rect x="30"  y="37" width="22" height="16" rx="4" fill="#a8d4f5" opacity="0.9" />
      <rect x="62"  y="37" width="22" height="16" rx="4" fill="#a8d4f5" opacity="0.9" />
      <rect x="94"  y="37" width="22" height="16" rx="4" fill="#a8d4f5" opacity="0.9" />
      <rect x="148" y="40" width="14" height="12" rx="3" fill="#a8d4f5" opacity="0.7" />
      {/* Stripe */}
      <rect x="10" y="56" width="150" height="4" rx="2" fill="#2d5a99" />
      {/* Wheels */}
      <circle cx="40"  cy="76" r="10" fill="#2d3a50" />
      <circle cx="40"  cy="76" r="5"  fill="#4a5568" />
      <circle cx="80"  cy="76" r="10" fill="#2d3a50" />
      <circle cx="80"  cy="76" r="5"  fill="#4a5568" />
      <circle cx="120" cy="76" r="10" fill="#2d3a50" />
      <circle cx="120" cy="76" r="5"  fill="#4a5568" />
      {/* Rail */}
      <rect x="0" y="85" width="180" height="3" rx="1.5" fill="#2d3a50" opacity="0.4" />
    </svg>
  );
}

/* ── Field label + value ─────────────────────────────────── */
function Field({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <p style={{ fontSize: "8px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "2px" }}>{label}</p>
      <p style={{ fontSize: mono ? "13px" : "14px", fontWeight: 800, color: "#1e293b", letterSpacing: mono ? "0.06em" : "0.02em", fontFamily: mono ? "monospace" : "inherit" }}>{value}</p>
    </div>
  );
}

/* ── Stub field (small, right panel) ────────────────────── */
function StubField({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: "8px" }}>
      <p style={{ fontSize: "7px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1px" }}>{label}</p>
      <p style={{ fontSize: "12px", fontWeight: 800, color: "#1e293b", letterSpacing: "0.04em" }}>{value}</p>
    </div>
  );
}

/* ── Zigzag tear line SVG ────────────────────────────────── */
function TearLine({ vertical = false }: { vertical?: boolean }) {
  if (vertical) {
    return (
      <svg width="16" height="340" viewBox="0 0 16 340" aria-hidden="true" style={{ flexShrink: 0 }}>
        <path d={`M8 0 ${Array.from({ length: 34 }, (_, i) => `L${i % 2 === 0 ? 14 : 2} ${(i + 1) * 10}`).join(" ")}`}
          stroke="#cbd5e1" strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
      </svg>
    );
  }
  return (
    <svg width="100%" height="16" viewBox="0 0 600 16" preserveAspectRatio="none" aria-hidden="true">
      <path d={`M0 8 ${Array.from({ length: 60 }, (_, i) => `L${(i + 1) * 10} ${i % 2 === 0 ? 2 : 14}`).join(" ")}`}
        stroke="#cbd5e1" strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
    </svg>
  );
}

/* ── Main ticket modal ───────────────────────────────────── */
type Props = {
  state: BookingState;
  onClose: () => void;
};

export default function TicketModal({ state, onClose }: Props) {
  const passenger = state.passengerDetails[0];
  const seat      = state.selectedSeats[0];
  const classCode = state.selectedClass?.code ?? "SL";
  const classLabel = state.selectedClass?.label ?? "Sleeper";
  const price     = `₹${state.fare.total.toLocaleString("en-IN")}`;

  // Format date nicely
  const formatDate = (d: string) => {
    if (!d) return "12 SEP 2024";
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? d.toUpperCase()
      : dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
  };

  const printTicket = () => window.print();

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(15,17,26,0.75)", backdropFilter: "blur(4px)" }}
      role="dialog" aria-modal="true" aria-label="Train ticket"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="flex flex-col items-center gap-4 w-full" style={{ maxWidth: "720px" }}>

        {/* ── Action bar above ticket ── */}
        <div className="flex items-center justify-between w-full px-1">
          <p style={{ fontSize: "13px", color: "#a5b4fc", fontWeight: 500 }}>
            Your boarding pass is ready
          </p>
          <div className="flex items-center gap-2">
            <button onClick={printTicket}
              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity focus:outline-none"
              style={{ background: "#748efe", color: "white", borderRadius: "8px", padding: "7px 14px", fontSize: "13px", fontWeight: 600, border: "none", cursor: "pointer" }}>
              <Download size={14} /> Download PDF
            </button>
            <button
              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity focus:outline-none"
              style={{ background: "#25d366", color: "white", borderRadius: "8px", padding: "7px 14px", fontSize: "13px", fontWeight: 600, border: "none", cursor: "pointer" }}>
              <Share2 size={14} /> Share
            </button>
            <button onClick={onClose}
              className="flex items-center justify-center rounded-full hover:bg-white/10 transition-colors focus:outline-none"
              style={{ width: "34px", height: "34px", color: "white" }} aria-label="Close">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ══ TICKET BODY ═════════════════════════════════ */}
        <div
          id="printable-ticket"
          className="w-full flex"
          style={{
            background: "#f8faff",
            borderRadius: "16px",
            boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
            overflow: "hidden",
            fontFamily: "'Google Sans', 'Segoe UI', system-ui, sans-serif",
          }}
        >

          {/* ── MAIN SECTION (left + center) ── */}
          <div className="flex flex-col flex-1" style={{ minWidth: 0 }}>

            {/* Top header bar */}
            <div style={{ background: "#1e2a3a", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: "9px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.15em" }}>🎫</span>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#e2e8f0", letterSpacing: "0.12em" }}>TRAIN TICKET</span>
              </div>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#e2e8f0", letterSpacing: "0.12em" }}>BOARDING PASS</span>
            </div>

            {/* Main body */}
            <div style={{ display: "flex", flex: 1, background: "#f0f4f8" }}>

              {/* Left: train illustration + passenger name */}
              <div style={{ width: "200px", flexShrink: 0, background: "#e8eff7", padding: "18px 16px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontSize: "8px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.12em", marginBottom: "4px" }}>NAME OF PASSENGER</p>
                  <p style={{ fontSize: "16px", fontWeight: 900, color: "#1e293b", letterSpacing: "0.08em", lineHeight: "1.2" }}>
                    {(passenger?.name || "PASSENGER NAME").toUpperCase()}
                  </p>
                </div>
                <div style={{ margin: "12px 0" }}>
                  <TrainIllustration />
                </div>
                <div>
                  <p style={{ fontSize: "8px", color: "#94a3b8", letterSpacing: "0.08em" }}>PNR</p>
                  <p style={{ fontSize: "13px", fontWeight: 800, color: "#1e293b", letterSpacing: "0.1em", fontFamily: "monospace" }}>
                    {state.pnr}
                  </p>
                </div>
              </div>

              {/* Center: journey details */}
              <div style={{ flex: 1, padding: "18px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px", alignContent: "start" }}>

                <Field label="Price"      value={price} />
                <Field label="Train"      value={`${state.trainName}`} />

                <Field label="From"       value={state.from.toUpperCase()} />
                <Field label="Departure"  value={`${state.passengerDetails.length > 0 ? "06:00 AM" : "—"}`} />

                <Field label="To"         value={state.to.toUpperCase()} />
                <Field label="Arrive"     value="10:00 AM" />

                <Field label="Date"       value={formatDate(state.departDate)} />
                <Field label="Seat"       value={seat ? `${seat.number} (${seat.type})` : classCode} />

                {/* Class badge */}
                <div style={{ gridColumn: "1 / -1", marginTop: "6px" }}>
                  <span style={{
                    display: "inline-block",
                    background: "#1e2a3a", color: "#a5b4fc",
                    borderRadius: "6px", padding: "3px 10px",
                    fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em",
                  }}>
                    {classLabel.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Barcode strip (rotated text label) */}
              <div style={{
                width: "48px", flexShrink: 0,
                background: "#1e2a3a",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                padding: "10px 0",
                gap: "8px",
              }}>
                <Barcode />
                <div style={{ transform: "rotate(90deg)", whiteSpace: "nowrap" }}>
                  <span style={{ fontSize: "7px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.15em" }}>
                    {classLabel.toUpperCase().replace(" ", " ")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── TEAR LINE ── */}
          <div style={{ display: "flex", alignItems: "stretch" }}>
            <TearLine vertical />
          </div>

          {/* ── STUB (right panel) ── */}
          <div style={{ width: "160px", flexShrink: 0, display: "flex", flexDirection: "column" }}>

            {/* Stub header */}
            <div style={{ background: "#1e2a3a", padding: "10px 14px" }}>
              <p style={{ fontSize: "8px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.12em", marginBottom: "1px" }}>BOARDING PASS</p>
              <p style={{ fontSize: "11px", fontWeight: 800, color: "#e2e8f0", letterSpacing: "0.08em" }}>
                {classLabel.toUpperCase().split(" ").slice(0, 2).join(" ")}
              </p>
            </div>

            {/* Stub body */}
            <div style={{ flex: 1, background: "#f0f4f8", padding: "14px" }}>
              <StubField label="Name of Passenger" value={(passenger?.name || "PASSENGER").toUpperCase()} />
              <StubField label="From" value={state.from.split(" ")[0].toUpperCase()} />
              <StubField label="To"   value={state.to.split(" ")[0].toUpperCase()} />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px", marginTop: "6px" }}>
                <StubField label="Train" value={state.trainNumber} />
                <StubField label="Seat"  value={seat ? seat.number : classCode} />
              </div>

              <div style={{ marginTop: "10px", borderTop: "1px dashed #cbd5e1", paddingTop: "10px" }}>
                <p style={{ fontSize: "7px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", marginBottom: "4px" }}>DATE</p>
                <p style={{ fontSize: "11px", fontWeight: 800, color: "#1e293b", letterSpacing: "0.04em" }}>
                  {formatDate(state.departDate)}
                </p>
              </div>

              <div style={{ marginTop: "10px", borderTop: "1px dashed #cbd5e1", paddingTop: "10px" }}>
                <p style={{ fontSize: "7px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", marginBottom: "4px" }}>TOTAL FARE</p>
                <p style={{ fontSize: "13px", fontWeight: 800, color: "#748efe", letterSpacing: "0.04em" }}>{price}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Print hint */}
        <p style={{ fontSize: "12px", color: "#64748b", textAlign: "center" }}>
          Tip: Use browser print (Ctrl+P / Cmd+P) to save as PDF
        </p>
      </div>

      {/* Print-only styles */}
      <style>{`
        @media print {
          body > * { display: none !important; }
          #printable-ticket { display: flex !important; position: fixed; top: 0; left: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
}
