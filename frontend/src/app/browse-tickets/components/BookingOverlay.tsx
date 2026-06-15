"use client";

import { useState, useCallback } from "react";
import { ArrowLeft, Train as TrainIcon } from "lucide-react";

import StepIndicator         from "../../book/components/StepIndicator";
import Step1JourneyOverlay   from "../../book/steps/Step1JourneyOverlay"; // Step 1: date + return + pax count
import Step3Seats            from "../../book/steps/Step3Seats";           // Step 2: class + seat layout
import Step2Passengers       from "../../book/steps/Step2Passengers";      // Step 3: passenger details
import Step4Review           from "../../book/steps/Step4Review";           // Step 4: review + coupon
import Step5Payment          from "../../book/steps/Step5Payment";          // Step 5: payment
import Step6Confirm          from "../../book/steps/Step6Confirm";          // Step 6: confirmation

import { BookingState, SeatClass, makeFare, generatePNR } from "../../book/types";
import { Train as TrainData, ClassAvailability } from "../data/trains";

/* ── helpers ─────────────────────────────────────────────── */
function makePassenger(id: string) {
  return {
    id, name: "", age: "", gender: "" as const,
    idType: "" as const, idNumber: "", kycVerified: false,
  };
}

function mapClass(cls: ClassAvailability): SeatClass {
  const match = cls.status.match(/\d+/);
  const numAvailable = match ? parseInt(match[0], 10) : 0;
  return {
    code:      cls.code,
    label:     cls.label,
    price:     cls.price,
    available: cls.available ? (numAvailable || 10) : 0,
  };
}

function makeInitial(train: TrainData, cls: ClassAvailability): BookingState {
  const seatClass = mapClass(cls);
  const today = new Date().toISOString().split("T")[0];
  return {
    from:             train.departure.city,
    to:               train.arrival.city,
    departDate:       today,   // default to current date
    returnDate:       "",
    returnEnabled:    false,
    passengers:       1,
    transportType:    "train",
    selectedClass:    seatClass,              // pre-filled from card selection
    trainName:        train.name,
    trainNumber:      train.trainNumber,
    passengerDetails: [makePassenger("p1")],
    contactEmail:     "",
    contactPhone:     "",
    selectedSeats:    [],
    selectedCoach:    "",
    paymentMethod:    null,
    upiId:            "",
    pnr:              "",
    bookingId:        "",
    confirmedAt:      "",
    fare:             makeFare(seatClass.price, 1),
    couponInput:      "",
    appliedCoupon:    "",
  };
}

/* ── Props ───────────────────────────────────────────────── */
type Props = {
  train: TrainData;
  selectedClass: ClassAvailability;
  onClose: () => void;
};

