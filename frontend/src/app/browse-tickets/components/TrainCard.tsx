"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark, Utensils, Wifi, WifiOff, Star, Clock, TrendingUp, RefreshCw, Check } from "lucide-react";
import { Train, ClassAvailability } from "../data/trains";

/* ── availability pill ──────────────────────────────────────── */
function AvailPill({ status }: { status: string }) {
  const lo = status.toLowerCase();
  const [bg, col, bdr] = lo.startsWith("wl")  ? ["#fff7ed","#c2410c","#fed7aa"]
                       : lo.startsWith("rac") ? ["#fefce8","#a16207","#fde68a"]
                       :                        ["#f0fdf4","#16a34a","#bbf7d0"];
  return (
    <span style={{ background:bg, border:`1px solid ${bdr}`, borderRadius:"9999px", padding:"1px 6px", fontSize:"10px", fontWeight:700, color:col, whiteSpace:"nowrap" }}>
      {status}
    </span>
  );
}

/* ── badge ──────────────────────────────────────────────────── */
function Badge({ type, label }: { type: string; label: string }) {
  const s: Record<string,React.CSSProperties> = {
    cheapest:    { background:"#f4632a", color:"#fff" },
    recommended: { background:"#6366f1", color:"#fff" },
    popular:     { background:"rgba(99,102,241,0.1)", color:"#6366f1", border:"1px solid rgba(99,102,241,0.22)" },
  };
  return <span style={{ ...s[type], borderRadius:"9999px", padding:"2px 9px", fontSize:"11px", fontWeight:700 }}>{label}</span>;
}

/* ── compact route bar ──────────────────────────────────────── */
function RouteBar({ dep, arr, stops, duration, distance }: {
  dep: { time: string; city: string; date: string };
  arr: { time: string; city: string; date: string };
  stops: { city: string; time?: string }[];
  duration: string; distance: string;
}) {
  return (
    <div style={{ display:"flex", alignItems:"center", width:"100%" }}>
      {/* Departure */}
      <div style={{ flexShrink:0, textAlign:"left" }}>
        <div style={{ fontSize:"20px", fontWeight:800, color:"#0f172a", letterSpacing:"-0.03em", lineHeight:1 }}>{dep.time}</div>
        <div style={{ fontSize:"12px", fontWeight:600, color:"#334155", marginTop:"2px" }}>{dep.city}</div>
        <div style={{ fontSize:"10px", color:"#94a3b8" }}>{dep.date}</div>
      </div>

      {/* Middle */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"0 10px" }}>
        <div style={{ width:"100%", display:"flex", alignItems:"center", marginBottom:"4px" }}>
          <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:"#6366f1", flexShrink:0 }} />
          {stops.map((_, i) => (
            <div key={i} style={{ flex:1, display:"flex", alignItems:"center" }}>
              <div style={{ flex:1, height:"1.5px", background:"rgba(99,102,241,0.35)" }} />
              <div style={{ width:"5px", height:"5px", borderRadius:"50%", background:"#fff", border:"1.5px solid #94a3b8", flexShrink:0 }} />
            </div>
          ))}
          <div style={{ flex:1, height:"1.5px", background:"rgba(99,102,241,0.35)" }} />
          <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:"#6366f1", flexShrink:0 }} />
        </div>
        <div style={{ fontSize:"11px", color:"#64748b", fontWeight:500 }}>{duration} · {distance}</div>
        {stops.length > 0 && (
          <div style={{ fontSize:"10px", color:"#94a3b8", marginTop:"1px", maxWidth:"100%", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
            via {stops.map(s => s.city.split(" ")[0]).join(", ")}
          </div>
        )}
      </div>

      {/* Arrival */}
      <div style={{ flexShrink:0, textAlign:"right" }}>
        <div style={{ fontSize:"20px", fontWeight:800, color:"#0f172a", letterSpacing:"-0.03em", lineHeight:1 }}>{arr.time}</div>
        <div style={{ fontSize:"12px", fontWeight:600, color:"#334155", marginTop:"2px" }}>{arr.city}</div>
        <div style={{ fontSize:"10px", color:"#94a3b8" }}>{arr.date}</div>
      </div>
    </div>
  );
}

