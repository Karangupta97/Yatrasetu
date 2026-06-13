"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import RegisterShell from "@/components/register/RegisterShell";
import { onInputFocus, onInputBlur } from "@/components/register/form-utils";
import { saveRegisterData } from "@/lib/register-store";

export default function RegisterPage() {
  const router = useRouter();
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!/^\d{10}$/.test(form.mobile.replace(/\s/g, ""))) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    const [firstName, ...rest] = form.fullName.trim().split(" ");
    saveRegisterData({
      fullName: form.fullName.trim(),
      email: form.email.trim().toLowerCase(),
      mobile: form.mobile.replace(/\s/g, ""),
      password: form.password,
      firstName: firstName || "",
      lastName: rest.join(" ") || "",
      emailVerified: false,
    });

    router.push("/register/verify-otp");
  }

  return (
    <RegisterShell
      step={1}
      title="Create Account"
      subtitle="Set up your YatraSetu profile in a few simple steps."
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="reg-form-section">
          <p className="reg-form-section__label">
            <User size={14} />
            Profile Information
          </p>

          <div className="reg-field">
            <label htmlFor="fullName" className="reg-label">Full Name</label>
            <input
              id="fullName"
              type="text"
              className="reg-input"
              placeholder="Enter your full name"
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              onFocus={onInputFocus}
              onBlur={onInputBlur}
              required
            />
          </div>

          <div className="reg-field">
            <label htmlFor="email" className="reg-label">Email Address</label>
            <input
              id="email"
              type="email"
              className="reg-input"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              onFocus={onInputFocus}
              onBlur={onInputBlur}
              required
            />
            <p className="reg-field-hint">We&apos;ll send a verification OTP to this email.</p>
          </div>

          <div className="reg-field">
            <label htmlFor="mobile" className="reg-label">Mobile Number</label>
            <input
              id="mobile"
              type="tel"
              className="reg-input"
              placeholder="10-digit mobile number"
              value={form.mobile}
              onChange={(e) => update("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))}
              onFocus={onInputFocus}
              onBlur={onInputBlur}
              required
            />
          </div>
        </div>

        <div className="reg-form-section">
          <p className="reg-form-section__label">
            <Lock size={14} />
            Security
          </p>

          <div className="reg-field">
            <label htmlFor="password" className="reg-label">Password</label>
            <div className="reg-input-wrap">
              <input
                id="password"
                type={showPwd ? "text" : "password"}
                className="reg-input"
                placeholder="Minimum 8 characters"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                onFocus={onInputFocus}
                onBlur={onInputBlur}
                required
                minLength={8}
              />
              <button
                type="button"
                className="reg-input-toggle"
                aria-label={showPwd ? "Hide password" : "Show password"}
                onClick={() => setShowPwd((v) => !v)}
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="reg-field">
            <label htmlFor="confirmPassword" className="reg-label">Confirm Password</label>
            <div className="reg-input-wrap">
              <input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                className="reg-input"
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={(e) => update("confirmPassword", e.target.value)}
                onFocus={onInputFocus}
                onBlur={onInputBlur}
                required
              />
              <button
                type="button"
                className="reg-input-toggle"
                aria-label={showConfirm ? "Hide password" : "Show password"}
                onClick={() => setShowConfirm((v) => !v)}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        {error && <p className="reg-error">{error}</p>}

        <button type="submit" className="reg-btn reg-btn--primary" disabled={loading}>
          {loading ? (
            <>
              <span className="reg-btn__spinner" aria-hidden="true" />
              Continuing…
            </>
          ) : (
            "CONTINUE"
          )}
        </button>

        <p className="reg-footer">
          Already have an account?{" "}
          <Link href="/login" className="reg-link">Sign In</Link>
        </p>
      </form>
    </RegisterShell>
  );
}
