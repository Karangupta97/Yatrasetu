"use client";

import { useState } from "react";
import { Tag, CheckCircle, XCircle, Train, Users, Calendar, MapPin } from "lucide-react";
import StepCard, { NavButtons } from "../components/StepCard";
import { BookingState, makeFare } from "../types";

const VALID_COUPONS = ["YATRA10", "NEWUSER"];

export default function Step4Review({
  state, setState, onNext, onBack,
}: {
  state: BookingState;
  setState: (s: Partial<BookingState>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [couponMsg, setCouponMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const applyCoupon = () => {
    const code = state.couponInput.trim().toUpperCase();
    if (VALID_COUPONS.includes(code)) {
      setState({ appliedCoupon: code, fare: makeFare(state.selectedClass!.price, state.passengers, code) });
      setCouponMsg({ ok: true, text: `Coupon "${code}" applied successfully!` });
    } else {
      setState({ appliedCoupon: "" });
      setCouponMsg({ ok: false, text: "Invalid or expired coupon code." });
    }
  };

  const fare = state.fare;

  const rows = [
    { label: "Base Fare",            val: fare.baseFare },
    { label: "Reservation Fee",      val: fare.reservationFee },
    { label: "Superfast Charges",    val: fare.superfastCharge },
    { label: "GST (5%)",             val: fare.gst },
    { label: "IRCTC Service Fee",    val: fare.irctcFee },
  ];

  return (
    <StepCard>
      <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#181d2a", marginBottom: "6px" }}>
        Review Booking
      </h2>
      <p style={{ fontSize: "14px", color: "#9ca3af", marginBottom: "24px" }}>
        Double-check everything before paying.
      </p>

      <div className="flex gap-5 flex-col lg:flex-row">
        {/* Left — journey + passengers */}
        <div className="flex-1 flex flex-col gap-4">

          {/* Journey card */}
          <div style={{ border: "1.5px solid #e8ebed", borderRadius: "12px", padding: "18px" }}>
            <div className="flex items-center gap-2 mb-3">
              <Train size={16} style={{ color: "#748efe" }} />
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#181d2a" }}>Journey Details</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span style={{ fontSize: "22px", fontWeight: 800, color: "#181d2a" }}>{state.from}</span>
              <span style={{ color: "#748efe", fontSize: "18px", fontWeight: 700 }}>→</span>
              <span style={{ fontSize: "22px", fontWeight: 800, color: "#181d2a" }}>{state.to}</span>
            </div>
            <div className="flex items-center flex-wrap gap-3">
              <span className="flex items-center gap-1" style={{ fontSize: "13px", color: "#6b7280" }}>
                <Calendar size={13} style={{ color: "#9ca3af" }} />
                {state.departDate || "—"}
              </span>
              <span className="flex items-center gap-1" style={{ fontSize: "13px", color: "#6b7280" }}>
                <Train size={13} style={{ color: "#9ca3af" }} />
                {state.trainName} ({state.trainNumber})
              </span>
              <span className="flex items-center gap-1" style={{ fontSize: "13px", color: "#6b7280" }}>
                <MapPin size={13} style={{ color: "#9ca3af" }} />
                {state.selectedClass?.label}
              </span>
            </div>
            {state.returnEnabled && state.returnDate && (
              <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid #f3f4f6", fontSize: "13px", color: "#6b7280" }}>
                Return: {state.returnDate}
              </div>
            )}
          </div>

          {/* Passengers */}
          <div style={{ border: "1.5px solid #e8ebed", borderRadius: "12px", padding: "18px" }}>
            <div className="flex items-center gap-2 mb-3">
              <Users size={16} style={{ color: "#748efe" }} />
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#181d2a" }}>
                Passengers ({state.passengerDetails.length})
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {state.passengerDetails.map((p, i) => {
                const seat = state.selectedSeats[i];
                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between"
                    style={{ padding: "8px 12px", background: "#f8fafc", borderRadius: "8px" }}
                  >
                    <div>
                      <span style={{ fontSize: "14px", fontWeight: 600, color: "#181d2a" }}>{p.name}</span>
                      <span style={{ fontSize: "12px", color: "#9ca3af", marginLeft: "8px" }}>
                        {p.age}y · {p.gender}
                      </span>
                    </div>
                    {seat && (
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#748efe", background: "rgba(116,142,254,0.1)", borderRadius: "6px", padding: "3px 8px" }}>
                        Seat {seat.number}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right — fare */}
        <div style={{ width: "100%", maxWidth: "280px" }} className="flex flex-col gap-4">

          {/* Coupon */}
          <div style={{ border: "1.5px solid #e8ebed", borderRadius: "12px", padding: "16px" }}>
            <div className="flex items-center gap-2 mb-3">
              <Tag size={15} style={{ color: "#748efe" }} />
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#181d2a" }}>Apply Coupon</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={state.couponInput}
                onChange={(e) => { setState({ couponInput: e.target.value.toUpperCase() }); setCouponMsg(null); }}
                placeholder="Enter code"
                className="flex-1 border-none outline-none focus:ring-0"
                style={{
                  border: "1.5px solid #e8ebed", borderRadius: "8px",
                  padding: "8px 12px", fontSize: "13px", fontWeight: 600,
                  color: "#181d2a", letterSpacing: "0.05em",
                }}
                aria-label="Coupon code"
              />
              <button
                onClick={applyCoupon}
                style={{
                  background: "#181d2a", color: "white", borderRadius: "8px",
                  padding: "8px 14px", fontSize: "13px", fontWeight: 600,
                  border: "none", cursor: "pointer",
                }}
              >
                Apply
              </button>
            </div>
            {couponMsg && (
              <div className="flex items-center gap-1.5 mt-2">
                {couponMsg.ok
                  ? <CheckCircle size={13} style={{ color: "#16a34a" }} />
                  : <XCircle size={13} style={{ color: "#dc2626" }} />}
                <span style={{ fontSize: "12px", color: couponMsg.ok ? "#16a34a" : "#dc2626", fontWeight: 500 }}>
                  {couponMsg.text}
                </span>
              </div>
            )}
            <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: "6px" }}>
              Try: YATRA10 (10% off) · NEWUSER (₹200 off)
            </p>
          </div>

          {/* Fare breakdown */}
          <div style={{ border: "1.5px solid #e8ebed", borderRadius: "12px", padding: "16px" }}>
            <p style={{ fontSize: "14px", fontWeight: 700, color: "#181d2a", marginBottom: "14px" }}>
              Fare Breakdown
            </p>
            <div className="flex flex-col gap-2.5">
              {rows.map(({ label, val }) => (
                <div key={label} className="flex items-center justify-between">
                  <span style={{ fontSize: "13px", color: "#6b7280" }}>{label}</span>
                  <span style={{ fontSize: "13px", color: "#181d2a", fontWeight: 500 }}>
                    ₹{val.toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
              {fare.discount !== 0 && (
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: "13px", color: "#16a34a" }}>
                    Discount ({state.appliedCoupon})
                  </span>
                  <span style={{ fontSize: "13px", color: "#16a34a", fontWeight: 600 }}>
                    ₹{fare.discount.toLocaleString("en-IN")}
                  </span>
                </div>
              )}
              <div style={{ borderTop: "1.5px solid #e8ebed", paddingTop: "10px", marginTop: "4px" }}>
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "#181d2a" }}>Total</span>
                  <span style={{ fontSize: "20px", fontWeight: 800, color: "#748efe" }}>
                    ₹{fare.total.toLocaleString("en-IN")}
                  </span>
                </div>
                <p style={{ fontSize: "11px", color: "#9ca3af", textAlign: "right", marginTop: "2px" }}>
                  incl. all taxes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NavButtons onBack={onBack} onNext={onNext} nextLabel="Proceed to Payment →" />
    </StepCard>
  );
}
