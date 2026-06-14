"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Train, MapPin, Clock, Star, Wifi, WifiOff,
  Utensils, Users, Calendar, ChevronDown, ChevronUp,
  RefreshCw, Radio, AlertCircle, CheckCircle2, Circle,
  Accessibility, TrendingUp,
} from "lucide-react";
import { TRAINS } from "../../passenger/data/trains";
import BookingsNavbar from "../../my-bookings/components/BookingsNavbar";

/* ─── Helpers ────────────────────────────────────────────── */
function FeatureIcon({ text }: { text: string }) {
  const lower = text.toLowerCase();
  if (lower.includes("pantry") || lower.includes("catering"))
    return <Utensils size={14} style={{ color: "#748efe" }} />;
  if (lower.includes("no wi-fi"))
    return <WifiOff size={14} style={{ color: "#9ca3af" }} />;
  if (lower.includes("wi-fi"))
    return <Wifi size={14} style={{ color: "#748efe" }} />;
  return <Accessibility size={14} style={{ color: "#748efe" }} />;
}

function getDelay(trainId: string): number {
  const hash = trainId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const val = ((hash * 7) % 9) - 2;
  return val * 5;
}

function timeToDate(hhmm: string): Date {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

type RouteStop = {
  city: string;
  time: string;
  date: string;
  isOrigin?: boolean;
  isDestination?: boolean;
};

/* ─── Page ───────────────────────────────────────────────── */
export default function TrainDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const train = TRAINS.find((t) => t.id === id);

  const [showAllStops, setShowAllStops] = useState(false);
  const [refreshing, setRefreshing]     = useState(false);
  const [lastUpdated, setLastUpdated]   = useState("Just now");

  if (!train) {
    return (
      <div style={{ minHeight: "100vh", background: "#f0f2f5" }}>
        <BookingsNavbar />
        <div className="flex flex-col items-center justify-center" style={{ minHeight: "60vh", gap: "16px" }}>
          <Train size={48} style={{ color: "#e8ebed" }} />
          <p style={{ fontSize: "18px", fontWeight: 600, color: "#181d2a" }}>Train not found</p>
          <Link href="/passenger" style={{ background: "#748efe", color: "white", borderRadius: "12px", padding: "10px 24px", fontSize: "14px", fontWeight: 600, textDecoration: "none" }}>
            Browse trains
          </Link>
        </div>
      </div>
    );
  }

  const delay    = getDelay(train.id);
  const isOnTime = delay <= 0;
  const isLate   = delay > 15;

  const fullRoute: RouteStop[] = [
    { city: train.departure.city, time: train.departure.time, date: train.departure.date, isOrigin: true },
    ...train.stops.map((s) => ({ city: s.city, time: s.time ?? "—", date: s.date })),
    { city: train.arrival.city,   time: train.arrival.time,   date: train.arrival.date,   isDestination: true },
  ];

  const now = new Date();
  let currentStopIndex = 0;
  for (let i = 0; i < fullRoute.length; i++) {
    if (fullRoute[i].time === "—") continue;
    if (timeToDate(fullRoute[i].time) <= now) currentStopIndex = i;
  }

  const visibleStops = showAllStops ? fullRoute : fullRoute.slice(0, Math.min(4, fullRoute.length));

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      const t = new Date();
      setLastUpdated(`${t.getHours()}:${String(t.getMinutes()).padStart(2, "0")}`);
    }, 1200);
  };

  const delayColor = isOnTime ? "#16a34a" : isLate ? "#dc2626" : "#d97706";
  const delayBg    = isOnTime ? "#f0fdf4" : isLate ? "#fef2f2" : "#fffbeb";
  const [ratingNum] = train.rating.split(" · ");

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <BookingsNavbar />

      <main className="mx-auto" style={{ maxWidth: "900px", padding: "20px 16px 56px" }}>

        {/* ── Breadcrumb ── */}
        <div className="flex items-center gap-2 mb-5">
          <Link href="/passenger" className="flex items-center gap-1.5 hover:opacity-70 transition-opacity focus:outline-none" style={{ fontSize: "13px", color: "#6b7280", textDecoration: "none" }}>
            <ArrowLeft size={14} /> Browse Trains
          </Link>
          <span style={{ width: "1px", height: "16px", background: "#e8ebed" }} />
          <span style={{ fontSize: "13px", color: "#9ca3af" }}>Train Detail</span>
        </div>

        {/* ── Hero card ── */}
        <div style={{ background: "#ffffff", borderRadius: "16px", border: "1px solid #e8ebed", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", padding: "24px", marginBottom: "16px" }}>
          <div className="flex items-start justify-between gap-4 flex-wrap">

            {/* Operator + name */}
            <div className="flex items-center gap-4">
              <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: train.logoColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: 800, color: "white", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }} aria-hidden="true">
                {train.initials}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 style={{ fontSize: "20px", fontWeight: 800, color: "#181d2a" }}>{train.name}</h1>
                  {train.badge && (
                    <span style={{ background: train.badge.type === "cheapest" ? "#f4632a" : train.badge.type === "recommended" ? "#748efe" : "rgba(116,142,254,0.12)", color: train.badge.type === "popular" ? "#748efe" : "white", borderRadius: "9999px", padding: "3px 10px", fontSize: "11px", fontWeight: 600 }}>
                      {train.badge.label}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: "13px", color: "#9ca3af", marginTop: "3px" }}>Train #{train.trainNumber} · {train.runsOn}</p>
              </div>
            </div>

            {/* Rating + features */}
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-1.5">
                <Star size={15} style={{ color: "#f59e0b", fill: "#f59e0b" }} />
                <span style={{ fontSize: "15px", fontWeight: 700, color: "#181d2a" }}>{ratingNum}</span>
                <span style={{ fontSize: "12px", color: "#9ca3af" }}>({train.rating.split("· ")[1]})</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap justify-end">
                {train.features.map((f) => (
                  <span key={f} className="flex items-center gap-1" style={{ background: "#f8fafc", border: "1px solid #e8ebed", borderRadius: "9999px", padding: "4px 10px", fontSize: "12px", color: "#6b7280" }}>
                    <FeatureIcon text={f} />{f}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Route summary */}
          <div className="flex items-center justify-between mt-6 flex-wrap gap-4" style={{ background: "#f8fafc", border: "1px solid #e8ebed", borderRadius: "12px", padding: "16px 20px" }}>
            <div>
              <p style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 700, letterSpacing: "0.06em", marginBottom: "4px" }}>DEPARTS</p>
              <p style={{ fontSize: "32px", fontWeight: 700, color: "#181d2a", lineHeight: 1 }}>{train.departure.time}</p>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "#181d2a", marginTop: "4px" }}>{train.departure.city}</p>
              <p style={{ fontSize: "11px", color: "#9ca3af" }}>{train.departure.date}{train.departure.platform && ` · ${train.departure.platform}`}</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1">
                <Clock size={12} style={{ color: "#9ca3af" }} />
                <span style={{ fontSize: "12px", color: "#9ca3af" }}>{train.duration}</span>
              </div>
              <div style={{ width: "80px", height: "2px", background: "linear-gradient(to right, #748efe, #a78bfa)", borderRadius: "9999px" }} />
              <span style={{ fontSize: "11px", color: "#9ca3af" }}>{train.distance}</span>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 700, letterSpacing: "0.06em", marginBottom: "4px" }}>ARRIVES</p>
              <p style={{ fontSize: "32px", fontWeight: 700, color: "#181d2a", lineHeight: 1 }}>{train.arrival.time}</p>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "#181d2a", marginTop: "4px" }}>{train.arrival.city}</p>
              <p style={{ fontSize: "11px", color: "#9ca3af" }}>{train.arrival.date}{train.arrival.platform && ` · ${train.arrival.platform}`}</p>
            </div>
          </div>
        </div>

        {/* ── Two-column body ── */}
        <div className="flex gap-4 items-start flex-col lg:flex-row">

          {/* LEFT — Live status + route map */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            <div style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #e8ebed", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>

              {/* Header */}
              <div className="flex items-center justify-between" style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6" }}>
                <div className="flex items-center gap-2">
                  <Radio size={16} style={{ color: "#748efe" }} />
                  <span style={{ fontSize: "15px", fontWeight: 700, color: "#181d2a" }}>Live Status</span>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: isOnTime ? "#16a34a" : isLate ? "#dc2626" : "#d97706", display: "inline-block", animation: "livePulse 1.5s ease-in-out infinite" }} aria-label="Live" />
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: "11px", color: "#9ca3af" }}>Updated: {lastUpdated}</span>
                  <button onClick={handleRefresh} aria-label="Refresh live status" className="hover:bg-blue-50 transition-colors focus:outline-none focus-visible:ring-2" style={{ background: "none", border: "none", cursor: "pointer", padding: "6px", borderRadius: "8px", color: "#748efe", display: "flex" }}>
                    <RefreshCw size={14} style={{ animation: refreshing ? "spin 0.8s linear infinite" : "none" }} />
                  </button>
                </div>
              </div>

              {/* Delay banner */}
              <div style={{ background: delayBg, padding: "12px 20px", display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid #f3f4f6" }}>
                {isOnTime
                  ? <CheckCircle2 size={18} style={{ color: "#16a34a" }} />
                  : <AlertCircle  size={18} style={{ color: delayColor }} />
                }
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: delayColor }}>
                    {isOnTime ? `On time${delay < 0 ? ` (${Math.abs(delay)} min early)` : ""}` : `Delayed by ${delay} minutes`}
                  </p>
                  <p style={{ fontSize: "12px", color: "#6b7280" }}>
                    {delay === 0 ? "Running as scheduled" : delay < 0 ? "Train is running ahead of schedule" : isLate ? "Significant delay reported" : "Minor delay — expected to recover"}
                  </p>
                </div>
              </div>

              {/* Current position */}
              <div style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6", background: "rgba(116,142,254,0.03)" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: "6px" }}>CURRENT POSITION</p>
                <div className="flex items-center gap-2">
                  <MapPin size={15} style={{ color: "#748efe" }} />
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "#181d2a" }}>
                    {currentStopIndex < fullRoute.length - 1
                      ? `Between ${fullRoute[currentStopIndex].city} and ${fullRoute[currentStopIndex + 1].city}`
                      : `Arrived at ${fullRoute[currentStopIndex].city}`}
                  </span>
                </div>
              </div>

              {/* Route timeline */}
              <div style={{ padding: "20px" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: "16px" }}>
                  ROUTE MAP ({fullRoute.length} stops)
                </p>

                <div style={{ position: "relative" }} role="list" aria-label="Train route stops">
                  {/* Track line */}
                  <div style={{ position: "absolute", left: "11px", top: "12px", bottom: "12px", width: "2px", background: "#e8ebed", zIndex: 0 }} aria-hidden="true" />
                  {/* Progress fill */}
                  <div style={{ position: "absolute", left: "11px", top: "12px", width: "2px", height: `${Math.min(100, (currentStopIndex / Math.max(1, fullRoute.length - 1)) * 100)}%`, background: "linear-gradient(to bottom, #748efe, #a78bfa)", zIndex: 1, transition: "height 0.6s ease" }} aria-hidden="true" />

                  {visibleStops.map((stop, idx) => {
                    const abs       = fullRoute.indexOf(stop);
                    const isPassed  = abs < currentStopIndex;
                    const isCurrent = abs === currentStopIndex;
                    const isFirst   = abs === 0;
                    const isLast    = abs === fullRoute.length - 1;

                    return (
                      <div key={`${stop.city}-${idx}`} className="flex items-start gap-4" style={{ position: "relative", zIndex: 2, paddingBottom: idx < visibleStops.length - 1 ? "20px" : "0" }} role="listitem">
                        <div style={{ flexShrink: 0, paddingTop: "2px" }}>
                          {isCurrent ? (
                            <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#748efe", border: "3px solid white", boxShadow: "0 0 0 3px #748efe", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "white" }} />
                            </div>
                          ) : isPassed ? (
                            <CheckCircle2 size={24} style={{ color: "#748efe" }} />
                          ) : isFirst || isLast ? (
                            <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#181d2a", border: "3px solid white", boxShadow: "0 0 0 2px #e8ebed" }} />
                          ) : (
                            <Circle size={24} style={{ color: "#e8ebed" }} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p style={{ fontSize: isCurrent || isFirst || isLast ? "14px" : "13px", fontWeight: isCurrent || isFirst || isLast ? 700 : 500, color: isPassed || isCurrent ? "#181d2a" : "#9ca3af" }}>
                              {stop.city}
                              {isFirst   && <span style={{ marginLeft: "8px", fontSize: "10px", background: "#eff6ff", color: "#2563eb", borderRadius: "9999px", padding: "2px 8px", fontWeight: 600 }}>ORIGIN</span>}
                              {isLast    && <span style={{ marginLeft: "8px", fontSize: "10px", background: "#f0fdf4", color: "#16a34a", borderRadius: "9999px", padding: "2px 8px", fontWeight: 600 }}>DESTINATION</span>}
                              {isCurrent && <span style={{ marginLeft: "8px", fontSize: "10px", background: "rgba(116,142,254,0.1)", color: "#748efe", borderRadius: "9999px", padding: "2px 8px", fontWeight: 700 }}>CURRENT</span>}
                            </p>
                            <div style={{ textAlign: "right", flexShrink: 0 }}>
                              <p style={{ fontSize: "13px", fontWeight: 600, color: isPassed || isCurrent ? "#181d2a" : "#9ca3af" }}>{stop.time}</p>
                              <p style={{ fontSize: "11px", color: "#9ca3af" }}>{stop.date}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {fullRoute.length > 4 && (
                  <button onClick={() => setShowAllStops((v) => !v)} className="flex items-center gap-1.5 mt-3 hover:opacity-70 transition-opacity focus:outline-none focus-visible:ring-2 rounded" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "#748efe", padding: "4px 0" }}>
                    {showAllStops ? <><ChevronUp size={14} /> Show less</> : <><ChevronDown size={14} /> Show all {fullRoute.length} stops</>}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT — Availability + info */}
          <div className="flex flex-col gap-4" style={{ width: "100%", maxWidth: "320px" }}>

            {/* Seat availability */}
            <div style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #e8ebed", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", padding: "20px" }}>
              <p style={{ fontSize: "13px", fontWeight: 700, color: "#181d2a", marginBottom: "14px" }}>Seat Availability</p>
              <div className="flex flex-col gap-2">
                {train.classes.map((cls) => {
                  const isWL  = cls.status.toLowerCase().startsWith("wl");
                  const isRAC = cls.status.toLowerCase().startsWith("rac");
                  return (
                    <div key={cls.code} className="flex items-center justify-between" style={{ padding: "10px 14px", borderRadius: "10px", border: "1px solid #e8ebed", background: "#fafafa" }}>
                      <div>
                        <p style={{ fontSize: "13px", fontWeight: 700, color: "#181d2a" }}>{cls.code}</p>
                        <p style={{ fontSize: "11px", color: "#9ca3af" }}>{cls.label}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: "15px", fontWeight: 700, color: "#748efe" }}>₹{cls.price.toLocaleString("en-IN")}</p>
                        <span style={{ fontSize: "11px", fontWeight: 600, color: isWL ? "#c2410c" : isRAC ? "#b45309" : "#16a34a", background: isWL ? "#fff7ed" : isRAC ? "#fffbeb" : "#f0fdf4", borderRadius: "9999px", padding: "2px 8px" }}>
                          {cls.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Link href="/passenger" className="flex items-center justify-center gap-2 hover:opacity-90 transition-opacity" style={{ marginTop: "14px", padding: "12px", background: "#181d2a", color: "white", borderRadius: "10px", fontSize: "14px", fontWeight: 600, textDecoration: "none" }}>
                <Train size={15} /> Book this train
              </Link>
            </div>

            {/* Journey info */}
            <div style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #e8ebed", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", padding: "20px" }}>
              <p style={{ fontSize: "13px", fontWeight: 700, color: "#181d2a", marginBottom: "14px" }}>Journey Info</p>
              {[
                { icon: <Train size={14} />,      label: "Train No.",     value: train.trainNumber },
                { icon: <Calendar size={14} />,   label: "Runs on",       value: train.runsOn      },
                { icon: <Clock size={14} />,      label: "Duration",      value: train.duration    },
                { icon: <MapPin size={14} />,     label: "Distance",      value: train.distance    },
                { icon: <Users size={14} />,      label: "Operator",      value: train.operator    },
                { icon: <TrendingUp size={14} />, label: "Tatkal opens",  value: train.tatkalTime ?? "N/A" },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-center justify-between" style={{ padding: "8px 0", borderBottom: "1px solid #f3f4f6" }}>
                  <div className="flex items-center gap-2" style={{ color: "#9ca3af", fontSize: "12px" }}>{icon}{label}</div>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#181d2a" }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Tags */}
            {train.tags && train.tags.length > 0 && (
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "14px 16px" }}>
                <p style={{ fontSize: "12px", fontWeight: 700, color: "#15803d", marginBottom: "8px" }}>Special Features</p>
                <div className="flex flex-wrap gap-2">
                  {train.tags.map((tag) => (
                    <span key={tag} style={{ background: "#ffffff", border: "1px solid #bbf7d0", borderRadius: "9999px", padding: "4px 12px", fontSize: "12px", color: "#15803d", fontWeight: 500 }}>
                      🌿 {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.4); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
