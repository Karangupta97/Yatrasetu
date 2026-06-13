"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Search, Calendar, SlidersHorizontal, Plus, ArrowLeft } from "lucide-react";
import BookingsNavbar from "./components/BookingsNavbar";
import BookingCard from "./components/BookingCard";
import BookingCardSkeleton from "./components/BookingCardSkeleton";
import EmptyState from "./components/EmptyState";
import { MOCK_BOOKINGS, BookingStatus } from "./data/mockBookings";

// ── Booking flow imports ──────────────────────────────────────
import StepIndicator    from "../book/components/StepIndicator";
import Step1Journey     from "../book/steps/Step1Journey";
import Step2Passengers  from "../book/steps/Step2Passengers";
import Step3Seats       from "../book/steps/Step3Seats";
import Step4Review      from "../book/steps/Step4Review";
import Step5Payment     from "../book/steps/Step5Payment";
import Step6Confirm     from "../book/steps/Step6Confirm";
import { BookingState, makeFare, generatePNR } from "../book/types";

// ── Types ─────────────────────────────────────────────────────
type View = "list" | "booking";
type Tab  = "All" | "Upcoming" | "Completed" | "Cancelled";

const TABS: Tab[] = ["All", "Upcoming", "Completed", "Cancelled"];
const UPCOMING_STATUSES:  BookingStatus[] = ["Confirmed", "RAC", "Waitlisted"];
const COMPLETED_STATUSES: BookingStatus[] = ["Completed"];
const CANCELLED_STATUSES: BookingStatus[] = ["Cancelled", "Refund Initiated"];

// ── Booking flow helpers ──────────────────────────────────────
function makePassenger(id: string) {
  return { id, name: "", age: "", gender: "" as const, idType: "" as const, idNumber: "", kycVerified: false };
}

