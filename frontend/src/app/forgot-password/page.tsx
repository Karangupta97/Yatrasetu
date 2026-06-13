"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Eye, EyeOff } from "lucide-react";
import AuthShell from "@/components/shared/AuthShell";
import OtpInput, { OTP_LENGTH } from "@/components/shared/OtpInput";
import SuccessCheckmark from "@/components/shared/SuccessCheckmark";
import {
  formatAadhaar,
  lookupUserByAadhaar,
  simulateDelay,
} from "@/lib/auth-utils";
import { onInputFocus, onInputBlur } from "@/components/register/form-utils";
import "@/app/auth/auth.css";

const RESEND_SECONDS = 30;

type Step = "aadhaar" | "otp" | "password" | "success";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("aadhaar");
  const [aadhaar, setAadhaar] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);

  const stepIndex = { aadhaar: 0, otp: 1, password: 2, success: 3 }[step];

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
    setLoading(false);
    setStep("password");
    setError("");
  }

  async function resetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    await simulateDelay(1200);
    setLoading(false);
    setStep("success");
  }

  const subtitles: Record<Step, string> = {
    aadhaar: "Reset your password using Aadhaar OTP verification.",
    otp: "Verify OTP sent to your Aadhaar-linked mobile.",
    password: "Create a new password for your account.",
    success: "Your password has been reset successfully.",
  };

  return (
    <AuthShell title="Forgot Password" subtitle={subtitles[step]}>
      {step !== "success" && (
        <div className="recovery-step-indicator">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`recovery-step-dot${i <= stepIndex ? " recovery-step-dot--done" : ""}${i === stepIndex ? " recovery-step-dot--active" : ""}`}
            />
          ))}
        </div>
      )}

      {step === "aadhaar" && (
        <form onSubmit={(e) => { e.preventDefault(); sendOtp(); }} noValidate>
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
          <OtpInput value={otp} onChange={setOtp} disabled={loading} idPrefix="fp-otp" />
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

      {step === "password" && (
        <form onSubmit={resetPassword} noValidate>
          <div className="reg-field">
            <label htmlFor="password" className="reg-label">New Password</label>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                type={showPwd ? "text" : "password"}
                className="reg-input"
                placeholder="Create new password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                onFocus={onInputFocus}
                onBlur={onInputBlur}
                required
                minLength={8}
                style={{ paddingRight: 48 }}
              />
              <button
                type="button"
                aria-label={showPwd ? "Hide password" : "Show password"}
                onClick={() => setShowPwd((v) => !v)}
                style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94A3B8", display: "flex" }}
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="reg-field">
            <label htmlFor="confirmPassword" className="reg-label">Confirm Password</label>
            <div style={{ position: "relative" }}>
              <input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                className="reg-input"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                onFocus={onInputFocus}
                onBlur={onInputBlur}
                required
                style={{ paddingRight: 48 }}
              />
              <button
                type="button"
                aria-label={showConfirm ? "Hide password" : "Show password"}
                onClick={() => setShowConfirm((v) => !v)}
                style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94A3B8", display: "flex" }}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {error && <p style={{ color: "#DC2626", fontSize: 14, marginBottom: 16 }}>{error}</p>}
          <button type="submit" className="reg-btn reg-btn--primary" disabled={loading}>
            {loading ? "Resetting…" : "RESET PASSWORD"}
          </button>
        </form>
      )}

      {step === "success" && (
        <div className="recovery-result">
          <SuccessCheckmark size={80} />
          <div className="reg-verify-success" style={{ justifyContent: "center", margin: "16px 0" }}>
            <CheckCircle2 size={20} />
            Password Reset Successful
          </div>
          <div className="recovery-username-box">
            <div className="recovery-username-box__label">Username</div>
            <div className="recovery-username-box__value">{username}</div>
          </div>
          <Link href="/login" className="reg-btn reg-btn--primary" style={{ textDecoration: "none" }}>
            GO TO LOGIN
          </Link>
        </div>
      )}

      {step !== "success" && (
        <p className="reg-footer">
          Remember your password?{" "}
          <Link href="/login" className="reg-link">Sign In</Link>
        </p>
      )}
    </AuthShell>
  );
}
