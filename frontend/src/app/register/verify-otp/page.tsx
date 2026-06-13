"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import RegisterShell from "@/components/register/RegisterShell";
import OtpInput, { OTP_LENGTH } from "@/components/shared/OtpInput";
import { loadRegisterData, saveRegisterData, maskEmail } from "@/lib/register-store";
import { simulateDelay } from "@/lib/auth-utils";

const RESEND_SECONDS = 30;

export default function VerifyOtpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(RESEND_SECONDS);

  useEffect(() => {
    const data = loadRegisterData();
    if (!data.email) {
      router.replace("/register");
      return;
    }
    setEmail(data.email);
  }, [router]);

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
    await simulateDelay(1000);
    saveRegisterData({ emailVerified: true });
    router.push("/register/identity-verification");
  }

  function handleResend() {
    if (timer > 0) return;
    setTimer(RESEND_SECONDS);
    setOtp(Array(OTP_LENGTH).fill(""));
    setError("");
  }

  const masked = email ? maskEmail(email) : "";

  return (
    <RegisterShell
      step={2}
      title="Verify Email"
      subtitle={masked ? `Enter the OTP sent to ${masked}` : "Enter the 6-digit OTP sent to your email."}
    >
      <div className="reg-email-badge">
        <Mail size={18} />
        <span>{masked || "your email"}</span>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <OtpInput value={otp} onChange={setOtp} disabled={loading} idPrefix="reg-otp" />

        {error && <p className="reg-error reg-error--center">{error}</p>}

        <div className="reg-resend">
          {timer > 0 ? (
            <span>Resend OTP in <strong>{timer}s</strong></span>
          ) : (
            <button type="button" onClick={handleResend}>Resend OTP</button>
          )}
        </div>

        <button
          type="submit"
          className="reg-btn reg-btn--primary"
          disabled={loading || otp.join("").length !== OTP_LENGTH}
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
