"use client";

import { useState } from "react";
import {
  Bookmark,
  MapPin,
  Utensils,
  Wifi,
  WifiOff,
  Star,
  Clock,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { Train, ClassAvailability } from "../data/trains";
import RouteTimeline from "./RouteTimeline";

/* ─── Badge chip ─────────────────────────────────────────── */
function BadgeChip({ type, label }: { type: string; label: string }) {
  const map: Record<string, React.CSSProperties> = {
    cheapest:    { background: "#f4632a", color: "white" },
    recommended: { background: "#748efe", color: "white" },
    popular:     { background: "rgba(116,142,254,0.12)", color: "#748efe" },
  };
  return (
    <span style={{ ...map[type], borderRadius: "9999px", padding: "3px 10px", fontSize: "11px", fontWeight: 600 }}>
      {label}
    </span>
  );
}

/* ─── Operator initials circle ───────────────────────────── */
function OperatorCircle({ initials, color }: { initials: string; color: string }) {
  return (
    <div
      className="flex items-center justify-center rounded-full flex-shrink-0"
      style={{ width: "38px", height: "38px", background: color, fontSize: "13px", fontWeight: 700, color: "white", boxShadow: "0 1px 4px rgba(0,0,0,0.18)" }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

/* ─── Feature icon helper ────────────────────────────────── */
function FeatureIcon({ text }: { text: string }) {
  const lower = text.toLowerCase();
  if (lower.includes("pantry") || lower.includes("catering"))
    return <Utensils size={13} style={{ color: "#6b7280", flexShrink: 0 }} aria-hidden="true" />;
  if (lower.includes("no wi-fi"))
    return <WifiOff size={13} style={{ color: "#6b7280", flexShrink: 0 }} aria-hidden="true" />;
  if (lower.includes("wi-fi"))
    return <Wifi size={13} style={{ color: "#6b7280", flexShrink: 0 }} aria-hidden="true" />;
  return <span style={{ fontSize: "13px", flexShrink: 0 }} aria-hidden="true">♿</span>;
}

/* ─── Class availability tile ────────────────────────────── */
function ClassTile({
  cls, selected, onClick,
}: {
  cls: ClassAvailability;
  selected: boolean;
  onClick: () => void;
}) {
  const isWL  = cls.status.toLowerCase().startsWith("wl");
  const isRAC = cls.status.toLowerCase().startsWith("rac");
  return (
    <button
      onClick={onClick}
      className="flex flex-col text-left focus:outline-none focus-visible:ring-2 transition-all"
      style={{
        minWidth: "80px", padding: "8px 12px", borderRadius: "10px",
        border: selected ? "2px solid #748efe" : "1px solid #e8ebed",
        background: selected ? "rgba(116,142,254,0.06)" : "#ffffff",
        cursor: "pointer",
      }}
      aria-pressed={selected}
      aria-label={`${cls.label} — ₹${cls.price.toLocaleString("en-IN")} — ${cls.status}`}
    >
      <span style={{ fontSize: "13px", fontWeight: 700, color: "#181d2a" }}>{cls.code}</span>
      <span style={{ fontSize: "14px", fontWeight: 700, color: "#748efe", marginTop: "2px" }}>
        ₹{cls.price.toLocaleString("en-IN")}
      </span>
      <span style={{
        fontSize: "11px", fontWeight: 500, marginTop: "3px", lineHeight: "1.3",
        color: isWL ? "#c2410c" : isRAC ? "#b45309" : "#16a34a",
      }}>
        {cls.status}
      </span>
    </button>
  );
}

/* ─── Main card ──────────────────────────────────────────── */
export default function TrainCard({
  train,
  onBook,
}: {
  train: Train;
  /** Called when user clicks "Book · ₹X". Receives the selected ClassAvailability. */
  onBook?: (train: Train, cls: ClassAvailability) => void;
}) {
  const [bookmarked, setBookmarked]   = useState(false);
  const [selectedClass, setSelectedClass] = useState<string>(train.classes[0]?.code ?? "");

  const activeClass = train.classes.find((c) => c.code === selectedClass) ?? train.classes[0];

  const handleBook = () => {
    if (onBook && activeClass) {
      onBook(train, activeClass);
    }
  };

  const totalReturn = train.returnLeg ? activeClass.price + train.returnLeg.price : null;

  return (
    <article
      style={{
        background: "#ffffff",
        borderRadius: "12px",
        border: "1px solid #e8ebed",
        boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
        overflow: "hidden",
      }}
      aria-label={`${train.name} from ${train.departure.city} to ${train.arrival.city}`}
    >
      {/* ══ HEADER ══════════════════════════════════════════ */}
      <div style={{ padding: "18px 22px 0" }}>

        {/* Row 1: operator + name + badges | tags + bookmark */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <OperatorCircle initials={train.initials} color={train.logoColor} />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span style={{ fontSize: "15px", fontWeight: 700, color: "#181d2a" }}>{train.name}</span>
                {train.badge && <BadgeChip type={train.badge.type} label={train.badge.label} />}
                {train.seatsLeft && (
                  <span style={{ background: "#fff7ed", color: "#c2410c", border: "1px solid #fed7aa", borderRadius: "9999px", padding: "3px 10px", fontSize: "11px", fontWeight: 500 }}>
                    {train.seatsLeft} seats left
                  </span>
                )}
              </div>
              <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>
                {train.trainNumber} · Runs: {train.runsOn}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {train.tags?.map((tag) => (
              <span key={tag} style={{ background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0", borderRadius: "9999px", padding: "3px 10px", fontSize: "11px", fontWeight: 500, whiteSpace: "nowrap" }}>
                🌿 {tag}
              </span>
            ))}
            <button
              onClick={() => setBookmarked((v) => !v)}
              className="flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2"
              style={{ width: "32px", height: "32px" }}
              aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
              aria-pressed={bookmarked}
            >
              <Bookmark size={15} style={{ color: bookmarked ? "#748efe" : "#9ca3af" }} fill={bookmarked ? "#748efe" : "none"} />
            </button>
          </div>
        </div>

        {/* Row 2: Timeline */}
        <div className="flex items-center gap-4 mb-1">
          <div className="flex-shrink-0" style={{ textAlign: "right", minWidth: "80px" }}>
            <p style={{ fontSize: "34px", fontWeight: 700, color: "#181d2a", lineHeight: 1, letterSpacing: "-0.5px" }}>{train.departure.time}</p>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#181d2a", marginTop: "4px" }}>{train.departure.city}</p>
            <p style={{ fontSize: "11px", color: "#6b7280" }}>{train.departure.date}</p>
            {train.departure.platform && <p style={{ fontSize: "11px", color: "#9ca3af" }}>{train.departure.platform}</p>}
          </div>

          <div className="flex-1 min-w-0 flex flex-col items-center gap-1">
            <RouteTimeline stops={train.stops} />
            <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>{train.duration} · {train.distance}</p>
          </div>

          <div className="flex-shrink-0" style={{ textAlign: "left", minWidth: "80px" }}>
            <p style={{ fontSize: "34px", fontWeight: 700, color: "#181d2a", lineHeight: 1, letterSpacing: "-0.5px" }}>{train.arrival.time}</p>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#181d2a", marginTop: "4px" }}>{train.arrival.city}</p>
            <p style={{ fontSize: "11px", color: "#6b7280" }}>{train.arrival.date}</p>
            {train.arrival.platform && <p style={{ fontSize: "11px", color: "#9ca3af" }}>{train.arrival.platform}</p>}
          </div>
        </div>

        {/* Row 3: Features + rating */}
        <div className="flex items-center flex-wrap gap-3" style={{ padding: "10px 0", borderTop: "1px solid #f3f4f6", marginTop: "6px" }}>
          {train.features.map((f) => (
            <span key={f} className="flex items-center gap-1" style={{ fontSize: "12px", color: "#6b7280" }}>
              <FeatureIcon text={f} />
              {f}
            </span>
          ))}
          <span className="flex items-center gap-1 ml-auto" style={{ fontSize: "12px", color: "#6b7280" }}>
            <Star size={12} style={{ color: "#f59e0b", fill: "#f59e0b" }} aria-hidden="true" />
            {train.rating}
          </span>
        </div>
      </div>

      {/* ══ CLASS SELECTOR ══════════════════════════════════ */}
      <div style={{ padding: "14px 22px", borderTop: "1px solid #f3f4f6" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: "10px" }}>
          SELECT CLASS
        </p>
        <div className="flex items-start gap-2 flex-wrap">
          {train.classes.map((cls) => (
            <ClassTile
              key={cls.code}
              cls={cls}
              selected={selectedClass === cls.code}
              onClick={() => setSelectedClass(cls.code)}
            />
          ))}
        </div>
      </div>

      {/* ══ FOOTER: chips + Book CTA ═════════════════════════ */}
      <div
        className="flex items-center justify-between flex-wrap gap-2"
        style={{ padding: "12px 22px", borderTop: "1px solid #f3f4f6", background: "#fafafa" }}
      >
        <div className="flex items-center gap-2 flex-wrap">
          {train.tatkalTime && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: "#ffffff", border: "1px solid #e8ebed", color: "#181d2a" }}>
              <RefreshCw size={11} style={{ color: "#748efe" }} />
              Tatkal opens {train.tatkalTime}
            </span>
          )}
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: "#ffffff", border: "1px solid #e8ebed", color: "#181d2a" }}>
            <Clock size={11} style={{ color: "#748efe" }} />
            Price History
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: "#ffffff", border: "1px solid #e8ebed", color: "#181d2a" }}>
            <TrendingUp size={11} style={{ color: "#748efe" }} />
            Track live
          </span>
        </div>

        {/* ── Book button — triggers booking flow ── */}
        <button
          onClick={handleBook}
          className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 hover:opacity-90 active:scale-[0.97] transition-all"
          style={{
            background: "#181d2a", color: "white",
            borderRadius: "12px", height: "42px", padding: "0 20px",
            fontSize: "14px", fontWeight: 600, whiteSpace: "nowrap",
            cursor: "pointer", border: "none",
          }}
          aria-label={`Book ${train.name} — ₹${activeClass?.price.toLocaleString("en-IN")}`}
        >
          Book · ₹{activeClass?.price.toLocaleString("en-IN")}
        </button>
      </div>

      {/* ══ EXPANDED: Return leg ════════════════════════════ */}
      <div
        className="expand-section"
        style={{ maxHeight: train.returnLeg ? "480px" : "0", opacity: train.returnLeg ? 1 : 0 }}
        aria-hidden={!train.returnLeg}
      >
        {train.returnLeg && (
          <div style={{ padding: "0 22px 20px" }}>
            <div style={{ position: "relative", height: "1px", background: "#e8ebed", margin: "4px 0 20px" }}>
              <span style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", background: "#ffffff", padding: "0 12px", fontSize: "11px", color: "#9ca3af", whiteSpace: "nowrap" }}>
                Return journey
              </span>
            </div>
            <div className="flex items-center gap-4 mb-3">
              <div className="flex-shrink-0" style={{ textAlign: "right", minWidth: "80px" }}>
                <p style={{ fontSize: "34px", fontWeight: 700, color: "#181d2a", lineHeight: 1, letterSpacing: "-0.5px" }}>{train.returnLeg.departure.time}</p>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#181d2a", marginTop: "4px" }}>{train.returnLeg.departure.city}</p>
                <p style={{ fontSize: "11px", color: "#6b7280" }}>{train.returnLeg.departure.date}</p>
              </div>
              <div className="flex-1 min-w-0 flex flex-col items-center gap-1">
                <RouteTimeline stops={train.returnLeg.stops} compact />
                <p style={{ fontSize: "12px", color: "#9ca3af" }}>{train.returnLeg.duration}</p>
              </div>
              <div className="flex-shrink-0" style={{ textAlign: "left", minWidth: "80px" }}>
                <p style={{ fontSize: "34px", fontWeight: 700, color: "#181d2a", lineHeight: 1, letterSpacing: "-0.5px" }}>{train.returnLeg.arrival.time}</p>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#181d2a", marginTop: "4px" }}>{train.returnLeg.arrival.city}</p>
                <p style={{ fontSize: "11px", color: "#6b7280" }}>{train.returnLeg.arrival.date}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid #f3f4f6" }}>
              <div className="flex items-center gap-2">
                <MapPin size={13} style={{ color: "#9ca3af" }} />
                <span style={{ fontSize: "12px", color: "#6b7280" }}>Combined total both legs</span>
              </div>
              <div className="flex items-center gap-4">
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: "20px", fontWeight: 700, color: "#748efe", lineHeight: 1 }}>₹{totalReturn?.toLocaleString("en-IN")}</p>
                  <p style={{ fontSize: "11px", color: "#9ca3af" }}>incl. tax · both legs</p>
                </div>
                <button
                  onClick={handleBook}
                  className="focus:outline-none focus-visible:ring-2 hover:opacity-90 active:scale-[0.97]"
                  style={{ background: "#181d2a", color: "white", borderRadius: "12px", height: "42px", padding: "0 20px", fontSize: "14px", fontWeight: 600, cursor: "pointer", border: "none" }}
                >
                  Book this
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
