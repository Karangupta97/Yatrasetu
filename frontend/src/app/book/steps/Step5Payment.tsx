"use client";

import { useState } from "react";
import { ShieldCheck, Smartphone, CreditCard, Building2, Wallet, AlertCircle, Lock } from "lucide-react";
import StepCard, { FieldLabel, FieldInput, NavButtons } from "../components/StepCard";
import { BookingState, PaymentMethod } from "../types";

const METHODS: { id: PaymentMethod; label: string; Icon: React.ElementType; desc: string }[] = [
  { id: "upi",        label: "UPI",          Icon: Smartphone,  desc: "Google Pay, PhonePe, Paytm, BHIM" },
  { id: "card",       label: "Card",         Icon: CreditCard,  desc: "Debit & Credit cards accepted" },
  { id: "netbanking", label: "Net Banking",  Icon: Building2,   desc: "50+ banks supported" },
  { id: "wallet",     label: "Wallet",       Icon: Wallet,      desc: "Paytm, Amazon Pay, Mobikwik" },
];

const BANKS = ["SBI", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Bank", "PNB", "Canara Bank", "Bank of Baroda"];

export default function Step5Payment({
  state, setState, onNext, onBack,
}: {
  state: BookingState;
  setState: (s: Partial<BookingState>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [selectedBank, setSelectedBank] = useState("");

  const handlePay = () => {
    setError("");
    if (!state.paymentMethod) { setError("Please select a payment method."); return; }
    if (state.paymentMethod === "upi" && !state.upiId.includes("@")) {
      setError("Enter a valid UPI ID (e.g. name@upi)"); return;
    }
    if (state.paymentMethod === "card" && (cardNum.replace(/\s/g, "").length < 16 || !cardName || !expiry || !cvv)) {
      setError("Please fill in all card details."); return;
    }
    if (state.paymentMethod === "netbanking" && !selectedBank) {
      setError("Please select your bank."); return;
    }
    setProcessing(true);
    setTimeout(() => { setProcessing(false); onNext(); }, 2200);
  };

  return (
    <StepCard>
      {/* Security header */}
      <div className="flex items-center gap-3 mb-6 p-3" style={{ background: "#f0fdf4", borderRadius: "10px", border: "1px solid #bbf7d0" }}>
        <ShieldCheck size={20} style={{ color: "#16a34a", flexShrink: 0 }} />
        <div>
          <p style={{ fontSize: "13px", fontWeight: 700, color: "#15803d" }}>Secure Payment</p>
          <p style={{ fontSize: "12px", color: "#16a34a" }}>256-bit SSL encryption · PCI DSS Compliant</p>
        </div>
        <Lock size={16} style={{ color: "#16a34a", marginLeft: "auto", flexShrink: 0 }} />
      </div>

      <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#181d2a", marginBottom: "6px" }}>
        Payment
      </h2>
      <div className="flex items-center justify-between mb-6">
        <p style={{ fontSize: "14px", color: "#9ca3af" }}>Choose how you'd like to pay</p>
        <span style={{ fontSize: "18px", fontWeight: 800, color: "#748efe" }}>
          ₹{state.fare.total.toLocaleString("en-IN")}
        </span>
      </div>

      {/* Method selector */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {METHODS.map(({ id, label, Icon, desc }) => {
          const active = state.paymentMethod === id;
          return (
            <button
              key={id}
              onClick={() => { setState({ paymentMethod: id }); setError(""); }}
              className="flex flex-col text-left p-4 focus:outline-none focus-visible:ring-2 transition-all"
              style={{
                border: `2px solid ${active ? "#748efe" : "#e8ebed"}`,
                background: active ? "rgba(116,142,254,0.06)" : "#ffffff",
                borderRadius: "12px", cursor: "pointer",
              }}
              aria-pressed={active}
            >
              <Icon size={20} style={{ color: active ? "#748efe" : "#6b7280", marginBottom: "6px" }} />
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#181d2a" }}>{label}</span>
              <span style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>{desc}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic form */}
      {state.paymentMethod === "upi" && (
        <div className="mb-4">
          <FieldLabel required>UPI ID</FieldLabel>
          <FieldInput
            value={state.upiId}
            onChange={(v) => setState({ upiId: v })}
            placeholder="yourname@upi"
            icon={<Smartphone size={15} />}
          />
          <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "6px" }}>
            A payment request will be sent to your UPI app.
          </p>
        </div>
      )}

      {state.paymentMethod === "card" && (
        <div className="flex flex-col gap-4 mb-4">
          <div>
            <FieldLabel required>Card Number</FieldLabel>
            <FieldInput
              value={cardNum}
              onChange={(v) => setCardNum(v.replace(/(\d{4})(?=\d)/g, "$1 ").slice(0, 19))}
              placeholder="1234 5678 9012 3456"
              icon={<CreditCard size={15} />}
            />
          </div>
          <div>
            <FieldLabel required>Cardholder Name</FieldLabel>
            <FieldInput value={cardName} onChange={setCardName} placeholder="Name on card" />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <FieldLabel required>Expiry</FieldLabel>
              <FieldInput value={expiry} onChange={(v) => setExpiry(v.replace(/(\d{2})(?=\d)/, "$1/").slice(0, 5))} placeholder="MM/YY" />
            </div>
            <div className="flex-1">
              <FieldLabel required>CVV</FieldLabel>
              <FieldInput type="password" value={cvv} onChange={(v) => setCvv(v.slice(0, 4))} placeholder="•••" />
            </div>
          </div>
        </div>
      )}

      {state.paymentMethod === "netbanking" && (
        <div className="mb-4">
          <FieldLabel required>Select Bank</FieldLabel>
          <div className="grid grid-cols-2 gap-2">
            {BANKS.map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBank(b)}
                className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 transition-all"
                style={{
                  padding: "10px 14px", borderRadius: "10px", cursor: "pointer",
                  border: `1.5px solid ${selectedBank === b ? "#748efe" : "#e8ebed"}`,
                  background: selectedBank === b ? "rgba(116,142,254,0.06)" : "#ffffff",
                  fontSize: "13px", fontWeight: 500, color: selectedBank === b ? "#748efe" : "#181d2a",
                }}
                aria-pressed={selectedBank === b}
              >
                <Building2 size={14} style={{ color: selectedBank === b ? "#748efe" : "#9ca3af" }} />
                {b}
              </button>
            ))}
          </div>
        </div>
      )}

      {state.paymentMethod === "wallet" && (
        <div className="mb-4 p-4" style={{ background: "#f8fafc", borderRadius: "10px", border: "1px solid #e8ebed" }}>
          <p style={{ fontSize: "13px", color: "#6b7280" }}>
            You&apos;ll be redirected to your wallet to complete the payment securely.
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3" style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", marginBottom: "16px" }}>
          <AlertCircle size={15} style={{ color: "#dc2626", flexShrink: 0 }} />
          <p style={{ fontSize: "13px", color: "#dc2626", fontWeight: 500 }}>{error}</p>
        </div>
      )}

      {/* Processing overlay feel */}
      {processing && (
        <div className="flex flex-col items-center justify-center py-8 gap-3">
          <svg className="animate-spin" width="40" height="40" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#e8ebed" strokeWidth="3" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="#748efe" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <p style={{ fontSize: "15px", fontWeight: 600, color: "#181d2a" }}>Processing payment…</p>
          <p style={{ fontSize: "13px", color: "#9ca3af" }}>Please do not close or refresh this page.</p>
        </div>
      )}

      {!processing && (
        <NavButtons
          onBack={onBack}
          onNext={handlePay}
          nextLabel={`Pay ₹${state.fare.total.toLocaleString("en-IN")} →`}
          loading={processing}
        />
      )}
    </StepCard>
  );
}
