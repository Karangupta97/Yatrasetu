"use client";

import { useState } from "react";
import { CreditCard, Smartphone, Building2, Plus, Check, Trash2, Star, ShieldCheck, AlertCircle } from "lucide-react";

type Method = { id: string; type: "upi" | "card" | "netbanking"; label: string; sub: string; default: boolean };

const INIT_METHODS: Method[] = [
  { id: "m1", type: "upi",        label: "jidnyasa@paytm",    sub: "Paytm UPI",           default: true  },
  { id: "m2", type: "card",       label: "•••• •••• •••• 4242", sub: "HDFC Visa Credit",  default: false },
  { id: "m3", type: "netbanking", label: "SBI Net Banking",    sub: "State Bank of India", default: false },
];

const TYPE_ICON: Record<Method["type"], React.ReactNode> = {
  upi:        <Smartphone size={18} style={{ color: "#748efe" }} />,
  card:       <CreditCard size={18} style={{ color: "#8b5cf6" }} />,
  netbanking: <Building2  size={18} style={{ color: "#0891b2" }} />,
};
const TYPE_BG: Record<Method["type"], string> = {
  upi: "#eff6ff", card: "#fdf4ff", netbanking: "#ecfeff",
};

export default function BillingPayment() {
  const [methods, setMethods]   = useState<Method[]>(INIT_METHODS);
  const [addType, setAddType]   = useState<Method["type"] | "">("");
  const [upiInput, setUpiInput] = useState("");
  const [upiStatus, setUpiStatus] = useState<"idle" | "verifying" | "ok" | "fail">("idle");
  const [showAdd, setShowAdd]   = useState(false);

  const setDefault = (id: string) =>
    setMethods((p) => p.map((m) => ({ ...m, default: m.id === id })));

  const remove = (id: string) =>
    setMethods((p) => {
      const filtered = p.filter((m) => m.id !== id);
      if (filtered.length && !filtered.some((m) => m.default))
        filtered[0].default = true;
      return filtered;
    });

  const verifyUpi = () => {
    if (!upiInput.includes("@")) { setUpiStatus("fail"); return; }
    setUpiStatus("verifying");
    setTimeout(() => setUpiStatus("ok"), 1400);
  };

  const addMethod = () => {
    if (!addType) return;
    const labels: Record<string, string> = {
      upi: upiInput || "new@upi", card: "New card", netbanking: "New bank",
    };
    const subs: Record<string, string> = {
      upi: "UPI", card: "Credit/Debit Card", netbanking: "Net Banking",
    };
    setMethods((p) => [
      ...p,
      { id: `m${Date.now()}`, type: addType as Method["type"], label: labels[addType], sub: subs[addType], default: p.length === 0 },
    ]);
    setShowAdd(false);
    setAddType("");
    setUpiInput("");
    setUpiStatus("idle");
  };

  return (
    <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #e8ebed", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "20px 22px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div className="flex items-center gap-3">
          <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CreditCard size={20} style={{ color: "#22c55e" }} />
          </div>
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#181d2a", margin: 0 }}>Billing & Payment</h2>
            <p style={{ fontSize: "13px", color: "#9ca3af", margin: "2px 0 0" }}>Manage your saved payment methods</p>
          </div>
        </div>
        <button onClick={() => setShowAdd((v) => !v)}
          className="flex items-center gap-1.5 hover:opacity-80 transition-opacity focus:outline-none"
          style={{ background: "#181d2a", color: "#fff", borderRadius: "9px", padding: "8px 14px", fontSize: "13px", fontWeight: 600, border: "none", cursor: "pointer" }}>
          <Plus size={14} /> Add Method
        </button>
      </div>

      <div style={{ padding: "22px" }}>

        {/* Saved methods */}
        <div className="flex flex-col gap-3 mb-5">
          {methods.map((m) => (
            <div key={m.id}
              style={{ display: "flex", alignItems: "center", gap: "14px", background: m.default ? "rgba(116,142,254,0.04)" : "#f9fafb", border: `1.5px solid ${m.default ? "#748efe" : "#e8ebed"}`, borderRadius: "12px", padding: "14px 16px" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "9px", background: TYPE_BG[m.type], display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {TYPE_ICON[m.type]}
              </div>
              <div className="flex-1 min-w-0">
                <p style={{ fontSize: "14px", fontWeight: 600, color: "#181d2a" }}>{m.label}</p>
                <p style={{ fontSize: "12px", color: "#9ca3af" }}>{m.sub}</p>
              </div>
              <div className="flex items-center gap-2">
                {m.default
                  ? <span style={{ background: "#748efe", color: "#fff", borderRadius: "9999px", padding: "2px 10px", fontSize: "11px", fontWeight: 700 }}>Default</span>
                  : <button onClick={() => setDefault(m.id)}
                      className="flex items-center gap-1 hover:opacity-70 focus:outline-none"
                      style={{ fontSize: "12px", color: "#748efe", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
                      <Star size={12} /> Set default
                    </button>}
                <button onClick={() => remove(m.id)}
                  className="flex items-center justify-center rounded-full hover:bg-red-50 transition-colors focus:outline-none"
                  style={{ width: "28px", height: "28px" }} aria-label="Remove">
                  <Trash2 size={13} style={{ color: "#9ca3af" }} />
                </button>
              </div>
            </div>
          ))}

          {methods.length === 0 && (
            <div style={{ textAlign: "center", padding: "24px", color: "#9ca3af", fontSize: "14px" }}>
              No saved methods. Add one below.
            </div>
          )}
        </div>

        {/* Add method panel */}
        {showAdd && (
          <div style={{ background: "#f8fafc", border: "1.5px solid #e8ebed", borderRadius: "12px", padding: "18px" }}>
            <p style={{ fontSize: "14px", fontWeight: 700, color: "#181d2a", marginBottom: "14px" }}>Add Payment Method</p>

            {/* Type selector */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {([["upi","UPI"],["card","Card"],["netbanking","Net Banking"]] as const).map(([t, lbl]) => (
                <button key={t} onClick={() => setAddType(t)}
                  className="flex flex-col items-center gap-1.5 focus:outline-none transition-all"
                  style={{ padding: "12px 8px", borderRadius: "10px", border: `2px solid ${addType === t ? "#748efe" : "#e8ebed"}`, background: addType === t ? "rgba(116,142,254,0.06)" : "#fff", cursor: "pointer" }}>
                  {TYPE_ICON[t]}
                  <span style={{ fontSize: "12px", fontWeight: 600, color: addType === t ? "#748efe" : "#6b7280" }}>{lbl}</span>
                </button>
              ))}
            </div>

            {/* UPI form */}
            {addType === "upi" && (
              <div className="flex flex-col gap-3">
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", display: "block", marginBottom: "5px" }}>UPI ID</label>
                  <div className="flex gap-2">
                    <input value={upiInput} onChange={(e) => { setUpiInput(e.target.value); setUpiStatus("idle"); }}
                      placeholder="name@upi"
                      style={{ flex: 1, padding: "10px 14px", fontSize: "14px", color: "#181d2a", border: `1.5px solid ${upiStatus === "fail" ? "#dc2626" : upiStatus === "ok" ? "#22c55e" : "#e8ebed"}`, borderRadius: "10px", background: "#fff", outline: "none" }} />
                    <button onClick={verifyUpi}
                      style={{ padding: "10px 16px", background: "#748efe", color: "#fff", borderRadius: "10px", fontSize: "13px", fontWeight: 600, border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>
                      {upiStatus === "verifying" ? "..." : "Verify"}
                    </button>
                  </div>
                  {upiStatus === "ok"   && <p className="flex items-center gap-1 mt-1" style={{ fontSize: "12px", color: "#16a34a", fontWeight: 600 }}><Check size={12} /> UPI ID verified</p>}
                  {upiStatus === "fail" && <p className="flex items-center gap-1 mt-1" style={{ fontSize: "12px", color: "#dc2626" }}><AlertCircle size={12} /> Invalid UPI ID</p>}
                </div>
              </div>
            )}

            {/* Card form */}
            {addType === "card" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[["Card Number","number","•••• •••• •••• ••••"],["Cardholder Name","text","Name on card"],["Expiry (MM/YY)","text","MM/YY"],["CVV","password","•••"]].map(([lbl,type,ph]) => (
                  <div key={lbl} className={lbl === "Card Number" ? "sm:col-span-2" : ""}>
                    <label style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", display: "block", marginBottom: "5px" }}>{lbl}</label>
                    <input type={type} placeholder={ph} style={{ width: "100%", padding: "10px 14px", fontSize: "14px", color: "#181d2a", border: "1.5px solid #e8ebed", borderRadius: "10px", background: "#fff", outline: "none" }} />
                  </div>
                ))}
              </div>
            )}

            {/* Net banking */}
            {addType === "netbanking" && (
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", display: "block", marginBottom: "5px" }}>Select Bank</label>
                <select style={{ width: "100%", padding: "10px 14px", fontSize: "14px", color: "#181d2a", border: "1.5px solid #e8ebed", borderRadius: "10px", background: "#fff", outline: "none" }}>
                  <option value="">Select your bank</option>
                  {["SBI","HDFC Bank","ICICI Bank","Axis Bank","Kotak Bank","PNB","Canara Bank"].map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
            )}

            {addType && (
              <div className="flex items-center gap-3 mt-4">
                <button onClick={addMethod}
                  className="flex items-center gap-2 hover:opacity-90 active:scale-[0.97] transition-all focus:outline-none"
                  style={{ background: "#748efe", color: "#fff", borderRadius: "10px", padding: "10px 20px", fontSize: "14px", fontWeight: 700, border: "none", cursor: "pointer" }}>
                  <Plus size={14} /> Save Method
                </button>
                <button onClick={() => { setShowAdd(false); setAddType(""); setUpiStatus("idle"); setUpiInput(""); }}
                  style={{ fontSize: "13px", color: "#6b7280", background: "none", border: "none", cursor: "pointer" }}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}

        {/* Security footer */}
        <div className="flex items-center gap-2 mt-5" style={{ borderTop: "1px solid #f3f4f6", paddingTop: "14px" }}>
          <ShieldCheck size={14} style={{ color: "#22c55e" }} />
          <span style={{ fontSize: "12px", color: "#6b7280" }}>All payment data is encrypted with 256-bit SSL. PCI DSS compliant.</span>
        </div>
      </div>
    </div>
  );
}
