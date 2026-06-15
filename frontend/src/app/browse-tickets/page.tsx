"use client";

import { useState, useMemo, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  SlidersHorizontal, X, MapPin, Flag, CalendarDays,
  ArrowLeftRight, Search, Users, Train,
} from "lucide-react";
import BookingsNavbar from "../my-bookings/components/BookingsNavbar";
import FilterSidebar from "./components/FilterSidebar";
import type { Filters } from "./components/FilterSidebar";
import SortBar from "./components/SortBar";
import TrainCard from "./components/TrainCard";
import BookingOverlay from "./components/BookingOverlay";
import { Train as TrainType, ClassAvailability } from "./data/trains";
import { searchTrains } from "./data/searchTrains";

/* ── defaults ─────────────────────────────────────────────── */
const DEFAULT_FILTERS: Filters = {
  seatClasses: [], priceMin: 1000, priceMax: 5000,
  fromTime: { hour: 7, minute: 0, period: "AM" },
  toTime: { hour: 6, minute: 0, period: "PM" },
  trainTypes: [], amenities: [],
};

type SortKey = "cheapest" | "recommended";

/* ── sort ─────────────────────────────────────────────────── */
function sortTrains(t: TrainType[], s: SortKey) {
  const c = [...t];
  if (s === "cheapest") return c.sort((a, b) => a.price - b.price);
  const rank = (x: TrainType) =>
    x.badge?.type === "recommended" ? 0 : x.badge?.type === "popular" ? 1 : x.badge?.type === "cheapest" ? 2 : 3;
  return c.sort((a, b) => rank(a) - rank(b));
}

/* ── filter ───────────────────────────────────────────────── */
function filterTrains(t: TrainType[], f: Filters): TrainType[] {
  return t.filter(x => {
    if (x.price < f.priceMin || x.price > f.priceMax) return false;
    if (f.seatClasses.length > 0) {
      if (!f.seatClasses.some(k => x.classes.some(c => c.code === k || (k === "Sleeper" && c.code === "SL"))))
        return false;
    }
    if (f.trainTypes.length > 0) {
      if (!f.trainTypes.some(k => x.name.toLowerCase().includes(k.toLowerCase()))) return false;
    }
    const [depH] = x.departure.time.split(":").map(Number);
    const depMins = depH * 60;
    const { period, hour: fromH } = f.fromTime;
    let slotStart = 0, slotEnd = 1440;
    if (period === "AM" && fromH === 6) { slotStart = 360; slotEnd = 720; }
    if (period === "PM" && fromH === 12) { slotStart = 720; slotEnd = 1080; }
    if (period === "PM" && fromH === 18) { slotStart = 1080; slotEnd = 1320; }
    if (period === "PM" && fromH === 22) { slotStart = 1320; slotEnd = 1440; }
    if (slotStart !== 0 || slotEnd !== 1440) {
      if (slotStart === 1320) { if (!(depMins >= 1320 || depMins < 360)) return false; }
      else { if (depMins < slotStart || depMins >= slotEnd) return false; }
    }
    if (f.amenities.length > 0) {
      const feats = x.features.map(v => v.toLowerCase());
      for (const a of f.amenities) {
        if (a === "pantry" && !feats.some(v => v.includes("pantry") || v.includes("catering"))) return false;
        if (a === "wifi" && !feats.some(v => v.includes("wi-fi") && !v.includes("no wi-fi"))) return false;
        if (a === "eco" && !x.tags?.some(v => v.toLowerCase().includes("eco"))) return false;
        if (a === "divyang" && !feats.some(v => v.includes("divyang"))) return false;
      }
    }
    return true;
  });
}

