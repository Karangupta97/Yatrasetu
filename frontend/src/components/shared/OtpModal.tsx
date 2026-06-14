"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import OtpInput, { OTP_LENGTH } from "./OtpInput";

const RESEND_SECONDS = 30;

interface OtpModalProps {
  open: boolean;
  title: string;
  subtitle: string;
  onClose: () => void;
  onVerified: (otpCode: string) => Promise<void>;
  onResend?: () => Promise<void>;
}

export default function OtpModal({ open, title, subtitle, onClose, onVerified, onResend }: OtpModalProps) {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (!open) return;
    setOtp(Array(OTP_LENGTH).fill(""));
    setError("");
    setTimer(RESEND_SECONDS);
  }, [open]);

  useEffect(() => {
    if (!open || timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [open, timer]);

  if (!open) return null;

  async function handleVerify() {
    const code = otp.join("");
    if (code.length !== OTP_LENGTH) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await onVerified(code);
    } catch (err: any) {
      setError(err?.message ?? "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (timer > 0) return;
    setError("");
    try {
      if (onResend) {
        await onResend();
      }
      setTimer(RESEND_SECONDS);
      setOtp(Array(OTP_LENGTH).fill(""));
    } catch (err: any) {
      setError(err?.message ?? "Failed to resend OTP.");
    }
  }


  return (
    <div className="auth-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="otp-modal-title">
      <div className="auth-modal">
        <button type="button" className="auth-modal__close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <h2 id="otp-modal-title" className="auth-modal__title">{title}</h2>
        <p className="auth-modal__subtitle">{subtitle}</p>

        <OtpInput value={otp} onChange={setOtp} disabled={loading} idPrefix="modal-otp" />

        {error && <p className="auth-modal__error">{error}</p>}

        <div className="reg-resend">
          {timer > 0 ? (
            <span>Resend OTP in <strong>{timer}s</strong></span>
          ) : (
            <button type="button" onClick={handleResend}>Resend OTP</button>
          )}
        </div>

        <button
          type="button"
          className="reg-btn reg-btn--primary"
          disabled={loading || otp.join("").length !== OTP_LENGTH}
          onClick={handleVerify}
        >
          {loading ? "Verifying…" : "VERIFY OTP"}
        </button>
      </div>
    </div>
  );
}
