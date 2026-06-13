"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import WelcomeModal from "@/components/shared/WelcomeModal";
import { consumePendingWelcome } from "@/lib/auth-utils";
import "@/app/auth/auth.css";

export default function LoginCard() {
  const router = useRouter();
  const [showPwd,  setShowPwd]  = useState(false);
  const [remember, setRemember] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [welcomeUser, setWelcomeUser] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);

    const pending = consumePendingWelcome();
    if (pending) {
      setWelcomeUser(pending);
    } else {
      router.push("/dashboard");
    }
  }

  function focus(e: React.FocusEvent<HTMLInputElement>) {
    e.currentTarget.style.borderColor = "#2563EB";
    e.currentTarget.style.background  = "#FFFFFF";
    e.currentTarget.style.boxShadow   = "0 0 0 4px rgba(37,99,235,0.12)";
  }
  function blur(e: React.FocusEvent<HTMLInputElement>) {
    e.currentTarget.style.borderColor = "#E2E8F0";
    e.currentTarget.style.background  = "rgba(255,255,255,0.9)";
    e.currentTarget.style.boxShadow   = "none";
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
          margin-bottom: 24px;
          font-family: inherit;
        }
        @media (min-width: 640px) {
          .login-submit { height: 56px; border-radius: 16px; margin-bottom: 28px; }
        }
        @media (min-width: 1024px) {
          .login-submit { height: 60px; }
        }
      `}</style>

      <div className="login-card">
        <div className="login-card__header">
          <h1 className="login-card__title">Welcome Back</h1>
          <p className="login-card__subtitle">Sign in to continue your journey.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
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
                onChange={(e) => setUsername(e.target.value)}
                required
                onFocus={focus}
                onBlur={blur}
                className="login-input"
                style={{ paddingLeft: "48px", paddingRight: "16px" }}
              />
            </div>
          </div>

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
                onChange={(e) => setPassword(e.target.value)}
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

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              marginBottom: "24px",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              role="checkbox"
              aria-checked={remember}
              onClick={() => setRemember((v) => !v)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "9px",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                fontSize: "14px",
                fontWeight: 500,
                color: "#475569",
                fontFamily: "inherit",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "6px",
                  border: `2px solid ${remember ? "#2563EB" : "#CBD5E1"}`,
                  background: remember ? "#2563EB" : "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.2s ease",
                }}
              >
                {remember && (
                  <svg width="11" height="9" viewBox="0 0 10 8" fill="none">
                    <path
                      d="M1 4L3.5 6.5L9 1"
                      stroke="white"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              Remember Me
            </button>

            <Link href="/forgot-password" className="ys-link" style={{ fontSize: "14px", fontWeight: 500, color: "#2563EB", textDecoration: "none" }}>
              Forgot Password?
            </Link>
          </div>

          <p style={{ textAlign: "center", fontSize: "13px", marginBottom: "20px" }}>
            <Link href="/forgot-username" className="ys-link" style={{ color: "#2563EB", fontWeight: 500, textDecoration: "none" }}>
              Forgot Username?
            </Link>
          </p>

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="ys-btn login-submit"
            style={{
              background: loading ? "#64748B" : "linear-gradient(135deg, #1E40AF 0%, #2563EB 100%)",
              color: "#FFFFFF",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 16px 32px rgba(37,99,235,0.28)",
            }}
          >
            {loading ? (
              <>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="ys-spin" aria-hidden="true">
                  <circle cx="9" cy="9" r="7" stroke="white" strokeWidth="2" strokeOpacity="0.3" />
                  <path d="M9 2a7 7 0 0 1 7 7" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Signing in…
              </>
            ) : (
              "LOGIN"
            )}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "22px" }}>
            <div style={{ flex: 1, height: "1px", background: "#E2E8F0" }} />
            <span style={{ fontSize: "13px", color: "#CBD5E1" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "#E2E8F0" }} />
          </div>

          <p style={{ textAlign: "center", fontSize: "14px", color: "#94A3B8", margin: 0 }}>
            New to YatraSetu?{" "}
            <Link href="/register" className="ys-link" style={{ color: "#2563EB", fontWeight: 600, textDecoration: "none" }}>
              Create Account
            </Link>
          </p>
        </form>
      </div>

      {welcomeUser && (
        <WelcomeModal
          username={welcomeUser}
          onContinue={() => router.push("/dashboard")}
        />
      )}
    </>
  );
}
