"use client";

import { useState } from "react";
import { ShieldCheck, Lock, CheckCircle, RefreshCw } from "lucide-react";

type Step = "idle" | "enter-otp" | "verified";

export default function AadhaarVerification() {
  const [step, setStep]           = useState<Step>("idle");
  const [aadhaar, setAadhaar]     = useState("");
  const [otp, setOtp]             = useState(["", "", "", "", "", ""]);
  const [aadhaarErr, setAadhaarErr] = useState("");
  const [otpErr, setOtpErr]       = useState("");
  const [resent, setResent]       = useState(false);

  const masked = aadhaar ? `XXXX XXXX ${aadhaar.replace(/\s/g, "").slice(-4)}` : "";

  const formatAadhaar = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 12);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const handleSendOtp = () => {
    const raw = aadhaar.replace(/\s/g, "");
    if (raw.length !== 12) { setAadhaarErr("Enter a valid 12-digit Aadhaar number"); return; }
    setAadhaarErr("");
    setStep("enter-otp");
  };

  const handleVerifyOtp = () => {
    const code = otp.join("");
    if (code.length !== 6) { setOtpErr("Enter the complete 6-digit OTP"); return; }
    // Simulate: any OTP passes
    setOtpErr("");
    setStep("verified");
  };

  const handleResend = () => {
    setOtp(["", "", "", "", "", ""]);
    setResent(true);
    setTimeout(() => setResent(false), 3000);
  };

  const handleOtpChange = (idx: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) (document.getElementById(`otp-${idx + 1}`) as HTMLInputElement)?.focus();
  };

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0)
      (document.getElementById(`otp-${idx - 1}`) as HTMLInputElement)?.focus();
  };

  return (
    <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #e8ebed", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "20px 22px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <ShieldCheck size={20} style={{ color: "#748efe" }} />
        </div>
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#181d2a", margin: 0 }}>Aadhaar Verification</h2>
          <p style={{ fontSize: "13px", color: "#9ca3af", margin: "2px 0 0" }}>Verify your identity for secure bookings</p>
        </div>
        {step === "verified" && (
          <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: "5px", background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", borderRadius: "9999px", padding: "4px 12px", fontSize: "12px", fontWeight: 700 }}>
            <CheckCircle size={13} /> Verified
          </span>
        )}
        {step !== "verified" && (
          <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: "5px", background: "#fffbeb", color: "#d97706", border: "1px solid #fde68a", borderRadius: "9999px", padding: "4px 12px", fontSize: "12px", fontWeight: 600 }}>
            Pending
          </span>
        )}
      </div>

      <div style={{ padding: "22px" }}>

        {/* Verified state */}
        {step === "verified" && (
          <div className="flex flex-col items-center text-center py-4 gap-3">
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#f0fdf4", border: "2px solid #bbf7d0", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckCircle size={28} style={{ color: "#16a34a" }} />
            </div>
            <p style={{ fontSize: "16px", fontWeight: 700, color: "#181d2a" }}>Aadhaar Verified!</p>
            <p style={{ fontSize: "13px", color: "#6b7280" }}>
              Your Aadhaar <strong>{masked}</strong> has been successfully verified.
            </p>
            <div className="flex items-center gap-2" style={{ background: "#f8fafc", border: "1px solid #e8ebed", borderRadius: "9px", padding: "8px 14px" }}>
              <Lock size={13} style={{ color: "#9ca3af" }} />
              <span style={{ fontSize: "12px", color: "#6b7280" }}>Your Aadhaar data is encrypted and stored securely.</span>
            </div>
          </div>
        )}

        {/* Enter Aadhaar */}
        {step === "idle" && (
          <div className="flex flex-col gap-4">
            <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "10px", padding: "12px 14px", display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <Lock size={15} style={{ color: "#748efe", flexShrink: 0, marginTop: "1px" }} />
              <p style={{ fontSize: "13px", color: "#1d4ed8", lineHeight: "1.5", margin: 0 }}>
                Your Aadhaar number is encrypted and used only for identity verification. We never share it with third parties.
              </p>
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", display: "block", marginBottom: "6px", letterSpacing: "0.04em" }}>AADHAAR NUMBER</label>
              <input
                type="text" inputMode="numeric"
                value={aadhaar} onChange={(e) => setAadhaar(formatAadhaar(e.target.value))}
                placeholder="XXXX XXXX XXXX"
                style={{ width: "100%", padding: "12px 14px", fontSize: "18px", fontWeight: 600, letterSpacing: "0.12em", color: "#181d2a", border: `1.5px solid ${aadhaarErr ? "#dc2626" : "#e8ebed"}`, borderRadius: "10px", background: "#fff", outline: "none" }}
              />
              {aadhaarErr && <p style={{ fontSize: "12px", color: "#dc2626", marginTop: "4px" }}>{aadhaarErr}</p>}
            </div>
            <button onClick={handleSendOtp}
              className="w-full flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.97] transition-all focus:outline-none"
              style={{ background: "#748efe", color: "#fff", borderRadius: "10px", height: "44px", fontSize: "14px", fontWeight: 700, border: "none", cursor: "pointer" }}>
              <ShieldCheck size={15} /> Send OTP
            </button>
          </div>
        )}

        {/* Enter OTP */}
        {step === "enter-otp" && (
          <div className="flex flex-col gap-4">
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "14px", color: "#6b7280" }}>
                OTP sent to mobile linked with <strong style={{ color: "#181d2a" }}>{masked}</strong>
              </p>
            </div>

            {/* 6-box OTP input */}
            <div className="flex items-center justify-center gap-3">
              {otp.map((digit, i) => (
                <input
                  key={i} id={`otp-${i}`}
                  type="text" inputMode="numeric" maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  style={{
                    width: "44px", height: "52px", borderRadius: "10px",
                    border: `2px solid ${digit ? "#748efe" : "#e8ebed"}`,
                    background: digit ? "rgba(116,142,254,0.06)" : "#fff",
                    fontSize: "20px", fontWeight: 700, color: "#181d2a",
                    textAlign: "center", outline: "none",
                  }}
                />
              ))}
            </div>

            {otpErr && <p style={{ fontSize: "12px", color: "#dc2626", textAlign: "center" }}>{otpErr}</p>}

            {resent && <p style={{ fontSize: "12px", color: "#16a34a", textAlign: "center", fontWeight: 600 }}>OTP resent successfully!</p>}

            <button onClick={handleVerifyOtp}
              className="w-full flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.97] transition-all focus:outline-none"
              style={{ background: "#181d2a", color: "#fff", borderRadius: "10px", height: "44px", fontSize: "14px", fontWeight: 700, border: "none", cursor: "pointer" }}>
              <ShieldCheck size={15} /> Verify OTP
            </button>

            <div className="flex items-center justify-between">
              <button onClick={handleResend}
                className="flex items-center gap-1.5 focus:outline-none hover:opacity-70 transition-opacity"
                style={{ fontSize: "13px", color: "#748efe", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
                <RefreshCw size={12} /> Resend OTP
              </button>
              <button onClick={() => { setStep("idle"); setOtp(["","","","","",""]); }}
                style={{ fontSize: "13px", color: "#9ca3af", background: "none", border: "none", cursor: "pointer" }}>
                Change Aadhaar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
