"use client";

import { useRef, useCallback, useState } from "react";
import {
  ChevronUp, ChevronDown, Check, RotateCcw, SlidersHorizontal,
  Sunrise, Sun, Sunset, Moon, Utensils, Wifi, Leaf, Accessibility,
} from "lucide-react";

/* ── Types ─────────────────────────────────────────────────── */
type TimeVal = { hour: number; minute: number; period: "AM" | "PM" };

export type Filters = {
  seatClasses: string[];
  priceMin: number;
  priceMax: number;
  fromTime: TimeVal;
  toTime: TimeVal;
  trainTypes: string[];
  amenities: string[];
};

type Props = { filters: Filters; onChange: (f: Filters) => void; onApply: () => void };

/* ── Constants ─────────────────────────────────────────────── */
const PRICE_MIN_ABS = 1000, PRICE_MAX_ABS = 5000, PRICE_RANGE = 4000, MIN_GAP = 200;
const PRICE_BARS    = [20,35,55,70,85,95,100,88,72,58,45,38,28,18];

const SEAT_CLASSES = [
  { key:"Sleeper", code:"SL", count:6  },
  { key:"3A",      code:"3A", count:8  },
  { key:"2A",      code:"2A", count:5  },
  { key:"1A",      code:"1A", count:3  },
  { key:"CC",      code:"CC", count:4  },
];

const TIME_SLOTS = [
  { key:"morning",   label:"Morning",   sub:"6AM–12PM", icon:<Sunrise size={14} />   },
  { key:"afternoon", label:"Afternoon", sub:"12PM–6PM", icon:<Sun size={14} />       },
  { key:"evening",   label:"Evening",   sub:"6PM–10PM", icon:<Sunset size={14} />    },
  { key:"night",     label:"Night",     sub:"10PM–6AM", icon:<Moon size={14} />      },
];

const TRAIN_TYPES = [
  { key:"Rajdhani",  color:"#f4632a" },
  { key:"Shatabdi",  color:"#9333ea" },
  { key:"Duronto",   color:"#748efe" },
  { key:"Express",   color:"#0891b2" },
  { key:"Superfast", color:"#22a85a" },
];

const AMENITIES = [
  { key:"pantry",  label:"Pantry Car",   icon:<Utensils size={12} />     },
  { key:"wifi",    label:"Wi-Fi",        icon:<Wifi size={12} />         },
  { key:"eco",     label:"Eco Coach",    icon:<Leaf size={12} />         },
  { key:"divyang", label:"Divyang Coach",icon:<Accessibility size={12} />},
];

const DEFAULT_TIME_VAL: TimeVal = { hour:7, minute:0, period:"AM" };

/* ── Section ───────────────────────────────────────────────── */
function Section({ label, open, onToggle, badge, children }: {
  label: string; open: boolean; onToggle: ()=>void; badge?: number; children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom:"4px" }}>
      <button onClick={onToggle} aria-expanded={open}
        style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0", background:"none", border:"none", cursor:"pointer", fontFamily:"inherit" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
          <span style={{ fontSize:"13px", fontWeight:700, color:"#0f172a" }}>{label}</span>
          {badge !== undefined && badge > 0 && (
            <span style={{ background:"#6366f1", color:"white", borderRadius:"9999px", padding:"1px 7px", fontSize:"10px", fontWeight:700 }}>{badge}</span>
          )}
        </div>
        {open ? <ChevronUp size={14} style={{ color:"#94a3b8" }} /> : <ChevronDown size={14} style={{ color:"#94a3b8" }} />}
      </button>
      {open && <div style={{ paddingBottom:"12px" }}>{children}</div>}
      <div style={{ height:"1px", background:"rgba(226,232,240,0.7)" }} />
    </div>
  );
}

