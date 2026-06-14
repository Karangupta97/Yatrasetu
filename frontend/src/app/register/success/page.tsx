"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import AuthShell from "@/components/shared/AuthShell";
import SuccessCheckmark from "@/components/shared/SuccessCheckmark";
import {
  loadRegistrationSuccess,
  clearRegistrationSuccess,
  type RegistrationSuccess,
} from "@/lib/auth-utils";
import { clearRegisterData } from "@/lib/register-store";
import "@/app/auth/auth.css";

export default function RegistrationSuccessPage() {
  const router = useRouter();
  const [data, setData] = useState<RegistrationSuccess | null>(null);

  useEffect(() => {
    const success = loadRegistrationSuccess();
    if (!success) {
      router.replace("/register");
      return;
    }
    clearRegisterData();
    setData(success);
  }, [router]);

  if (!data) return null;

  return (
    <AuthShell
      title="Registration Successful"
      subtitle="Welcome to YatraSetu"
    >
      <div className="success-page success-page--premium reg-enter">
        <div className="success-page__hero">
          <SuccessCheckmark size={112} />
        </div>

        <h2 className="success-page__title">Registration Successful</h2>
        <p className="success-page__subtitle">
          Your account has been created and verified successfully.
        </p>

        <div className="reg-success-username-card">
          <span className="reg-success-username-card__label">Your Username</span>
          <span className="reg-success-username-card__value">{data.username}</span>
        </div>

        <div className="success-page__details success-page__details--premium">
          <div className="reg-review-row">
            <span className="reg-review-row__label">Account Status</span>
            <span className="reg-review-row__value reg-status--ok">Active</span>
          </div>
          <div className="success-page__status">
            <CheckCircle2 size={16} /> Email Verified
          </div>
          <div className="success-page__status">
            <CheckCircle2 size={16} /> Aadhaar Verified
          </div>
          <div className="success-page__status">
            <CheckCircle2 size={16} /> KYC Completed
          </div>
        </div>

        <div className="success-page__actions">
          <Link href="/browse-tickets" className="reg-btn reg-btn--primary" style={{ textDecoration: "none" }}>
            BROWSE TICKETS
          </Link>
          <Link
            href="/login"
            className="reg-btn reg-btn--secondary"
            style={{ textDecoration: "none" }}
            onClick={() => clearRegistrationSuccess()}
          >
            LOGIN NOW
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}
