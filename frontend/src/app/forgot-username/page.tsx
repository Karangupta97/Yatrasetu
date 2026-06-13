"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import AuthShell from "@/components/shared/AuthShell";
import OtpInput, { OTP_LENGTH } from "@/components/shared/OtpInput";
import {
  formatAadhaar,
  lookupUserByAadhaar,
  simulateDelay,
} from "@/lib/auth-utils";
import { onInputFocus, onInputBlur } from "@/components/register/form-utils";
import "@/app/auth/auth.css";

const RESEND_SECONDS = 30;

type Step = "aadhaar" | "otp" | "result";

export default function ForgotUsernamePage() {
  const [step, setStep] = useState<Step>("aadhaar");
  const [aadhaar, setAadhaar] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);
  const [smsSent, setSmsSent] = useState(false);

  const stepIndex = step === "aadhaar" ? 0 : step === "otp" ? 1 : 2;

  async function sendOtp() {
    const digits = aadhaar.replace(/\s/g, "");
    if (digits.length !== 12) {
      setError("Enter a valid 12-digit Aadhaar number.");
      return;
    }
    const user = lookupUserByAadhaar(digits);
    if (!user) {
      setError("No account found for this Aadhaar number.");
      return;
    }
    setError("");
    setLoading(true);
    await simulateDelay(900);
    setUsername(user.username);
    setLoading(false);
    setStep("otp");
    setTimer(RESEND_SECONDS);
    const id = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) { clearInterval(id); return 0; }
        return t - 1;
      });
    }, 1000);
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (otp.join("").length !== OTP_LENGTH) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }
    setLoading(true);
    await simulateDelay(1000);
    setSmsSent(true);
    setLoading(false);
    setStep("result");
  }

  return (
    <AuthShell
      title="Forgot Username"
      subtitle="Recover your username using Aadhaar OTP verification."
    >
      <div className="recovery-step-indicator">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`recovery-step-dot${i <= stepIndex ? " recovery-step-dot--done" : ""}${i === stepIndex ? " recovery-step-dot--active" : ""}`}
          />
        ))}
      </div>

      {step === "aadhaar" && (
        <form
          onSubmit={(e) => { e.preventDefault(); sendOtp(); }}
          noValidate
        >
          <div className="reg-field">
            <label htmlFor="aadhaar" className="reg-label">Aadhaar Number</label>
            <input
              id="aadhaar"
              type="text"
              className="reg-input"
              placeholder="XXXX XXXX XXXX"
              value={aadhaar}
              onChange={(e) => { setAadhaar(formatAadhaar(e.target.value)); setError(""); }}
              onFocus={onInputFocus}
              onBlur={onInputBlur}
              required
            />
          </div>
          {error && <p style={{ color: "#DC2626", fontSize: 14, marginBottom: 16 }}>{error}</p>}
          <button type="submit" className="reg-btn reg-btn--primary" disabled={loading}>
            {loading ? "Sending OTP…" : "SEND OTP"}
          </button>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={verifyOtp} noValidate>
          <p className="auth-modal__subtitle" style={{ marginBottom: 20 }}>
            Enter the OTP sent to your Aadhaar-linked mobile number.
          </p>
          <OtpInput value={otp} onChange={setOtp} disabled={loading} idPrefix="fu-otp" />
          {error && <p style={{ color: "#DC2626", fontSize: 14, textAlign: "center", marginBottom: 16 }}>{error}</p>}
          <div className="reg-resend">
            {timer > 0 ? (
              <span>Resend OTP in <strong>{timer}s</strong></span>
            ) : (
              <button type="button" onClick={sendOtp}>Resend OTP</button>
            )}
          </div>
          <button type="submit" className="reg-btn reg-btn--primary" disabled={loading}>
            {loading ? "Verifying…" : "VERIFY OTP"}
          </button>
        </form>
      )}

      {step === "result" && (
        <div className="recovery-result">
          <div className="reg-verify-success" style={{ justifyContent: "center", marginBottom: 16 }}>
            <CheckCircle2 size={20} />
            Username Retrieved
          </div>
          <div className="recovery-username-box">
            <div className="recovery-username-box__label">Your Username</div>
            <div className="recovery-username-box__value">{username}</div>
          </div>
          {smsSent && (
            <p className="recovery-sms-note">✓ Username sent via SMS to your registered mobile</p>
          )}
          <Link href="/login" className="reg-btn reg-btn--primary" style={{ textDecoration: "none" }}>
            GO TO LOGIN
          </Link>
        </div>
      )}

      <p className="reg-footer">
        Remember your username?{" "}
        <Link href="/login" className="reg-link">Sign In</Link>
      </p>
    </AuthShell>
  );
}
