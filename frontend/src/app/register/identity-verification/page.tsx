"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import RegisterShell from "@/components/register/RegisterShell";
import OtpModal from "@/components/shared/OtpModal";
import { formatAadhaar } from "@/lib/auth-utils";
import { onInputFocus, onInputBlur } from "@/components/register/form-utils";
import { loadRegisterData, saveRegisterData } from "@/lib/register-store";
import { apiGenerateAadhaarOtp, apiVerifyAadhaarOtp, type ApiError } from "@/lib/api";
import { loadSessionUser, saveSessionUser } from "@/lib/auth-store";

export default function IdentityVerificationPage() {
  const router = useRouter();
  const [aadhaar, setAadhaar] = useState("");
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [aadhaarSending, setAadhaarSending] = useState(false);
  const [continueLoading, setContinueLoading] = useState(false);
  const [error, setError] = useState("");
  const [mobile, setMobile] = useState("");

  useEffect(() => {
    const data = loadRegisterData();
    if (!data.emailVerified) {
      router.replace("/register");
      return;
    }
    setAadhaar(formatAadhaar(data.aadhaar));
    setAadhaarVerified(data.aadhaarVerified);
    setMobile(data.mobile);
  }, [router]);

  async function sendAadhaarOtp() {
    const digits = aadhaar.replace(/\s/g, "");
    if (digits.length !== 12) {
      setError("Enter a valid 12-digit Aadhaar number.");
      return;
    }
    setError("");
    setAadhaarSending(true);
    try {
      await apiGenerateAadhaarOtp({ aadhaarNumber: digits, consent: "y" });
      setOtpModalOpen(true);
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.message ?? "Failed to send Aadhaar OTP. Please try again.");
      throw err;
    } finally {
      setAadhaarSending(false);
    }
  }

  async function handleAadhaarOtpVerified(otpCode: string) {
    const digits = aadhaar.replace(/\s/g, "");
    try {
      await apiVerifyAadhaarOtp({ otp: otpCode, aadhaarNumber: digits });
      setAadhaarVerified(true);
      saveRegisterData({ aadhaar: digits, aadhaarVerified: true });

      const sessionUser = loadSessionUser();
      if (sessionUser) {
        sessionUser.isAadhaarVerified = true;
        saveSessionUser(sessionUser);
      }
      setOtpModalOpen(false);
    } catch (err) {
      const apiErr = err as ApiError;
      throw new Error(apiErr.message ?? "Incorrect OTP. Please try again.");
    }
  }

  async function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    if (!aadhaarVerified) {
      setError("Please verify your Aadhaar to continue.");
      return;
    }
    setContinueLoading(true);
    router.push("/register/review");
  }

  const maskedMobile = mobile
    ? `+91 ${mobile.slice(0, 2)}****${mobile.slice(-4)}`
    : "your Aadhaar-linked mobile";

  return (
    <>
      <RegisterShell
        step={3}
        title="Identity Verification"
        subtitle="Verify your Aadhaar to complete registration."
      >
        <form onSubmit={handleContinue} noValidate>
          <div className="reg-verify-section">
            <h3 className="reg-verify-section__title">Aadhaar Verification</h3>
            <p className="reg-verify-section__desc">
              An OTP will be sent to your Aadhaar-linked mobile number.
            </p>
            <div className="reg-verify-row">
              <div className="reg-field">
                <label htmlFor="aadhaar" className="reg-label">Aadhaar Number</label>
                <input
                  id="aadhaar"
                  type="text"
                  className="reg-input"
                  placeholder="XXXX XXXX XXXX"
                  value={aadhaar}
                  onChange={(e) => {
                    setAadhaar(formatAadhaar(e.target.value));
                    setAadhaarVerified(false);
                    setError("");
                  }}
                  onFocus={onInputFocus}
                  onBlur={onInputBlur}
                  disabled={aadhaarVerified}
                  required
                />
              </div>
              <button
                type="button"
                className="reg-btn reg-btn--secondary reg-btn--sm"
                onClick={sendAadhaarOtp}
                disabled={aadhaarVerified || aadhaarSending}
                style={{ marginBottom: 0, flexShrink: 0 }}
              >
                {aadhaarSending ? "Sending…" : aadhaarVerified ? "Verified" : "Verify Aadhaar"}
              </button>
            </div>
            {aadhaarVerified && (
              <div className="reg-verify-success">
                <CheckCircle2 size={18} />
                Aadhaar Verified
              </div>
            )}
          </div>

          {error && <p className="reg-error">{error}</p>}

          <button
            type="submit"
            className="reg-btn reg-btn--primary"
            disabled={continueLoading || !aadhaarVerified}
          >
            {continueLoading ? (
              <>
                <span className="reg-btn__spinner" aria-hidden="true" />
                Continuing…
              </>
            ) : (
              "CONTINUE"
            )}
          </button>
        </form>
      </RegisterShell>

      <OtpModal
        open={otpModalOpen}
        title="Verify Aadhaar OTP"
        subtitle={`Enter the 6-digit OTP sent to ${maskedMobile}`}
        onClose={() => setOtpModalOpen(false)}
        onVerified={handleAadhaarOtpVerified}
        onResend={sendAadhaarOtp}
      />
    </>
  );
}
