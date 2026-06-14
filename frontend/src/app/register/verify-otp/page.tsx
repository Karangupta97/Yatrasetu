"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import RegisterShell from "@/components/register/RegisterShell";
import OtpInput, { OTP_LENGTH } from "@/components/shared/OtpInput";
import { apiVerifyEmail, apiResendOtp, setAccessToken, type ApiError } from "@/lib/api";
import { saveSessionUser } from "@/lib/auth-store";
import { loadRegisterData, saveRegisterData, maskEmail } from "@/lib/register-store";


const RESEND_SECONDS = 60; // matches backend cooldown (60 s)

export default function VerifyOtpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [timer, setTimer] = useState(RESEND_SECONDS);

  useEffect(() => {
    const data = loadRegisterData();
    // Guard: must have come from Step 1 with a real userId from the backend
    if (!data.userId || !data.email) {
      router.replace("/register");
      return;
    }
    setEmail(data.email);
    setUserId(data.userId);
  }, [router]);

  // Countdown timer for resend button
  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== OTP_LENGTH) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await apiVerifyEmail({ userId, otp: code });
      if (res.accessToken && res.user) {
        setAccessToken(res.accessToken);
        saveSessionUser(res.user);
      }
      saveRegisterData({ emailVerified: true });
      router.push("/register/identity-verification");
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.message ?? "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (timer > 0 || resending) return;
    setResending(true);
    setError("");
    setInfo("");

    try {
      await apiResendOtp({ userId });
      setTimer(RESEND_SECONDS);
      setOtp(Array(OTP_LENGTH).fill(""));
      setInfo("A new OTP has been sent to your email.");
    } catch (err) {
      const apiErr = err as ApiError;
      if (apiErr.retryAfter) {
        setTimer(apiErr.retryAfter);
        setError(`Please wait ${apiErr.retryAfter}s before requesting a new OTP.`);
      } else {
        setError(apiErr.message ?? "Failed to resend OTP.");
      }
    } finally {
      setResending(false);
    }
  }

  const masked = email ? maskEmail(email) : "";

  return (
    <RegisterShell
      step={2}
      title="Verify Email"
      subtitle={
        masked
          ? `Enter the OTP sent to ${masked}`
          : "Enter the 6-digit OTP sent to your email."
      }
    >
      <div className="reg-email-badge">
        <Mail size={18} />
        <span>{masked || "your email"}</span>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <OtpInput
          value={otp}
          onChange={(v) => {
            setOtp(v);
            setError("");
          }}
          disabled={loading}
          idPrefix="reg-otp"
        />

        {error && <p className="reg-error reg-error--center">{error}</p>}
        {info && !error && (
          <p className="reg-error reg-error--center" style={{ color: "#16a34a" }}>
            {info}
          </p>
        )}

        <div className="reg-resend">
          {timer > 0 ? (
            <span>
              Resend OTP in <strong>{timer}s</strong>
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
            >
              {resending ? "Resending…" : "Resend OTP"}
            </button>
          )}
        </div>

        <button
          type="submit"
          className="reg-btn reg-btn--primary"
          disabled={loading || otp.join("").length !== OTP_LENGTH}
          aria-busy={loading}
        >
          {loading ? (
            <>
              <span className="reg-btn__spinner" aria-hidden="true" />
              Verifying…
            </>
          ) : (
            "VERIFY EMAIL"
          )}
        </button>
      </form>
    </RegisterShell>
  );
}
