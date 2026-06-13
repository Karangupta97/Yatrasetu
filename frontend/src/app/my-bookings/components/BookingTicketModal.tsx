"use client";

import { X, Download, Share2 } from "lucide-react";
import { Booking } from "../data/mockBookings";

/* ── Barcode ──────────────────────────────────────────────── */
function Barcode() {
  return (
    <svg width="52" height="110" viewBox="0 0 52 110" aria-label="Barcode" role="img">
      {Array.from({ length: 26 }, (_, i) => (
        <rect key={i}
          x={i * 2} y={0}
          width={i % 3 === 0 ? 2 : 1} height={110}
          fill={i % 2 === 0 ? "#1e2a3a" : "#3a4a60"}
          opacity={i % 5 === 0 ? 1 : 0.8}
        />
      ))}
    </svg>
  );
}

/* ── Train illustration ───────────────────────────────────── */
function TrainSVG() {
  return (
    <svg width="170" height="80" viewBox="0 0 180 90" fill="none" aria-hidden="true">
      <rect x="10" y="30" width="150" height="42" rx="12" fill="#4a7fc1" />
      <path d="M140 33 Q175 33 178 51 Q175 69 140 69 Z" fill="#5b8fd1" />
      <rect x="15" y="20" width="120" height="14" rx="6" fill="#3a6aaa" />
      <rect x="30" y="37" width="22" height="16" rx="4" fill="#a8d4f5" opacity="0.9" />
      <rect x="62" y="37" width="22" height="16" rx="4" fill="#a8d4f5" opacity="0.9" />
      <rect x="94" y="37" width="22" height="16" rx="4" fill="#a8d4f5" opacity="0.9" />
      <rect x="10" y="56" width="150" height="4" rx="2" fill="#2d5a99" />
      <circle cx="40" cy="76" r="10" fill="#2d3a50" /><circle cx="40" cy="76" r="5" fill="#4a5568" />
      <circle cx="80" cy="76" r="10" fill="#2d3a50" /><circle cx="80" cy="76" r="5" fill="#4a5568" />
      <circle cx="120" cy="76" r="10" fill="#2d3a50" /><circle cx="120" cy="76" r="5" fill="#4a5568" />
      <rect x="0" y="85" width="180" height="3" rx="1.5" fill="#2d3a50" opacity="0.4" />
    </svg>
  );
}

/* ── Field helpers ────────────────────────────────────────── */
function F({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <p style={{ fontSize: "8px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "2px" }}>{label}</p>
      <p style={{ fontSize: "13px", fontWeight: 800, color: "#1e293b", letterSpacing: "0.03em" }}>{value}</p>
    </div>
  );
}
function SF({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: "7px" }}>
      <p style={{ fontSize: "7px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1px" }}>{label}</p>
      <p style={{ fontSize: "11px", fontWeight: 800, color: "#1e293b", letterSpacing: "0.04em" }}>{value}</p>
    </div>
  );
}

/* ── Tear line ────────────────────────────────────────────── */
function TearLine() {
  return (
    <svg width="14" height="100%" viewBox="0 0 14 400" preserveAspectRatio="none"
      aria-hidden="true" style={{ flexShrink: 0, minHeight: "220px" }}>
      {Array.from({ length: 40 }, (_, i) => (
        <rect key={i} x={i % 2 === 0 ? 5 : 2} y={i * 10} width="4" height="6" rx="1"
          fill="#cbd5e1" opacity="0.7" />
      ))}
    </svg>
  );
}

/* ── Main modal ───────────────────────────────────────────── */
type Props = { booking: Booking; onClose: () => void };

