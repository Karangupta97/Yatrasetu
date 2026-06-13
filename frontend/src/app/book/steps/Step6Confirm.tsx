"use client";

import { useState } from "react";
import {
  CheckCircle, Download, Share2, Calendar, Copy, Check,
  Train, MapPin, Users,
} from "lucide-react";
import { BookingState } from "../types";
import TicketModal from "../components/TicketModal";

// Mini QR pattern (SVG placeholder — matches real QR feel)
function QRPlaceholder({ pnr }: { pnr: string }) {
  return (
    <div
      style={{
        width: "140px", height: "140px", borderRadius: "12px",
        border: "2px solid #e8ebed", background: "#ffffff",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: "6px", padding: "10px",
      }}
      aria-label={`QR code for PNR ${pnr}`}
    >
      {/* Simple QR-like grid */}
      <svg width="100" height="100" viewBox="0 0 100 100" fill="none" aria-hidden="true">
        {/* Corner marks */}
        <rect x="4" y="4" width="28" height="28" rx="3" fill="#181d2a" />
        <rect x="8" y="8" width="20" height="20" rx="2" fill="white" />
        <rect x="12" y="12" width="12" height="12" rx="1" fill="#181d2a" />
        <rect x="68" y="4" width="28" height="28" rx="3" fill="#181d2a" />
        <rect x="72" y="8" width="20" height="20" rx="2" fill="white" />
        <rect x="76" y="12" width="12" height="12" rx="1" fill="#181d2a" />
        <rect x="4" y="68" width="28" height="28" rx="3" fill="#181d2a" />
        <rect x="8" y="72" width="20" height="20" rx="2" fill="white" />
        <rect x="12" y="76" width="12" height="12" rx="1" fill="#181d2a" />
        {/* Data dots */}
        {[40,44,48,52,56,60,36,64].map((x, i) => (
          <rect key={i} x={x} y={i % 2 === 0 ? 36 : 44} width="3" height="3" fill="#181d2a" />
        ))}
        {[40,48,52,60].map((y, i) => (
          <rect key={i} x={i % 2 === 0 ? 36 : 64} y={y} width="3" height="3" fill="#181d2a" />
        ))}
        {[40,44,48,52,56].map((x, i) => (
          <rect key={i} x={x} y={60} width="3" height="3" fill="#181d2a" />
        ))}
        {/* Center logo */}
        <rect x="44" y="44" width="12" height="12" rx="2" fill="#748efe" />
      </svg>
      <span style={{ fontSize: "9px", color: "#9ca3af", letterSpacing: "0.08em", fontWeight: 600 }}>
        SCAN TO VERIFY
      </span>
    </div>
  );
}