/* ── Main ──────────────────────────────────────────────────── */
export default function FilterSidebar({ filters: rawFilters, onChange, onApply }: Props) {
  const filters: Filters = {
    ...rawFilters,
    trainTypes: rawFilters.trainTypes ?? [],
    amenities:  rawFilters.amenities  ?? [],
  };

  const [open, setOpen] = useState({ time:true, price:true, cls:true, type:false, amen:false });
  const tog = (k: keyof typeof open) => setOpen(p => ({ ...p, [k]:!p[k] }));

  /* price slider */
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<"min"|"max"|null>(null);
  const toPx = (pct: number) => Math.round((PRICE_MIN_ABS + (pct/100)*PRICE_RANGE)/100)*100;
  const getPct = useCallback((cx: number) => {
    if (!trackRef.current) return 0;
    const { left, width } = trackRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(100, ((cx-left)/width)*100));
  }, []);
  const onPD = (th: "min"|"max") => (e: React.PointerEvent) => { e.currentTarget.setPointerCapture(e.pointerId); dragging.current = th; };
  const onPM = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const p = toPx(getPct(e.clientX));
    if (dragging.current==="min" && p < filters.priceMax-MIN_GAP) onChange({ ...filters, priceMin:p });
    if (dragging.current==="max" && p > filters.priceMin+MIN_GAP) onChange({ ...filters, priceMax:p });
  }, [filters, onChange, getPct]);
  const onPU = useCallback(() => { dragging.current=null; }, []);

  const minPct = ((filters.priceMin-PRICE_MIN_ABS)/PRICE_RANGE)*100;
  const maxPct = ((filters.priceMax-PRICE_MIN_ABS)/PRICE_RANGE)*100;
  const activeBarCount = Math.round((maxPct/100)*PRICE_BARS.length);

  /* toggles */
  const togCls  = (k:string) => onChange({ ...filters, seatClasses: filters.seatClasses.includes(k) ? filters.seatClasses.filter(x=>x!==k) : [...filters.seatClasses,k] });
  const togType = (k:string) => onChange({ ...filters, trainTypes:  filters.trainTypes.includes(k)  ? filters.trainTypes.filter(x=>x!==k)  : [...filters.trainTypes,k] });
  const togAmen = (k:string) => onChange({ ...filters, amenities:   filters.amenities.includes(k)   ? filters.amenities.filter(x=>x!==k)   : [...filters.amenities,k] });

  /* time slot */
  const h = filters.fromTime.hour, p = filters.fromTime.period;
  const activeSlot = (p==="AM"&&h>=6&&h<12)?"morning":(p==="PM"&&h>=12&&h<18)?"afternoon":(p==="PM"&&h>=18)?"evening":"night";
  const setSlot = (k:string) => {
    const m:Record<string,TimeVal> = { morning:{hour:6,minute:0,period:"AM"}, afternoon:{hour:12,minute:0,period:"PM"}, evening:{hour:18,minute:0,period:"PM"}, night:{hour:22,minute:0,period:"PM"} };
    onChange({ ...filters, fromTime: m[k]??DEFAULT_TIME_VAL });
  };

  const activeCount = filters.seatClasses.length + filters.trainTypes.length + filters.amenities.length
    + (filters.priceMin>PRICE_MIN_ABS||filters.priceMax<PRICE_MAX_ABS?1:0);

  const resetAll = () => onChange({ seatClasses:[], priceMin:PRICE_MIN_ABS, priceMax:PRICE_MAX_ABS,
    fromTime:DEFAULT_TIME_VAL, toTime:{hour:22,minute:0,period:"PM"}, trainTypes:[], amenities:[] });

  return (
    <aside style={{ width:"260px", background:"#ffffff", borderRadius:"16px", border:"1px solid #e2e8f0", boxShadow:"0 2px 12px rgba(0,0,0,0.07)", padding:"18px 16px 16px", display:"flex", flexDirection:"column" }} aria-label="Search filters">

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"14px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"7px" }}>
          <SlidersHorizontal size={15} style={{ color:"#6366f1" }} />
          <span style={{ fontSize:"15px", fontWeight:700, color:"#0f172a" }}>Filters</span>
          {activeCount>0 && <span style={{ background:"#6366f1", color:"white", borderRadius:"9999px", padding:"2px 8px", fontSize:"11px", fontWeight:700 }}>{activeCount}</span>}
        </div>
        <button onClick={resetAll} style={{ display:"flex", alignItems:"center", gap:"4px", background:"none", border:"none", cursor:"pointer", fontSize:"12px", color:"#6366f1", fontWeight:600, fontFamily:"inherit" }}>
          <RotateCcw size={11} /> Reset all
        </button>
      </div>

      {/* Departure Time */}
      <Section label="Departure Time" open={open.time} onToggle={() => tog("time")}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px" }}>
          {TIME_SLOTS.map(s => {
            const active = activeSlot === s.key;
            return (
              <button key={s.key} onClick={() => setSlot(s.key)}
                style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"3px", padding:"10px 6px", borderRadius:"10px", border:`1.5px solid ${active?"#6366f1":"#e2e8f0"}`, background:active?"rgba(99,102,241,0.07)":"#fafafa", cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s" }}>
                <span style={{ color:active?"#6366f1":"#64748b" }}>{s.icon}</span>
                <span style={{ fontSize:"12px", fontWeight:700, color:active?"#6366f1":"#0f172a" }}>{s.label}</span>
                <span style={{ fontSize:"10px", color:"#94a3b8" }}>{s.sub}</span>
              </button>
            );
          })}
        </div>
      </Section>

      {/* Price Range */}
      <Section label="Price Range" open={open.price} onToggle={() => tog("price")} badge={filters.priceMin>PRICE_MIN_ABS||filters.priceMax<PRICE_MAX_ABS?1:undefined}>
        <div style={{ display:"flex", alignItems:"flex-end", gap:"2px", height:"44px", marginBottom:"10px" }} aria-hidden>
          {PRICE_BARS.map((h,i) => <div key={i} style={{ flex:1, borderRadius:"2px", height:`${h}%`, background:i<activeBarCount?"#6366f1":"#e2e8f0", minWidth:"5px" }} />)}
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"10px" }}>
          <span style={{ fontSize:"13px", fontWeight:700, color:"#0f172a" }}>₹{filters.priceMin.toLocaleString("en-IN")}</span>
          <span style={{ fontSize:"13px", fontWeight:700, color:"#0f172a" }}>₹{filters.priceMax.toLocaleString("en-IN")}</span>
        </div>
        <div ref={trackRef} style={{ position:"relative", height:"24px", display:"flex", alignItems:"center" }}
          onPointerMove={onPM} onPointerUp={onPU} onPointerLeave={onPU} role="group" aria-label="Price range slider">
          <div aria-hidden style={{ position:"absolute", left:0, right:0, height:"4px", borderRadius:"9999px", background:"#e2e8f0" }} />
          <div aria-hidden style={{ position:"absolute", left:`${minPct}%`, width:`${maxPct-minPct}%`, height:"4px", borderRadius:"9999px", background:"#6366f1", pointerEvents:"none" }} />
          {(["min","max"] as const).map(th => (
            <div key={th} role="slider" tabIndex={0}
              aria-label={th==="min"?"Minimum price":"Maximum price"}
              aria-valuemin={PRICE_MIN_ABS} aria-valuemax={PRICE_MAX_ABS}
              aria-valuenow={th==="min"?filters.priceMin:filters.priceMax}
              onPointerDown={onPD(th)}
              onKeyDown={e => {
                const step = e.shiftKey?500:100;
                if (e.key==="ArrowLeft") { e.preventDefault(); if(th==="min"){const v=Math.max(PRICE_MIN_ABS,filters.priceMin-step);if(v<filters.priceMax-MIN_GAP)onChange({...filters,priceMin:v});}else{onChange({...filters,priceMax:Math.max(filters.priceMin+MIN_GAP,filters.priceMax-step)});} }
                if (e.key==="ArrowRight"){ e.preventDefault(); if(th==="min"){onChange({...filters,priceMin:Math.min(filters.priceMax-MIN_GAP,filters.priceMin+step)});}else{onChange({...filters,priceMax:Math.min(PRICE_MAX_ABS,filters.priceMax+step)});} }
              }}
              style={{ position:"absolute", left:`${th==="min"?minPct:maxPct}%`, transform:"translateX(-50%)", width:"18px", height:"18px", borderRadius:"50%", background:"#ffffff", border:"2.5px solid #6366f1", boxShadow:"0 1px 4px rgba(99,102,241,0.35)", cursor:"grab", zIndex:th==="max"?4:3, touchAction:"none" }}
            />
          ))}
        </div>
      </Section>

      {/* Seat Class */}
      <Section label="Seat Class" open={open.cls} onToggle={() => tog("cls")} badge={filters.seatClasses.length||undefined}>
        <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>
          {SEAT_CLASSES.map(({ key, code, count }) => {
            const active = filters.seatClasses.includes(key);
            return (
              <button key={key} onClick={() => togCls(key)}
                style={{ display:"flex", alignItems:"center", gap:"5px", padding:"6px 12px", borderRadius:"9999px", border:`1.5px solid ${active?"#6366f1":"#e2e8f0"}`, background:active?"#6366f1":"#fafafa", cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s", flexShrink:0 }}>
                {active && <Check size={11} color="white" strokeWidth={3} />}
                <span style={{ fontSize:"12px", fontWeight:600, color:active?"white":"#334155" }}>{code}</span>
                <span style={{ fontSize:"11px", color:active?"rgba(255,255,255,0.7)":"#94a3b8" }}>({count})</span>
              </button>
            );
          })}
        </div>
      </Section>

      {/* Train Type */}
      <Section label="Train Type" open={open.type} onToggle={() => tog("type")} badge={filters.trainTypes.length||undefined}>
        <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>
          {TRAIN_TYPES.map(({ key, color }) => {
            const active = filters.trainTypes.includes(key);
            return (
              <button key={key} onClick={() => togType(key)}
                style={{ padding:"5px 12px", borderRadius:"9999px", border:`1.5px solid ${active?color:"#e2e8f0"}`, background:active?color:"#fafafa", cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s" }}>
                <span style={{ fontSize:"12px", fontWeight:600, color:active?"white":"#334155" }}>{key}</span>
              </button>
            );
          })}
        </div>
      </Section>

      {/* Amenities */}
      <Section label="Amenities" open={open.amen} onToggle={() => tog("amen")} badge={filters.amenities.length||undefined}>
        <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
          {AMENITIES.map(({ key, label, icon }) => {
            const active = filters.amenities.includes(key);
            return (
              <button key={key} onClick={() => togAmen(key)}
                style={{ display:"flex", alignItems:"center", gap:"8px", padding:"8px 10px", borderRadius:"10px", border:`1.5px solid ${active?"#6366f1":"#e2e8f0"}`, background:active?"rgba(99,102,241,0.06)":"#fafafa", cursor:"pointer", fontFamily:"inherit", textAlign:"left", transition:"all 0.15s" }}>
                <span style={{ color:active?"#6366f1":"#64748b", display:"flex" }}>{icon}</span>
                <span style={{ fontSize:"13px", fontWeight:500, color:active?"#3730a3":"#334155", flex:1 }}>{label}</span>
                {active && <Check size={12} style={{ color:"#6366f1" }} strokeWidth={3} />}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Apply */}
      <button onClick={onApply}
        style={{ width:"100%", height:"44px", background:"linear-gradient(135deg,#4f46e5,#6366f1)", color:"white", border:"none", borderRadius:"12px", fontSize:"14px", fontWeight:700, cursor:"pointer", fontFamily:"inherit", marginTop:"12px", boxShadow:"0 4px 12px rgba(99,102,241,0.28)", transition:"filter 0.2s, transform 0.15s" }}
        onMouseOver={e => { const b=e.currentTarget as HTMLButtonElement; b.style.filter="brightness(1.08)"; b.style.transform="translateY(-1px)"; }}
        onMouseOut={e => { const b=e.currentTarget as HTMLButtonElement; b.style.filter="brightness(1)"; b.style.transform="translateY(0)"; }}>
        Apply Filters{activeCount>0?` (${activeCount})`:""}
      </button>
    </aside>
  );
}