/* ── station list ─────────────────────────────────────────── */
const STATIONS = [
  // Major metros & hubs
  { code: "NDLS", name: "New Delhi" },
  { code: "NZM",  name: "Hazrat Nizamuddin" },
  { code: "DLI",  name: "Old Delhi" },
  { code: "DEE",  name: "Delhi Sarai Rohilla" },
  { code: "CSMT", name: "Mumbai CSMT" },
  { code: "BCT",  name: "Mumbai Central" },
  { code: "DDR",  name: "Mumbai Dadar" },
  { code: "LTT",  name: "Mumbai Lokmanya Tilak" },
  { code: "THANE",name: "Thane" },
  { code: "SBC",  name: "Bengaluru KSR" },
  { code: "YPR",  name: "Yeshwanthpur" },
  { code: "BNC",  name: "Bengaluru City" },
  { code: "MAS",  name: "Chennai Central" },
  { code: "MS",   name: "Chennai Egmore" },
  { code: "MBM",  name: "Chennai Beach" },
  { code: "HWH",  name: "Howrah Jn" },
  { code: "KOAA", name: "Kolkata" },
  { code: "SDAH", name: "Sealdah" },
  { code: "BPL",  name: "Bhopal Jn" },
  { code: "NGP",  name: "Nagpur" },
  // Rajasthan & Gujarat
  { code: "JP",   name: "Jaipur" },
  { code: "JU",   name: "Jodhpur Jn" },
  { code: "UDZ",  name: "Udaipur City" },
  { code: "AII",  name: "Ajmer Jn" },
  { code: "BKN",  name: "Bikaner Jn" },
  { code: "ADI",  name: "Ahmedabad" },
  { code: "BRC",  name: "Vadodara Jn" },
  { code: "ST",   name: "Surat" },
  { code: "RJT",  name: "Rajkot Jn" },
  { code: "GIMB", name: "Gandhidham" },
  { code: "PBR",  name: "Porbandar" },
  // Maharashtra & Pune
  { code: "PUNE", name: "Pune Jn" },
  { code: "PNVL", name: "Panvel" },
  { code: "NK",   name: "Nasik Road" },
  { code: "AWB",  name: "Aurangabad" },
  { code: "NGS",  name: "Nagpur" },
  { code: "KOP",  name: "Kolhapur" },
  // Telangana & Andhra
  { code: "SC",   name: "Secunderabad Jn" },
  { code: "HYB",  name: "Hyderabad Deccan" },
  { code: "NZB",  name: "Nizamabad" },
  { code: "VSKP", name: "Visakhapatnam" },
  { code: "BZA",  name: "Vijayawada Jn" },
  { code: "GNT",  name: "Guntur Jn" },
  { code: "TPTY", name: "Tirupati" },
  { code: "GTL",  name: "Guntakal Jn" },
  // Karnataka & Kerala
  { code: "MYS",  name: "Mysuru Jn" },
  { code: "UBL",  name: "Hubballi Jn" },
  { code: "DWR",  name: "Dharwad" },
  { code: "MAQ",  name: "Mangaluru Jn" },
  { code: "TVC",  name: "Thiruvananthapuram" },
  { code: "ERS",  name: "Ernakulam Jn" },
  { code: "CBE",  name: "Coimbatore Jn" },
  { code: "SA",   name: "Salem Jn" },
  { code: "MDU",  name: "Madurai Jn" },
  { code: "TEN",  name: "Tirunelveli Jn" },
  // Odisha & East
  { code: "BBS",  name: "Bhubaneswar" },
  { code: "CTC",  name: "Cuttack" },
  { code: "PURI", name: "Puri" },
  { code: "ROU",  name: "Rourkela Jn" },
  // UP, Bihar & Jharkhand
  { code: "LKO",  name: "Lucknow NR" },
  { code: "LJN",  name: "Lucknow Jn" },
  { code: "CNB",  name: "Kanpur Central" },
  { code: "BSB",  name: "Varanasi Jn" },
  { code: "ALD",  name: "Prayagraj Jn" },
  { code: "AGC",  name: "Agra Cantt" },
  { code: "AF",   name: "Agra Fort" },
  { code: "MTJ",  name: "Mathura Jn" },
  { code: "MB",   name: "Moradabad" },
  { code: "GZB",  name: "Ghaziabad" },
  { code: "MFP",  name: "Muzaffarpur Jn" },
  { code: "PNBE", name: "Patna Jn" },
  { code: "GAYA", name: "Gaya Jn" },
  { code: "DHN",  name: "Dhanbad Jn" },
  { code: "RNC",  name: "Ranchi" },
  { code: "JSME", name: "Jasidih" },
  // Punjab, Haryana & HP
  { code: "ASR",  name: "Amritsar Jn" },
  { code: "CDG",  name: "Chandigarh" },
  { code: "LDH",  name: "Ludhiana Jn" },
  { code: "JUC",  name: "Jalandhar City" },
  { code: "PTKC", name: "Pathankot Cantt" },
  { code: "UMB",  name: "Ambala Cantt" },
  { code: "RE",   name: "Rewari" },
  { code: "GGN",  name: "Gurugram" },
  // MP, CG
  { code: "KOTA", name: "Kota Jn" },
  { code: "IDH",  name: "Indore Jn" },
  { code: "GWL",  name: "Gwalior Jn" },
  { code: "JBP",  name: "Jabalpur" },
  { code: "R",    name: "Raipur Jn" },
  { code: "BSP",  name: "Bilaspur Jn" },
  // North East & J&K
  { code: "GHY",  name: "Guwahati" },
  { code: "DBRG", name: "Dibrugarh" },
  { code: "AGTL", name: "Agartala" },
  { code: "JAT",  name: "Jammu Tawi" },
];

