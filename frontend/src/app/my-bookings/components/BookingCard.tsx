import Link from "next/link";
import { Train, Calendar, Clock, Users, ChevronRight } from "lucide-react";
import { Booking } from "../data/mockBookings";
import StatusBadge from "./StatusBadge";

export default function BookingCard({ booking }: { booking: Booking }) {
  return (
    <Link
      href={`/my-bookings/${booking.pnr}`}
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 group"
      style={{ focusRingColor: "#748efe" } as React.CSSProperties}
      aria-label={`View booking ${booking.pnr} — ${booking.trainName}`}
    >
      <div
        className="flex items-center gap-4 transition-all duration-150 group-hover:shadow-md"
        style={{
          background: "#ffffff",
          border: "1px solid #e8ebed",
          borderRadius: "12px",
          padding: "16px 20px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        {/* Train icon + PNR */}
        <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{ width: "44px", height: "44px", background: "rgba(116,142,254,0.1)" }}
          >
            <Train size={20} style={{ color: "#748efe" }} aria-hidden="true" />
          </div>
          <div className="text-center">
            <p style={{ fontSize: "9px", color: "#9ca3af", fontWeight: 500, letterSpacing: "0.05em" }}>PNR</p>
            <p style={{ fontSize: "12px", color: "#748efe", fontWeight: 700, letterSpacing: "0.02em" }}>
              {booking.pnr}
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Train name */}
          <p style={{ fontSize: "15px", fontWeight: 700, color: "#181d2a", marginBottom: "3px" }}>
            {booking.trainName}{" "}
            <span style={{ fontWeight: 500, color: "#6b7280", fontSize: "13px" }}>
              ({booking.trainNumber})
            </span>
          </p>

          {/* Route */}
          <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "6px" }}>
            {booking.origin.name} ({booking.origin.code}){" "}
            <span style={{ color: "#9ca3af" }}>→</span>{" "}
            {booking.destination.name} ({booking.destination.code})
          </p>

          {/* Meta row */}
          <div className="flex items-center flex-wrap gap-3">
            <span className="flex items-center gap-1" style={{ fontSize: "12px", color: "#6b7280" }}>
              <Calendar size={12} style={{ color: "#9ca3af" }} aria-hidden="true" />
              {booking.journeyDate}
            </span>
            <span className="flex items-center gap-1" style={{ fontSize: "12px", color: "#6b7280" }}>
              <Clock size={12} style={{ color: "#9ca3af" }} aria-hidden="true" />
              {booking.departureTime} → {booking.arrivalTime}
            </span>
            <span className="flex items-center gap-1" style={{ fontSize: "12px", color: "#6b7280" }}>
              <Users size={12} style={{ color: "#9ca3af" }} aria-hidden="true" />
              {booking.passengers.length} Adult{booking.passengers.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Right: class + status + chevron */}
        <div className="flex-shrink-0 flex flex-col items-end gap-2">
          <p style={{ fontSize: "12px", color: "#6b7280", fontWeight: 500 }}>
            {booking.seatClass} ({booking.seatClassCode})
          </p>
          <StatusBadge status={booking.status} />
        </div>

        <ChevronRight size={16} style={{ color: "#9ca3af", flexShrink: 0 }} aria-hidden="true" />
      </div>
    </Link>
  );
}
