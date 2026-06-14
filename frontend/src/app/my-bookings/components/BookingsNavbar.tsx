"use client";

import { useEffect, useState } from "react";
import { Ticket, Bell, Train, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { loadSessionUser, clearSessionUser } from "@/lib/auth-store";
import { apiLogout, type AuthUser } from "@/lib/api";

const UNREAD_COUNT = 2; // static badge count shown on bell

function AshokaEmblem() {
  return (
    <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <circle cx="16" cy="16" r="15" fill="#1E3A5F" />
      <circle cx="16" cy="16" r="11" stroke="#C9A227" strokeWidth="1.2" fill="none" />
      <circle cx="16" cy="16" r="2.5" fill="#C9A227" />
      <line x1="19" y1="16" x2="26" y2="16" stroke="#C9A227" strokeWidth="0.8" />
      <line x1="18.9" y1="16.8" x2="25.7" y2="18.6" stroke="#C9A227" strokeWidth="0.8" />
      <line x1="18.6" y1="17.6" x2="25.2" y2="21.2" stroke="#C9A227" strokeWidth="0.8" />
      <line x1="18.1" y1="18.3" x2="24.4" y2="23.6" stroke="#C9A227" strokeWidth="0.8" />
      <line x1="17.4" y1="18.9" x2="23.4" y2="25.4" stroke="#C9A227" strokeWidth="0.8" />
      <line x1="16.8" y1="19.4" x2="22.1" y2="26.9" stroke="#C9A227" strokeWidth="0.8" />
      <line x1="16" y1="19.8" x2="20.6" y2="28.1" stroke="#C9A227" strokeWidth="0.8" />
      <line x1="15.2" y1="19.9" x2="19.1" y2="28.9" stroke="#C9A227" strokeWidth="0.8" />
      <line x1="14.4" y1="19.8" x2="17.6" y2="29.2" stroke="#C9A227" strokeWidth="0.8" />
      <line x1="13.7" y1="19.4" x2="16.3" y2="29.1" stroke="#C9A227" strokeWidth="0.8" />
      <line x1="13.1" y1="18.9" x2="15.2" y2="28.6" stroke="#C9A227" strokeWidth="0.8" />
      <line x1="12.6" y1="18.3" x2="14.4" y2="27.6" stroke="#C9A227" strokeWidth="0.8" />
      <line x1="12.3" y1="17.6" x2="13.9" y2="26.2" stroke="#C9A227" strokeWidth="0.8" />
      <line x1="12.1" y1="16.8" x2="13.7" y2="25" stroke="#C9A227" strokeWidth="0.8" />
      <line x1="12" y1="16" x2="13.4" y2="23.4" stroke="#C9A227" strokeWidth="0.8" />
      <line x1="12.1" y1="15.2" x2="13.7" y2="22" stroke="#C9A227" strokeWidth="0.8" />
      <line x1="12.3" y1="14.4" x2="14.4" y2="20.6" stroke="#C9A227" strokeWidth="0.8" />
      <line x1="12.6" y1="13.7" x2="15.2" y2="19.4" stroke="#C9A227" strokeWidth="0.8" />
      <line x1="13.1" y1="13.1" x2="16.3" y2="18.5" stroke="#C9A227" strokeWidth="0.8" />
      <line x1="13.7" y1="12.6" x2="17.6" y2="17.8" stroke="#C9A227" strokeWidth="0.8" />
      <line x1="14.4" y1="12.3" x2="19.1" y2="17.3" stroke="#C9A227" strokeWidth="0.8" />
      <line x1="15.2" y1="12.1" x2="20.6" y2="17" stroke="#C9A227" strokeWidth="0.8" />
      <line x1="16" y1="12" x2="22.1" y2="16.9" stroke="#C9A227" strokeWidth="0.8" />
      <line x1="16.8" y1="12.1" x2="23.4" y2="16.8" stroke="#C9A227" strokeWidth="0.8" />
      <line x1="17.6" y1="12.3" x2="24.4" y2="16.6" stroke="#C9A227" strokeWidth="0.8" />
      <line x1="18.3" y1="12.6" x2="25.2" y2="16.2" stroke="#C9A227" strokeWidth="0.8" />
      <line x1="18.9" y1="13.1" x2="25.7" y2="15.6" stroke="#C9A227" strokeWidth="0.8" />
    </svg>
  );
}

export default function BookingsNavbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(loadSessionUser());
  }, []);

  async function handleLogout() {
    try {
      await apiLogout();
    } catch {
      // ignore
    }
    clearSessionUser();
    window.location.href = "/";
  }

  const initial = user?.fullName
    ? user.fullName.charAt(0).toUpperCase()
    : user?.username
      ? user.username.charAt(0).toUpperCase()
      : "U";

  const navLinks = user
    ? [
      { label: "Browse tickets", href: "/passenger" },
      { label: "My Bookings", href: "/my-bookings" },
      { label: "Contact Us", href: "/contact" },
    ]
    : [
      { label: "Features", href: "/#features" },
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Browse tickets", href: "/passenger" },
      { label: "Contact Us", href: "/contact" },
    ];

  return (
    <nav
      className="w-full sticky top-0 z-50 transition-all duration-200"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        height: "70px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.02), 0 1px 0 rgba(226, 232, 240, 0.8)",
        borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div
        className="w-full mx-auto h-full flex items-center justify-between"
        style={{ maxWidth: "1240px", paddingLeft: "24px", paddingRight: "24px" }}
      >
        {/* ── Left Side: Logo & Official Initiative ── */}
        <div className="flex-1 flex items-center justify-start gap-6">
          <Link
            href="/"
            className="flex items-center gap-3 flex-shrink-0 focus:outline-none rounded text-decoration-none hover:opacity-90 transition-opacity"
            aria-label="YatraSetu home"
          >
            <div
              className="hover:scale-105 transition-transform duration-200"
              style={{
                width: "40px",
                height: "40px",
                background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
              }}
            >
              <Train size={20} color="white" strokeWidth={2.2} />
            </div>
            <div style={{ lineHeight: 1.2 }}>
              <span
                style={{
                  color: "#0F172A",
                  fontSize: "19px",
                  fontWeight: 800,
                  letterSpacing: "-0.6px",
                }}
              >
                Yatra<span style={{ color: "#2563EB" }}>Setu</span>
              </span>
              <div style={{ fontSize: "10px", color: "#94A3B8", fontWeight: 500, marginTop: "2px" }}>
                Your bridge to every journey.
              </div>
            </div>
          </Link>

          {/* Government Initiative Badge (Hidden on mobile) */}
          <div
            className="hidden lg:flex items-center gap-2.5"
            style={{
              paddingLeft: "20px",
              borderLeft: "1px solid rgba(226, 232, 240, 0.8)",
            }}
          >
            <AshokaEmblem />
            <div style={{ lineHeight: 1.25 }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#0F172A", letterSpacing: "-0.1px" }}>
                Government of India
              </div>
              <div style={{ fontSize: "9.5px", color: "#64748B", fontWeight: 500 }}>
                Official Railway Initiative
              </div>
            </div>
          </div>
        </div>

        {/* ── Center: Menu Links ── */}
        <div className="hidden md:flex items-center justify-center gap-2" role="menubar">
          {navLinks.map(({ label, href }) => {
            const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={label}
                href={href}
                role="menuitem"
                className={`px-4 py-2 rounded-xl text-[14px] font-semibold transition-all duration-200 focus:outline-none text-decoration-none ${isActive
                    ? "text-blue-600 bg-blue-50/70"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* ── Right Actions ── */}
        <div className="flex-1 flex items-center justify-end gap-3.5">
          {user ? (
            <>
              {/* Notification bell */}
              <div className="relative">
                <Link
                  href="/notifications"
                  className="flex items-center justify-center rounded-xl transition-all duration-200 hover:bg-slate-50 hover:text-slate-900 focus:outline-none"
                  style={{ width: "40px", height: "40px", color: "#475569" }}
                  aria-label={`Notifications — ${UNREAD_COUNT} unread`}
                >
                  <Bell size={20} className="hover:rotate-12 transition-transform duration-200" />
                  {UNREAD_COUNT > 0 && (
                    <span
                      aria-hidden="true"
                      className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white"
                    />
                  )}
                </Link>
              </div>

              {/* Avatar linking to /profile */}
              <Link
                href="/profile"
                className="flex items-center justify-center rounded-xl flex-shrink-0 focus:outline-none hover:scale-105 transition-transform duration-200"
                style={{
                  width: "38px",
                  height: "38px",
                  background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: 700,
                  textDecoration: "none",
                  boxShadow: "0 4px 10px rgba(37,99,235,0.2)",
                }}
                aria-label="User profile"
              >
                {initial}
              </Link>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs font-bold bg-slate-50 hover:bg-red-50 hover:text-red-600 border border-slate-200/80 hover:border-red-200 transition-all duration-200"
                style={{
                  borderRadius: "10px",
                  padding: "8px 14px",
                  color: "#475569",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                <LogOut size={13} />
                LOGOUT
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="transition-colors hover:text-blue-600 font-semibold"
                style={{
                  fontSize: "14px",
                  color: "#475569",
                  textDecoration: "none",
                  padding: "8px 16px",
                }}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="hover:shadow-md hover:scale-[1.02] transition-all duration-200 font-semibold"
                style={{
                  fontSize: "14px",
                  color: "#ffffff",
                  background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                  borderRadius: "10px",
                  padding: "10px 20px",
                  textDecoration: "none",
                  boxShadow: "0 4px 12px rgba(37,99,235,0.2)",
                }}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