const INITIAL_BOOKING: BookingState = {
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

// ── Main page ─────────────────────────────────────────────────
export default function MyBookingsPage() {
  // List view state
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [search, setSearch]       = useState("");
  const [loading, setLoading]     = useState(true);

  // View toggle
  const [view, setView] = useState<View>("list");

  // Booking flow state
  const [step, setStep]         = useState(1);
  const [bookState, _setBState] = useState<BookingState>(INITIAL_BOOKING);

  // Simulate list load
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  // ── Filtered bookings ──
  const filtered = useMemo(() => {
    let items = MOCK_BOOKINGS;
    if (activeTab === "Upcoming")  items = items.filter((b) => UPCOMING_STATUSES.includes(b.status));
    if (activeTab === "Completed") items = items.filter((b) => COMPLETED_STATUSES.includes(b.status));
    if (activeTab === "Cancelled") items = items.filter((b) => CANCELLED_STATUSES.includes(b.status));
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (b) => b.pnr.toLowerCase().includes(q) || b.trainName.toLowerCase().includes(q) || b.trainNumber.includes(q)
      );
    }
    return items;
  }, [activeTab, search]);

  // ── Booking flow setState ──
  const setBookingState = useCallback((patch: Partial<BookingState>) => {
    _setBState((prev) => {
      const next = { ...prev, ...patch };
      if (patch.passengers !== undefined) {
        const count = patch.passengers;
        while (next.passengerDetails.length < count)
          next.passengerDetails = [...next.passengerDetails, makePassenger(Date.now().toString() + next.passengerDetails.length)];
        if (next.passengerDetails.length > count)
          next.passengerDetails = next.passengerDetails.slice(0, count);
      }
      if ((patch.selectedClass || patch.passengers) && next.selectedClass)
        next.fare = makeFare(next.selectedClass.price, next.passengers, next.appliedCoupon || undefined);
      return next;
    });
  }, []);

  // ── Step navigation ──
  const goTo = (n: number) => {
    if (n === 6) {
      _setBState((prev) => ({
        ...prev,
        pnr: generatePNR(),
        bookingId: "TRX" + Date.now().toString().slice(-10),
        confirmedAt: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
      }));
    }
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Open booking flow ──
  const openBooking = () => {
    setStep(1);
    _setBState(INITIAL_BOOKING);
    setView("booking");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Return to list ──
  const backToList = () => {
    setView("list");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ═══════════════════════════════════════════════════════════
  // BOOKING FLOW VIEW
  // ═══════════════════════════════════════════════════════════
  if (view === "booking") {
    return (
      <div style={{ minHeight: "100vh", background: "#f0f2f5" }}>
        <BookingsNavbar />

        <main className="mx-auto" style={{ maxWidth: "780px", padding: "20px 16px 56px" }}>

          {/* Back to list */}
          <button
            onClick={backToList}
            className="flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 rounded mb-5 hover:opacity-70 transition-opacity"
            style={{ fontSize: "13px", color: "#6b7280", background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            <ArrowLeft size={14} /> Back to My Bookings
          </button>

          {/* Title + step indicator */}
          {step < 6 && (
            <>
              <div className="mb-5">
                <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#181d2a", marginBottom: "4px" }}>
                  Book a Ticket
                </h1>
                <p style={{ fontSize: "13px", color: "#9ca3af" }}>
                  Complete all steps to confirm your booking.
                </p>
              </div>

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
            </>
          )}

          {/* Steps — Step 1 back goes to list */}
          {step === 1 && (
            <Step1Journey
              state={bookState}
              setState={setBookingState}
              onNext={() => goTo(2)}
              onBack={backToList}
            />
          )}
          {step === 2 && (
            <Step2Passengers
              state={bookState}
              setState={setBookingState}
              onNext={() => goTo(3)}
              onBack={() => goTo(1)}
            />
          )}
          {step === 3 && (
            <Step3Seats
              state={bookState}
              setState={setBookingState}
              onNext={() => goTo(4)}
              onBack={() => goTo(2)}
            />
          )}
          {step === 4 && (
            <Step4Review
              state={bookState}
              setState={setBookingState}
              onNext={() => goTo(5)}
              onBack={() => goTo(3)}
            />
          )}
          {step === 5 && (
            <Step5Payment
              state={bookState}
              setState={setBookingState}
              onNext={() => goTo(6)}
              onBack={() => goTo(4)}
            />
          )}
          {step === 6 && (
            <Step6Confirm
              state={bookState}
              onBackToList={backToList}
            />
          )}
        </main>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // LIST VIEW
  // ═══════════════════════════════════════════════════════════
  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <BookingsNavbar />

      <main className="mx-auto" style={{ maxWidth: "900px", padding: "28px 16px 48px" }}>

        {/* Header row: title + Book button */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#181d2a" }}>
            My Bookings
          </h1>
          <button
            onClick={openBooking}
            className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 hover:opacity-90 active:scale-[0.97] transition-all"
            style={{
              background: "#748efe", color: "white",
              borderRadius: "10px", padding: "10px 20px",
              fontSize: "14px", fontWeight: 600,
              border: "none", cursor: "pointer",
              minHeight: "44px",
            }}
            aria-label="Book a new ticket"
          >
            <Plus size={16} />
            Book a Ticket
          </button>
        </div>

        {/* Tab bar */}
        <div
          className="flex items-center gap-1 mb-5 p-1"
          style={{
            background: "#ffffff", border: "1px solid #e8ebed",
            borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            width: "fit-content",
          }}
          role="tablist"
          aria-label="Booking filter tabs"
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab)}
                className="transition-all focus:outline-none focus-visible:ring-2 rounded-lg"
                style={{
                  padding: "7px 18px", fontSize: "13px",
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "#ffffff" : "#6b7280",
                  background: isActive ? "#748efe" : "transparent",
                  borderRadius: "9px", border: "none", cursor: "pointer",
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Search + filter row */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div
            className="flex items-center gap-2 flex-1"
            style={{
              background: "#ffffff", border: "1px solid #e8ebed",
              borderRadius: "10px", padding: "0 14px",
              height: "44px", minWidth: "200px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
            }}
          >
            <Search size={15} style={{ color: "#9ca3af", flexShrink: 0 }} aria-hidden="true" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by PNR or train name..."
              className="flex-1 bg-transparent border-none outline-none focus:ring-0"
              style={{ fontSize: "13px", color: "#181d2a" }}
              aria-label="Search bookings"
            />
          </div>

          <button
            className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 hover:bg-gray-50 transition-colors"
            style={{
              background: "#ffffff", border: "1px solid #e8ebed",
              borderRadius: "10px", padding: "0 14px",
              height: "44px", fontSize: "13px", color: "#9ca3af",
              whiteSpace: "nowrap", boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              cursor: "pointer",
            }}
            aria-label="Filter by journey date"
          >
            <Calendar size={15} style={{ color: "#9ca3af" }} aria-hidden="true" />
            Journey date
          </button>

          <button
            className="flex items-center justify-center focus:outline-none focus-visible:ring-2 hover:bg-gray-50 transition-colors"
            style={{
              background: "#ffffff", border: "1px solid #e8ebed",
              borderRadius: "10px", width: "44px", height: "44px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)", cursor: "pointer",
            }}
            aria-label="More filters"
          >
            <SlidersHorizontal size={16} style={{ color: "#6b7280" }} />
          </button>
        </div>

        {/* Booking list */}
        <div className="flex flex-col gap-3">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <BookingCardSkeleton key={i} />)
          ) : filtered.length === 0 ? (
            <EmptyState onBookTicket={openBooking} />
          ) : (
            filtered.map((booking) => <BookingCard key={booking.pnr} booking={booking} />)
          )}
        </div>
      </main>
    </div>
  );
}