function todayStr() { return new Date().toISOString().split("T")[0]; }
function fmtDate(iso: string) {
  if (!iso) return "";
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

/* ── station row (shared render) ──────────────────────────── */
function StationRow({ s, hovered, setHovered, onSelect }: {
  s: { code: string; name: string };
  hovered: string | null;
  setHovered: (c: string | null) => void;
  onSelect: (s: { code: string; name: string }) => void;
}) {
  const isHov = hovered === s.code;
  return (
    <button
      onMouseDown={e => { e.preventDefault(); onSelect(s); }}
      onMouseEnter={() => setHovered(s.code)}
      onMouseLeave={() => setHovered(null)}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: "10px",
        padding: "9px 14px",
        background: isHov ? "#f0f3ff" : "transparent",
        border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left",
        transition: "background 0.15s",
      }}
    >
      <span style={{
        minWidth: "42px", height: "24px", borderRadius: "6px",
        background: isHov ? "#dde4ff" : "#eef2ff",
        border: `1px solid ${isHov ? "#748efe" : "#c7d2fe"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "10px", fontWeight: 800, color: "#748efe",
        flexShrink: 0, letterSpacing: "0.04em", padding: "0 4px",
      }}>
        {s.code}
      </span>
      <span style={{ fontSize: "13.5px", fontWeight: 600, color: "#181d2a", flex: 1 }}>
        {s.name}
      </span>
      {isHov && <span style={{ fontSize: "12px", color: "#748efe", fontWeight: 700 }}>↗</span>}
    </button>
  );
}

/* Section label inside dropdown */
function DropdownLabel({ text }: { text: string }) {
  return (
    <div style={{
      padding: "8px 14px 5px",
      fontSize: "10px", fontWeight: 700, color: "#9ca3af",
      textTransform: "uppercase", letterSpacing: "0.08em",
      borderBottom: "1px solid #f3f4f6",
    }}>
      {text}
    </div>
  );
}

/* ── station autocomplete ─────────────────────────────────── */

/* A fixed set of "popular" stations shown at the top when idle and as
   "other suggestions" below matching results when the user is typing. */
const POPULAR_CODES = ["NDLS", "CSMT", "SBC", "MAS", "HWH", "BCT", "PUNE", "SC"];
const POPULAR = STATIONS.filter(s => POPULAR_CODES.includes(s.code));

function StationInput({ label, value, onChange, icon }: {
  label: string; value: string; onChange: (v: string) => void; icon: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const [query, setQuery]     = useState(value);
  const [hovered, setHovered] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setQuery(value); }, [value]);

  const isSearching = query.trim().length > 0;

  /* Up to 6 stations that match the query */
  const matches = isSearching
    ? STATIONS.filter(s =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.code.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : [];

  /* Popular stations that are NOT already in the match list */
  const matchCodes = new Set(matches.map(s => s.code));
  const others = isSearching
    ? POPULAR.filter(s => !matchCodes.has(s.code)).slice(0, 4)
    : POPULAR;

  const handleSelect = (s: { code: string; name: string }) => {
    setQuery(s.name);
    onChange(s.name);
    setFocused(false);
  };

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", flex: 1, minWidth: "130px" }}>
      {/* Input */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 14px" }}>
        {icon}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: "10px", fontWeight: 700, color: "#748efe",
            textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "2px",
          }}>{label}</div>
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); onChange(e.target.value); }}
            onFocus={() => setFocused(true)}
            placeholder="City or station code"
            autoComplete="off"
            aria-label={label}
            style={{
              background: "transparent", border: "none", outline: "none",
              fontSize: "14px", fontWeight: 700, color: "#181d2a",
              fontFamily: "inherit", width: "100%",
            }}
          />
        </div>
      </div>

      {/* Dropdown */}
      {focused && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", left: 0,
          minWidth: "270px", background: "#ffffff",
          border: "1.5px solid #e8ebed",
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          zIndex: 300, overflow: "hidden",
        }}>

          {isSearching ? (
            <>
              {/* ── Matching results ── */}
              {matches.length > 0 ? (
                <>
                  <DropdownLabel text="Matching Stations" />
                  {matches.map(s => (
                    <StationRow key={s.code} s={s} hovered={hovered} setHovered={setHovered} onSelect={handleSelect} />
                  ))}
                </>
              ) : (
                <div style={{ padding: "14px 16px", fontSize: "13px", color: "#9ca3af" }}>
                  No stations found
                </div>
              )}

              {/* ── Other suggestions (popular, not in match list) ── */}
              {others.length > 0 && (
                <>
                  <DropdownLabel text="Other Suggestions" />
                  {others.map(s => (
                    <StationRow key={s.code} s={s} hovered={hovered} setHovered={setHovered} onSelect={handleSelect} />
                  ))}
                </>
              )}
            </>
          ) : (
            /* ── Idle: just popular ── */
            <>
              <DropdownLabel text="Popular Stations" />
              {others.map(s => (
                <StationRow key={s.code} s={s} hovered={hovered} setHovered={setHovered} onSelect={handleSelect} />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ── search bar ───────────────────────────────────────────── */
function SearchRow({ defaultFrom, defaultTo, onSearch }: {
  defaultFrom: string; defaultTo: string; onSearch: (f: string, t: string) => void;
}) {
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo]     = useState(defaultTo);
  const [date, setDate] = useState(todayStr());
  const [swapped, setSwap] = useState(false);
  const [shakeError, setShakeError] = useState(false);
  const dateRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setFrom(defaultFrom); setTo(defaultTo); }, [defaultFrom, defaultTo]);

  const swap = () => { setSwap(v => !v); const tmp = from; setFrom(to); setTo(tmp); };

  /* Normalise for comparison — lowercase + trim */
  const isSame = from.trim().toLowerCase() !== "" &&
                 from.trim().toLowerCase() === to.trim().toLowerCase();

  const handleSearch = () => {
    if (isSame) {
      /* Shake the error message to draw attention */
      setShakeError(true);
      setTimeout(() => setShakeError(false), 600);
      return;
    }
    onSearch(from, to);
  };

  return (
    <div>
      <div style={{
        background: "#ffffff",
        border: `1.5px solid ${isSame ? "#f4632a" : "#e8ebed"}`,
        borderRadius: "16px",
        padding: "6px 10px 6px 6px",
        display: "flex", alignItems: "center",
        flexWrap: "wrap", gap: 0,
        boxShadow: isSame
          ? "0 4px 12px rgba(244,99,42,0.15)"
          : "0 4px 12px rgba(0,0,0,0.08)",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}>
        {/* FROM */}
        <StationInput
          label="From"
          value={from}
          onChange={setFrom}
          icon={<MapPin size={15} style={{ color: isSame ? "#f4632a" : "#748efe", flexShrink: 0 }} />}
        />

        {/* SWAP */}
        <button
          onClick={swap}
          aria-label="Swap departure and destination"
          style={{
            width: "34px", height: "34px", borderRadius: "50%",
            background: "#181d2a", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, margin: "0 4px",
            transform: `rotate(${swapped ? 180 : 0}deg)`,
            transition: "transform 0.3s ease, background 0.2s",
            boxShadow: "0 2px 8px rgba(24,29,42,0.3)",
          }}
          onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.background = "#2d3748"; }}
          onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.background = "#181d2a"; }}
        >
          <ArrowLeftRight size={14} color="white" strokeWidth={2.2} />
        </button>

        {/* Divider */}
        <div style={{ width: "1px", height: "34px", background: "#e8ebed", margin: "0 4px", flexShrink: 0 }} />

        {/* TO */}
        <StationInput
          label="To"
          value={to}
          onChange={setTo}
          icon={<Flag size={15} style={{ color: isSame ? "#f4632a" : "#748efe", flexShrink: 0 }} />}
        />

        {/* Divider */}
        <div style={{ width: "1px", height: "34px", background: "#e8ebed", margin: "0 6px", flexShrink: 0 }} />

        {/* DATE */}
        <div
          style={{
            position: "relative", display: "flex", alignItems: "center",
            gap: "8px", padding: "6px 14px", flexShrink: 0, cursor: "pointer",
          }}
          onClick={() => dateRef.current?.showPicker?.()}
        >
          <CalendarDays size={15} style={{ color: "#748efe", flexShrink: 0, pointerEvents: "none" }} />
          <div style={{ pointerEvents: "none" }}>
            <div style={{
              fontSize: "10px", fontWeight: 700, color: "#748efe",
              textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "2px",
            }}>Date</div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#181d2a", whiteSpace: "nowrap" }}>
              {fmtDate(date) || "Select date"}
            </div>
          </div>
          <input
            ref={dateRef} type="date" value={date} min={todayStr()}
            onChange={e => setDate(e.target.value)}
            style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: "1px", height: "1px", top: 0, left: 0 }}
            aria-label="Journey date"
          />
        </div>

        {/* Divider */}
        <div style={{ width: "1px", height: "34px", background: "#e8ebed", margin: "0 6px", flexShrink: 0 }} />

        {/* PASSENGERS */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 14px", flexShrink: 0 }}>
          <Users size={15} style={{ color: "#748efe" }} />
          <div>
            <div style={{
              fontSize: "10px", fontWeight: 700, color: "#748efe",
              textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "2px",
            }}>Passengers</div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#181d2a" }}>1 Adult</div>
          </div>
        </div>

        {/* SEARCH BUTTON */}
        <button
          onClick={handleSearch}
          style={{
            marginLeft: "8px",
            background: isSame ? "#e5e7eb" : "#181d2a",
            border: "none", borderRadius: "12px",
            padding: "11px 22px",
            color: isSame ? "#9ca3af" : "white",
            fontSize: "14px", fontWeight: 700,
            cursor: isSame ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", gap: "7px",
            fontFamily: "inherit",
            boxShadow: isSame ? "none" : "0 4px 12px rgba(24,29,42,0.30)",
            transition: "background 0.2s, box-shadow 0.2s, color 0.2s",
            flexShrink: 0,
          }}
          onMouseOver={e => {
            if (isSame) return;
            const btn = e.currentTarget as HTMLButtonElement;
            btn.style.background = "#2d3748";
            btn.style.boxShadow = "0 6px 16px rgba(24,29,42,0.4)";
          }}
          onMouseOut={e => {
            if (isSame) return;
            const btn = e.currentTarget as HTMLButtonElement;
            btn.style.background = "#181d2a";
            btn.style.boxShadow = "0 4px 12px rgba(24,29,42,0.30)";
          }}
          aria-disabled={isSame}
        >
          <Search size={14} strokeWidth={2.5} /> Search
        </button>
      </div>

      {/* ── Same-station error banner ── */}
      {isSame && (
        <div
          role="alert"
          style={{
            marginTop: "8px",
            display: "flex", alignItems: "center", gap: "8px",
            background: "#fff5f0",
            border: "1.5px solid #f4632a",
            borderRadius: "10px",
            padding: "9px 14px",
            animation: shakeError ? "ys-shake 0.5s ease" : "ys-slideDown 0.2s ease",
          }}
        >
          {/* Icon */}
          <span style={{
            width: "20px", height: "20px", borderRadius: "50%",
            background: "#f4632a", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "12px", fontWeight: 900, flexShrink: 0,
          }}>!</span>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#c2410c" }}>
            Departure and destination can&apos;t be the same station.
          </span>
          <span style={{ fontSize: "12px", color: "#f4632a", marginLeft: "auto", whiteSpace: "nowrap" }}>
            Please choose a different station.
          </span>
        </div>
      )}

      <style>{`
        @keyframes ys-slideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ys-shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-6px); }
          40%       { transform: translateX(6px); }
          60%       { transform: translateX(-4px); }
          80%       { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}

/* ── loading skeleton ─────────────────────────────────────── */
function TrainCardSkeleton() {
  return (
    <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "16px 18px", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }} aria-hidden>
      <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
        {[120, 60, 70].map((w, i) => <div key={i} style={{ width: `${w}px`, height: "14px", borderRadius: "6px", background: "#f1f5f9", animation: `ys-pulse 1.4s ease-in-out ${i * 0.1}s infinite` }} />)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
        <div style={{ width: "52px", height: "36px", borderRadius: "6px", background: "#f1f5f9", animation: "ys-pulse 1.4s ease-in-out infinite" }} />
        <div style={{ flex: 1, height: "4px", borderRadius: "2px", background: "#f1f5f9" }} />
        <div style={{ width: "52px", height: "36px", borderRadius: "6px", background: "#f1f5f9", animation: "ys-pulse 1.4s ease-in-out 0.15s infinite" }} />
      </div>
      <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
        {[80, 65, 90].map((w, i) => <div key={i} style={{ width: `${w}px`, height: "20px", borderRadius: "9999px", background: "#f1f5f9", animation: `ys-pulse 1.4s ease-in-out ${i * 0.1}s infinite` }} />)}
      </div>
      <div style={{ display: "flex", gap: "6px" }}>
        {[74, 74, 74].map((w, i) => <div key={i} style={{ width: `${w}px`, height: "60px", borderRadius: "10px", background: "#f1f5f9", animation: `ys-pulse 1.4s ease-in-out ${i * 0.1}s infinite` }} />)}
      </div>
    </div>
  );
}