/* ── class tile ─────────────────────────────────────────────── */
function ClassTile({ cls, selected, onClick }: { cls: ClassAvailability; selected: boolean; onClick: ()=>void }) {
  return (
    <button onClick={onClick}
      style={{ display:"flex", flexDirection:"column", alignItems:"flex-start", padding:"7px 11px", borderRadius:"10px", border:selected?"2px solid #6366f1":"1.5px solid #e2e8f0", background:selected?"rgba(99,102,241,0.05)":"#fafafa", cursor:"pointer", minWidth:"74px", position:"relative", transition:"border-color 0.12s", fontFamily:"inherit" }}
      aria-pressed={selected}
      onMouseOver={e => { if (!selected) (e.currentTarget as HTMLButtonElement).style.borderColor="#a5b4fc"; }}
      onMouseOut={e =>  { if (!selected) (e.currentTarget as HTMLButtonElement).style.borderColor="#e2e8f0"; }}>
      {selected && <Check size={9} style={{ position:"absolute", top:"5px", right:"5px", color:"#6366f1" }} strokeWidth={3} />}
      <span style={{ fontSize:"11px", fontWeight:700, color:"#475569" }}>{cls.code}</span>
      <span style={{ fontSize:"13px", fontWeight:800, color:selected?"#6366f1":"#0f172a", letterSpacing:"-0.02em", marginTop:"1px" }}>₹{cls.price.toLocaleString("en-IN")}</span>
      <AvailPill status={cls.status} />
    </button>
  );
}

