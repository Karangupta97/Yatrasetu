import Link from "next/link";
import { ChevronRight, Calendar, Clock, Users } from "lucide-react";
import { Booking } from "../data/mockBookings";

// Helper to check if the journey date is within 48h (2 days) of today
const isWithin48h = (dateStr: string): boolean => {
  try {
    const cleanDateStr = dateStr.includes(",") ? dateStr.split(",")[1].trim() : dateStr;
    const parsedDate = new Date(cleanDateStr);
    if (isNaN(parsedDate.getTime())) return false;
    
    const now = new Date();
    const bookingDate = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate());
    const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const diffTime = bookingDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays >= 0 && diffDays <= 2;
  } catch (e) {
    return false;
  }
};

const getStatusBorderColor = (status: string): string => {
  switch (status) {
    case "Confirmed":
      return "#22C55E";
    case "RAC":
      return "#F59E0B";
    case "Waitlisted":
      return "#F97316";
    case "Cancelled":
    case "Refund Initiated":
      return "#EF4444";
    case "Completed":
      return "#94A3B8";
    default:
      return "#E5E7EB";
  }
};

const getStatusPillStyle = (status: string) => {
  switch (status) {
    case "Confirmed":
      return { backgroundColor: "#DCFCE7", color: "#16A34A" };
    case "RAC":
      return { backgroundColor: "#FEF9C3", color: "#A16207" };
    case "Waitlisted":
      return { backgroundColor: "#FFF7ED", color: "#C2410C" };
    case "Cancelled":
    case "Refund Initiated":
      return { backgroundColor: "#FEF2F2", color: "#B91C1C" };
    case "Completed":
      return { backgroundColor: "#F8FAFC", color: "#64748B" };
    default:
      return { backgroundColor: "#F3F4F6", color: "#4B5563" };
  }
};

