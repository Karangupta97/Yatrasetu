"use client";

import { useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft, Copy, Check, Download, Train,
  MapPin, Share2, MessageCircle, HelpCircle,
  ChevronRight, Shield, Clock, Zap,
} from "lucide-react";
import BookingsNavbar from "../components/BookingsNavbar";
import StatusBadge from "../components/StatusBadge";
import CancelModal from "../components/CancelModal";
import BookingTicketModal from "../components/BookingTicketModal";
import { MOCK_BOOKINGS, Booking } from "../data/mockBookings";

/* ── Shared section card ── */
function SectionCard({
  title,
  children,
  icon,
  accent,
}: {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className="pnr-section-card">
      <div className="pnr-section-header">
        {icon && (
          <div
            className="pnr-section-icon"
            style={{ background: accent ?? "linear-gradient(135deg,#6366f1,#4338ca)" }}
          >
            {icon}
          </div>
        )}
        <h2 className="pnr-section-title">{title}</h2>
      </div>
      <div className="pnr-section-body">{children}</div>
    </div>
  );
}

/* ── Passenger status pill ── */
function PaxStatus({ status }: { status: "CNF" | "RAC" | "WL" }) {
  const s = {
    CNF: { bg: "linear-gradient(135deg,#d1fae5,#a7f3d0)", color: "#065f46", shadow: "rgba(16,185,129,0.18)" },
    RAC: { bg: "linear-gradient(135deg,#fef3c7,#fde68a)", color: "#92400e", shadow: "rgba(217,119,6,0.15)" },
    WL:  { bg: "linear-gradient(135deg,#dbeafe,#bfdbfe)",  color: "#1e40af", shadow: "rgba(37,99,235,0.15)" },
  }[status];
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        padding: "3px 12px",
        borderRadius: "9999px",
        fontSize: "11px",
        fontWeight: 700,
        boxShadow: `0 2px 8px ${s.shadow}`,
        letterSpacing: "0.04em",
      }}
    >
      {status}
    </span>
  );
}

