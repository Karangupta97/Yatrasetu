"use client";
import { CreditCard, XCircle, RotateCcw, AlertCircle, FileText, Clock } from "lucide-react";

const CATS = [
  { icon: <CreditCard size={22} style={{ color: "#748efe" }} />, label: "Payment Issue", desc: "Failed payment, double deduction, card error", bg: "#eff6ff", border: "#bfdbfe" },
  { icon: <XCircle size={22} style={{ color: "#f4632a" }} />, label: "Cancellation", desc: "Cancel booking, partial cancel, TDR filing", bg: "#fff7ed", border: "#fed7aa" },
  { icon: <RotateCcw size={22} style={{ color: "#22c55e" }} />, label: "Refund Status", desc: "Track refund, not received, wrong amount", bg: "#f0fdf4", border: "#bbf7d0" },
  { icon: <AlertCircle size={22} style={{ color: "#f59e0b" }} />, label: "Booking Failure", desc: "Ticket not confirmed, error during booking", bg: "#fffbeb", border: "#fde68a" },
  { icon: <FileText size={22} style={{ color: "#8b5cf6" }} />, label: "PNR / E-Ticket", desc: "PNR not found, ticket not received on email", bg: "#fdf4ff", border: "#e9d5ff" },
  { icon: <Clock size={22} style={{ color: "#0891b2" }} />, label: "Train Schedule", desc: "Delay, platform change, live running status", bg: "#ecfeff", border: "#a5f3fc" },
];

export default function IssueCategories() {
  return (
    <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #e8ebed", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", marginBottom: "20px" }}>
      <div style={{ padding: "22px 22px 4px" }}>
        <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#181d2a", marginBottom: "3px" }}>What do you need help with?</h2>
        <p style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "18px" }}>Select a category for targeted support.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" style={{ padding: "0 22px 22px" }}>
        {CATS.map((c) => (
          <button
            key={c.label}
            className="flex flex-col text-left hover:shadow-md transition-all focus:outline-none focus-visible:ring-2"
            style={{ background: c.bg, border: `1.5px solid ${c.border}`, borderRadius: "12px", padding: "14px", cursor: "pointer" }}
            aria-label={c.label}
          >
            <div style={{ marginBottom: "10px" }}>{c.icon}</div>
            <p style={{ fontSize: "13px", fontWeight: 700, color: "#181d2a", marginBottom: "3px" }}>{c.label}</p>
            <p style={{ fontSize: "11px", color: "#6b7280", lineHeight: "1.4" }}>{c.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
