"use client";
import { useState } from "react";
import { FileText, CheckCircle, Phone } from "lucide-react";

export default function ComplaintForm() {
  const [sent, setSent]           = useState(false);
  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [msg, setMsg]             = useState("");
  const [category, setCategory]   = useState("");
  const [pnr, setPnr]             = useState("");

  const ticketId = `YS${Date.now().toString().slice(-7)}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const inp: React.CSSProperties = {
    width: "100%", border: "1.5px solid #e8ebed", borderRadius: "10px",
    padding: "10px 14px", fontSize: "14px", color: "#181d2a",
    background: "#fff", outline: "none",
  };

  return (
    <div style={{ position: "sticky", top: "80px" }}>
      {/* Complaint card */}
      <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #e8ebed", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", padding: "22px", marginBottom: "14px" }}>
        {sent ? (
          <div className="flex flex-col items-center text-center py-4 gap-3">
            <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "#f0fdf4", border: "2px solid #bbf7d0", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckCircle size={26} style={{ color: "#16a34a" }} />
            </div>
            <p style={{ fontSize: "16px", fontWeight: 700, color: "#181d2a" }}>Complaint Raised!</p>
            <p style={{ fontSize: "13px", color: "#6b7280" }}>
              Ticket ID: <strong style={{ color: "#748efe" }}>{ticketId}</strong>
            </p>
            <p style={{ fontSize: "12px", color: "#9ca3af" }}>You&apos;ll receive an update within 24 hours.</p>
            <button
              onClick={() => { setSent(false); setName(""); setEmail(""); setMsg(""); setCategory(""); setPnr(""); }}
              style={{ background: "#748efe", color: "#fff", borderRadius: "10px", padding: "9px 20px", fontSize: "13px", fontWeight: 600, border: "none", cursor: "pointer" }}
            >
              Raise Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-2 mb-5">
              <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FileText size={16} style={{ color: "#748efe" }} />
              </div>
              <div>
                <p style={{ fontSize: "15px", fontWeight: 700, color: "#181d2a", margin: 0 }}>Raise a Complaint</p>
                <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0 }}>We respond within 24 hours</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", display: "block", marginBottom: "5px" }}>Full Name *</label>
                <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" style={inp} />
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", display: "block", marginBottom: "5px" }}>Email Address *</label>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" style={inp} />
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", display: "block", marginBottom: "5px" }}>Issue Category *</label>
                <select required value={category} onChange={(e) => setCategory(e.target.value)}
                  style={{ ...inp, color: category ? "#181d2a" : "#9ca3af" }}>
                  <option value="">Select category</option>
                  <option value="payment">Payment Issue</option>
                  <option value="cancellation">Cancellation</option>
                  <option value="refund">Refund</option>
                  <option value="booking">Booking Failure</option>
                  <option value="pnr">PNR / E-Ticket</option>
                  <option value="schedule">Train Schedule</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", display: "block", marginBottom: "5px" }}>
                  PNR Number <span style={{ fontWeight: 400, color: "#9ca3af" }}>(optional)</span>
                </label>
                <input value={pnr} onChange={(e) => setPnr(e.target.value)} placeholder="e.g. ABC1234567" style={{ ...inp, letterSpacing: "0.05em" }} />
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", display: "block", marginBottom: "5px" }}>Describe your issue *</label>
                <textarea required value={msg} onChange={(e) => setMsg(e.target.value)}
                  rows={4} placeholder="Please describe the issue in detail…"
                  style={{ ...inp, resize: "vertical" }}
                />
              </div>
              <button type="submit" className="w-full flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.97] transition-all"
                style={{ background: "#748efe", color: "#fff", borderRadius: "10px", height: "44px", fontSize: "14px", fontWeight: 700, border: "none", cursor: "pointer" }}>
                <FileText size={14} /> Raise Complaint
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Emergency helpline */}
      <div style={{ background: "#181d2a", borderRadius: "12px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(116,142,254,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Phone size={18} style={{ color: "#748efe" }} />
        </div>
        <div>
          <p style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "2px" }}>RAILWAY EMERGENCY</p>
          <p style={{ fontSize: "22px", fontWeight: 800, color: "#fff", letterSpacing: "0.04em" }}>139</p>
          <p style={{ fontSize: "11px", color: "#9ca3af" }}>24 × 7 · Free to call</p>
        </div>
      </div>
    </div>
  );
}
