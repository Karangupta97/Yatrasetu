"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import WelcomeModal from "@/components/shared/WelcomeModal";
import { consumePendingWelcome } from "@/lib/auth-utils";
import { apiLogin, setAccessToken, type ApiError } from "@/lib/api";
import { saveSessionUser, consumeReturnTo } from "@/lib/auth-store";
import { saveRegisterData } from "@/lib/register-store";
import "@/app/auth/auth.css";

export default function LoginCard() {
  const router = useRouter();
  const [showPwd, setShowPwd] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unverifiedUserId, setUnverifiedUserId] = useState<string | null>(null);
  const [welcomeUser, setWelcomeUser] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Username and password are required.");
      return;
    }

    setLoading(true);
    setError("");
    setUnverifiedUserId(null);

    try {
      const res = await apiLogin({ username: username.trim(), password });

      // Store access token in memory (never localStorage/sessionStorage)
      setAccessToken(res.accessToken);

      // Persist non-sensitive user metadata for UI re-hydration
      saveSessionUser(res.user);

      // Check for pending welcome modal (post-registration first login)
      const pending = consumePendingWelcome();
      if (pending) {
        setWelcomeUser(pending);
      } else {
        router.push(consumeReturnTo());
      }
    } catch (err) {
      const apiErr = err as ApiError & { _httpStatus?: number };

      // 403 = email not verified — offer to complete verification
      if (apiErr._httpStatus === 403 && apiErr.userId) {
        setUnverifiedUserId(apiErr.userId);
        setError(
          "Your email is not verified yet. Click below to complete verification."
        );
      } else {
        setError(apiErr.message ?? "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleResendVerification() {
    if (!unverifiedUserId) return;
    // Re-enter OTP flow with the existing userId
    saveRegisterData({ userId: unverifiedUserId });
    router.push("/register/verify-otp");
  }

  function focus(e: React.FocusEvent<HTMLInputElement>) {
    e.currentTarget.style.borderColor = "#2563EB";
    e.currentTarget.style.background = "#FFFFFF";
    e.currentTarget.style.boxShadow = "0 0 0 4px rgba(37,99,235,0.12)";
  }
  function blur(e: React.FocusEvent<HTMLInputElement>) {
    e.currentTarget.style.borderColor = "#E2E8F0";
    e.currentTarget.style.background = "rgba(255,255,255,0.9)";
    e.currentTarget.style.boxShadow = "none";
  }

  return (
    <>
      <style>{`
        @keyframes ys-spin { to { transform: rotate(360deg); } }
        .ys-spin { animation: ys-spin 0.75s linear infinite; }
        .ys-btn {
          transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
          cursor: pointer;
        }
        .ys-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 20px 40px rgba(37,99,235,0.32) !important;
          filter: brightness(1.04);
        }
        .ys-btn:active:not(:disabled) { transform: translateY(0); }
        .ys-link { transition: color 0.15s ease; }
        .ys-link:hover { color: #1D4ED8; text-decoration: underline; }

        .login-field { margin-bottom: 18px; }
        @media (min-width: 1024px) { .login-field { margin-bottom: 20px; } }

        .login-input {
          width: 100%;
          height: 52px;
          background: rgba(255,255,255,0.9);
          border: 1.5px solid #E2E8F0;
          border-radius: 14px;
          font-size: 15px;
          font-family: inherit;
          color: #0F172A;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }
        @media (min-width: 640px) {
          .login-input { height: 56px; border-radius: 16px; }
        }
        @media (min-width: 1024px) {
          .login-input { height: 60px; }
        }

        .login-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          margin-bottom: 8px;
        }
        @media (min-width: 640px) { .login-label { font-size: 14px; } }

        .login-submit {
          width: 100%;
          height: 52px;
          border: none;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.08em;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 16px;
          font-family: inherit;
        }
        @media (min-width: 640px) {
          .login-submit { height: 56px; border-radius: 16px; margin-bottom: 20px; }
        }
        @media (min-width: 1024px) {
          .login-submit { height: 60px; }
        }

        .login-error {
          font-size: 13px;
          color: #DC2626;
          background: #FEF2F2;
          border: 1px solid #FECACA;
          border-radius: 10px;
          padding: 10px 14px;
          margin-bottom: 16px;
          line-height: 1.5;
        }

        .login-verify-btn {
          display: block;
          width: 100%;
          padding: 10px;
          background: none;
          border: 1.5px solid #2563EB;
          border-radius: 10px;
          color: #2563EB;
          font-size: 13px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          margin-top: 8px;
          margin-bottom: 16px;
          transition: background 0.15s ease;
        }
        .login-verify-btn:hover { background: #EFF6FF; }
      `}</style>

      <div className="login-card">
        <div className="login-card__header">
          <h1 className="login-card__title">Welcome Back</h1>
          <p className="login-card__subtitle">Sign in to continue your journey.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div className="login-field">
            <label htmlFor="ys-u" className="login-label">Username</label>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94A3B8",
                  display: "flex",
                  pointerEvents: "none",
                }}
              >
                <User size={18} strokeWidth={1.75} />
              </span>
              <input
                id="ys-u"
                type="text"
                autoComplete="username"
                placeholder="Enter username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                  setUnverifiedUserId(null);
                }}
                required
                onFocus={focus}
                onBlur={blur}
                className="login-input"
                style={{ paddingLeft: "48px", paddingRight: "16px" }}
              />
            </div>
          </div>

          {/* Password */}
          <div className="login-field">
            <label htmlFor="ys-p" className="login-label">Password</label>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94A3B8",
                  display: "flex",
                  pointerEvents: "none",
                }}
              >
                <Lock size={18} strokeWidth={1.75} />
              </span>
              <input
                id="ys-p"
                type={showPwd ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                required
                onFocus={focus}
                onBlur={blur}
                className="login-input"
                style={{ paddingLeft: "48px", paddingRight: "48px" }}
              />
              <button
                type="button"
                aria-label={showPwd ? "Hide password" : "Show password"}
                onClick={() => setShowPwd((v) => !v)}
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94A3B8",
                  display: "flex",
                  padding: "4px",
                }}
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Forgot links */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              marginBottom: "20px",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/forgot-username"
              className="ys-link"
              style={{ fontSize: "13px", fontWeight: 500, color: "#2563EB", textDecoration: "none" }}
            >
              Forgot Username?
            </Link>
            <Link
              href="/forgot-password"
              className="ys-link"
              style={{ fontSize: "13px", fontWeight: 500, color: "#2563EB", textDecoration: "none" }}
            >
              Forgot Password?
            </Link>
          </div>

          {/* Error banner */}
          {error && (
            <div className="login-error" role="alert">
              {error}
              {unverifiedUserId && (
                <button
                  type="button"
                  className="login-verify-btn"
                  onClick={handleResendVerification}
                >
                  Complete Email Verification →
                </button>
              )}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="ys-btn login-submit"
            style={{
              background: loading
                ? "#64748B"
                : "linear-gradient(135deg, #1E40AF 0%, #2563EB 100%)",
              color: "#FFFFFF",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 16px 32px rgba(37,99,235,0.28)",
            }}
          >
            {loading ? (
              <>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  className="ys-spin"
                  aria-hidden="true"
                >
                  <circle cx="9" cy="9" r="7" stroke="white" strokeWidth="2" strokeOpacity="0.3" />
                  <path d="M9 2a7 7 0 0 1 7 7" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Signing in…
              </>
            ) : (
              "LOGIN"
            )}
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "22px",
            }}
          >
            <div style={{ flex: 1, height: "1px", background: "#E2E8F0" }} />
            <span style={{ fontSize: "13px", color: "#CBD5E1" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "#E2E8F0" }} />
          </div>

          <p
            style={{ textAlign: "center", fontSize: "14px", color: "#94A3B8", margin: 0 }}
          >
            New to YatraSetu?{" "}
            <Link
              href="/register"
              className="ys-link"
              style={{ color: "#2563EB", fontWeight: 600, textDecoration: "none" }}
            >
              Create Account
            </Link>
          </p>
        </form>
      </div>

      {welcomeUser && (
        <WelcomeModal
          username={welcomeUser}
          onContinue={() => router.push(consumeReturnTo())}
        />
      )}
    </>
  );
}
