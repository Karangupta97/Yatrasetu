"use client";

/**
 * LoginForm — YatraSetu Design System v1.0
 * Matches reference: clean white card, 48px inputs,
 * dark LOGIN button, indigo "Create Account" link.
 */

import { useState } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe,   setRememberMe]   = useState(false);
  const [username,     setUsername]     = useState("");
  const [password,     setPassword]     = useState("");
  const [loading,      setLoading]      = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
  }

  return (
    <>
      <style>{`
        .lf-input {
          width: 100%;
          height: 48px;
          background: #f5f6f8;
          border: 1.5px solid #e8ebed;
          border-radius: 10px;
          font-size: 14px;
          font-family: inherit;
          color: #181d2a;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
        }
        .lf-input::placeholder { color: #b0b7c3; font-size: 13.5px; }
        .lf-input:focus {
          border-color: #748efe;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(116,142,254,0.12);
        }
        .lf-input-user { padding: 0 14px 0 42px; }
        .lf-input-pass { padding: 0 44px 0 42px; }

        .lf-btn {
          width: 100%;
          height: 50px;
          background: #181d2a;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-family: inherit;
          font-weight: 700;
          letter-spacing: 0.12em;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          gap: 8px;
          transition: background 0.15s, box-shadow 0.15s, transform 0.1s;
          box-shadow: 0 4px 16px rgba(24,29,42,0.20);
        }
        .lf-btn:hover:not(:disabled) {
          background: #232b3e;
          box-shadow: 0 6px 22px rgba(24,29,42,0.28);
        }
        .lf-btn:active:not(:disabled) { transform: scale(0.987); }
        .lf-btn:disabled { background: #4b5563; cursor: not-allowed; box-shadow: none; }

        .lf-forgot:hover { text-decoration: underline; }
        .lf-create:hover { text-decoration: underline; }

        @keyframes lf-spin { to { transform: rotate(360deg); } }
        .lf-spinner { animation: lf-spin 0.75s linear infinite; }
      `}</style>

      <div style={{
        background: "#ffffff",
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(24,29,42,0.10), 0 1px 4px rgba(24,29,42,0.06)",
        padding: "32px 28px 28px",
        width: "100%",
        fontFamily: "'Google Sans', 'Inter', sans-serif",
      }}>

        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{
            fontSize: "24px", fontWeight: 700,
            color: "#181d2a", lineHeight: 1.2,
            letterSpacing: "-0.3px", marginBottom: "5px",
          }}>
            Welcome Back
          </h1>
          <p style={{ fontSize: "13.5px", color: "#6b7280", fontWeight: 400, lineHeight: 1.5 }}>
            Sign in to continue your journey.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>

          {/* Username */}
          <div style={{ marginBottom: "14px" }}>
            <label htmlFor="lf-u" style={{
              display: "block", fontSize: "13px", fontWeight: 600,
              color: "#181d2a", marginBottom: "6px",
            }}>
              Username
            </label>
            <div style={{ position: "relative" }}>
              <span aria-hidden="true" style={{
                position: "absolute", left: "13px", top: "50%",
                transform: "translateY(-50%)", color: "#b0b7c3",
                display: "flex", alignItems: "center", pointerEvents: "none",
              }}>
                <User size={16} strokeWidth={1.75} />
              </span>
              <input
                id="lf-u" type="text" autoComplete="username"
                placeholder="Enter username" value={username}
                onChange={(e) => setUsername(e.target.value)}
                required className="lf-input lf-input-user"
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: "14px" }}>
            <label htmlFor="lf-p" style={{
              display: "block", fontSize: "13px", fontWeight: 600,
              color: "#181d2a", marginBottom: "6px",
            }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <span aria-hidden="true" style={{
                position: "absolute", left: "13px", top: "50%",
                transform: "translateY(-50%)", color: "#b0b7c3",
                display: "flex", alignItems: "center", pointerEvents: "none",
              }}>
                <Lock size={16} strokeWidth={1.75} />
              </span>
              <input
                id="lf-p" type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                required className="lf-input lf-input-pass"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  position: "absolute", right: "11px", top: "50%",
                  transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer",
                  color: "#9ca3af", display: "flex", alignItems: "center",
                  padding: "4px", borderRadius: "5px", lineHeight: 1,
                }}
              >
                {showPassword ? <EyeOff size={16} strokeWidth={1.75} /> : <Eye size={16} strokeWidth={1.75} />}
              </button>
            </div>
          </div>

          {/* Remember Me + Forgot */}
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between", marginBottom: "22px",
          }}>
            <button
              type="button" role="checkbox" aria-checked={rememberMe}
              onClick={() => setRememberMe((v) => !v)}
              style={{
                display: "flex", alignItems: "center", gap: "7px",
                background: "none", border: "none", cursor: "pointer",
                padding: 0, fontSize: "13px", color: "#181d2a",
                fontWeight: 500, fontFamily: "inherit",
              }}
            >
              <span style={{
                width: "16px", height: "16px", borderRadius: "4px",
                border: `1.8px solid ${rememberMe ? "#748efe" : "#d1d5db"}`,
                background: rememberMe ? "#748efe" : "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, transition: "all 0.14s",
              }} aria-hidden="true">
                {rememberMe && (
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path d="M1 3.5L3 5.5L8 1" stroke="white" strokeWidth="1.7"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </span>
              Remember Me
            </button>

            <Link href="/forgot-password" className="lf-forgot" style={{
              fontSize: "13px", color: "#748efe", fontWeight: 500, textDecoration: "none",
            }}>
              Forgot Password?
            </Link>
          </div>

          {/* LOGIN */}
          <button type="submit" disabled={loading} aria-busy={loading}
            className="lf-btn" style={{ marginBottom: "18px" }}>
            {loading ? (
              <>
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none"
                  aria-hidden="true" className="lf-spinner">
                  <circle cx="8.5" cy="8.5" r="6.5" stroke="white"
                    strokeWidth="2" strokeOpacity="0.25" />
                  <path d="M8.5 2a6.5 6.5 0 0 1 6.5 6.5"
                    stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Signing in…
              </>
            ) : "LOGIN"}
          </button>

          {/* Divider */}
          <div style={{
            display: "flex", alignItems: "center",
            gap: "12px", marginBottom: "18px",
          }}>
            <div style={{ flex: 1, height: "1px", background: "#e8ebed" }} />
            <span style={{ fontSize: "12px", color: "#b0b7c3" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "#e8ebed" }} />
          </div>

          {/* Create Account */}
          <p style={{ textAlign: "center", fontSize: "13.5px", color: "#6b7280" }}>
            New to YatraSetu?{" "}
            <Link href="/register" className="lf-create"
              style={{ color: "#748efe", fontWeight: 600, textDecoration: "none" }}>
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
