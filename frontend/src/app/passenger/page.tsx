"use client";

import { useState, useMemo } from "react";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import FilterSidebar from "./components/FilterSidebar";
import type { Filters } from "./components/FilterSidebar";
import SortBar from "./components/SortBar";
import TrainCard from "./components/TrainCard";
import BookingOverlay from "./components/BookingOverlay";
import { TRAINS, Train, ClassAvailability } from "./data/trains";
import { SlidersHorizontal, X } from "lucide-react";

const DEFAULT_FILTERS: Filters = {
  seatClasses: [],
  priceMin: 1000,
  priceMax: 5000,
  fromTime: { hour: 7, minute: 0, period: "AM" },
  toTime:   { hour: 6, minute: 0, period: "PM" },
};

type SortKey = "cheapest" | "recommended";

function sortTrains(trains: Train[], sort: SortKey): Train[] {
  const copy = [...trains];
  if (sort === "cheapest") return copy.sort((a, b) => a.price - b.price);
  const rank = (t: Train) => {
    if (t.badge?.type === "recommended") return 0;
    if (t.badge?.type === "popular")     return 1;
    if (t.badge?.type === "cheapest")    return 2;
    return 3;
  };
  return copy.sort((a, b) => rank(a) - rank(b));
}

function filterTrains(trains: Train[], filters: Filters): Train[] {
  return trains.filter((t) => {
    if (t.price < filters.priceMin || t.price > filters.priceMax) return false;
    return true;
  });
}

export default function PassengerPage() {
  const [filters, setFilters]             = useState<Filters>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sort, setSort]                   = useState<SortKey>("cheapest");
  const [fadeKey, setFadeKey]             = useState(0);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // ── Booking overlay state ──────────────────────────────────
  const [bookingTrain, setBookingTrain]   = useState<Train | null>(null);
  const [bookingClass, setBookingClass]   = useState<ClassAvailability | null>(null);

  const handleBook = (train: Train, cls: ClassAvailability) => {
    setBookingTrain(train);
    setBookingClass(cls);
  };

  const handleCloseOverlay = () => {
    setBookingTrain(null);
    setBookingClass(null);
  };
  // ──────────────────────────────────────────────────────────

  const handleSortChange = (s: SortKey) => {
    setSort(s);
    setFadeKey((k) => k + 1);
  };

  const displayedTrains = useMemo(
    () => sortTrains(filterTrains(TRAINS, appliedFilters), sort),
    [appliedFilters, sort]
  );

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setFadeKey((k) => k + 1);
    setMobileSidebarOpen(false);
  };

  const handleSearch = (from: string, to: string, date: string) => {
    setFadeKey((k) => k + 1);
    console.log("Searching:", { from, to, date });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5" }}>

      {/* ── NAVBAR — fixed at top ── */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50 }}>
        <Navbar />
      </div>

      {/* Spacer */}
      <div style={{ height: "64px" }} />

      <main className="mx-auto" style={{ maxWidth: "1200px", padding: "16px 16px 48px" }}>

        {/* ── SEARCH BAR — sticky ── */}
        <div
          style={{
            position: "sticky", top: "64px", zIndex: 40,
            paddingBottom: "4px", background: "#f0f2f5",
          }}
        >
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* ── CONTENT ── */}
        <div className="flex gap-5 items-start" style={{ marginTop: "4px" }}>

          {/* Filter sidebar */}
          <div
            className="hidden md:block flex-shrink-0"
            style={{
              position: "sticky", top: "calc(64px + 100px)",
              alignSelf: "flex-start",
              maxHeight: "calc(100vh - 64px - 100px - 16px)",
              overflowY: "auto",
            }}
          >
            <FilterSidebar filters={filters} onChange={setFilters} onApply={handleApplyFilters} />
          </div>

          {/* Results */}
          <div className="flex-1 min-w-0">
            <div className="flex md:hidden mb-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="flex items-center gap-2 rounded-full focus:outline-none focus-visible:ring-2"
                style={{
                  background: "#ffffff", border: "1px solid #e8ebed",
                  padding: "8px 16px", fontSize: "14px", fontWeight: 600,
                  color: "#181d2a", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", minHeight: "44px",
                }}
                aria-label="Open filters"
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>
            </div>

            <SortBar activeSort={sort} onSortChange={handleSortChange} />

            {displayedTrains.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-20 rounded-xl"
                style={{ background: "#ffffff", border: "1px solid #e8ebed", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
              >
                <p style={{ fontSize: "16px", color: "#9ca3af", fontWeight: 500 }}>
                  No trains match your filters.
                </p>
                <button
                  onClick={() => { setFilters(DEFAULT_FILTERS); setAppliedFilters(DEFAULT_FILTERS); }}
                  className="mt-4 rounded-full focus:outline-none hover:opacity-90"
                  style={{ background: "#748efe", color: "white", padding: "8px 24px", fontSize: "14px", fontWeight: 600, minHeight: "44px" }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div key={fadeKey} className="flex flex-col gap-3" style={{ animation: "fadeIn 0.25s ease" }}>
                {displayedTrains.map((train) => (
                  <TrainCard
                    key={train.id}
                    train={train}
                    onBook={handleBook}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── MOBILE BOTTOM SHEET ── */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end md:hidden"
          style={{ background: "rgba(0,0,0,0.45)" }}
          role="dialog" aria-modal="true" aria-label="Filters"
        >
          <div className="absolute inset-0" onClick={() => setMobileSidebarOpen(false)} />
          <div
            className="relative overflow-y-auto"
            style={{ background: "#ffffff", borderRadius: "20px 20px 0 0", maxHeight: "85vh", padding: "8px 8px 0" }}
          >
            <div className="flex justify-between items-center px-4 py-3">
              <span style={{ fontSize: "16px", fontWeight: 600, color: "#181d2a" }}>Filters</span>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="flex items-center justify-center rounded-full hover:bg-gray-100 focus:outline-none"
                style={{ width: "44px", height: "44px" }} aria-label="Close filters"
              >
                <X size={18} style={{ color: "#6b7280" }} />
              </button>
            </div>
            <div className="px-2 pb-6">
              <FilterSidebar filters={filters} onChange={setFilters} onApply={handleApplyFilters} />
            </div>
          </div>
        </div>
      )}

      {/* ── BOOKING OVERLAY — mounts when a train is selected ── */}
      {bookingTrain && bookingClass && (
        <BookingOverlay
          train={bookingTrain}
          selectedClass={bookingClass}
          onClose={handleCloseOverlay}
        />
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
