"use client";

import { useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft, Copy, Check, Download, Train,
  MapPin, Share2, MessageCircle, HelpCircle,
} from "lucide-react";
import BookingsNavbar from "../components/BookingsNavbar";
import StatusBadge from "../components/StatusBadge";
import CancelModal from "../components/CancelModal";
import BookingTicketModal from "../components/BookingTicketModal";
import { MOCK_BOOKINGS, Booking } from "../data/mockBookings";

/* ── Shared section card ── */
function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#ffffff", borderRadius: "12px",
        border: "1px solid #e8ebed", boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6" }}>
        <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#181d2a", margin: 0 }}>{title}</h2>
      </div>
      <div style={{ padding: "20px" }}>
        {children}
      </div>
    </div>
  );
}

/* ── Passenger status pill ── */
function PaxStatus({ status }: { status: "CNF" | "RAC" | "WL" }) {
  const s = {
    CNF: { bg: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" },
    RAC: { bg: "#fffbeb", color: "#d97706", border: "1px solid #fde68a" },
    WL:  { bg: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe" },
  }[status];
  return (
    <span style={{ ...s, padding: "2px 10px", borderRadius: "9999px", fontSize: "11px", fontWeight: 700 }}>
      {status}
    </span>
  );
}

/* ── Route timeline strip (inline for detail page) ── */
function RouteStrip({ booking }: { booking: Booking }) {
  const allPoints = [
    { city: booking.origin.name.split(" ")[0], code: booking.origin.code, time: booking.departureTime },
    ...booking.stops.map((s) => ({ city: s.city, code: "", time: s.time })),
    { city: booking.destination.name.split(" ")[0], code: booking.destination.code, time: booking.arrivalTime },
  ];

  return (
    <div className="relative flex items-start justify-between w-full" style={{ paddingTop: "8px" }}>
      {/* Connector line */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", left: "12px", right: "12px",
          top: "20px", height: "2px", background: "#748efe",
          borderRadius: "9999px",
        }}
      />
      {allPoints.map((pt, i) => (
        <div key={i} className="flex flex-col items-center" style={{ zIndex: 1, gap: "4px", minWidth: "60px" }}>
          {/* Dot */}
          <div
            aria-hidden="true"
            style={{
              width: "10px", height: "10px", borderRadius: "50%",
              background: "#748efe", border: "2px solid #ffffff",
              boxShadow: "0 0 0 2px #748efe",
            }}
          />
          <span style={{ fontSize: "11px", fontWeight: 600, color: "#181d2a", textAlign: "center", lineHeight: "1.2" }}>
            {pt.city}
          </span>
          {pt.code && (
            <span style={{ fontSize: "10px", color: "#9ca3af", textAlign: "center" }}>{pt.code}</span>
          )}
          <span style={{ fontSize: "11px", color: "#6b7280", textAlign: "center" }}>{pt.time}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Main detail page ── */
export default function BookingDetailPage({ params }: { params: Promise<{ pnr: string }> }) {
  const { pnr } = use(params);
  const [booking, setBooking] = useState<Booking | undefined>(
    () => MOCK_BOOKINGS.find((b) => b.pnr === pnr)
  );
  const [copied, setCopied]             = useState(false);
  const [showCancel, setShowCancel]     = useState(false);
  const [cancelDone, setCancelDone]     = useState(false);
  const [showTicket, setShowTicket]     = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(pnr).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmCancel = () => {
    setBooking((prev) => prev ? { ...prev, status: "Cancelled" } : prev);
    setShowCancel(false);
    setCancelDone(true);
  };

  if (!booking) {
    return (
      <div style={{ minHeight: "100vh", background: "#f0f2f5" }}>
        <BookingsNavbar />
        <main className="mx-auto flex flex-col items-center justify-center py-32" style={{ maxWidth: "900px", padding: "80px 16px" }}>
          <p style={{ fontSize: "18px", fontWeight: 600, color: "#6b7280" }}>Booking not found.</p>
          <Link href="/my-bookings" style={{ color: "#748efe", marginTop: "12px", fontSize: "14px" }}>
            ← Back to bookings
          </Link>
        </main>
      </div>
    );
  }

  const isCancellable = !["Cancelled", "Completed", "Refund Initiated"].includes(booking.status);

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <BookingsNavbar />

      <main className="mx-auto" style={{ maxWidth: "960px", padding: "20px 16px 48px" }}>

        {/* ── Back link ── */}
        <Link
          href="/my-bookings"
          className="inline-flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 rounded mb-5 hover:opacity-70 transition-opacity"
          style={{ fontSize: "13px", color: "#6b7280", textDecoration: "none" }}
        >
          <ArrowLeft size={14} /> Back to bookings
        </Link>

        {/* ── PNR header card ── */}
        <div
          style={{
            background: "#ffffff", borderRadius: "12px",
            border: "1px solid #e8ebed", padding: "20px 24px",
            marginBottom: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 600, letterSpacing: "0.08em", marginBottom: "4px" }}>PNR</p>
              <div className="flex items-center gap-3">
                <span style={{ fontSize: "30px", fontWeight: 800, color: "#181d2a", letterSpacing: "-0.5px" }}>
                  {booking.pnr}
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 rounded-lg hover:bg-gray-50 transition-colors"
                  style={{
                    border: "1px solid #e8ebed", borderRadius: "8px",
                    padding: "5px 10px", fontSize: "12px", color: "#6b7280", fontWeight: 500,
                  }}
                  aria-label="Copy PNR"
                >
                  {copied ? <Check size={12} style={{ color: "#16a34a" }} /> : <Copy size={12} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>{booking.journeyDate}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <StatusBadge status={booking.status} size="lg" />
              {booking.chartStatus && (
                <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>
                  Chart Status:{" "}
                  <span style={{ color: "#16a34a", fontWeight: 500 }}>{booking.chartStatus}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Two-column layout on desktop ── */}
        <div className="flex gap-4 items-start flex-col md:flex-row">

          {/* ── LEFT COLUMN ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">

            {/* Journey Summary */}
            <SectionCard title="Journey Summary">
              <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "12px" }}>
                {booking.trainNumber} &nbsp;·&nbsp;
                <span style={{ fontWeight: 600, color: "#181d2a" }}>{booking.trainName}</span>
              </p>

              {/* Dep / Arr times + route strip */}
              <div className="flex items-start gap-4 mb-4">
                {/* Departure */}
                <div style={{ minWidth: "80px" }}>
                  <p style={{ fontSize: "30px", fontWeight: 800, color: "#181d2a", lineHeight: 1 }}>
                    {booking.departureTime}
                  </p>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "#181d2a", marginTop: "4px" }}>
                    {booking.origin.name}
                  </p>
                  <p style={{ fontSize: "11px", color: "#9ca3af" }}>{booking.origin.code}</p>
                  {booking.origin.platform && (
                    <p style={{ fontSize: "11px", color: "#9ca3af" }}>{booking.origin.platform}</p>
                  )}
                  <p style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>{booking.journeyDate}</p>
                </div>

                {/* Center timeline */}
                <div className="flex-1 min-w-0 px-2">
                  <p style={{ fontSize: "11px", color: "#9ca3af", textAlign: "center", marginBottom: "4px" }}>
                    {booking.duration}
                  </p>
                  <RouteStrip booking={booking} />
                </div>

                {/* Arrival */}
                <div style={{ minWidth: "80px", textAlign: "right" }}>
                  <p style={{ fontSize: "30px", fontWeight: 800, color: "#181d2a", lineHeight: 1 }}>
                    {booking.arrivalTime}
                  </p>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "#181d2a", marginTop: "4px" }}>
                    {booking.destination.name}
                  </p>
                  <p style={{ fontSize: "11px", color: "#9ca3af" }}>{booking.destination.code}</p>
                  {booking.destination.platform && (
                    <p style={{ fontSize: "11px", color: "#9ca3af" }}>{booking.destination.platform}</p>
                  )}
                </div>
              </div>

              {/* Distance + class */}
              <div className="flex items-center gap-2 flex-wrap" style={{ borderTop: "1px solid #f3f4f6", paddingTop: "12px" }}>
                <span className="flex items-center gap-1" style={{ fontSize: "12px", color: "#6b7280" }}>
                  <MapPin size={12} style={{ color: "#9ca3af" }} aria-hidden="true" />
                  Distance: {booking.distance}
                </span>
                <span style={{ color: "#e8ebed" }}>·</span>
                <span className="flex items-center gap-1" style={{ fontSize: "12px", color: "#6b7280" }}>
                  <Train size={12} style={{ color: "#9ca3af" }} aria-hidden="true" />
                  Class: {booking.seatClass} ({booking.seatClassCode})
                </span>
              </div>
            </SectionCard>

            {/* Passenger Details */}
            <SectionCard title="Passenger Details">
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                      {["Passenger Name", "Age", "Gender", "Berth / Seat", "Coach", "Status"].map((h) => (
                        <th
                          key={h}
                          style={{
                            textAlign: "left", padding: "8px 12px",
                            fontSize: "11px", fontWeight: 600, color: "#9ca3af",
                            letterSpacing: "0.04em", textTransform: "uppercase",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {booking.passengers.map((p, idx) => (
                      <tr
                        key={p.id}
                        style={{ borderBottom: idx < booking.passengers.length - 1 ? "1px solid #f9fafb" : "none" }}
                      >
                        <td style={{ padding: "12px", fontWeight: 500, color: "#181d2a" }}>
                          {idx + 1}. {p.name}
                        </td>
                        <td style={{ padding: "12px", color: "#6b7280" }}>{p.age}</td>
                        <td style={{ padding: "12px", color: "#6b7280" }}>{p.gender}</td>
                        <td style={{ padding: "12px", color: "#6b7280" }}>{p.berth}</td>
                        <td style={{ padding: "12px", color: "#6b7280" }}>{p.coach}</td>
                        <td style={{ padding: "12px" }}>
                          <PaxStatus status={p.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>

            {/* Actions */}
            <SectionCard title="Actions">
              <div className="flex items-center gap-4 flex-wrap">
                {/* Download — enabled for all non-cancelled bookings */}
                <button
                  onClick={() => !["Cancelled", "Refund Initiated"].includes(booking.status) && setShowTicket(true)}
                  disabled={["Cancelled", "Refund Initiated"].includes(booking.status)}
                  className="flex flex-col items-center gap-2 focus:outline-none focus-visible:ring-2 rounded-xl hover:opacity-80 transition-opacity"
                  style={{
                    minWidth: "72px", padding: "12px 16px",
                    background: ["Cancelled", "Refund Initiated"].includes(booking.status) ? "#f9fafb" : "#f0f2f5",
                    borderRadius: "12px", border: "none",
                    cursor: ["Cancelled", "Refund Initiated"].includes(booking.status) ? "not-allowed" : "pointer",
                    opacity: ["Cancelled", "Refund Initiated"].includes(booking.status) ? 0.5 : 1,
                  }}
                  aria-label="Download e-ticket"
                >
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Download size={18} style={{ color: "#2563eb" }} />
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: 500, color: "#181d2a", textAlign: "center" }}>Download<br />e-ticket</span>
                </button>

                {/* Cancel */}
                <button
                  onClick={() => isCancellable && !cancelDone && setShowCancel(true)}
                  disabled={!isCancellable || cancelDone}
                  className="flex flex-col items-center gap-2 focus:outline-none focus-visible:ring-2 rounded-xl hover:opacity-80 transition-opacity"
                  style={{
                    minWidth: "72px", padding: "12px 16px",
                    background: !isCancellable || cancelDone ? "#f9fafb" : "#f0f2f5",
                    borderRadius: "12px", border: "none",
                    cursor: !isCancellable || cancelDone ? "not-allowed" : "pointer",
                    opacity: !isCancellable || cancelDone ? 0.5 : 1,
                  }}
                  aria-label="Cancel booking"
                  aria-disabled={!isCancellable || cancelDone}
                >
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: "18px" }}>✕</span>
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: 500, color: "#181d2a", textAlign: "center" }}>
                    {cancelDone ? "Cancelled" : "Cancel\nbooking"}
                  </span>
                </button>

                {/* Track train */}
                <button
                  className="flex flex-col items-center gap-2 focus:outline-none focus-visible:ring-2 rounded-xl hover:opacity-80 transition-opacity"
                  style={{ minWidth: "72px", padding: "12px 16px", background: "#f0f2f5", borderRadius: "12px", border: "none", cursor: "pointer" }}
                  aria-label="Track train"
                >
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Train size={18} style={{ color: "#748efe" }} />
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: 500, color: "#181d2a", textAlign: "center" }}>Track<br />train</span>
                </button>

                {/* Share via WhatsApp */}
                <button
                  className="flex flex-col items-center gap-2 focus:outline-none focus-visible:ring-2 rounded-xl hover:opacity-80 transition-opacity"
                  style={{ minWidth: "72px", padding: "12px 16px", background: "#f0f2f5", borderRadius: "12px", border: "none", cursor: "pointer" }}
                  aria-label="Share via WhatsApp"
                >
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <MessageCircle size={18} style={{ color: "#16a34a" }} />
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: 500, color: "#181d2a", textAlign: "center" }}>Share via<br />WhatsApp</span>
                </button>
              </div>
            </SectionCard>

            {/* Need help */}
            <div
              className="flex items-center justify-between flex-wrap gap-3"
              style={{
                background: "#fffbeb", border: "1px solid #fde68a",
                borderRadius: "12px", padding: "16px 20px",
              }}
            >
              <div className="flex items-center gap-3">
                <HelpCircle size={20} style={{ color: "#d97706", flexShrink: 0 }} aria-hidden="true" />
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "#92400e" }}>Need help?</p>
                  <p style={{ fontSize: "12px", color: "#a16207" }}>Our customer support is available 24/7 for any assistance.</p>
                </div>
              </div>
              <button
                className="focus:outline-none focus-visible:ring-2 hover:bg-white transition-colors"
                style={{
                  border: "1px solid #fbbf24", borderRadius: "8px",
                  padding: "8px 16px", fontSize: "13px", fontWeight: 600, color: "#92400e",
                  background: "rgba(255,255,255,0.6)", cursor: "pointer", whiteSpace: "nowrap",
                }}
                aria-label="Contact support"
              >
                Contact Support
              </button>
            </div>
          </div>

          {/* ── RIGHT COLUMN (sticky on md+) ── */}
          <div
            className="w-full md:w-72 flex-shrink-0 flex flex-col gap-4"
            style={{ position: "sticky", top: "80px", alignSelf: "flex-start" } as React.CSSProperties}
          >

            {/* Fare Details */}
            <SectionCard title="Fare Details">
              <div className="flex flex-col gap-3">
                {[
                  { label: "Base Fare",            val: booking.fare.baseFare },
                  { label: "Reservation Charges",  val: booking.fare.reservationCharges },
                  { label: "Superfast Charges",     val: booking.fare.superfastCharges },
                  { label: "Other Charges",         val: booking.fare.otherCharges },
                  { label: "IRCTC Service Fee",     val: booking.fare.irctcServiceFee },
                ].map(({ label, val }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span style={{ fontSize: "13px", color: "#6b7280" }}>{label}</span>
                    <span style={{ fontSize: "13px", color: "#181d2a", fontWeight: 500 }}>
                      ₹{val.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}

                {booking.fare.discount !== 0 && (
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: "13px", color: "#6b7280" }}>
                      Discount{booking.fare.discountCode ? ` (${booking.fare.discountCode})` : ""}
                    </span>
                    <span style={{ fontSize: "13px", color: "#16a34a", fontWeight: 500 }}>
                      ₹{booking.fare.discount.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                <div style={{ borderTop: "1.5px solid #e8ebed", paddingTop: "12px", marginTop: "4px" }}>
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#181d2a" }}>Total Amount</span>
                    <span style={{ fontSize: "18px", fontWeight: 800, color: "#748efe" }}>
                      ₹{booking.fare.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px", textAlign: "right" }}>
                    (incl. of all taxes)
                  </p>
                </div>
              </div>
            </SectionCard>

            {/* Booking Info */}
            <SectionCard title="Booking Info">
              <div className="flex flex-col gap-3">
                {[
                  { label: "Booking Date",    val: booking.bookingInfo.bookingDate },
                  { label: "Booked From",     val: booking.bookingInfo.bookedFrom },
                  { label: "Payment Method",  val: booking.bookingInfo.paymentMethod },
                  { label: "Transaction ID",  val: booking.bookingInfo.transactionId },
                ].map(({ label, val }) => (
                  <div key={label}>
                    <p style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "1px" }}>{label}</p>
                    <p style={{ fontSize: "13px", color: "#181d2a", fontWeight: 500, wordBreak: "break-all" }}>{val}</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Share button */}
            <button
              className="w-full flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 hover:opacity-90 active:scale-[0.97] transition-all"
              style={{
                background: "#25d366", color: "white",
                borderRadius: "12px", height: "44px",
                fontSize: "14px", fontWeight: 600, border: "none", cursor: "pointer",
              }}
              aria-label="Share booking via WhatsApp"
            >
              <Share2 size={16} />
              Share via WhatsApp
            </button>
          </div>

        </div>
      </main>

      {/* Cancel modal */}
      {showCancel && booking.refundAmount !== undefined && (
        <CancelModal
          refundAmount={booking.refundAmount}
          onConfirm={handleConfirmCancel}
          onClose={() => setShowCancel(false)}
        />
      )}

      {/* E-ticket modal — opens when Download e-ticket is clicked */}
      {showTicket && (
        <BookingTicketModal
          booking={booking}
          onClose={() => setShowTicket(false)}
        />
      )}
    </div>
  );
}
