"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Lock, Eye, EyeOff, AtSign } from "lucide-react";
import RegisterShell from "@/components/register/RegisterShell";
import { onInputFocus, onInputBlur } from "@/components/register/form-utils";
import { saveRegisterData } from "@/lib/register-store";
import { apiRegister, type ApiError } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    username: "",
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

  function validateClient(): string | null {
    if (!form.username.trim()) return "Username is required.";
    if (/\s/.test(form.username)) return "Username must not contain spaces.";
    if (form.username.length < 3) return "Username must be at least 3 characters.";
    if (!/^[a-zA-Z0-9_]+$/.test(form.username))
      return "Username may only contain letters, numbers, and underscores.";
    if (!form.fullName.trim()) return "Full name is required.";
    if (!form.email.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "Enter a valid email address.";
    if (!/^\d{10}$/.test(form.mobile.replace(/\s/g, "")))
      return "Enter a valid 10-digit mobile number.";
    if (form.password.length < 8)
      return "Password must be at least 8 characters.";
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(form.password)
    )
      return "Password must include uppercase, lowercase, a number, and a special character.";
    if (form.password !== form.confirmPassword)
      return "Passwords do not match.";
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const clientError = validateClient();
    if (clientError) {
      setError(clientError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await apiRegister({
        username: form.username.trim().toLowerCase(),
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        mobile: form.mobile.replace(/\s/g, ""),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      // Persist userId + form data for the OTP step
      const [firstName, ...rest] = form.fullName.trim().split(" ");
      saveRegisterData({
        userId: res.userId,
        username: form.username.trim().toLowerCase(),
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        mobile: form.mobile.replace(/\s/g, ""),
        password: form.password,
        firstName: firstName || "",
        lastName: rest.join(" ") || "",
        emailVerified: false,
      });

      router.push("/register/verify-otp");
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.message ?? "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <RegisterShell
      step={1}
      title="Create Account"
      subtitle="Set up your YatraSetu profile in a few simple steps."
    >
      <form onSubmit={handleSubmit} noValidate>

        {/* ── Profile Information ─────────────────────────────────── */}
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
              autoComplete="name"
              required
            />
          </div>

          <div className="reg-field">
            <label htmlFor="username" className="reg-label">Username</label>
            <div className="reg-input-wrap">
              <span className="reg-input-icon">
                <AtSign size={16} />
              </span>
              <input
                id="username"
                type="text"
                className="reg-input reg-input--icon"
                placeholder="e.g. rahul_99"
                value={form.username}
                onChange={(e) =>
                  update(
                    "username",
                    e.target.value.replace(/\s/g, "").toLowerCase()
                  )
                }
                onFocus={onInputFocus}
                onBlur={onInputBlur}
                autoComplete="username"
                required
                minLength={3}
                maxLength={30}
              />
            </div>
            <p className="reg-field-hint">
              Letters, numbers, and underscores only. Used to log in.
            </p>
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
              autoComplete="email"
              required
            />
            <p className="reg-field-hint">
              We&apos;ll send a verification OTP to this email.
            </p>
          </div>

          <div className="reg-field">
            <label htmlFor="mobile" className="reg-label">Mobile Number</label>
            <input
              id="mobile"
              type="tel"
              className="reg-input"
              placeholder="10-digit mobile number"
              value={form.mobile}
              onChange={(e) =>
                update("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              onFocus={onInputFocus}
              onBlur={onInputBlur}
              autoComplete="tel"
              required
            />
          </div>
        </div>

        {/* ── Security ─────────────────────────────────────────────── */}
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
                placeholder="Min 8 chars · Upper · Lower · Number · Symbol"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                onFocus={onInputFocus}
                onBlur={onInputBlur}
                autoComplete="new-password"
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
            <label htmlFor="confirmPassword" className="reg-label">
              Confirm Password
            </label>
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
                autoComplete="new-password"
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

        <button
          type="submit"
          className="reg-btn reg-btn--primary"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? (
            <>
              <span className="reg-btn__spinner" aria-hidden="true" />
              Creating Account…
            </>
          ) : (
            "CONTINUE"
          )}
        </button>

        <p className="reg-footer">
          Already have an account?{" "}
          <Link href="/login" className="reg-link">
            Sign In
          </Link>
        </p>
      </form>
    </RegisterShell>
  );
}