export default function BookingTicketModal({ booking, onClose }: Props) {
  const p1 = booking.passengers[0];

  const fmtDate = (s: string) => {
    const parts = s.replace("Tue,","").replace("Wed,","").replace("Thu,","")
      .replace("Fri,","").replace("Sat,","").replace("Sun,","").replace("Mon,","").trim();
    return parts.toUpperCase();
  };

  const price = `₹${booking.fare.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
  const classLabel = `${booking.seatClass} (${booking.seatClassCode})`;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-3 md:p-6"
      style={{ background: "rgba(15,17,26,0.80)", backdropFilter: "blur(4px)" }}
      role="dialog" aria-modal="true" aria-label="E-ticket"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="flex flex-col items-center gap-3 w-full" style={{ maxWidth: "700px" }}>

        {/* Top action bar */}
        <div className="flex items-center justify-between w-full px-1">
          <p style={{ fontSize: "13px", color: "#a5b4fc", fontWeight: 500 }}>E-Ticket / Boarding Pass</p>
          <div className="flex items-center gap-2">
            <button onClick={() => window.print()}
              className="flex items-center gap-1.5 hover:opacity-80 focus:outline-none transition-opacity"
              style={{ background: "#748efe", color: "#fff", borderRadius: "8px", padding: "7px 14px", fontSize: "13px", fontWeight: 600, border: "none", cursor: "pointer" }}>
              <Download size={14} /> Download PDF
            </button>
            <button
              className="flex items-center gap-1.5 hover:opacity-80 focus:outline-none transition-opacity"
              style={{ background: "#25d366", color: "#fff", borderRadius: "8px", padding: "7px 14px", fontSize: "13px", fontWeight: 600, border: "none", cursor: "pointer" }}>
              <Share2 size={14} /> Share
            </button>
            <button onClick={onClose}
              className="flex items-center justify-center rounded-full hover:bg-white/10 transition-colors focus:outline-none"
              style={{ width: "34px", height: "34px", color: "white" }} aria-label="Close ticket">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ══ TICKET ══════════════════════════════════════ */}
        <div
          id="printable-ticket"
          className="w-full flex"
          style={{
            borderRadius: "14px",
            boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
            overflow: "hidden",
            fontFamily: "'Google Sans','Segoe UI',system-ui,sans-serif",
            /* Horizontal scroll on very small screens */
            overflowX: "auto",
          }}
        >
          {/* ── MAIN BODY ─────────────────────────────── */}
          <div className="flex flex-col flex-1" style={{ minWidth: "320px" }}>

            {/* Header bar */}
            <div style={{ background: "#1e2a3a", padding: "9px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "10px", fontWeight: 700, color: "#e2e8f0", letterSpacing: "0.14em" }}>🎫  TRAIN TICKET</span>
              <span style={{ fontSize: "10px", fontWeight: 700, color: "#e2e8f0", letterSpacing: "0.14em" }}>BOARDING PASS</span>
            </div>

            {/* Body */}
            <div style={{ display: "flex", background: "#eef2f7", flex: 1 }}>

              {/* Left panel — passenger + illustration */}
              <div style={{ width: "190px", flexShrink: 0, background: "#dce6f2", padding: "16px 14px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontSize: "8px", fontWeight: 700, color: "#64748b", letterSpacing: "0.12em", marginBottom: "3px" }}>NAME OF PASSENGER</p>
                  <p style={{ fontSize: "15px", fontWeight: 900, color: "#0f172a", letterSpacing: "0.06em", lineHeight: "1.25" }}>
                    {(p1?.name || "PASSENGER").toUpperCase()}
                  </p>
                  {booking.passengers.length > 1 && (
                    <p style={{ fontSize: "10px", color: "#64748b", marginTop: "2px" }}>
                      +{booking.passengers.length - 1} more
                    </p>
                  )}
                </div>
                <div style={{ margin: "10px 0" }}>
                  <TrainSVG />
                </div>
                <div>
                  <p style={{ fontSize: "7px", fontWeight: 600, color: "#94a3b8", letterSpacing: "0.1em" }}>PNR NUMBER</p>
                  <p style={{ fontSize: "12px", fontWeight: 800, color: "#0f172a", letterSpacing: "0.1em", fontFamily: "monospace" }}>
                    {booking.pnr}
                  </p>
                </div>
              </div>

              {/* Center — journey details grid */}
              <div style={{ flex: 1, padding: "16px 18px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px", alignContent: "start" }}>
                <F label="Price"     value={price} />
                <F label="Train No." value={booking.trainNumber} />
                <F label="From"      value={`${booking.origin.name.split(" ")[0].toUpperCase()} (${booking.origin.code})`} />
                <F label="Departure" value={booking.departureTime} />
                <F label="To"        value={`${booking.destination.name.split(" ")[0].toUpperCase()} (${booking.destination.code})`} />
                <F label="Arrive"    value={booking.arrivalTime} />
                <F label="Date"      value={fmtDate(booking.journeyDate)} />
                <F label="Coach / Seat" value={p1 ? `${p1.coach} – ${p1.berth.split(" ")[0]}` : booking.seatClassCode} />

                {/* Class badge */}
                <div style={{ gridColumn: "1 / -1", marginTop: "4px" }}>
                  <span style={{ display: "inline-block", background: "#1e2a3a", color: "#93c5fd", borderRadius: "5px", padding: "2px 9px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em" }}>
                    {classLabel.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Barcode strip */}
              <div style={{ width: "44px", flexShrink: 0, background: "#1e2a3a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "8px 0", gap: "6px" }}>
                <Barcode />
                <div style={{ transform: "rotate(90deg)", whiteSpace: "nowrap" }}>
                  <span style={{ fontSize: "6px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.14em" }}>
                    {booking.seatClass.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── TEAR LINE ─────────────────────────────── */}
          <TearLine />

          {/* ── STUB ──────────────────────────────────── */}
          <div style={{ width: "148px", flexShrink: 0, display: "flex", flexDirection: "column" }}>
            {/* Stub header */}
            <div style={{ background: "#1e2a3a", padding: "9px 12px" }}>
              <p style={{ fontSize: "7px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.12em", marginBottom: "1px" }}>BOARDING PASS</p>
              <p style={{ fontSize: "10px", fontWeight: 800, color: "#e2e8f0", letterSpacing: "0.08em" }}>
                {booking.seatClass.split(" ").slice(0, 2).join(" ").toUpperCase()}
              </p>
            </div>

            {/* Stub body */}
            <div style={{ flex: 1, background: "#eef2f7", padding: "12px" }}>
              <SF label="Name of Passenger" value={(p1?.name || "PASSENGER").toUpperCase()} />
              <SF label="From" value={booking.origin.name.split(" ")[0].toUpperCase()} />
              <SF label="To"   value={booking.destination.name.split(" ")[0].toUpperCase()} />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px", marginTop: "4px" }}>
                <SF label="Train" value={booking.trainNumber} />
                <SF label="Seat"  value={p1?.berth.split(" ")[0] ?? booking.seatClassCode} />
              </div>

              <div style={{ marginTop: "8px", borderTop: "1px dashed #94a3b8", paddingTop: "8px" }}>
                <SF label="Date" value={fmtDate(booking.journeyDate)} />
              </div>
              <div style={{ marginTop: "4px", borderTop: "1px dashed #94a3b8", paddingTop: "8px" }}>
                <p style={{ fontSize: "7px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", marginBottom: "2px" }}>TOTAL FARE</p>
                <p style={{ fontSize: "13px", fontWeight: 800, color: "#748efe" }}>{price}</p>
              </div>
            </div>
          </div>
        </div>

        <p style={{ fontSize: "11px", color: "#64748b", textAlign: "center" }}>
          Press Ctrl+P / Cmd+P to save as PDF
        </p>
      </div>

      <style>{`
        @media print {
          body > *:not(#printable-ticket) { display: none !important; }
          #printable-ticket {
            display: flex !important;
            position: fixed; top: 0; left: 0;
            width: 100vw; max-width: 100vw;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
