"use client";

import {
  MapPin,
  Flag,
  CalendarDays,
  ArrowLeftRight,
  Minus,
  Plus,
  Search,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

type SearchBarProps = {
  onSearch?: (from: string, to: string, date: string) => void;
};

const labelStyle: React.CSSProperties = {
  fontSize: "11px", fontWeight: 500, color: "#6b7280", lineHeight: "1", marginBottom: "3px",
};

const valueStyle: React.CSSProperties = {
  fontSize: "14px", fontWeight: 500, color: "#181d2a",
};

function Divider() {
  return (
    <div
      className="hidden md:block self-stretch flex-shrink-0"
      style={{ width: "1px", background: "#e8ebed", margin: "0 8px" }}
      aria-hidden="true"
    />
  );
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [from, setFrom]       = useState("New Delhi");
  const [to, setTo]           = useState("Mumbai CSMT");
  const [date]                = useState("Tue, 12 Sep");
  const [returnOn, setReturnOn] = useState(false);
  const [returnDate]          = useState("Fri, 15 Sep");
  const [passengers, setPassengers] = useState(1);
  const [swapRotated, setSwapRotated] = useState(false);

  const handleSwap = () => {
    setSwapRotated((r) => !r);
    const tmp = from;
    setFrom(to);
    setTo(tmp);
  };

  return (
    <div className="relative" style={{ paddingBottom: "24px" }}>
      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #e8ebed",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          padding: "16px 24px",
        }}
      >
        <div className="flex items-center flex-wrap md:flex-nowrap" style={{ gap: "0" }}>

          {/* FROM */}
          <div className="flex items-center gap-2 flex-1" style={{ minWidth: "110px" }}>
            <MapPin size={16} style={{ color: "#9ca3af", flexShrink: 0 }} aria-hidden="true" />
            <div className="flex flex-col">
              <span style={labelStyle}>From</span>
              <input
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="bg-transparent border-none outline-none focus:ring-0"
                style={{ ...valueStyle, width: "100px" }}
                aria-label="Departure city"
              />
            </div>
          </div>

          {/* SWAP */}
          <div className="flex items-center" style={{ padding: "0 8px", flexShrink: 0 }}>
            <button
              onClick={handleSwap}
              className="flex items-center justify-center focus:outline-none focus-visible:ring-2 hover:opacity-85 active:scale-95"
              style={{
                background: "#181d2a", borderRadius: "50%",
                width: "36px", height: "36px", color: "white", flexShrink: 0,
                transform: `rotate(${swapRotated ? 180 : 0}deg)`,
                transition: "transform 0.3s ease",
              }}
              aria-label="Swap departure and destination cities"
            >
              <ArrowLeftRight size={16} strokeWidth={2} />
            </button>
          </div>

          <Divider />

          {/* TO */}
          <div className="flex items-center gap-2 flex-1" style={{ minWidth: "110px", paddingLeft: "4px" }}>
            <Flag size={16} style={{ color: "#9ca3af", flexShrink: 0 }} aria-hidden="true" />
            <div className="flex flex-col">
              <span style={labelStyle}>To</span>
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="bg-transparent border-none outline-none focus:ring-0"
                style={{ ...valueStyle, width: "110px" }}
                aria-label="Destination city"
              />
            </div>
          </div>

          <Divider />

          {/* DEPARTURE DATE */}
          <div className="flex items-center gap-2 flex-shrink-0" style={{ padding: "0 8px" }}>
            <CalendarDays size={16} style={{ color: "#9ca3af" }} aria-hidden="true" />
            <div className="flex flex-col">
              <span style={labelStyle}>Departure Date</span>
              <div className="flex items-center gap-1">
                <span style={valueStyle}>
                  {returnOn ? `${date} → ${returnDate}` : date}
                </span>
                <ChevronRight size={13} style={{ color: "#9ca3af" }} />
              </div>
            </div>
          </div>

          <Divider />

          {/* RETURN TOGGLE */}
          <div className="flex items-center gap-2 flex-shrink-0" style={{ padding: "0 8px" }}>
            <span style={{ fontSize: "13px", color: "#6b7280", fontWeight: 500 }}>Return</span>
            <button
              role="switch"
              aria-checked={returnOn}
              aria-label="Toggle return journey"
              onClick={() => setReturnOn((v) => !v)}
              className={`toggle-track focus:outline-none focus-visible:ring-2 ${returnOn ? "active" : ""}`}
            >
              <div className="toggle-thumb" />
            </button>
          </div>

          <Divider />

          {/* PASSENGERS */}
          <div className="flex items-center gap-2 flex-shrink-0" style={{ padding: "0 8px" }}>
            <div className="flex flex-col">
              <span style={labelStyle}>Passengers</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPassengers((p) => Math.max(1, p - 1))}
                  className="flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2"
                  style={{ width: "22px", height: "22px", border: "1.5px solid #e8ebed", flexShrink: 0 }}
                  aria-label="Decrease passengers"
                >
                  <Minus size={10} style={{ color: "#181d2a" }} />
                </button>
                <span style={{ ...valueStyle, minWidth: "50px", textAlign: "center" }}>
                  {passengers} adult{passengers > 1 ? "s" : ""}
                </span>
                <button
                  onClick={() => setPassengers((p) => Math.min(9, p + 1))}
                  className="flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2"
                  style={{ width: "22px", height: "22px", border: "1.5px solid #e8ebed", flexShrink: 0 }}
                  aria-label="Increase passengers"
                >
                  <Plus size={10} style={{ color: "#181d2a" }} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* SEARCH BUTTON */}
      <button
        onClick={() => onSearch?.(from, to, date)}
        className="absolute right-0 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-opacity hover:opacity-85 active:scale-95"
        style={{
          background: "#181d2a", borderRadius: "9999px",
          height: "46px", width: "54px", color: "white",
          bottom: "0px", boxShadow: "0 4px 12px rgba(24,29,42,0.35)",
        }}
        aria-label="Search trains"
      >
        <Search size={18} strokeWidth={2.5} />
      </button>
    </div>
  );
}
