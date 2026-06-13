"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FAQS } from "../data";

export default function FaqSection({ query }: { query: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const filtered = FAQS.filter((f) => !query || f.q.toLowerCase().includes(query.toLowerCase()));

  return (
    <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #e8ebed", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", marginBottom: "20px" }}>
      <div style={{ padding: "22px 22px 4px" }}>
        <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#181d2a", marginBottom: "3px" }}>Frequently Asked Questions</h2>
        <p style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "4px" }}>
          {query ? `Results for "${query}"` : "Common questions answered."}
        </p>
      </div>
      <div style={{ padding: "4px 22px 22px" }}>
        {filtered.length === 0 ? (
          <p style={{ fontSize: "14px", color: "#9ca3af", padding: "16px 0" }}>No FAQs match your search.</p>
        ) : filtered.map((faq, i) => {
          const isOpen = open === i;
          return (
            <div key={i} style={{ borderTop: i > 0 ? "1px solid #f3f4f6" : "none" }}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex items-center justify-between w-full text-left focus:outline-none"
                style={{ padding: "15px 0", background: "none", border: "none", cursor: "pointer" }}
                aria-expanded={isOpen}
              >
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#181d2a", paddingRight: "16px" }}>{faq.q}</span>
                {isOpen
                  ? <ChevronUp size={16} style={{ color: "#748efe", flexShrink: 0 }} />
                  : <ChevronDown size={16} style={{ color: "#9ca3af", flexShrink: 0 }} />}
              </button>
              {isOpen && (
                <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.7", paddingBottom: "14px" }}>{faq.a}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