export default function Step6Confirm({ state, onBackToList }: { state: BookingState; onBackToList?: () => void }) {
  const [copied, setCopied]       = useState(false);
  const [calAdded, setCalAdded]   = useState(false);
  const [showTicket, setShowTicket] = useState(false);

  const copyPNR = () => {
    navigator.clipboard.writeText(state.pnr).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="flex flex-col items-center"
      style={{
        background: "#ffffff", borderRadius: "16px",
        border: "1px solid #e8ebed",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        padding: "36px 28px",
        width: "100%",
      }}
    >
      {/* Success icon */}
      <div
        style={{
          width: "64px", height: "64px", borderRadius: "50%",
          background: "#f0fdf4", border: "2px solid #bbf7d0",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "16px",
          animation: "indigoPulse 1s ease",
        }}
        aria-hidden="true"
      >
        <CheckCircle size={32} style={{ color: "#16a34a" }} />
      </div>

      <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#181d2a", marginBottom: "6px", textAlign: "center" }}>
        Booking Confirmed! 🎉
      </h2>
      <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "24px", textAlign: "center" }}>
        Your ticket has been booked. A confirmation has been sent to{" "}
        <strong style={{ color: "#181d2a" }}>{state.contactEmail}</strong>
      </p>

      {/* PNR + QR row */}
      <div
        className="flex items-center gap-8 flex-col sm:flex-row"
        style={{
          background: "#f8faff", border: "1.5px solid #dbeafe",
          borderRadius: "14px", padding: "20px 28px",
          width: "100%", marginBottom: "24px",
        }}
      >
        <div>
          <p style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 700, letterSpacing: "0.08em", marginBottom: "6px" }}>
            BOOKING ID / PNR
          </p>
          <div className="flex items-center gap-3">
            <span style={{ fontSize: "28px", fontWeight: 800, color: "#181d2a", letterSpacing: "0.04em" }}>
              {state.pnr}
            </span>
            <button
              onClick={copyPNR}
              className="flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 rounded-lg hover:bg-blue-50 transition-colors"
              style={{ border: "1px solid #bfdbfe", borderRadius: "8px", padding: "4px 10px", fontSize: "12px", color: "#2563eb", background: "white", cursor: "pointer" }}
              aria-label="Copy PNR"
            >
              {copied ? <Check size={11} style={{ color: "#16a34a" }} /> : <Copy size={11} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>
            Transaction: {state.bookingId}
          </p>
          <p style={{ fontSize: "12px", color: "#9ca3af" }}>Booked: {state.confirmedAt}</p>
        </div>
        <div className="flex-shrink-0">
          <QRPlaceholder pnr={state.pnr} />
        </div>
      </div>

      {/* Journey summary */}
      <div
        style={{
          border: "1.5px solid #e8ebed", borderRadius: "12px",
          padding: "16px 20px", width: "100%", marginBottom: "20px",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Train size={15} style={{ color: "#748efe" }} />
          <span style={{ fontSize: "14px", fontWeight: 700, color: "#181d2a" }}>Journey Summary</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: <MapPin size={13} />, label: "Route", val: `${state.from} → ${state.to}` },
            { icon: <Train size={13} />, label: "Train", val: `${state.trainName} (${state.trainNumber})` },
            { icon: <Calendar size={13} />, label: "Date", val: state.departDate },
            { icon: <Users size={13} />, label: "Class", val: state.selectedClass?.label ?? "—" },
          ].map(({ icon, label, val }) => (
            <div key={label} className="flex items-start gap-2">
              <span style={{ color: "#9ca3af", marginTop: "2px" }}>{icon}</span>
              <div>
                <p style={{ fontSize: "11px", color: "#9ca3af" }}>{label}</p>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#181d2a" }}>{val}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Passengers */}
        <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #f3f4f6" }}>
          <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "6px" }}>Passengers & Seats</p>
          <div className="flex flex-wrap gap-2">
            {state.passengerDetails.map((p, i) => (
              <span
                key={p.id}
                style={{
                  background: "#f8fafc", border: "1px solid #e8ebed",
                  borderRadius: "8px", padding: "5px 10px", fontSize: "12px", color: "#181d2a",
                }}
              >
                {p.name.split(" ")[0]}
                {state.selectedSeats[i] && (
                  <span style={{ color: "#748efe", fontWeight: 700 }}> · Seat {state.selectedSeats[i].number}</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Fare total */}
      <div
        className="flex items-center justify-between w-full mb-6"
        style={{ background: "#f8faff", border: "1px solid #dbeafe", borderRadius: "10px", padding: "12px 16px" }}
      >
        <span style={{ fontSize: "14px", fontWeight: 600, color: "#181d2a" }}>Total Paid</span>
        <span style={{ fontSize: "20px", fontWeight: 800, color: "#748efe" }}>
          ₹{state.fare.total.toLocaleString("en-IN")}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 w-full mb-6">
        <button
          onClick={() => setShowTicket(true)}
          className="flex items-center gap-2 flex-1 justify-center focus:outline-none focus-visible:ring-2 hover:opacity-90 transition-all"
          style={{
            background: "#181d2a", color: "white",
            borderRadius: "10px", height: "44px", fontSize: "14px", fontWeight: 600,
            border: "none", cursor: "pointer", minWidth: "140px",
          }}
          aria-label="Download e-ticket"
        >
          <Download size={16} /> Download Ticket
        </button>
        <button
          className="flex items-center gap-2 flex-1 justify-center focus:outline-none focus-visible:ring-2 hover:opacity-90 transition-all"
          style={{
            background: "#25d366", color: "white",
            borderRadius: "10px", height: "44px", fontSize: "14px", fontWeight: 600,
            border: "none", cursor: "pointer", minWidth: "140px",
          }}
          aria-label="Share via WhatsApp"
        >
          <Share2 size={16} /> Share Ticket
        </button>
        <button
          onClick={() => setCalAdded(true)}
          className="flex items-center gap-2 flex-1 justify-center focus:outline-none focus-visible:ring-2 hover:opacity-90 transition-all"
          style={{
            background: calAdded ? "#f0fdf4" : "#ffffff",
            color: calAdded ? "#16a34a" : "#181d2a",
            border: `1.5px solid ${calAdded ? "#bbf7d0" : "#e8ebed"}`,
            borderRadius: "10px", height: "44px", fontSize: "14px", fontWeight: 600,
            cursor: "pointer", minWidth: "140px",
          }}
          aria-label="Add journey to calendar"
        >
          {calAdded ? <Check size={16} /> : <Calendar size={16} />}
          {calAdded ? "Added!" : "Add to Calendar"}
        </button>
      </div>

      {/* Navigation links */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBackToList}
          className="focus:outline-none focus-visible:ring-2 rounded hover:opacity-80 transition-opacity"
          style={{ fontSize: "14px", fontWeight: 600, color: "#748efe", background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          View My Bookings →
        </button>
        <button
          onClick={onBackToList}
          className="focus:outline-none focus-visible:ring-2 rounded hover:opacity-80 transition-opacity"
          style={{ fontSize: "14px", color: "#9ca3af", background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          Book another ticket
        </button>
      </div>

      {/* Ticket modal */}
      {showTicket && (
        <TicketModal state={state} onClose={() => setShowTicket(false)} />
      )}
    </div>
  );
}
