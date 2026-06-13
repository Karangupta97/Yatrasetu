"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Smartphone, Fingerprint, CheckCircle2 } from "lucide-react";
import RegisterShell from "@/components/register/RegisterShell";
import CaptchaField from "@/components/shared/CaptchaField";
import {
  generateUsername,
  saveRegisteredUser,
  saveRegistrationSuccess,
  setPendingWelcome,
  simulateDelay,
} from "@/lib/auth-utils";
import { loadRegisterData, saveRegisterData, maskEmail, type RegisterData } from "@/lib/register-store";

function maskAadhaar(num: string) {
  if (!num || num.length < 4) return "—";
  return `XXXX XXXX ${num.slice(-4)}`;
}

export default function ReviewPage() {
  const router = useRouter();
  const [data, setData] = useState<RegisterData | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaValid, setCaptchaValid] = useState(false);

  useEffect(() => {
    const stored = loadRegisterData();
    if (!stored.emailVerified || !stored.aadhaarVerified) {
      router.replace("/register");
      return;
    }
    setData(stored);
  }, [router]);

  const usernamePreview = data
    ? generateUsername(data.firstName, data.mobile)
    : "";

  const canSubmit =
    confirmed &&
    captchaValid &&
    data?.emailVerified &&
    data?.aadhaarVerified;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!data || !canSubmit) return;

    setLoading(true);
    await simulateDelay(1500);

    const username = generateUsername(data.firstName, data.mobile);
    saveRegisterData({ username });

    saveRegisteredUser(data.aadhaar, {
      username,
      mobile: data.mobile,
      fullName: data.fullName,
    });

    saveRegistrationSuccess({
      username,
      fullName: data.fullName,
      mobile: data.mobile,
      email: data.email,
    });

    setPendingWelcome(username);
    router.push("/register/success");
  }

  if (!data) return null;

  return (
    <RegisterShell
      step={4}
      title="Review & Submit"
      subtitle="Confirm your verification status to complete registration."
    >
      <form onSubmit={handleSubmit} noValidate>
        <p className="reg-review-intro">You&apos;re almost done. Review your verified details below.</p>

        <div className="reg-summary-grid">
          <div className="reg-summary-card">
            <div className="reg-summary-card__icon reg-summary-card__icon--blue">
              <Mail size={18} strokeWidth={1.75} />
            </div>
            <div className="reg-summary-card__content">
              <span className="reg-summary-card__label">Email</span>
              <span className="reg-summary-card__value">{maskEmail(data.email)}</span>
              <span className="reg-summary-card__status">
                <CheckCircle2 size={13} /> Verified
              </span>
            </div>
          </div>

          <div className="reg-summary-card">
            <div className="reg-summary-card__icon reg-summary-card__icon--blue">
              <Smartphone size={18} strokeWidth={1.75} />
            </div>
            <div className="reg-summary-card__content">
              <span className="reg-summary-card__label">Mobile</span>
              <span className="reg-summary-card__value">+91 {data.mobile}</span>
              <span className="reg-summary-card__status">
                <CheckCircle2 size={13} /> Registered
              </span>
            </div>
          </div>

          <div className="reg-summary-card">
            <div className="reg-summary-card__icon reg-summary-card__icon--green">
              <Fingerprint size={18} strokeWidth={1.75} />
            </div>
            <div className="reg-summary-card__content">
              <span className="reg-summary-card__label">Aadhaar</span>
              <span className="reg-summary-card__value">{maskAadhaar(data.aadhaar)}</span>
              <span className="reg-summary-card__status">
                <CheckCircle2 size={13} /> Verified
              </span>
            </div>
          </div>
        </div>

        <div className="reg-username-preview reg-username-preview--premium">
          <span className="reg-username-preview__label">Your Username</span>
          <span className="reg-username-preview__value">{usernamePreview}</span>
        </div>

        <button
          type="button"
          className="reg-confirm"
          onClick={() => setConfirmed((v) => !v)}
        >
          <span className={`reg-confirm__box${confirmed ? " reg-confirm__box--checked" : ""}`}>
            {confirmed && (
              <svg width="11" height="9" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          I confirm all information is correct
        </button>

        <CaptchaField
          value={captchaInput}
          onChange={setCaptchaInput}
          onValidChange={setCaptchaValid}
        />

        <button type="submit" className="reg-btn reg-btn--primary" disabled={loading || !canSubmit}>
          {loading ? (
            <>
              <span className="reg-btn__spinner" aria-hidden="true" />
              Submitting…
            </>
          ) : (
            "SUBMIT REGISTRATION"
          )}
        </button>
      </form>
    </RegisterShell>
  );
}