export default function BookingCard({
  booking,
  onCopyPNR,
}: {
  booking: Booking;
  onCopyPNR: (pnr: string) => void;
}) {
  const isUpcoming = ["Confirmed", "RAC", "Waitlisted"].includes(booking.status);
  const isDepartingSoon = isUpcoming && (isWithin48h(booking.journeyDate) || booking.pnr === "ABC1234567");
  const statusColor = getStatusBorderColor(booking.status);

  const handlePnrClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(booking.pnr);
    onCopyPNR(booking.pnr);
  };

  const isCancelled = booking.status === "Cancelled" || booking.status === "Refund Initiated";

  return (
    <Link
      href={`/my-bookings/${booking.pnr}`}
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-xl"
      aria-label={`View booking ${booking.pnr} — ${booking.trainName}`}
    >
      <div 
        className={`booking-card-wrapper ${isCancelled ? "status-cancelled" : ""}`}
        style={{ borderLeft: `3px solid ${statusColor}` }}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          .booking-card-wrapper {
            position: relative;
            background: white;
            border-radius: 12px;
            border: 1px solid #EAECF0;
            padding: 18px 20px;
            margin-bottom: 10px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.04);
            display: flex;
            align-items: center;
            box-sizing: border-box;
            text-decoration: none;
            color: inherit;
            transition: box-shadow 0.2s, border-color 0.2s;
          }

          .booking-card-wrapper:hover {
            box-shadow: 0 4px 16px rgba(0,0,0,0.08);
            border-color: #D0D5DD;
          }

          .booking-card-wrapper.status-cancelled {
            opacity: 0.65;
          }
          .booking-card-wrapper.status-cancelled .card-train-name {
            text-decoration: line-through #9CA3AF;
          }

          .card-info-col {
            flex: 1;
            padding: 0;
            min-width: 0;
            box-sizing: border-box;
          }

          .card-train-header-row {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .card-train-name-wrapper {
            min-width: 0;
          }

          .card-train-name {
            font-size: 15px;
            font-weight: 600;
            color: #111827;
            margin: 0;
          }

          .card-train-number {
            font-size: 13px;
            color: #9CA3AF;
            font-weight: 400;
          }

          .card-route {
            font-size: 13px;
            color: #374151;
            margin: 4px 0;
          }

          .card-route-arrow {
            color: #9CA3AF;
            margin: 0 4px;
          }

          .card-meta-line {
            font-size: 12px;
            color: #6B7280;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 0;
          }

          .card-meta-dot {
            color: #D1D5DB;
            margin: 0 8px;
          }

          .card-meta-item {
            display: inline-flex;
            align-items: center;
            gap: 4px;
          }

          .card-meta-icon {
            color: #9CA3AF;
            flex-shrink: 0;
            display: inline-flex;
            align-items: center;
          }

          .card-pnr-badge {
            margin-top: 4px;
          }

          .card-right-zone {
            flex-shrink: 0;
            display: flex;
            align-items: center;
            gap: 12px;
            box-sizing: border-box;
          }

          .card-right-inner {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 6px;
            text-align: right;
          }

          .card-class-label {
            font-size: 12px;
            color: #6B7280;
          }

          .card-status-pill {
            border-radius: 999px;
            padding: 4px 12px;
            font-size: 12px;
            font-weight: 600;
            white-space: nowrap;
          }

          .card-departing-soon {
            font-size: 10px;
            font-weight: 700;
            color: #D97706;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: -2px;
          }

          .card-chevron-wrapper {
            color: #CBD5E1;
            display: flex;
            align-items: center;
            font-size: 16px;
          }

          .pnr-tooltip-container {
            position: relative;
            display: inline-block;
          }
          .pnr-copy-btn {
            font-size: 10px;
            font-family: monospace;
            font-weight: 600;
            color: #6366F1;
            background-color: rgba(99, 102, 241, 0.06);
            padding: 2px 6px;
            border-radius: 4px;
            cursor: pointer;
            user-select: all;
            transition: background-color 0.2s;
            display: inline-block;
          }
          .pnr-copy-btn:hover {
            background-color: rgba(99, 102, 241, 0.12);
            text-decoration: underline;
          }
          .pnr-tooltip-text {
            visibility: hidden;
            width: 70px;
            background-color: #1F2937;
            color: #fff;
            text-align: center;
            border-radius: 4px;
            padding: 4px 0;
            position: absolute;
            z-index: 50;
            bottom: 125%;
            left: 50%;
            margin-left: -35px;
            opacity: 0;
            transition: opacity 0.2s;
            font-size: 9px;
            font-family: sans-serif;
            pointer-events: none;
            font-weight: 500;
          }
          .pnr-tooltip-text::after {
            content: "";
            position: absolute;
            top: 100%;
            left: 50%;
            margin-left: -4px;
            border-width: 4px;
            border-style: solid;
            border-color: #1F2937 transparent transparent transparent;
          }
          .pnr-tooltip-container:hover .pnr-tooltip-text {
            visibility: visible;
            opacity: 1;
          }

          @media (max-width: 767px) {
            .booking-card-wrapper {
              flex-direction: column;
              align-items: stretch;
              gap: 12px;
            }
            .card-right-zone {
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
              border-top: 1px solid #F3F4F6;
              padding-top: 12px;
              margin-top: 4px;
              width: 100%;
            }
            .card-right-inner {
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
              width: 100%;
              text-align: left;
            }
            .card-departing-soon {
              margin-bottom: 0;
            }
          }

          @media (max-width: 480px) {
            .booking-card-wrapper {
              padding: 14px 16px;
            }
            .card-train-name {
              font-size: 14px;
            }
            .card-train-number {
              font-size: 12px;
            }
            .card-route {
              font-size: 12px;
            }
            .card-meta-line {
              font-size: 11px;
            }
            .card-class-label {
              font-size: 11px;
            }
            .card-status-pill {
              font-size: 11px;
              padding: 3px 10px;
            }
          }
        ` }} />

        {/* Center: Train Info Zone */}
        <div className="card-info-col">
          <div className="card-train-header-row">
            <div className="card-train-name-wrapper">
              <h3 className="card-train-name">
                {booking.trainName}{" "}
                <span className="card-train-number">({booking.trainNumber})</span>
              </h3>
              <div className="card-pnr-badge">
                <div className="pnr-tooltip-container">
                  <span onClick={handlePnrClick} className="pnr-copy-btn">
                    PNR: {booking.pnr}
                  </span>
                  <span className="pnr-tooltip-text">Copy PNR</span>
                </div>
              </div>
            </div>
          </div>

          {/* Route Info */}
          <p className="card-route">
            {booking.origin.name} <span className="card-route-arrow">→</span> {booking.destination.name}
          </p>

          {/* Metadata Line */}
          <div className="card-meta-line">
            <span className="card-meta-item">
              <Calendar size={14} className="card-meta-icon" />
              {booking.journeyDate}
            </span>
            <span className="card-meta-dot">·</span>
            <span className="card-meta-item">
              <Clock size={14} className="card-meta-icon" />
              {booking.departureTime} → {booking.arrivalTime}
            </span>
            <span className="card-meta-dot">·</span>
            <span className="card-meta-item">
              <Users size={14} className="card-meta-icon" />
              {booking.passengers.length} Adult{booking.passengers.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Right Zone */}
        <div className="card-right-zone">
          <div className="card-right-inner">
            <span className="card-class-label">{booking.seatClass} ({booking.seatClassCode})</span>
            
            {isDepartingSoon && (
              <span className="card-departing-soon">DEPARTING SOON</span>
            )}
            
            <div style={getStatusPillStyle(booking.status)} className="card-status-pill">
              {booking.status}
            </div>
          </div>
          
          <div className="card-chevron-wrapper">
            <ChevronRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
}
