"use client";

import { useState } from "react";
import {
  CreditCard, Smartphone, Building2, Plus, Check,
  Trash2, Star, ShieldCheck, AlertCircle, Wallet,
} from "lucide-react";
import { useUserProfile, type PaymentMethod } from "@/hooks/useUserProfile";

/* ── Icon & color maps ──────────────────────────────────────── */
const TYPE_ICON: Record<PaymentMethod["type"], React.ReactNode> = {
  upi:        <Smartphone size={18} style={{ color: "#6366F1" }} />,
  card:       <CreditCard size={18} style={{ color: "#8b5cf6" }} />,
  netbanking: <Building2  size={18} style={{ color: "#0891b2" }} />,
};
const TYPE_BG: Record<PaymentMethod["type"], string> = {
  upi:        "#EEF2FF",
  card:       "#fdf4ff",
  netbanking: "#ecfeff",
};

/* ── Empty state ────────────────────────────────────────────── */
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: "16px", padding: "40px 24px", textAlign: "center",
    }}>
      <div style={{
        width: "64px", height: "64px", borderRadius: "16px",
        background: "#f8fafc", border: "2px dashed #e8ebed",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Wallet size={28} style={{ color: "#9ca3af" }} />
      </div>
      <div>
        <p style={{ fontSize: "16px", fontWeight: 700, color: "#374151", margin: "0 0 6px" }}>
          No payment methods saved
        </p>
        <p style={{ fontSize: "14px", color: "#9ca3af", margin: 0 }}>
          Add a UPI ID, card, or bank account to pay faster at checkout.
        </p>
      </div>
      <button
        onClick={onAdd}
        style={{
          display: "flex", alignItems: "center", gap: "8px",
          background: "#6366F1", color: "#fff", borderRadius: "10px",
          padding: "11px 22px", fontSize: "14px", fontWeight: 700,
          border: "none", cursor: "pointer", fontFamily: "inherit",
          boxShadow: "0 4px 14px rgba(99,102,241,0.3)",
          transition: "opacity 0.15s",
        }}
      >
        <Plus size={15} /> Add Method
      </button>
    </div>
  );
}

