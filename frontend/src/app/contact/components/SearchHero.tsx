"use client";

import { Search, Headphones } from "lucide-react";

type Props = { query: string; setQuery: (v: string) => void };

export default function SearchHero({ query, setQuery }: Props) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg,#181d2a 0%,#2d3560 60%,#748efe 100%)",
        padding: "52px 24px 76px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative blobs */}
      <div aria-hidden="true" style={{ position:"absolute",top:"-60px",right:"-60px",width:"280px",height:"280px",borderRadius:"50%",background:"rgba(116,142,254,0.10)" }} />
      <div aria-hidden="true" style={{ position:"absolute",bottom:"-70px",left:"-40px",width:"200px",height:"200px",borderRadius:"50%",background:"rgba(116,142,254,0.07)" }} />

      <div className="mx-auto relative" style={{ maxWidth:"760px", textAlign:"center" }}>
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-4"
          style={{ background:"rgba(116,142,254,0.20)", borderRadius:"9999px", padding:"6px 16px" }}>
          <Headphones size={13} style={{ color:"#748efe" }} aria-hidden="true" />
          <span style={{ fontSize:"12px", color:"#a5b4fc", fontWeight:500 }}>24 × 7 Support Available</span>
        </div>

        <h1 style={{ fontSize:"clamp(24px,5vw,38px)", fontWeight:800, color:"#fff", marginBottom:"10px", letterSpacing:"-0.5px" }}>
          How can we help you?
        </h1>
        <p style={{ fontSize:"15px", color:"#a5b4fc", marginBottom:"26px" }}>
          Search our help centre or reach us directly — we&apos;re here round the clock.
        </p>

        {/* Search bar */}
        <div className="flex items-center gap-2"
          style={{ background:"#fff", borderRadius:"14px", padding:"6px 6px 6px 18px", boxShadow:"0 8px 28px rgba(0,0,0,0.22)", maxWidth:"560px", margin:"0 auto" }}>
          <Search size={17} style={{ color:"#9ca3af", flexShrink:0 }} aria-hidden="true" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search — refund, cancellation, PNR…"
            className="flex-1 bg-transparent border-none outline-none focus:ring-0"
            style={{ fontSize:"14px", color:"#181d2a" }}
            aria-label="Search help topics"
          />
          <button
            style={{ background:"#748efe", color:"#fff", borderRadius:"10px", padding:"9px 18px", fontSize:"13px", fontWeight:700, border:"none", cursor:"pointer", whiteSpace:"nowrap" }}
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