/* ── Route timeline strip ── */
function RouteStrip({ booking }: { booking: Booking }) {
  const allPoints = [
    { city: booking.origin.name.split(" ")[0], code: booking.origin.code, time: booking.departureTime },
    ...booking.stops.map((s) => ({ city: s.city, code: "", time: s.time })),
    { city: booking.destination.name.split(" ")[0], code: booking.destination.code, time: booking.arrivalTime },
  ];

  return (
    <div style={{ position: "relative", display: "flex", alignItems: "flex-start", justifyContent: "space-between", width: "100%", paddingTop: "8px" }}>
      {/* Gradient connector line */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", left: "12px", right: "12px",
          top: "17px", height: "3px",
          background: "linear-gradient(90deg,#6366f1,#818cf8,#a78bfa)",
          borderRadius: "9999px",
          boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
        }}
      />
      {allPoints.map((pt, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 1, gap: "5px", minWidth: "60px" }}>
          <div
            aria-hidden="true"
            style={{
              width: "14px", height: "14px", borderRadius: "50%",
              background: i === 0 || i === allPoints.length - 1
                ? "linear-gradient(135deg,#6366f1,#4338ca)"
                : "white",
              border: "2.5px solid #6366f1",
              boxShadow: "0 0 0 3px rgba(99,102,241,0.18), 0 2px 8px rgba(99,102,241,0.25)",
            }}
          />
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#1e1b4b", textAlign: "center", lineHeight: "1.2" }}>
            {pt.city}
          </span>
          {pt.code && (
            <span style={{ fontSize: "10px", color: "#9ca3af", textAlign: "center", fontWeight: 500 }}>{pt.code}</span>
          )}
          <span style={{ fontSize: "10px", color: "#6366f1", textAlign: "center", fontWeight: 600 }}>{pt.time}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Action button ── */
function ActionBtn({
  icon,
  label,
  subLabel,
  iconBg,
  iconColor,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  subLabel?: string;
  iconBg: string;
  iconColor: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="pnr-action-btn"
      style={{ opacity: disabled ? 0.45 : 1, cursor: disabled ? "not-allowed" : "pointer" }}
      aria-disabled={disabled}
    >
      <div
        className="pnr-action-icon"
        style={{ background: iconBg, boxShadow: `0 4px 14px ${iconColor}33` }}
      >
        <span style={{ color: iconColor, display: "flex" }}>{icon}</span>
      </div>
      <span className="pnr-action-label">{label}</span>
      {subLabel && <span className="pnr-action-sublabel">{subLabel}</span>}
    </button>
  );
}

/* ── Main detail page ── */
export default function BookingDetailPage({ params }: { params: Promise<{ pnr: string }> }) {
  const { pnr } = use(params);
  const [booking, setBooking] = useState<Booking | undefined>(
    () => MOCK_BOOKINGS.find((b) => b.pnr === pnr)
  );
  const [copied, setCopied] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [cancelDone, setCancelDone] = useState(false);
  const [showTicket, setShowTicket] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(pnr).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmCancel = () => {
    setBooking((prev) => (prev ? { ...prev, status: "Cancelled" } : prev));
    setShowCancel(false);
    setCancelDone(true);
  };

  if (!booking) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#f0f4ff 0%,#fafbff 50%,#f5f3ff 100%)" }}>
        <BookingsNavbar />
        <main style={{ maxWidth: "960px", margin: "0 auto", padding: "80px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div className="pnr-not-found">
            <Train size={40} color="#6366f1" />
            <p style={{ fontSize: "20px", fontWeight: 700, color: "#1e1b4b", margin: "16px 0 8px" }}>Booking not found</p>
            <p style={{ fontSize: "14px", color: "#6b7280" }}>We couldn't find a booking with PNR: <strong>{pnr}</strong></p>
            <Link href="/my-bookings" className="pnr-back-home-btn">← Back to My Bookings</Link>
          </div>
        </main>
      </div>
    );
  }

  const isCancellable = !["Cancelled", "Completed", "Refund Initiated"].includes(booking.status);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(150deg,#f0f4ff 0%,#fafbff 55%,#f5f3ff 100%)" }}>
      <BookingsNavbar />

      {/* Hero banner strip */}
      <div className="pnr-hero-strip">
        <div className="pnr-hero-inner">
          <div className="pnr-hero-train-icon">
            <Train size={22} color="white" strokeWidth={2.3} />
          </div>
          <span className="pnr-hero-text">Booking Details</span>
          <ChevronRight size={16} style={{ color: "rgba(255,255,255,0.5)", margin: "0 6px" }} />
          <span className="pnr-hero-pnr">{booking.pnr}</span>
        </div>
      </div>

      <main className="pnr-main">

        {/* ── Back link ── */}
        <Link href="/my-bookings" className="pnr-back-link">
          <ArrowLeft size={15} />
          Back to bookings
        </Link>

        {/* ── PNR header card ── */}
        <div className="pnr-header-card">
          {/* Decorative gradient blob */}
          <div className="pnr-header-blob" aria-hidden="true" />

          <div className="pnr-header-top">
            <div>
              <p className="pnr-label">PNR Number</p>
              <div className="pnr-number-row">
                <span className="pnr-number">{booking.pnr}</span>
                <button
                  onClick={handleCopy}
                  className={`pnr-copy-btn${copied ? " pnr-copy-btn--copied" : ""}`}
                  aria-label="Copy PNR"
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="pnr-journey-date">
                <Clock size={13} style={{ verticalAlign: "middle", marginRight: "5px" }} />
                {booking.journeyDate}
              </p>
            </div>

            <div className="pnr-header-status-col">
              <StatusBadge status={booking.status} size="lg" />
              {booking.chartStatus && (
                <div className="pnr-chart-status">
                  <Shield size={12} style={{ color: "#10b981" }} />
                  Chart: <span style={{ color: "#10b981", fontWeight: 600 }}>{booking.chartStatus}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Two-column layout ── */}
        <div className="pnr-layout">

          {/* ── LEFT COLUMN ── */}
          <div className="pnr-left-col">

            {/* Journey Summary */}
            <SectionCard
              title="Journey Summary"
              icon={<Train size={14} color="white" />}
              accent="linear-gradient(135deg,#6366f1,#4338ca)"
            >
              {/* Train name */}
              <div className="pnr-train-name-row">
                <span className="pnr-train-number">{booking.trainNumber}</span>
                <span className="pnr-train-divider">·</span>
                <span className="pnr-train-name">{booking.trainName}</span>
              </div>

              {/* Dep / Arr + route */}
              <div className="pnr-journey-row">
                <div className="pnr-station pnr-station--dep">
                  <p className="pnr-time">{booking.departureTime}</p>
                  <p className="pnr-station-name">{booking.origin.name}</p>
                  <p className="pnr-station-code">{booking.origin.code}</p>
                  {booking.origin.platform && (
                    <p className="pnr-platform">{booking.origin.platform}</p>
                  )}
                  <p className="pnr-station-date">{booking.journeyDate}</p>
                </div>

                <div className="pnr-route-center">
                  <p className="pnr-duration">
                    <Zap size={12} style={{ verticalAlign: "middle", marginRight: "3px", color: "#6366f1" }} />
                    {booking.duration}
                  </p>
                  <RouteStrip booking={booking} />
                </div>

                <div className="pnr-station pnr-station--arr">
                  <p className="pnr-time">{booking.arrivalTime}</p>
                  <p className="pnr-station-name">{booking.destination.name}</p>
                  <p className="pnr-station-code">{booking.destination.code}</p>
                  {booking.destination.platform && (
                    <p className="pnr-platform">{booking.destination.platform}</p>
                  )}
                </div>
              </div>

              {/* Distance + class chips */}
              <div className="pnr-meta-chips">
                <span className="pnr-chip">
                  <MapPin size={11} style={{ color: "#6366f1" }} />
                  {booking.distance}
                </span>
                <span className="pnr-chip">
                  <Train size={11} style={{ color: "#6366f1" }} />
                  {booking.seatClass} · {booking.seatClassCode}
                </span>
              </div>
            </SectionCard>

            {/* Passenger Details */}
            <SectionCard
              title="Passenger Details"
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              }
              accent="linear-gradient(135deg,#8b5cf6,#6d28d9)"
            >
              <div style={{ overflowX: "auto" }}>
                <table className="pnr-table">
                  <thead>
                    <tr>
                      {["Passenger Name", "Age", "Gender", "Berth / Seat", "Coach", "Status"].map((h) => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {booking.passengers.map((p, idx) => (
                      <tr key={p.id}>
                        <td className="pnr-passenger-name">
                          <span className="pnr-pax-index">{idx + 1}</span>
                          {p.name}
                        </td>
                        <td>{p.age}</td>
                        <td>{p.gender}</td>
                        <td>{p.berth}</td>
                        <td><span className="pnr-coach-badge">{p.coach}</span></td>
                        <td><PaxStatus status={p.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>

            {/* Quick Actions */}
            <SectionCard
              title="Quick Actions"
              icon={<Zap size={14} color="white" />}
              accent="linear-gradient(135deg,#f59e0b,#d97706)"
            >
              <div className="pnr-actions-grid">
                <ActionBtn
                  icon={<Download size={20} />}
                  label="Download"
                  subLabel="e-Ticket"
                  iconBg="linear-gradient(135deg,#dbeafe,#bfdbfe)"
                  iconColor="#2563eb"
                  onClick={() => !["Cancelled","Refund Initiated"].includes(booking.status) && setShowTicket(true)}
                  disabled={["Cancelled","Refund Initiated"].includes(booking.status)}
                />
                <ActionBtn
                  icon={<span style={{ fontSize: "18px", lineHeight: 1 }}>✕</span>}
                  label={cancelDone ? "Cancelled" : "Cancel"}
                  subLabel="booking"
                  iconBg="linear-gradient(135deg,#fee2e2,#fecaca)"
                  iconColor="#dc2626"
                  onClick={() => isCancellable && !cancelDone && setShowCancel(true)}
                  disabled={!isCancellable || cancelDone}
                />
                <ActionBtn
                  icon={<Train size={20} />}
                  label="Track"
                  subLabel="Train"
                  iconBg="linear-gradient(135deg,#ede9fe,#ddd6fe)"
                  iconColor="#7c3aed"
                />
                <ActionBtn
                  icon={<MessageCircle size={20} />}
                  label="Share"
                  subLabel="WhatsApp"
                  iconBg="linear-gradient(135deg,#d1fae5,#a7f3d0)"
                  iconColor="#059669"
                />
              </div>
            </SectionCard>

            {/* Need Help */}
            <div className="pnr-help-banner">
              <div className="pnr-help-icon-wrap" aria-hidden="true">
                <HelpCircle size={22} color="#d97706" />
              </div>
              <div className="pnr-help-text">
                <p className="pnr-help-title">Need help with your booking?</p>
                <p className="pnr-help-desc">Our support team is available 24/7 to assist you.</p>
              </div>
              <button className="pnr-help-btn" aria-label="Contact support">
                Contact Support
              </button>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="pnr-right-col">

            {/* Fare Details */}
            <SectionCard
              title="Fare Details"
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                </svg>
              }
              accent="linear-gradient(135deg,#10b981,#059669)"
            >
              <div className="pnr-fare-list">
                {[
                  { label: "Base Fare", val: booking.fare.baseFare },
                  { label: "Reservation Charges", val: booking.fare.reservationCharges },
                  { label: "Superfast Charges", val: booking.fare.superfastCharges },
                  { label: "Other Charges", val: booking.fare.otherCharges },
                  { label: "IRCTC Service Fee", val: booking.fare.irctcServiceFee },
                ].map(({ label, val }) => (
                  <div key={label} className="pnr-fare-row">
                    <span className="pnr-fare-label">{label}</span>
                    <span className="pnr-fare-val">₹{val.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}

                {booking.fare.discount !== 0 && (
                  <div className="pnr-fare-row pnr-fare-discount">
                    <span className="pnr-fare-label">
                      Discount{booking.fare.discountCode ? ` (${booking.fare.discountCode})` : ""}
                    </span>
                    <span className="pnr-fare-val pnr-fare-val--green">
                      − ₹{booking.fare.discount.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                <div className="pnr-fare-total">
                  <span className="pnr-fare-total-label">Total Amount</span>
                  <div>
                    <span className="pnr-fare-total-val">
                      ₹{booking.fare.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                    <p className="pnr-fare-incl">incl. of all taxes</p>
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Booking Info */}
            <SectionCard
              title="Booking Info"
              icon={<Shield size={14} color="white" />}
              accent="linear-gradient(135deg,#3b82f6,#1d4ed8)"
            >
              <div className="pnr-info-list">
                {[
                  { label: "Booking Date", val: booking.bookingInfo.bookingDate },
                  { label: "Booked From", val: booking.bookingInfo.bookedFrom },
                  { label: "Payment Method", val: booking.bookingInfo.paymentMethod },
                  { label: "Transaction ID", val: booking.bookingInfo.transactionId },
                ].map(({ label, val }) => (
                  <div key={label} className="pnr-info-item">
                    <p className="pnr-info-label">{label}</p>
                    <p className="pnr-info-val">{val}</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* WhatsApp Share button */}
            <button className="pnr-whatsapp-btn" aria-label="Share booking via WhatsApp">
              <Share2 size={17} />
              Share via WhatsApp
            </button>
          </div>

        </div>
      </main>

      {/* Modals */}
      {showCancel && booking.refundAmount !== undefined && (
        <CancelModal
          refundAmount={booking.refundAmount}
          onConfirm={handleConfirmCancel}
          onClose={() => setShowCancel(false)}
        />
      )}
      {showTicket && (
        <BookingTicketModal booking={booking} onClose={() => setShowTicket(false)} />
      )}

      {/* ── Styles ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* ─── Layout ─── */
        .pnr-main {
          max-width: 1000px;
          margin: 0 auto;
          padding: 24px 20px 60px;
        }

        /* ─── Hero strip ─── */
        .pnr-hero-strip {
          background: linear-gradient(90deg, #4338ca 0%, #6366f1 50%, #818cf8 100%);
          padding: 10px 0;
          box-shadow: 0 2px 12px rgba(99,102,241,0.22);
        }
        .pnr-hero-inner {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .pnr-hero-train-icon {
          width: 30px; height: 30px;
          background: rgba(255,255,255,0.2);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          backdrop-filter: blur(4px);
        }
        .pnr-hero-text {
          font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.75);
        }
        .pnr-hero-pnr {
          font-size: 13px; font-weight: 700; color: #fff;
          background: rgba(255,255,255,0.18);
          padding: 2px 10px; border-radius: 999px;
          letter-spacing: 0.05em;
        }

        /* ─── Back link ─── */
        .pnr-back-link {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 500; color: #6366f1;
          text-decoration: none; margin-bottom: 18px;
          padding: 6px 12px; border-radius: 8px;
          background: rgba(99,102,241,0.06);
          border: 1px solid rgba(99,102,241,0.15);
          transition: background 0.18s, transform 0.18s;
        }
        .pnr-back-link:hover {
          background: rgba(99,102,241,0.12);
          transform: translateX(-2px);
        }

        /* ─── PNR Header card ─── */
        .pnr-header-card {
          background: #fff;
          border-radius: 20px;
          border: 1px solid rgba(99,102,241,0.1);
          padding: 28px 32px;
          margin-bottom: 20px;
          box-shadow: 0 4px 24px rgba(99,102,241,0.08), 0 1px 4px rgba(0,0,0,0.04);
          position: relative;
          overflow: hidden;
        }
        .pnr-header-blob {
          position: absolute;
          top: -40px; right: -40px;
          width: 180px; height: 180px;
          background: radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }
        .pnr-header-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }
        .pnr-label {
          font-size: 11px; font-weight: 700; color: #9ca3af;
          letter-spacing: 0.1em; text-transform: uppercase;
          margin-bottom: 8px;
        }
        .pnr-number-row {
          display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
        }
        .pnr-number {
          font-size: 34px; font-weight: 900; color: #1e1b4b;
          letter-spacing: -0.5px; line-height: 1;
        }
        .pnr-copy-btn {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 12px; font-weight: 600; color: #6366f1;
          background: rgba(99,102,241,0.07);
          border: 1.5px solid rgba(99,102,241,0.2);
          border-radius: 8px; padding: 6px 12px;
          cursor: pointer; transition: all 0.18s;
          font-family: inherit;
        }
        .pnr-copy-btn:hover {
          background: rgba(99,102,241,0.14);
          border-color: rgba(99,102,241,0.35);
        }
        .pnr-copy-btn--copied {
          color: #059669;
          background: rgba(5,150,105,0.07) !important;
          border-color: rgba(5,150,105,0.25) !important;
        }
        .pnr-journey-date {
          font-size: 13px; color: #6b7280; margin-top: 8px; font-weight: 500;
        }
        .pnr-header-status-col {
          display: flex; flex-direction: column; align-items: flex-end; gap: 8px;
        }
        .pnr-chart-status {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 12px; color: #6b7280;
          background: rgba(16,185,129,0.07); padding: 4px 10px;
          border-radius: 999px; border: 1px solid rgba(16,185,129,0.2);
        }

        /* ─── Two-column layout ─── */
        .pnr-layout {
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }
        .pnr-left-col {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .pnr-right-col {
          width: 280px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 16px;
          position: sticky;
          top: 84px;
          align-self: flex-start;
        }

        /* ─── Section Card ─── */
        .pnr-section-card {
          background: #ffffff;
          border-radius: 18px;
          border: 1px solid rgba(99,102,241,0.08);
          box-shadow: 0 2px 16px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.04);
          overflow: hidden;
          transition: box-shadow 0.22s;
        }
        .pnr-section-card:hover {
          box-shadow: 0 6px 28px rgba(99,102,241,0.09), 0 2px 6px rgba(0,0,0,0.05);
        }
        .pnr-section-header {
          display: flex; align-items: center; gap: 10px;
          padding: 16px 20px;
          border-bottom: 1px solid #f3f4f6;
          background: linear-gradient(135deg, #fafbff 0%, #f8f9ff 100%);
        }
        .pnr-section-icon {
          width: 28px; height: 28px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .pnr-section-title {
          font-size: 14px; font-weight: 700; color: #1e1b4b;
          margin: 0; letter-spacing: -0.2px;
        }
        .pnr-section-body {
          padding: 20px;
        }

        /* ─── Journey Summary ─── */
        .pnr-train-name-row {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 18px;
        }
        .pnr-train-number {
          font-size: 12px; font-weight: 700; color: #6366f1;
          background: rgba(99,102,241,0.08);
          padding: 3px 10px; border-radius: 999px;
        }
        .pnr-train-divider {
          color: #d1d5db; font-size: 16px;
        }
        .pnr-train-name {
          font-size: 14px; font-weight: 700; color: #1e1b4b;
        }
        .pnr-journey-row {
          display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px;
        }
        .pnr-station {
          min-width: 90px; flex-shrink: 0;
        }
        .pnr-station--arr {
          text-align: right;
        }
        .pnr-time {
          font-size: 32px; font-weight: 900; color: #1e1b4b;
          line-height: 1; letter-spacing: -1px;
        }
        .pnr-station-name {
          font-size: 13px; font-weight: 700; color: #374151; margin-top: 5px;
        }
        .pnr-station-code {
          font-size: 11px; color: #9ca3af; font-weight: 500;
        }
        .pnr-platform {
          font-size: 11px; color: #6366f1; font-weight: 600;
          background: rgba(99,102,241,0.07);
          padding: 1px 6px; border-radius: 4px;
          display: inline-block; margin-top: 2px;
        }
        .pnr-station-date {
          font-size: 11px; color: #9ca3af; margin-top: 3px;
        }
        .pnr-route-center {
          flex: 1; min-width: 0; padding: 0 8px;
        }
        .pnr-duration {
          font-size: 11px; font-weight: 600; color: #6366f1;
          text-align: center; margin-bottom: 4px;
        }
        .pnr-meta-chips {
          display: flex; flex-wrap: wrap; gap: 8px;
          padding-top: 14px;
          border-top: 1px solid #f3f4f6;
        }
        .pnr-chip {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 12px; color: #374151; font-weight: 500;
          background: #f8f9ff;
          border: 1px solid rgba(99,102,241,0.12);
          padding: 5px 12px; border-radius: 999px;
        }

        /* ─── Passenger Table ─── */
        .pnr-table {
          width: 100%; border-collapse: collapse; font-size: 13px;
        }
        .pnr-table thead tr {
          border-bottom: 2px solid #f0f0ff;
        }
        .pnr-table th {
          text-align: left; padding: 8px 12px;
          font-size: 10.5px; font-weight: 700; color: #9ca3af;
          letter-spacing: 0.06em; text-transform: uppercase;
          white-space: nowrap;
        }
        .pnr-table tbody tr {
          border-bottom: 1px solid #f9fafb;
          transition: background 0.15s;
        }
        .pnr-table tbody tr:last-child { border-bottom: none; }
        .pnr-table tbody tr:hover { background: #fafbff; }
        .pnr-table td {
          padding: 13px 12px; color: #374151; vertical-align: middle;
        }
        .pnr-passenger-name {
          display: flex !important; align-items: center; gap: 8px;
          font-weight: 600; color: #1e1b4b !important;
        }
        .pnr-pax-index {
          width: 20px; height: 20px;
          background: linear-gradient(135deg,#6366f1,#4338ca);
          color: white; font-size: 10px; font-weight: 700;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .pnr-coach-badge {
          background: rgba(99,102,241,0.08);
          color: #4338ca; font-weight: 700; font-size: 12px;
          padding: 2px 8px; border-radius: 5px;
        }

        /* ─── Action Buttons ─── */
        .pnr-actions-grid {
          display: flex; gap: 12px; flex-wrap: wrap;
        }
        .pnr-action-btn {
          display: flex; flex-direction: column; align-items: center;
          gap: 8px; min-width: 78px; padding: 14px 12px;
          background: #f8f9ff;
          border: 1.5px solid rgba(99,102,241,0.1);
          border-radius: 14px;
          font-family: inherit; cursor: pointer;
          transition: all 0.18s; flex: 1;
        }
        .pnr-action-btn:hover:not(:disabled) {
          background: #fff;
          box-shadow: 0 4px 16px rgba(99,102,241,0.12);
          border-color: rgba(99,102,241,0.2);
          transform: translateY(-2px);
        }
        .pnr-action-icon {
          width: 44px; height: 44px;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.18s;
        }
        .pnr-action-btn:hover:not(:disabled) .pnr-action-icon {
          transform: scale(1.08);
        }
        .pnr-action-label {
          font-size: 12px; font-weight: 700; color: #1e1b4b; text-align: center;
        }
        .pnr-action-sublabel {
          font-size: 10.5px; font-weight: 500; color: #9ca3af; text-align: center;
          margin-top: -4px;
        }

        /* ─── Help Banner ─── */
        .pnr-help-banner {
          display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
          background: linear-gradient(135deg,#fffbeb 0%,#fef9ed 100%);
          border: 1.5px solid #fde68a;
          border-radius: 16px; padding: 16px 20px;
          box-shadow: 0 2px 12px rgba(217,119,6,0.08);
        }
        .pnr-help-icon-wrap {
          width: 40px; height: 40px;
          background: rgba(245,158,11,0.12);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .pnr-help-text { flex: 1; min-width: 160px; }
        .pnr-help-title {
          font-size: 14px; font-weight: 700; color: #92400e; margin-bottom: 2px;
        }
        .pnr-help-desc {
          font-size: 12px; color: #a16207;
        }
        .pnr-help-btn {
          background: linear-gradient(135deg,#f59e0b,#d97706);
          color: white; font-weight: 700; font-size: 13px;
          border: none; border-radius: 10px;
          padding: 9px 18px; cursor: pointer;
          font-family: inherit;
          box-shadow: 0 3px 10px rgba(217,119,6,0.3);
          transition: all 0.18s; white-space: nowrap;
        }
        .pnr-help-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 5px 16px rgba(217,119,6,0.4);
        }

        /* ─── Fare Details ─── */
        .pnr-fare-list {
          display: flex; flex-direction: column; gap: 10px;
        }
        .pnr-fare-row {
          display: flex; justify-content: space-between; align-items: center;
        }
        .pnr-fare-label {
          font-size: 13px; color: #6b7280;
        }
        .pnr-fare-val {
          font-size: 13px; font-weight: 600; color: #1e1b4b;
        }
        .pnr-fare-val--green { color: #059669 !important; }
        .pnr-fare-discount .pnr-fare-label { color: #059669; }
        .pnr-fare-total {
          display: flex; justify-content: space-between; align-items: flex-end;
          padding-top: 14px; margin-top: 6px;
          border-top: 2px solid #f0f0ff;
        }
        .pnr-fare-total-label {
          font-size: 14px; font-weight: 800; color: #1e1b4b;
        }
        .pnr-fare-total-val {
          font-size: 22px; font-weight: 900;
          background: linear-gradient(135deg,#6366f1,#4338ca);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; display: block; text-align: right;
        }
        .pnr-fare-incl {
          font-size: 10px; color: #9ca3af; text-align: right; margin-top: 2px;
        }

        /* ─── Booking Info ─── */
        .pnr-info-list {
          display: flex; flex-direction: column; gap: 14px;
        }
        .pnr-info-label {
          font-size: 10.5px; font-weight: 700; color: #9ca3af;
          text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 2px;
        }
        .pnr-info-val {
          font-size: 13px; font-weight: 600; color: #1e1b4b;
          word-break: break-all;
        }

        /* ─── WhatsApp button ─── */
        .pnr-whatsapp-btn {
          width: 100%;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          background: linear-gradient(135deg,#25d366,#1db954);
          color: white; font-size: 14px; font-weight: 700;
          border: none; border-radius: 14px; padding: 14px;
          cursor: pointer; font-family: inherit;
          box-shadow: 0 4px 16px rgba(37,211,102,0.3);
          transition: all 0.18s;
          letter-spacing: 0.01em;
        }
        .pnr-whatsapp-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(37,211,102,0.4);
        }

        /* ─── Not found ─── */
        .pnr-not-found {
          background: white; border-radius: 20px;
          border: 1px solid rgba(99,102,241,0.1);
          padding: 48px; text-align: center;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06);
          max-width: 420px; width: 100%;
        }
        .pnr-back-home-btn {
          display: inline-block; margin-top: 20px;
          background: linear-gradient(135deg,#6366f1,#4338ca);
          color: white; text-decoration: none;
          padding: 10px 24px; border-radius: 10px;
          font-weight: 600; font-size: 14px;
          box-shadow: 0 4px 12px rgba(99,102,241,0.3);
          transition: all 0.18s;
        }
        .pnr-back-home-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(99,102,241,0.4);
        }

        /* ─── Responsive ─── */
        @media (max-width: 700px) {
          .pnr-layout {
            flex-direction: column;
          }
          .pnr-right-col {
            width: 100%;
            position: static;
          }
          .pnr-header-card {
            padding: 20px;
          }
          .pnr-number { font-size: 26px; }
          .pnr-time { font-size: 24px; }
          .pnr-station { min-width: 70px; }
        }
      `}} />
    </div>
  );
}