/* ── Add method form ────────────────────────────────────────── */
function AddMethodForm({ onAdd, onCancel }: { onAdd: (m: Omit<PaymentMethod, "id">) => void; onCancel: () => void }) {
  const [addType, setAddType] = useState<PaymentMethod["type"] | "">("");
  const [upiInput, setUpiInput] = useState("");
  const [upiStatus, setUpiStatus] = useState<"idle" | "verifying" | "ok" | "fail">("idle");

  const verifyUpi = () => {
    if (!upiInput.includes("@")) { setUpiStatus("fail"); return; }
    setUpiStatus("verifying");
    setTimeout(() => setUpiStatus("ok"), 1200);
  };

  const handleAdd = () => {
    if (!addType) return;
    const labels: Record<string, string> = {
      upi: upiInput || "new@upi", card: "New card", netbanking: "New bank account",
    };
    const subs: Record<string, string> = {
      upi: "UPI", card: "Credit / Debit Card", netbanking: "Net Banking",
    };
    onAdd({ type: addType as PaymentMethod["type"], label: labels[addType], sub: subs[addType], default: false });
  };

  return (
    <div style={{
      background: "#f8fafc", border: "1.5px solid #e8ebed",
      borderRadius: "14px", padding: "20px",
    }}>
      <p style={{ fontSize: "15px", fontWeight: 700, color: "#181d2a", margin: "0 0 16px" }}>
        Add Payment Method
      </p>

      {/* Type selector */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px", marginBottom: "18px" }}>
        {([["upi", "UPI"], ["card", "Card"], ["netbanking", "Net Banking"]] as const).map(([t, lbl]) => (
          <button
            key={t}
            onClick={() => setAddType(t)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
              padding: "14px 8px", borderRadius: "12px",
              border: `2px solid ${addType === t ? "#6366F1" : "#e8ebed"}`,
              background: addType === t ? "rgba(99,102,241,0.06)" : "#fff",
              cursor: "pointer", transition: "all 0.15s",
            }}
          >
            {TYPE_ICON[t]}
            <span style={{ fontSize: "12px", fontWeight: 600, color: addType === t ? "#6366F1" : "#6b7280" }}>
              {lbl}
            </span>
          </button>
        ))}
      </div>

      {/* UPI form */}
      {addType === "upi" && (
        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", display: "block", marginBottom: "6px" }}>
            UPI ID
          </label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              value={upiInput}
              onChange={(e) => { setUpiInput(e.target.value); setUpiStatus("idle"); }}
              placeholder="yourname@upi"
              style={{
                flex: 1, padding: "10px 14px", fontSize: "14px", color: "#181d2a",
                border: `1.5px solid ${upiStatus === "fail" ? "#dc2626" : upiStatus === "ok" ? "#22c55e" : "#e8ebed"}`,
                borderRadius: "10px", background: "#fff", outline: "none", fontFamily: "inherit",
              }}
            />
            <button
              onClick={verifyUpi}
              style={{
                padding: "10px 18px", background: "#6366F1", color: "#fff",
                borderRadius: "10px", fontSize: "13px", fontWeight: 600,
                border: "none", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
              }}
            >
              {upiStatus === "verifying" ? "…" : "Verify"}
            </button>
          </div>
          {upiStatus === "ok"   && <p style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#16a34a", fontWeight: 600, marginTop: "4px" }}><Check size={12} /> UPI ID verified</p>}
          {upiStatus === "fail" && <p style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#dc2626", marginTop: "4px" }}><AlertCircle size={12} /> Invalid UPI ID</p>}
        </div>
      )}

      {/* Card form */}
      {addType === "card" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
          {[["Card Number", "number", "•••• •••• •••• ••••", true], ["Cardholder Name", "text", "Name on card", true], ["Expiry (MM/YY)", "text", "MM/YY", false], ["CVV", "password", "•••", false]].map(([lbl, type, ph, full]) => (
            <div key={lbl as string} style={{ gridColumn: full ? "1 / -1" : undefined }}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", display: "block", marginBottom: "5px" }}>{lbl as string}</label>
              <input type={type as string} placeholder={ph as string} style={{ width: "100%", padding: "10px 14px", fontSize: "14px", color: "#181d2a", border: "1.5px solid #e8ebed", borderRadius: "10px", background: "#fff", outline: "none", fontFamily: "inherit" }} />
            </div>
          ))}
        </div>
      )}

      {/* Net banking */}
      {addType === "netbanking" && (
        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", display: "block", marginBottom: "6px" }}>Select Bank</label>
          <select style={{ width: "100%", padding: "10px 14px", fontSize: "14px", color: "#181d2a", border: "1.5px solid #e8ebed", borderRadius: "10px", background: "#fff", outline: "none", fontFamily: "inherit" }}>
            <option value="">Select your bank</option>
            {["SBI", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Bank", "PNB", "Canara Bank"].map((b) => <option key={b}>{b}</option>)}
          </select>
        </div>
      )}

      {addType && (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={handleAdd}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              background: "#6366F1", color: "#fff", borderRadius: "10px",
              padding: "10px 22px", fontSize: "14px", fontWeight: 700,
              border: "none", cursor: "pointer", fontFamily: "inherit",
              transition: "opacity 0.15s",
            }}
          >
            <Plus size={14} /> Save Method
          </button>
          <button onClick={onCancel} style={{ fontSize: "13px", color: "#9ca3af", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
export default function BillingPayment() {
  const profile = useUserProfile();
  const [showAdd, setShowAdd] = useState(false);

  const methods = profile.paymentMethods;

  const setDefault = (id: string) => {
    profile.setPaymentMethods(methods.map((m) => ({ ...m, default: m.id === id })));
  };

  const remove = (id: string) => {
    const filtered = methods.filter((m) => m.id !== id);
    if (filtered.length && !filtered.some((m) => m.default)) filtered[0].default = true;
    profile.setPaymentMethods(filtered);
  };

  const addMethod = (m: Omit<PaymentMethod, "id">) => {
    const newMethod: PaymentMethod = {
      ...m,
      id: `m${Date.now()}`,
      default: methods.length === 0,
    };
    profile.setPaymentMethods([...methods, newMethod]);
    setShowAdd(false);
  };

  return (
    <div
      style={{
        background: "#fff", borderRadius: "16px",
        border: "1px solid #e8ebed",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        overflow: "hidden",
      }}
    >
      {/* ── Header ─────────────────────────────────── */}
      <div style={{
        padding: "24px 28px 20px", borderBottom: "1px solid #f3f4f6",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{
            width: "42px", height: "42px", borderRadius: "11px",
            background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <CreditCard size={22} style={{ color: "#22c55e" }} />
          </div>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#181d2a", margin: "0 0 3px" }}>
              Billing &amp; Payment
            </h2>
            <p style={{ fontSize: "13px", color: "#9ca3af", margin: 0 }}>
              Manage your saved payment methods
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAdd((v) => !v)}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            background: "#181d2a", color: "#fff", borderRadius: "10px",
            padding: "9px 16px", fontSize: "13px", fontWeight: 600,
            border: "none", cursor: "pointer", fontFamily: "inherit",
            transition: "opacity 0.15s",
          }}
          className="add-method-btn"
        >
          <Plus size={14} /> Add Method
        </button>
      </div>

      <div style={{ padding: "24px 28px" }}>

        {/* ── Payment method rows ─────────────────── */}
        {methods.length === 0 && !showAdd ? (
          <EmptyState onAdd={() => setShowAdd(true)} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: showAdd ? "20px" : "0" }}>
            {methods.map((m) => (
              <div
                key={m.id}
                className="payment-row"
                style={{
                  display: "flex", alignItems: "center", gap: "16px",
                  background: m.default ? "#F0FDF4" : "#fff",
                  border: `1px solid ${m.default ? "#86efac" : "#E5E7EB"}`,
                  borderRadius: "12px", padding: "16px 20px",
                  transition: "transform 0.18s ease, box-shadow 0.18s ease",
                }}
              >
                {/* Icon */}
                <div style={{
                  width: "40px", height: "40px", borderRadius: "10px",
                  background: TYPE_BG[m.type], display: "flex", alignItems: "center",
                  justifyContent: "center", flexShrink: 0,
                }}>
                  {TYPE_ICON[m.type]}
                </div>

                {/* Label */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "#181d2a", margin: 0 }}>
                    {m.label}
                  </p>
                  <p style={{ fontSize: "12px", color: "#9ca3af", margin: "2px 0 0" }}>{m.sub}</p>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                  {m.default ? (
                    <span style={{
                      background: "#16a34a", color: "#fff",
                      borderRadius: "9999px", padding: "3px 12px",
                      fontSize: "11px", fontWeight: 700,
                    }}>
                      Default
                    </span>
                  ) : (
                    <button
                      onClick={() => setDefault(m.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: "4px",
                        fontSize: "12px", color: "#6366F1", fontWeight: 600,
                        background: "none", border: "none", cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      <Star size={12} /> Set default
                    </button>
                  )}
                  <button
                    onClick={() => remove(m.id)}
                    aria-label={`Remove ${m.label}`}
                    className="remove-btn"
                    style={{
                      width: "30px", height: "30px", borderRadius: "8px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: "transparent", border: "none", cursor: "pointer",
                      transition: "background 0.15s",
                    }}
                  >
                    <Trash2 size={14} style={{ color: "#9ca3af" }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Add method form ─────────────────────── */}
        {showAdd && (
          <AddMethodForm onAdd={addMethod} onCancel={() => setShowAdd(false)} />
        )}

        {/* ── Security footer ──────────────────────── */}
        {(methods.length > 0 || showAdd) && (
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            marginTop: "20px", paddingTop: "16px",
            borderTop: "1px solid #f3f4f6",
          }}>
            <ShieldCheck size={14} style={{ color: "#22c55e" }} />
            <span style={{ fontSize: "12px", color: "#6b7280" }}>
              All payment data is encrypted with 256-bit SSL. PCI DSS compliant.
            </span>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .payment-row:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        }
        .remove-btn:hover { background: #FEF2F2 !important; }
        .remove-btn:hover svg { color: #dc2626 !important; }
        .add-method-btn:hover { opacity: 0.85; }
      `}} />
    </div>
  );
}