/* ── main card ──────────────────────────────────────────────── */
export default function TrainCard({ train, onBook }: {
  train: Train;
  onBook?: (train: Train, cls: ClassAvailability) => void;
}) {
  const [bookmarked, setBookmarked]       = useState(false);
  const [selectedClass, setSelectedClass] = useState(train.classes[0]?.code ?? "");
  const activeClass = train.classes.find(c => c.code === selectedClass) ?? train.classes[0];

  return (
    <article
      style={{ background:"#fff", borderRadius:"14px", border:"1px solid #e2e8f0", boxShadow:"0 1px 6px rgba(0,0,0,0.05)", overflow:"hidden", transition:"box-shadow 0.18s, transform 0.18s" }}
      onMouseOver={e => { const el=e.currentTarget as HTMLElement; el.style.boxShadow="0 6px 20px rgba(0,0,0,0.09)"; el.style.transform="translateY(-1px)"; }}
      onMouseOut={e =>  { const el=e.currentTarget as HTMLElement; el.style.boxShadow="0 1px 6px rgba(0,0,0,0.05)"; el.style.transform="translateY(0)"; }}
    >
      {/* Header */}
      <div style={{ padding:"12px 14px 10px" }}>
        {/* Row 1: name + badges + bookmark */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:"8px", marginBottom:"10px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"6px", flexWrap:"wrap", minWidth:0 }}>
            <span style={{ fontSize:"14px", fontWeight:800, color:"#0f172a" }}>{train.name}</span>
            <span style={{ fontSize:"11px", color:"#94a3b8" }}>#{train.trainNumber}</span>
            {train.badge && <Badge type={train.badge.type} label={train.badge.label} />}
            {train.seatsLeft && (
              <span style={{ background:"#fff7ed", color:"#c2410c", border:"1px solid #fed7aa", borderRadius:"9999px", padding:"1px 7px", fontSize:"10px", fontWeight:700 }}>
                Only {train.seatsLeft} left!
              </span>
            )}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"5px", flexShrink:0 }}>
            {train.tags?.map(tag => (
              <span key={tag} style={{ background:"#f0fdf4", color:"#15803d", border:"1px solid #bbf7d0", borderRadius:"9999px", padding:"2px 7px", fontSize:"10px", fontWeight:600 }}>
                🌿 {tag}
              </span>
            ))}
            <div style={{ display:"flex", alignItems:"center", gap:"2px", fontSize:"10px", color:"#64748b" }}>
              <Star size={10} style={{ color:"#f59e0b", fill:"#f59e0b" }} />
              {train.rating}
            </div>
            <button onClick={() => setBookmarked(v => !v)}
              style={{ width:"28px", height:"28px", borderRadius:"7px", border:"1.5px solid #e2e8f0", background:bookmarked?"rgba(99,102,241,0.07)":"transparent", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
              <Bookmark size={13} style={{ color:bookmarked?"#6366f1":"#94a3b8" }} fill={bookmarked?"#6366f1":"none"} />
            </button>
          </div>
        </div>

        {/* Sub row: runs on */}
        <div style={{ fontSize:"10px", color:"#94a3b8", marginBottom:"10px" }}>{train.runsOn}</div>

        {/* Row 2: route bar */}
        <RouteBar dep={train.departure} arr={train.arrival} stops={train.stops} duration={train.duration} distance={train.distance} />

        {/* Row 3: feature chips */}
        <div style={{ display:"flex", gap:"5px", overflowX:"auto", marginTop:"10px", scrollbarWidth:"none" }}>
          {train.features.map(f => {
            const lo = f.toLowerCase();
            const noWifi = lo.includes("no wi-fi");
            const ic = (lo.includes("pantry")||lo.includes("catering")) ? <Utensils size={10} />
                     : noWifi ? <WifiOff size={10} />
                     : lo.includes("wi-fi") ? <Wifi size={10} />
                     : <span style={{ fontSize:"10px" }}>♿</span>;
            return (
              <span key={f} style={{ display:"inline-flex", alignItems:"center", gap:"3px", padding:"2px 7px", borderRadius:"9999px", background:noWifi?"#fff1f2":"#f8fafc", border:`1px solid ${noWifi?"#fecdd3":"#e2e8f0"}`, fontSize:"10px", color:noWifi?"#e11d48":"#475569", fontWeight:500, whiteSpace:"nowrap", flexShrink:0 }}>
                {ic} {f}
              </span>
            );
          })}
        </div>
      </div>

      {/* Class selector */}
      <div style={{ padding:"8px 14px 10px", borderTop:"1px solid #f1f5f9" }}>
        <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
          {train.classes.map(cls => (
            <ClassTile key={cls.code} cls={cls} selected={selectedClass===cls.code} onClick={() => setSelectedClass(cls.code)} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:"8px", padding:"8px 14px", borderTop:"1px solid #f1f5f9", background:"#fafafa" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"5px", flexWrap:"wrap" }}>
          {train.tatkalTime && (
            <span style={{ display:"inline-flex", alignItems:"center", gap:"4px", padding:"4px 9px", borderRadius:"9999px", background:"#fff", border:"1px solid #e2e8f0", fontSize:"10px", color:"#334155", fontWeight:500 }}>
              <RefreshCw size={9} style={{ color:"#6366f1" }} /> Tatkal {train.tatkalTime}
            </span>
          )}
          <span style={{ display:"inline-flex", alignItems:"center", gap:"4px", padding:"4px 9px", borderRadius:"9999px", background:"#fff", border:"1px solid #e2e8f0", fontSize:"10px", color:"#334155", fontWeight:500 }}>
            <Clock size={9} style={{ color:"#6366f1" }} /> Price History
          </span>
          <Link href={`/train/${train.id}`}
            style={{ display:"inline-flex", alignItems:"center", gap:"4px", padding:"4px 9px", borderRadius:"9999px", background:"#fff", border:"1px solid #e2e8f0", fontSize:"10px", color:"#334155", fontWeight:500, textDecoration:"none", transition:"border-color 0.12s" }}
            onMouseOver={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor="#6366f1"; }}
            onMouseOut={e =>  { (e.currentTarget as HTMLAnchorElement).style.borderColor="#e2e8f0"; }}>
            <TrendingUp size={9} style={{ color:"#6366f1" }} /> Live Status
          </Link>
        </div>
        <button onClick={() => onBook?.(train, activeClass!)}
          style={{ display:"flex", alignItems:"center", gap:"6px", background:"linear-gradient(135deg,#4f46e5,#6366f1)", color:"#fff", border:"none", borderRadius:"9999px", height:"36px", padding:"0 18px", fontSize:"13px", fontWeight:700, cursor:"pointer", fontFamily:"inherit", boxShadow:"0 3px 10px rgba(99,102,241,0.28)", transition:"filter 0.15s, transform 0.12s", whiteSpace:"nowrap" }}
          onMouseOver={e => { const b=e.currentTarget as HTMLButtonElement; b.style.filter="brightness(1.08)"; b.style.transform="translateY(-1px)"; }}
          onMouseOut={e =>  { const b=e.currentTarget as HTMLButtonElement; b.style.filter="brightness(1)";   b.style.transform="translateY(0)"; }}>
          Book · ₹{activeClass?.price.toLocaleString("en-IN")}
        </button>
      </div>
    </article>
  );
}