/* ── main page ────────────────────────────────────────────── */
function PassengerPageInner() {
  const params = useSearchParams();
  const [from, setFrom] = useState(params.get("from") ?? "New Delhi");
  const [to, setTo] = useState(params.get("to") ?? "Mumbai CSMT");

  const [routeTrains, setRouteTrains] = useState<TrainType[]>(() => searchTrains(from, to).trains);
  const [routeMatched, setRouteMatched] = useState<boolean>(() => searchTrains(from, to).matched);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortKey>("cheapest");
  const [fadeKey, setFadeKey] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bookingTrain, setBookingTrain] = useState<TrainType | null>(null);
  const [bookingClass, setBookingClass] = useState<ClassAvailability | null>(null);

  const displayed = useMemo(
    () => sortTrains(filterTrains(routeTrains, appliedFilters), sort),
    [routeTrains, appliedFilters, sort]
  );

  const handleSearch = (f: string, t: string) => {
    setFrom(f); setTo(t);
    setFilters(DEFAULT_FILTERS); setAppliedFilters(DEFAULT_FILTERS);
    setLoading(true);
    setTimeout(() => {
      const r = searchTrains(f, t);
      setRouteTrains(r.trains);
      setRouteMatched(r.matched);
      setLoading(false);
      setFadeKey(k => k + 1);
    }, 600);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5", fontFamily: "'Google Sans','Inter',system-ui,sans-serif" }}>
      <BookingsNavbar />

      {/* Search bar — sticky */}
      <div style={{ background: "#ffffff", borderBottom: "1px solid #e8ebed", position: "sticky", top: "64px", zIndex: 40 }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "10px 24px" }}>
          <SearchRow defaultFrom={from} defaultTo={to} onSearch={handleSearch} />
        </div>
      </div>

      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "24px 24px 64px" }}>
        <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>

          {/* Sidebar */}
          <div className="hidden lg:block flex-shrink-0"
            style={{ width: "260px", position: "sticky", top: "130px", alignSelf: "flex-start", maxHeight: "calc(100vh - 146px)", overflowY: "auto", scrollbarWidth: "thin" }}>
            <FilterSidebar
              filters={filters}
              onChange={f => { setFilters(f); setAppliedFilters(f); setFadeKey(k => k + 1); }}
              onApply={() => { setAppliedFilters(filters); setFadeKey(k => k + 1); }}
            />
          </div>

          {/* Results */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Mobile filter btn */}
            <div className="flex lg:hidden" style={{ marginBottom: "12px" }}>
              <button onClick={() => setMobileOpen(true)}
                style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.9)", border: "1.5px solid rgba(226,232,240,0.85)", borderRadius: "10px", padding: "9px 18px", fontSize: "13px", fontWeight: 600, color: "#0f172a", cursor: "pointer", fontFamily: "inherit" }}>
                <SlidersHorizontal size={14} /> Filters
              </button>
            </div>

            {/* Result count */}
            {!loading && routeMatched && (
              <div style={{ fontSize: "13px", color: "#64748b", fontWeight: 500, marginBottom: "10px", display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ fontWeight: 700, color: "#0f172a" }}>{displayed.length}</span>
                {` train${displayed.length !== 1 ? "s" : ""} found · `}
                <span style={{ color: "#6366f1", fontWeight: 600 }}>{from} → {to}</span>
              </div>
            )}

            <SortBar activeSort={sort} onSortChange={s => { setSort(s); setFadeKey(k => k + 1); }} />

            {/* Content */}
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[1, 2, 3].map(i => <TrainCardSkeleton key={i} />)}
              </div>
            ) : !routeMatched ? (
              <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: "16px", padding: "56px 32px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <Train size={40} style={{ color: "#cbd5e1", margin: "0 auto 14px", display: "block" }} />
                <p style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>No trains found for this route</p>
                <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "16px" }}>Try different stations or date</p>
                <p style={{ fontSize: "11px", color: "#cbd5e1" }}>Supported: Delhi ↔ Mumbai · Mumbai ↔ Bengaluru · Delhi ↔ Bengaluru · Delhi ↔ Chennai · Mumbai ↔ Kolkata</p>
              </div>
            ) : displayed.length === 0 ? (
              <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: "16px", padding: "56px 32px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <Train size={36} style={{ color: "#cbd5e1", margin: "0 auto 12px", display: "block" }} />
                <p style={{ fontSize: "15px", fontWeight: 600, color: "#94a3b8", marginBottom: "16px" }}>No trains match your filters.</p>
                <button onClick={() => { setFilters(DEFAULT_FILTERS); setAppliedFilters(DEFAULT_FILTERS); }}
                  style={{ background: "linear-gradient(135deg,#4f46e5,#6366f1)", color: "white", border: "none", borderRadius: "9999px", padding: "10px 24px", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  Reset Filters
                </button>
              </div>
            ) : (
              <div key={fadeKey} style={{ display: "flex", flexDirection: "column", gap: "12px", animation: "ys-fadeIn 0.25s ease" }}>
                {displayed.map(train => (
                  <TrainCard key={train.id} train={train} onBook={(t, c) => { setBookingTrain(t); setBookingClass(c); }} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile bottom sheet */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden"
          style={{ background: "rgba(0,0,0,0.45)" }} role="dialog" aria-modal="true" aria-label="Filters">
          <div className="absolute inset-0" onClick={() => setMobileOpen(false)} />
          <div className="relative overflow-y-auto"
            style={{ background: "#ffffff", borderRadius: "20px 20px 0 0", maxHeight: "88vh", padding: "8px 8px 0" }}>
            <div className="flex justify-between items-center px-4 py-3">
              <span style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>Filters</span>
              <button onClick={() => setMobileOpen(false)}
                style={{ width: "38px", height: "38px", borderRadius: "50%", border: "none", background: "#f1f5f9", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} aria-label="Close">
                <X size={17} style={{ color: "#64748b" }} />
              </button>
            </div>
            <div className="px-2 pb-6">
              <FilterSidebar filters={filters} onChange={setFilters} onApply={() => { setAppliedFilters(filters); setFadeKey(k => k + 1); setMobileOpen(false); }} />
            </div>
          </div>
        </div>
      )}

      {bookingTrain && bookingClass && (
        <BookingOverlay train={bookingTrain} selectedClass={bookingClass}
          onClose={() => { setBookingTrain(null); setBookingClass(null); }} />
      )}

      <style>{`
        @keyframes ys-fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes ys-pulse  { 0%,100% { opacity:1; } 50% { opacity:0.45; } }
      `}</style>
    </div>
  );
}

export default function PassengerPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#f8faff 0%,#eef4ff 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "3px solid #e2e8f0", borderTopColor: "#2563eb", animation: "ys-spin 0.65s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ fontSize: "14px", color: "#94a3b8", fontWeight: 500 }}>Loading tickets…</p>
        </div>
        <style>{`@keyframes ys-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <PassengerPageInner />
    </Suspense>
  );
}
