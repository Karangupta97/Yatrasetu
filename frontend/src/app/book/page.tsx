"use client";

import { useState, useCallback } from "react";
import BookingsNavbar from "../my-bookings/components/BookingsNavbar";
import StepIndicator from "./components/StepIndicator";
import Step1Journey from "./steps/Step1Journey";
import Step2Passengers from "./steps/Step2Passengers";
import Step3Seats from "./steps/Step3Seats";
import Step4Review from "./steps/Step4Review";
import Step5Payment from "./steps/Step5Payment";
import Step6Confirm from "./steps/Step6Confirm";
import {
  BookingState, makeFare, generatePNR,
} from "./types";

function makePassenger(id: string) {
  return { id, name: "", age: "", gender: "" as const, idType: "" as const, idNumber: "", kycVerified: false };
}

const INITIAL: BookingState = {
  from: "New Delhi",
  to: "Mumbai CSMT",
  departDate: "",
  returnDate: "",
  returnEnabled: false,
  passengers: 1,
  transportType: "train",
  selectedClass: null,
  trainName: "Garib Rath Express",
  trainNumber: "12215",
  passengerDetails: [makePassenger("p1")],
  contactEmail: "",
  contactPhone: "",
  selectedSeats: [],
  selectedCoach: "",
  paymentMethod: null,
  upiId: "",
  pnr: "",
  bookingId: "",
  confirmedAt: "",
  fare: makeFare(845, 1),
  couponInput: "",
  appliedCoupon: "",
};

export default function BookPage() {
  const [step, setStep] = useState(1);
  const [state, _setState] = useState<BookingState>(INITIAL);

  const setState = useCallback((patch: Partial<BookingState>) => {
    _setState((prev) => {
      const next = { ...prev, ...patch };
      // Keep passenger array size in sync
      if (patch.passengers !== undefined) {
        const count = patch.passengers;
        while (next.passengerDetails.length < count) {
          next.passengerDetails = [...next.passengerDetails, makePassenger(Date.now().toString() + next.passengerDetails.length)];
        }
        if (next.passengerDetails.length > count) {
          next.passengerDetails = next.passengerDetails.slice(0, count);
        }
      }
      // Recalc fare when class or passengers change
      if ((patch.selectedClass || patch.passengers) && next.selectedClass) {
        next.fare = makeFare(next.selectedClass.price, next.passengers, next.appliedCoupon || undefined);
      }
      return next;
    });
  }, []);

  const goTo = (n: number) => {
    // When entering confirmation, finalise PNR
    if (n === 6) {
      _setState((prev) => ({
        ...prev,
        pnr: generatePNR(),
        bookingId: "TRX" + Date.now().toString().slice(-10),
        confirmedAt: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
      }));
    }
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <BookingsNavbar />

      <main className="mx-auto" style={{ maxWidth: "780px", padding: "24px 16px 56px" }}>

        {/* Page title */}
        {step < 6 && (
          <div className="mb-6">
            <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#181d2a", marginBottom: "4px" }}>
              Book a Ticket
            </h1>
            <p style={{ fontSize: "13px", color: "#9ca3af" }}>
              Complete all steps to confirm your booking.
            </p>
          </div>
        )}

        {/* Step indicator */}
        {step < 6 && (
          <div
            style={{
              background: "#ffffff", borderRadius: "14px",
              border: "1px solid #e8ebed", padding: "16px 20px",
              marginBottom: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              overflowX: "auto",
            }}
          >
            <StepIndicator current={step} />
          </div>
        )}

        {/* Steps */}
        {step === 1 && (
          <Step1Journey
            state={state}
            setState={setState}
            onNext={() => goTo(2)}
          />
        )}
        {step === 2 && (
          <Step2Passengers
            state={state}
            setState={setState}
            onNext={() => goTo(3)}
            onBack={() => goTo(1)}
          />
        )}
        {step === 3 && (
          <Step3Seats
            state={state}
            setState={setState}
            onNext={() => goTo(4)}
            onBack={() => goTo(2)}
          />
        )}
        {step === 4 && (
          <Step4Review
            state={state}
            setState={setState}
            onNext={() => goTo(5)}
            onBack={() => goTo(3)}
          />
        )}
        {step === 5 && (
          <Step5Payment
            state={state}
            setState={setState}
            onNext={() => goTo(6)}
            onBack={() => goTo(4)}
          />
        )}
        {step === 6 && (
          <Step6Confirm state={state} />
        )}
      </main>
    </div>
  );
}
