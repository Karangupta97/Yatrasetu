"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { Search, Calendar, SlidersHorizontal, Plus, ArrowLeft, Train, CheckCircle2 } from "lucide-react";
import BookingsNavbar from "./components/BookingsNavbar";
import BookingCard from "./components/BookingCard";
import BookingCardSkeleton from "./components/BookingCardSkeleton";
import EmptyState from "./components/EmptyState";
import { MOCK_BOOKINGS, BookingStatus } from "./data/mockBookings";

// ── Booking flow imports ──────────────────────────────────────
import StepIndicator from "../book/components/StepIndicator";
import Step1Journey from "../book/steps/Step1Journey";
import Step2Passengers from "../book/steps/Step2Passengers";
import Step3Seats from "../book/steps/Step3Seats";
import Step4Review from "../book/steps/Step4Review";
import Step5Payment from "../book/steps/Step5Payment";
import Step6Confirm from "../book/steps/Step6Confirm";
import { BookingState, makeFare, generatePNR } from "../book/types";

// ── Types ─────────────────────────────────────────────────────
type View = "list" | "booking";
type Tab = "All" | "Upcoming" | "Completed" | "Cancelled";

const TABS: Tab[] = ["All", "Upcoming", "Completed", "Cancelled"];
const UPCOMING_STATUSES: BookingStatus[] = ["Confirmed", "RAC", "Waitlisted"];
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
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isBookHovered, setIsBookHovered] = useState(false);

  // Filters state
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const parseJourneyDate = useCallback((dateStr: string): string => {
    try {
      const cleanDateStr = dateStr.includes(",") ? dateStr.split(",")[1].trim() : dateStr;
      const parsedDate = new Date(cleanDateStr);
      if (isNaN(parsedDate.getTime())) return "";
      const yyyy = parsedDate.getFullYear();
      const mm = String(parsedDate.getMonth() + 1).padStart(2, "0");
      const dd = String(parsedDate.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    } catch (e) {
      return "";
    }
  }, []);

  // Toast state
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({ visible: false, message: "" });

  // Tab fade state
  const [fadeState, setFadeState] = useState<"in" | "out">("in");
  const [pendingTab, setPendingTab] = useState<Tab | null>(null);

  // View toggle
  const [view, setView] = useState<View>("list");

  // Booking flow state
  const [step, setStep] = useState(1);
  const [bookState, _setBState] = useState<BookingState>(INITIAL_BOOKING);

  // Simulate list load
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 200);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Toast duration timer
  useEffect(() => {
    if (toast.visible) {
      const t = setTimeout(() => setToast({ visible: false, message: "" }), 2000);
      return () => clearTimeout(t);
    }
  }, [toast.visible]);

  // Fade transition for tab change
  const handleTabChange = (tab: Tab) => {
    if (tab === activeTab) return;
    setFadeState("out");
    setPendingTab(tab);
  };

  useEffect(() => {
    if (fadeState === "out" && pendingTab) {
      const t = setTimeout(() => {
        setActiveTab(pendingTab);
        setFadeState("in");
        setPendingTab(null);
      }, 150);
      return () => clearTimeout(t);
    }
  }, [fadeState, pendingTab]);

  // ── Dynamic stats calculation ──
  const stats = useMemo(() => {
    const confirmed = MOCK_BOOKINGS.filter((b) => b.status === "Confirmed").length;
    const rac = MOCK_BOOKINGS.filter((b) => b.status === "RAC").length;
    const cancelled = MOCK_BOOKINGS.filter((b) => b.status === "Cancelled" || b.status === "Refund Initiated").length;
    const completed = MOCK_BOOKINGS.filter((b) => b.status === "Completed").length;
    return { confirmed, rac, cancelled, completed };
  }, []);

  // ── Dynamic tab count badges ──
  const tabCounts = useMemo(() => {
    const all = MOCK_BOOKINGS.length;
    const upcoming = MOCK_BOOKINGS.filter((b) => UPCOMING_STATUSES.includes(b.status)).length;
    const completed = MOCK_BOOKINGS.filter((b) => COMPLETED_STATUSES.includes(b.status)).length;
    const cancelled = MOCK_BOOKINGS.filter((b) => CANCELLED_STATUSES.includes(b.status)).length;
    return { All: all, Upcoming: upcoming, Completed: completed, Cancelled: cancelled };
  }, []);

  // ── Filtered bookings ──
  const filtered = useMemo(() => {
    let items = MOCK_BOOKINGS;
    if (activeTab === "Upcoming") items = items.filter((b) => UPCOMING_STATUSES.includes(b.status));
    if (activeTab === "Completed") items = items.filter((b) => COMPLETED_STATUSES.includes(b.status));
    if (activeTab === "Cancelled") items = items.filter((b) => CANCELLED_STATUSES.includes(b.status));
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      items = items.filter(
        (b) => b.pnr.toLowerCase().includes(q) || b.trainName.toLowerCase().includes(q) || b.trainNumber.includes(q)
      );
    }
    if (selectedDate) {
      items = items.filter((b) => parseJourneyDate(b.journeyDate) === selectedDate);
    }
    if (selectedClasses.length > 0) {
      items = items.filter((b) => selectedClasses.includes(b.seatClass));
    }
    return items;
  }, [activeTab, debouncedSearch, selectedDate, selectedClasses, parseJourneyDate]);

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
    <div style={{ minHeight: "100vh", background: "#F6F8FA" }}>
      <BookingsNavbar />

      <style dangerouslySetInnerHTML={{
        __html: `
        .my-bookings-container {
          max-width: 900px;
          width: 100%;
          margin: 0 auto;
          padding: 40px 24px;
          box-sizing: border-box;
        }
        .my-bookings-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }
        .my-bookings-title {
          font-size: 26px;
          font-weight: 700;
          color: #0F172A;
          margin: 0;
          line-height: 1.2;
          text-decoration: none;
        }
        .my-bookings-subtitle {
          font-size: 13px;
          color: #9CA3AF;
          margin: 2px 0 0 0;
        }
        .my-bookings-book-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: #6366F1;
          color: white;
          border-radius: 10px;
          padding: 10px 20px 10px 16px;
          font-size: 14px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        .my-bookings-book-btn:hover {
          background-color: #4F46E5;
        }
        .my-bookings-stats-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          font-size: 13px;
          color: #6B7280;
          margin-bottom: 20px;
        }
        .my-bookings-stat-item {
          display: inline-flex;
          align-items: center;
        }
        .my-bookings-stat-dot {
          color: #D1D5DB;
          margin: 0 8px;
        }
        .my-bookings-stat-val {
          font-weight: 700;
          color: #111827;
          margin-left: 4px;
        }
        .my-bookings-stat-label-confirmed {
          color: #16A34A;
        }
        .my-bookings-stat-label-rac {
          color: #A16207;
        }
        .my-bookings-stat-label-cancelled {
          color: #B91C1C;
        }
        .my-bookings-stat-label-completed {
          color: #64748B;
        }
        .my-bookings-tabs-container {
          display: flex;
          border-bottom: 1px solid #E5E7EB;
          margin-bottom: 16px;
          width: 100%;
        }
        .my-bookings-tab-btn {
          background: none;
          border: none;
          outline: none;
          padding: 8px 0;
          margin-right: 28px;
          font-size: 13px;
          font-weight: 400;
          color: #6B7280;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .my-bookings-tab-btn:hover {
          color: #6366F1;
        }
        .my-bookings-tab-btn.active {
          font-weight: 600;
          color: #6366F1;
          border-bottom: 2px solid #6366F1;
        }
        .my-bookings-tab-count {
          opacity: 0.8;
          font-weight: inherit;
        }
        .my-bookings-search-row {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          width: 100%;
        }
        .my-bookings-search-wrapper {
          position: relative;
          flex: 1;
        }
        .my-bookings-search-input {
          width: 100%;
          height: 42px;
          border-radius: 10px;
          border: 1px solid #E5E7EB;
          background: white;
          padding: 0 16px 0 40px;
          font-size: 14px;
          color: #0F172A;
          outline: none;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .my-bookings-search-input:focus {
          border-color: #6366F1;
        }
        .my-bookings-btn-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          height: 42px;
          border-radius: 10px;
          border: 1px solid #E5E7EB;
          background: white;
          padding: 0 14px;
          font-size: 13px;
          color: #6B7280;
          cursor: pointer;
          transition: all 0.2s;
          box-sizing: border-box;
          white-space: nowrap;
        }
        .my-bookings-btn-secondary:hover {
          border-color: #D0D5DD;
          color: #374151;
        }
        .my-bookings-btn-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 10px;
          border: 1px solid #E5E7EB;
          background: white;
          color: #6B7280;
          cursor: pointer;
          transition: all 0.2s;
          box-sizing: border-box;
          flex-shrink: 0;
        }
        .my-bookings-btn-icon:hover {
          border-color: #D0D5DD;
          color: #374151;
        }

        @media (max-width: 899px) and (min-width: 768px) {
          .my-bookings-container {
            padding: 32px 20px;
          }
        }

        @media (max-width: 767px) {
          .my-bookings-container {
            padding: 32px 20px;
          }
          .my-bookings-header-row {
            flex-direction: column;
            align-items: stretch;
          }
          .my-bookings-book-btn {
            width: 100%;
            margin-top: 12px;
            justify-content: center;
          }
          .my-bookings-tabs-container {
            overflow-x: auto;
            white-space: nowrap;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .my-bookings-tabs-container::-webkit-scrollbar {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .my-bookings-container {
            padding: 20px 16px;
          }
          .my-bookings-title {
            font-size: 25px;
          }
          .my-bookings-subtitle {
            font-size: 12px;
          }
          .my-bookings-book-btn {
            font-size: 13px;
          }
          .my-bookings-stats-row {
            font-size: 12px;
          }
          .my-bookings-tab-btn {
            font-size: 12px;
            margin-right: 20px;
          }
          .my-bookings-search-input {
            font-size: 13px;
            padding-left: 36px;
          }
          .my-bookings-btn-secondary {
            font-size: 12px;
            padding: 0 10px;
          }
        }
      ` }} />

      <main className="my-bookings-container">

        {/* Header row: title + Book button */}
        <div className="my-bookings-header-row">
          <div className="my-bookings-header-title-zone">
            <h1 className="my-bookings-title">My Bookings</h1>
            <p className="my-bookings-subtitle">Track and manage all your train journeys</p>
          </div>
          <Link
            href="/browse-tickets"
            className="my-bookings-book-btn"
            style={{ textDecoration: "none" }}
            aria-label="Book a new ticket"
          >
            <Train size={14} />
            <span>Book a Ticket</span>
          </Link>
        </div>

        {/* Dynamic Stats bar */}
        <div className="my-bookings-stats-row">
          <span className="my-bookings-stat-item">
            <span className="my-bookings-stat-label-confirmed">Confirmed</span>
            <span className="my-bookings-stat-val">{stats.confirmed}</span>
          </span>
          <span className="my-bookings-stat-dot">·</span>
          <span className="my-bookings-stat-item">
            <span className="my-bookings-stat-label-rac">RAC</span>
            <span className="my-bookings-stat-val">{stats.rac}</span>
          </span>
          <span className="my-bookings-stat-dot">·</span>
          <span className="my-bookings-stat-item">
            <span className="my-bookings-stat-label-cancelled">Cancelled</span>
            <span className="my-bookings-stat-val">{stats.cancelled}</span>
          </span>
          <span className="my-bookings-stat-dot">·</span>
          <span className="my-bookings-stat-item">
            <span className="my-bookings-stat-label-completed">Completed</span>
            <span className="my-bookings-stat-val">{stats.completed}</span>
          </span>
        </div>

        {/* Tab bar switcher */}
        <div
          className="my-bookings-tabs-container"
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
                onClick={() => handleTabChange(tab)}
                className={`my-bookings-tab-btn ${isActive ? "active" : ""}`}
              >
                <span>{tab} </span>
                <span className="my-bookings-tab-count">({tabCounts[tab]})</span>
              </button>
            );
          })}
        </div>

        {/* Search + filter row */}
        <div className="my-bookings-search-row">
          <div className="my-bookings-search-wrapper">
            <Search
              size={18}
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9CA3AF",
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by PNR or train name..."
              className="my-bookings-search-input"
              aria-label="Search bookings"
            />
          </div>

          <div style={{ position: "relative", display: "inline-block" }}>
            <button
              className="my-bookings-btn-secondary"
              aria-label="Filter by journey date"
              style={{ position: "relative" }}
            >
              <Calendar size={16} style={{ color: "#9CA3AF" }} aria-hidden="true" />
              <span>{selectedDate ? selectedDate : "Journey date"}</span>
              {selectedDate && (
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedDate("");
                  }}
                  style={{
                    marginLeft: "6px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    color: "#6B7280",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor: "#F3F4F6",
                    fontSize: "12px",
                  }}
                >
                  ×
                </span>
              )}
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                opacity: 0,
                cursor: "pointer",
              }}
            />
          </div>

          <div style={{ position: "relative" }}>
            <button
              className="my-bookings-btn-icon"
              aria-label="More filters"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              style={{
                borderColor: selectedClasses.length > 0 || showFilterDropdown ? "#6366F1" : "#E5E7EB",
                color: selectedClasses.length > 0 || showFilterDropdown ? "#6366F1" : "#6B7280",
              }}
            >
              <SlidersHorizontal size={16} />
            </button>
            {showFilterDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "46px",
                  right: 0,
                  width: "200px",
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: "10px",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  padding: "12px",
                  zIndex: 100,
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#374151" }}>Filter by Class</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {["Sleeper", "AC 3 Tier", "AC 2 Tier", "Chair Car"].map((cls) => {
                    const isChecked = selectedClasses.includes(cls);
                    return (
                      <label
                        key={cls}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontSize: "13px",
                          color: "#4B5563",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setSelectedClasses(selectedClasses.filter((c) => c !== cls));
                            } else {
                              setSelectedClasses([...selectedClasses, cls]);
                            }
                          }}
                          style={{
                            accentColor: "#6366F1",
                            cursor: "pointer",
                          }}
                        />
                        {cls}
                      </label>
                    );
                  })}
                </div>
                {selectedClasses.length > 0 && (
                  <button
                    onClick={() => setSelectedClasses([])}
                    style={{
                      marginTop: "4px",
                      background: "none",
                      border: "none",
                      color: "#6366F1",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      textAlign: "left",
                      padding: 0,
                    }}
                  >
                    Clear Class Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Booking list wrapper with fade transitions */}
        <div
          className="flex flex-col gap-3"
          style={{
            opacity: fadeState === "in" ? 1 : 0,
            transition: "opacity 150ms ease-in-out",
          }}
        >
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <BookingCardSkeleton key={i} />)
          ) : filtered.length === 0 ? (
            <EmptyState />
          ) : (
            filtered.map((booking) => (
              <BookingCard
                key={booking.pnr}
                booking={booking}
                onCopyPNR={(pnr) => {
                  setToast({ visible: true, message: `PNR Copied!` });
                }}
              />
            ))
          )}
        </div>
      </main>

      {/* Copy notification toast */}
      {toast.visible && (
        <div
          style={{
            position: "fixed",
            bottom: "32px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#0F172A",
            color: "#ffffff",
            padding: "12px 24px",
            borderRadius: "999px",
            boxShadow: "0 10px 25px rgba(15,23,42,0.15)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            zIndex: 1000,
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          <CheckCircle2 size={16} style={{ color: "#22C55E" }} />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
