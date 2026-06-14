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
  toTime:   { hour: 6, minute: 0, period: "PM" },
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
    if (period === "AM" && fromH === 6)  { slotStart = 360;  slotEnd = 720;  }
    if (period === "PM" && fromH === 12) { slotStart = 720;  slotEnd = 1080; }
    if (period === "PM" && fromH === 18) { slotStart = 1080; slotEnd = 1320; }
    if (period === "PM" && fromH === 22) { slotStart = 1320; slotEnd = 1440; }
    if (slotStart !== 0 || slotEnd !== 1440) {
      if (slotStart === 1320) { if (!(depMins >= 1320 || depMins < 360)) return false; }
      else { if (depMins < slotStart || depMins >= slotEnd) return false; }
    }
    if (f.amenities.length > 0) {
      const feats = x.features.map(v => v.toLowerCase());
      for (const a of f.amenities) {
        if (a === "pantry"  && !feats.some(v => v.includes("pantry") || v.includes("catering"))) return false;
        if (a === "wifi"    && !feats.some(v => v.includes("wi-fi") && !v.includes("no wi-fi"))) return false;
        if (a === "eco"     && !x.tags?.some(v => v.toLowerCase().includes("eco"))) return false;
        if (a === "divyang" && !feats.some(v => v.includes("divyang"))) return false;
      }
    }
    return true;
  });
}

/* ── station list ─────────────────────────────────────────── */
const STATIONS = [
  { code:"NDLS", name:"New Delhi"       },
  { code:"CSMT", name:"Mumbai CSMT"     },
  { code:"BCT",  name:"Mumbai Central"  },
  { code:"SBC",  name:"Bengaluru KSR"   },
  { code:"MAS",  name:"Chennai Central" },
  { code:"HWH",  name:"Howrah Jn"       },
  { code:"KOAA", name:"Kolkata"         },
  { code:"SDAH", name:"Sealdah"         },
  { code:"BPL",  name:"Bhopal Jn"       },
  { code:"NGP",  name:"Nagpur"          },
  { code:"JP",   name:"Jaipur"          },
  { code:"ADI",  name:"Ahmedabad"       },
  { code:"PUNE", name:"Pune Jn"         },
  { code:"SC",   name:"Secunderabad"    },
  { code:"BRC",  name:"Vadodara"        },
  { code:"ST",   name:"Surat"           },
  { code:"LKO",  name:"Lucknow"         },
  { code:"CNB",  name:"Kanpur Central"  },
  { code:"BSB",  name:"Varanasi Jn"     },
  { code:"ASR",  name:"Amritsar Jn"     },
  { code:"CDG",  name:"Chandigarh"      },
  { code:"AGC",  name:"Agra Cantt"      },
  { code:"KOTA", name:"Kota Jn"         },
  { code:"VSKP", name:"Visakhapatnam"   },
  { code:"BBS",  name:"Bhubaneswar"     },
];

function todayStr() { return new Date().toISOString().split("T")[0]; }
function fmtDate(iso: string) {
  if (!iso) return "";
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", { weekday:"short", day:"numeric", month:"short" });
}

/* ── station autocomplete ─────────────────────────────────── */
function StationInput({ label, value, onChange, icon }: {
  label: string; value: string; onChange: (v: string) => void; icon: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const [query, setQuery]     = useState(value);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setQuery(value); }, [value]);

  const matches = query.length > 0
    ? STATIONS.filter(s => s.name.toLowerCase().includes(query.toLowerCase()) || s.code.toLowerCase().includes(query.toLowerCase())).slice(0, 7)
    : STATIONS.slice(0, 7);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setFocused(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} style={{ position:"relative", flex:1, minWidth:"120px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"8px", padding:"4px 12px" }}>
        {icon}
        <div style={{ flex:1 }}>
          <div style={{ fontSize:"10px", fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.07em" }}>{label}</div>
          <input value={query}
            onChange={e => { setQuery(e.target.value); onChange(e.target.value); }}
            onFocus={() => setFocused(true)}
            placeholder="City or station" autoComplete="off" aria-label={label}
            style={{ background:"transparent", border:"none", outline:"none", fontSize:"14px", fontWeight:700, color:"#0f172a", fontFamily:"inherit", width:"100%" }}
          />
        </div>
      </div>
      {focused && (
        <div style={{ position:"absolute", top:"calc(100% + 6px)", left:0, minWidth:"240px", background:"#fff", border:"1px solid #e2e8f0", borderRadius:"14px", boxShadow:"0 8px 30px rgba(15,23,42,0.12)", zIndex:200, overflow:"hidden" }}>
          {matches.length === 0
            ? <div style={{ padding:"12px 16px", fontSize:"13px", color:"#94a3b8" }}>No stations found</div>
            : matches.map(s => (
              <button key={s.code} onMouseDown={e => { e.preventDefault(); setQuery(s.name); onChange(s.name); setFocused(false); }}
                style={{ width:"100%", display:"flex", alignItems:"center", gap:"10px", padding:"10px 16px", background:"transparent", border:"none", cursor:"pointer", fontFamily:"inherit", textAlign:"left" }}
                onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.background = "#f8fafc"; }}
                onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>
                <span style={{ width:"36px", height:"24px", borderRadius:"6px", background:"#eff6ff", border:"1px solid #bfdbfe", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"10px", fontWeight:800, color:"#2563eb", flexShrink:0 }}>{s.code}</span>
                <span style={{ fontSize:"13px", fontWeight:600, color:"#0f172a" }}>{s.name}</span>
              </button>
            ))
          }
        </div>
      )}
    </div>
  );
}