/* ── Component ───────────────────────────────────────────── */
export default function BookingOverlay({ train, selectedClass, onClose }: Props) {
  /*
   * Overlay step mapping (displayed in StepIndicator as steps 1–6):
   *   overlayStep 1 → Journey   (date / return / pax count)
   *   overlayStep 2 → Seats     (class selector + seat grid)
   *   overlayStep 3 → Passengers(passenger details form)
   *   overlayStep 4 → Review    (summary + coupon)
   *   overlayStep 5 → Payment
   *   overlayStep 6 → Confirm
   */
  const [step, setStep]      = useState(1);
  const [state, _setState]   = useState<BookingState>(() => makeInitial(train, selectedClass));

  /* ── Shared setState with passenger-array sync + fare recalc ── */
  const setState = useCallback((patch: Partial<BookingState>) => {
    _setState((prev) => {
      const next = { ...prev, ...patch };

      // Keep passengerDetails array length in sync with passenger count
      if (patch.passengers !== undefined) {
        const count = patch.passengers;
        while (next.passengerDetails.length < count)
          next.passengerDetails = [
            ...next.passengerDetails,
            makePassenger(Date.now().toString() + next.passengerDetails.length),
          ];
        if (next.passengerDetails.length > count)
          next.passengerDetails = next.passengerDetails.slice(0, count);
      }

      // Recalc fare whenever class or passenger count changes
      if ((patch.selectedClass || patch.passengers) && next.selectedClass)
        next.fare = makeFare(
          next.selectedClass.price,
          next.passengers,
          next.appliedCoupon || undefined,
        );

      return next;
    });
  }, []);

  /* ── Step navigation ── */
  const goTo = (n: number) => {
    if (n === 6) {
      // Finalise PNR on entering confirmation
      _setState((prev) => ({
        ...prev,
        pnr:        generatePNR(),
        bookingId:  "TRX" + Date.now().toString().slice(-10),
        confirmedAt: new Date().toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
      }));
    }
    setStep(n);
    document.getElementById("booking-overlay-scroll")
      ?.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ── Render ── */
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "#f0f2f5" }}
      role="dialog"
      aria-modal="true"
      aria-label={`Book ${train.name}`}
    >

      {/* ── Top bar ─────────────────────────────────────── */}
      <div
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e8ebed",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        <div
          className="mx-auto w-full flex items-center justify-between"
          style={{
            maxWidth: "1080px",
            height: "64px",
            padding: "0 24px",
          }}
        >
          {/* Left: back button + train info */}
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={onClose}
              className="flex items-center gap-2 flex-shrink-0 focus:outline-none focus-visible:ring-2 rounded-lg transition-all"
              style={{
                fontSize: "13px", color: "#6b7280",
                background: "none", border: "1.5px solid #e8ebed",
                borderRadius: "8px", padding: "6px 12px",
                cursor: "pointer",
              }}
              onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.background = "#f8fafc"; }}
              onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
              aria-label="Back to search results"
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline" style={{ fontWeight: 500 }}>Back to results</span>
            </button>

            <span aria-hidden="true" style={{ width: "1px", height: "24px", background: "#e8ebed", flexShrink: 0 }} />

            <div className="hidden sm:flex items-center gap-2.5 min-w-0 overflow-hidden">
              {/* Operator circle */}
              <div
                className="flex items-center justify-center rounded-full flex-shrink-0"
                style={{
                  width: "30px", height: "30px",
                  background: train.logoColor,
                  fontSize: "11px", fontWeight: 700, color: "white",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                }}
                aria-hidden="true"
              >
                {train.initials}
              </div>
              <div className="flex flex-col min-w-0">
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#181d2a", whiteSpace: "nowrap", lineHeight: 1.2 }}>
                  {train.name}
                  <span style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 500, marginLeft: "6px" }}>
                    ({train.trainNumber})
                  </span>
                </span>
                <span style={{ fontSize: "12px", color: "#6b7280", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", lineHeight: 1.2 }}>
                  {train.departure.city} → {train.arrival.city}
                </span>
              </div>
            </div>
          </div>

          {/* Right: class badge + date */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <span
              style={{
                background: "rgba(116,142,254,0.08)", color: "#5b6efe",
                borderRadius: "9999px", padding: "6px 14px",
                fontSize: "12px", fontWeight: 700, whiteSpace: "nowrap",
                border: "1px solid rgba(116,142,254,0.15)",
              }}
            >
              {state.selectedClass?.code} · ₹{state.selectedClass?.price.toLocaleString("en-IN")}
            </span>
            <div
              className="hidden md:flex items-center gap-1.5"
              style={{
                fontSize: "12px", color: "#6b7280", fontWeight: 500,
                background: "#f8fafc", borderRadius: "8px",
                padding: "6px 12px", border: "1px solid #e8ebed",
              }}
            >
              <TrainIcon size={12} aria-hidden="true" style={{ color: "#9ca3af" }} />
              {train.departure.date}
            </div>
          </div>
        </div>
      </div>

      {/* ── Scrollable body ─────────────────────────────── */}
      <div
        id="booking-overlay-scroll"
        className="flex-1 overflow-y-auto flex justify-center"
        style={{ paddingBottom: "48px" }}
      >
        {/* Centered container */}
        <div
          style={{
            width: "100%",
            maxWidth: "680px",
            padding: "32px 24px 0",
          }}
        >

          {/* Step progress bar (steps 1–5; hidden on confirmation) */}
          {step < 6 && (
            <div
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #e8ebed",
                padding: "20px 28px",
                marginBottom: "24px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                overflowX: "auto",
              }}
            >
              <StepIndicator current={step} />
            </div>
          )}

          {/* ── Step 1: Journey (date / return / passengers) ── */}
          {step === 1 && (
            <Step1JourneyOverlay
              state={state}
              setState={setState}
              onNext={() => goTo(2)}
              onBack={onClose}
            />
          )}

          {/* ── Step 2: Seat Selection ── */}
          {step === 2 && (
            <Step3Seats
              state={state}
              setState={setState}
              onNext={() => goTo(3)}
              onBack={() => goTo(1)}
            />
          )}

          {/* ── Step 3: Passenger Details ── */}
          {step === 3 && (
            <Step2Passengers
              state={state}
              setState={setState}
              onNext={() => goTo(4)}
              onBack={() => goTo(2)}
            />
          )}

          {/* ── Step 4: Review + Coupon ── */}
          {step === 4 && (
            <Step4Review
              state={state}
              setState={setState}
              onNext={() => goTo(5)}
              onBack={() => goTo(3)}
            />
          )}

          {/* ── Step 5: Payment ── */}
          {step === 5 && (
            <Step5Payment
              state={state}
              setState={setState}
              onNext={() => goTo(6)}
              onBack={() => goTo(4)}
            />
          )}

          {/* ── Step 6: Confirmation ── */}
          {step === 6 && (
            <Step6Confirm
              state={state}
              onBackToList={onClose}
            />
          )}

        </div>
      </div>
    </div>
  );
}