/* ── search bar ───────────────────────────────────────────── */
function SearchRow({ defaultFrom, defaultTo, onSearch }: {
  defaultFrom: string; defaultTo: string; onSearch: (f: string, t: string) => void;
}) {
  const [from, setFrom]    = useState(defaultFrom);
  const [to,   setTo]      = useState(defaultTo);
  const [date, setDate]    = useState(todayStr());
  const [swapped, setSwap] = useState(false);
  const dateRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setFrom(defaultFrom); setTo(defaultTo); }, [defaultFrom, defaultTo]);

  const swap = () => { setSwap(v => !v); const tmp = from; setFrom(to); setTo(tmp); };

  return (
    <div style={{ background:"rgba(255,255,255,0.92)", backdropFilter:"blur(12px)", border:"1.5px solid rgba(226,232,240,0.85)", borderRadius:"16px", padding:"8px 12px", display:"flex", alignItems:"center", flexWrap:"wrap", gap:0, boxShadow:"0 4px 20px rgba(15,23,42,0.07)" }}>
      <StationInput label="From" value={from} onChange={setFrom} icon={<MapPin size={14} style={{ color:"#2563eb", flexShrink:0 }} />} />
      <button onClick={swap} aria-label="Swap"
        style={{ width:"32px", height:"32px", borderRadius:"50%", background:"linear-gradient(135deg,#1e40af,#2563eb)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"transform 0.3s", transform:`rotate(${swapped?180:0}deg)`, margin:"0 4px" }}>
        <ArrowLeftRight size={13} color="white" strokeWidth={2.2} />
      </button>
      <div style={{ width:"1px", height:"32px", background:"rgba(226,232,240,0.7)", margin:"0 4px" }} />
      <StationInput label="To" value={to} onChange={setTo} icon={<Flag size={14} style={{ color:"#2563eb", flexShrink:0 }} />} />
      <div style={{ width:"1px", height:"32px", background:"rgba(226,232,240,0.7)", margin:"0 4px" }} />
      {/* Date */}
      <div style={{ position:"relative", display:"flex", alignItems:"center", gap:"8px", padding:"4px 12px", flexShrink:0, cursor:"pointer" }}
        onClick={() => dateRef.current?.showPicker?.()}>
        <CalendarDays size={14} style={{ color:"#2563eb", flexShrink:0, pointerEvents:"none" }} />
        <div style={{ pointerEvents:"none" }}>
          <div style={{ fontSize:"10px", fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.07em" }}>Date</div>
          <div style={{ fontSize:"14px", fontWeight:600, color:"#0f172a", whiteSpace:"nowrap" }}>{fmtDate(date) || "Select date"}</div>
        </div>
        <input ref={dateRef} type="date" value={date} min={todayStr()} onChange={e => setDate(e.target.value)}
          style={{ position:"absolute", opacity:0, pointerEvents:"none", width:"1px", height:"1px", top:0, left:0 }} aria-label="Journey date" />
      </div>
      <div style={{ width:"1px", height:"32px", background:"rgba(226,232,240,0.7)", margin:"0 4px" }} />
      {/* Passengers */}
      <div style={{ display:"flex", alignItems:"center", gap:"8px", padding:"4px 12px", flexShrink:0 }}>
        <Users size={14} style={{ color:"#2563eb" }} />
        <div>
          <div style={{ fontSize:"10px", fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.07em" }}>Passengers</div>
          <div style={{ fontSize:"14px", fontWeight:600, color:"#0f172a" }}>1 Adult</div>
        </div>
      </div>
      <button onClick={() => onSearch(from, to)}
        style={{ marginLeft:"8px", background:"linear-gradient(135deg,#1e40af,#2563eb)", border:"none", borderRadius:"12px", padding:"10px 22px", color:"white", fontSize:"14px", fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:"7px", fontFamily:"inherit", boxShadow:"0 4px 12px rgba(37,99,235,0.30)", transition:"filter 0.2s", flexShrink:0 }}
        onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.08)"; }}
        onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1)"; }}>
        <Search size={14} strokeWidth={2.5} /> Search
      </button>
    </div>
  );
}

/* ── loading skeleton ─────────────────────────────────────── */
function TrainCardSkeleton() {
  return (
    <div style={{ background:"#fff", borderRadius:"14px", border:"1px solid #e2e8f0", padding:"16px 18px", boxShadow:"0 1px 6px rgba(0,0,0,0.04)" }} aria-hidden>
      <div style={{ display:"flex", gap:"10px", marginBottom:"12px" }}>
        {[120,60,70].map((w,i) => <div key={i} style={{ width:`${w}px`, height:"14px", borderRadius:"6px", background:"#f1f5f9", animation:`ys-pulse 1.4s ease-in-out ${i*0.1}s infinite` }} />)}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"12px" }}>
        <div style={{ width:"52px", height:"36px", borderRadius:"6px", background:"#f1f5f9", animation:"ys-pulse 1.4s ease-in-out infinite" }} />
        <div style={{ flex:1, height:"4px", borderRadius:"2px", background:"#f1f5f9" }} />
        <div style={{ width:"52px", height:"36px", borderRadius:"6px", background:"#f1f5f9", animation:"ys-pulse 1.4s ease-in-out 0.15s infinite" }} />
      </div>
      <div style={{ display:"flex", gap:"6px", marginBottom:"12px" }}>
        {[80,65,90].map((w,i) => <div key={i} style={{ width:`${w}px`, height:"20px", borderRadius:"9999px", background:"#f1f5f9", animation:`ys-pulse 1.4s ease-in-out ${i*0.1}s infinite` }} />)}
      </div>
      <div style={{ display:"flex", gap:"6px" }}>
        {[74,74,74].map((w,i) => <div key={i} style={{ width:`${w}px`, height:"60px", borderRadius:"10px", background:"#f1f5f9", animation:`ys-pulse 1.4s ease-in-out ${i*0.1}s infinite` }} />)}
      </div>
    </div>
  );
}

/* ── main page ────────────────────────────────────────────── */
function PassengerPageInner() {
  const params = useSearchParams();
  const [from, setFrom] = useState(params.get("from") ?? "New Delhi");
  const [to,   setTo]   = useState(params.get("to")   ?? "Mumbai CSMT");

  const [routeTrains, setRouteTrains]   = useState<TrainType[]>(() => searchTrains(from, to).trains);
  const [routeMatched, setRouteMatched] = useState<boolean>(() => searchTrains(from, to).matched);
  const [loading, setLoading]           = useState(false);

  const [filters, setFilters]               = useState<Filters>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sort, setSort]                     = useState<SortKey>("cheapest");
  const [fadeKey, setFadeKey]               = useState(0);
  const [mobileOpen, setMobileOpen]         = useState(false);
  const [bookingTrain, setBookingTrain]     = useState<TrainType | null>(null);
  const [bookingClass, setBookingClass]     = useState<ClassAvailability | null>(null);

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
    <div style={{ minHeight:"100vh", background:"linear-gradient(180deg,#f8faff 0%,#eef4ff 100%)", fontFamily:"'Google Sans','Inter',system-ui,sans-serif" }}>
      <BookingsNavbar />

      {/* Search bar — sticky */}
      <div style={{ background:"rgba(255,255,255,0.85)", backdropFilter:"blur(12px)", borderBottom:"1px solid rgba(226,232,240,0.7)", position:"sticky", top:"64px", zIndex:40 }}>
        <div style={{ maxWidth:"1280px", margin:"0 auto", padding:"10px 24px" }}>
          <SearchRow defaultFrom={from} defaultTo={to} onSearch={handleSearch} />
        </div>
      </div>

      <main style={{ maxWidth:"1280px", margin:"0 auto", padding:"24px 24px 64px" }}>
        <div style={{ display:"flex", gap:"24px", alignItems:"flex-start" }}>

          {/* Sidebar */}
          <div className="hidden lg:block flex-shrink-0"
            style={{ width:"260px", position:"sticky", top:"130px", alignSelf:"flex-start", maxHeight:"calc(100vh - 146px)", overflowY:"auto", scrollbarWidth:"thin" }}>
            <FilterSidebar
              filters={filters}
              onChange={f => { setFilters(f); setAppliedFilters(f); setFadeKey(k => k + 1); }}
              onApply={() => { setAppliedFilters(filters); setFadeKey(k => k + 1); }}
            />
          </div>

          {/* Results */}
          <div style={{ flex:1, minWidth:0 }}>
            {/* Mobile filter btn */}
            <div className="flex lg:hidden" style={{ marginBottom:"12px" }}>
              <button onClick={() => setMobileOpen(true)}
                style={{ display:"flex", alignItems:"center", gap:"8px", background:"rgba(255,255,255,0.9)", border:"1.5px solid rgba(226,232,240,0.85)", borderRadius:"10px", padding:"9px 18px", fontSize:"13px", fontWeight:600, color:"#0f172a", cursor:"pointer", fontFamily:"inherit" }}>
                <SlidersHorizontal size={14} /> Filters
              </button>
            </div>

            {/* Result count */}
            {!loading && routeMatched && (
              <div style={{ fontSize:"13px", color:"#64748b", fontWeight:500, marginBottom:"10px", display:"flex", alignItems:"center", gap:"5px" }}>
                <span style={{ fontWeight:700, color:"#0f172a" }}>{displayed.length}</span>
                {` train${displayed.length !== 1 ? "s" : ""} found · `}
                <span style={{ color:"#6366f1", fontWeight:600 }}>{from} → {to}</span>
              </div>
            )}

            <SortBar activeSort={sort} onSortChange={s => { setSort(s); setFadeKey(k => k + 1); }} />

            {/* Content */}
            {loading ? (
              <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                {[1,2,3].map(i => <TrainCardSkeleton key={i} />)}
              </div>
            ) : !routeMatched ? (
              <div style={{ background:"#fff", border:"1.5px solid #e2e8f0", borderRadius:"16px", padding:"56px 32px", textAlign:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>
                <Train size={40} style={{ color:"#cbd5e1", margin:"0 auto 14px", display:"block" }} />
                <p style={{ fontSize:"16px", fontWeight:700, color:"#0f172a", marginBottom:"6px" }}>No trains found for this route</p>
                <p style={{ fontSize:"13px", color:"#94a3b8", marginBottom:"16px" }}>Try different stations or date</p>
                <p style={{ fontSize:"11px", color:"#cbd5e1" }}>Supported: Delhi ↔ Mumbai · Mumbai ↔ Bengaluru · Delhi ↔ Bengaluru · Delhi ↔ Chennai · Mumbai ↔ Kolkata</p>
              </div>
            ) : displayed.length === 0 ? (
              <div style={{ background:"#fff", border:"1.5px solid #e2e8f0", borderRadius:"16px", padding:"56px 32px", textAlign:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>
                <Train size={36} style={{ color:"#cbd5e1", margin:"0 auto 12px", display:"block" }} />
                <p style={{ fontSize:"15px", fontWeight:600, color:"#94a3b8", marginBottom:"16px" }}>No trains match your filters.</p>
                <button onClick={() => { setFilters(DEFAULT_FILTERS); setAppliedFilters(DEFAULT_FILTERS); }}
                  style={{ background:"linear-gradient(135deg,#4f46e5,#6366f1)", color:"white", border:"none", borderRadius:"9999px", padding:"10px 24px", fontSize:"13px", fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                  Reset Filters
                </button>
              </div>
            ) : (
              <div key={fadeKey} style={{ display:"flex", flexDirection:"column", gap:"12px", animation:"ys-fadeIn 0.25s ease" }}>
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
          style={{ background:"rgba(0,0,0,0.45)" }} role="dialog" aria-modal="true" aria-label="Filters">
          <div className="absolute inset-0" onClick={() => setMobileOpen(false)} />
          <div className="relative overflow-y-auto"
            style={{ background:"#ffffff", borderRadius:"20px 20px 0 0", maxHeight:"88vh", padding:"8px 8px 0" }}>
            <div className="flex justify-between items-center px-4 py-3">
              <span style={{ fontSize:"16px", fontWeight:700, color:"#0f172a" }}>Filters</span>
              <button onClick={() => setMobileOpen(false)}
                style={{ width:"38px", height:"38px", borderRadius:"50%", border:"none", background:"#f1f5f9", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }} aria-label="Close">
                <X size={17} style={{ color:"#64748b" }} />
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
      <div style={{ minHeight:"100vh", background:"linear-gradient(180deg,#f8faff 0%,#eef4ff 100%)", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ width:"40px", height:"40px", borderRadius:"50%", border:"3px solid #e2e8f0", borderTopColor:"#2563eb", animation:"ys-spin 0.65s linear infinite", margin:"0 auto 16px" }} />
          <p style={{ fontSize:"14px", color:"#94a3b8", fontWeight:500 }}>Loading tickets…</p>
        </div>
        <style>{`@keyframes ys-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <PassengerPageInner />
    </Suspense>
  );
}
