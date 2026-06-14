"use client";

import { useEffect, useState } from "react";
import { Bell, Train, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { loadSessionUser, clearSessionUser } from "@/lib/auth-store";
import { apiLogout, type AuthUser } from "@/lib/api";
import { getAvatarGradient } from "@/hooks/useUserProfile";

const UNREAD_COUNT = 2;

/* ── Ashoka Emblem ── */
function AshokaEmblem() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
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

/* ── Fixed nav links — always the same regardless of auth state ── */
const NAV_LINKS = [
  { label: "Browse Tickets", href: "/passenger" },
  { label: "My Bookings",    href: "/my-bookings" },
  { label: "Contact Us",     href: "/contact" },
];

export default function BookingsNavbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setUser(loadSessionUser());
  }, []);

  async function handleLogout() {
    try { await apiLogout(); } catch { /* ignore */ }
    clearSessionUser();
    window.location.href = "/";
  }

  /** Two-letter initials: first letter of first name + first letter of last name */
  const initials = (() => {
    if (user?.fullName) {
      const parts = user.fullName.trim().split(/\s+/);
      if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      return parts[0][0].toUpperCase();
    }
    if (user?.username) return user.username[0].toUpperCase();
    return "U";
  })();

  const avatarGradient = getAvatarGradient(user?.username ?? null);
  const tooltipName = user?.fullName || user?.username || "My Profile";

  return (
    <>
      <nav
        role="navigation"
        aria-label="Main navigation"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          width: "100%",
          height: "68px",
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #F3F4F6",
          boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 32px",
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* ── LEFT: Logo + Gov badge ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "0", flexShrink: 0 }}>
            {/* Logo */}
            <Link
              href="/"
              aria-label="YatraSetu home"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                textDecoration: "none",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  background: "linear-gradient(135deg, #6366F1 0%, #4338CA 100%)",
                  borderRadius: "11px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(99,102,241,0.28)",
                  flexShrink: 0,
                  transition: "transform 0.18s ease, box-shadow 0.18s ease",
                }}
                className="logo-icon"
              >
                <Train size={20} color="white" strokeWidth={2.2} />
              </div>
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "#111827", letterSpacing: "-0.5px" }}>
                  Yatra<span style={{ color: "#6366F1" }}>Setu</span>
                </div>
                <div style={{ fontSize: "10px", color: "#9CA3AF", fontWeight: 500, marginTop: "1px" }}>
                  Your bridge to every journey.
                </div>
              </div>
            </Link>

            {/* Divider + Gov badge — hidden on small screens */}
            <div className="gov-badge" style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "20px", paddingLeft: "20px", borderLeft: "1px solid #E5E7EB" }}>
              <AshokaEmblem />
              <div style={{ lineHeight: 1.3 }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#111827" }}>
                  Government of India
                </div>
                <div style={{ fontSize: "11px", color: "#6B7280", fontWeight: 400 }}>
                  Official Railway Initiative
                </div>
              </div>
            </div>
          </div>

          {/* ── CENTER: Nav links ── */}
          <div
            className="nav-links-center"
            role="menubar"
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "36px",
              height: "100%",
            }}
          >
            {NAV_LINKS.map(({ label, href }) => {
              const isActive =
                pathname === href ||
                (href !== "/" && href !== "/my-bookings" && pathname.startsWith(href)) ||
                (href === "/my-bookings" && pathname.startsWith("/my-bookings"));
              return (
                <Link
                  key={label}
                  href={href}
                  role="menuitem"
                  aria-current={isActive ? "page" : undefined}
                  className={`nav-center-link${isActive ? " nav-center-link--active" : ""}`}
                  style={{
                    fontSize: "15px",
                    fontWeight: 500,
                    textDecoration: "none",
                    color: isActive ? "#6366F1" : "#374151",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    paddingBottom: "2px",
                    transition: "color 0.18s ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                  {/* Active underline */}
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "2px",
                      background: "#6366F1",
                      borderRadius: "999px 999px 0 0",
                      transform: isActive ? "scaleX(1)" : "scaleX(0)",
                      transformOrigin: "center",
                      transition: "transform 0.22s cubic-bezier(0.34,1.56,0.64,1)",
                    }}
                  />
                </Link>
              );
            })}
          </div>

          {/* ── RIGHT: Auth actions ── */}
          <div className="nav-right-actions" style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
            {user ? (
              <>
                {/* Notification bell */}
                <Link
                  href="/notifications"
                  aria-label={`Notifications — ${UNREAD_COUNT} unread`}
                  style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: "38px", height: "38px", borderRadius: "10px", color: "#6B7280", textDecoration: "none", transition: "background 0.18s, color 0.18s" }}
                  className="icon-btn"
                >
                  <Bell size={19} />
                  {UNREAD_COUNT > 0 && (
                    <span aria-hidden="true" style={{ position: "absolute", top: "8px", right: "8px", width: "8px", height: "8px", borderRadius: "50%", background: "#EF4444", border: "2px solid #fff" }} />
                  )}
                </Link>

                {/* Avatar with tooltip */}
                <div style={{ position: "relative" }} className="avatar-wrapper">
                  <Link
                    href="/profile"
                    aria-label={`My profile — ${tooltipName}`}
                    title={tooltipName}
                    style={{
                      width: "36px", height: "36px",
                      background: avatarGradient,
                      borderRadius: "10px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontSize: "12px", fontWeight: 700,
                      textDecoration: "none",
                      boxShadow: "0 2px 8px rgba(99,102,241,0.25)",
                      transition: "transform 0.18s, box-shadow 0.18s",
                      flexShrink: 0,
                      letterSpacing: "0.02em",
                    }}
                    className="avatar-btn"
                  >
                    {initials}
                  </Link>
                  {/* Hover tooltip */}
                  <div className="avatar-tooltip" aria-hidden="true">
                    {tooltipName}
                  </div>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    fontSize: "12px", fontWeight: 600, color: "#6B7280",
                    background: "#F9FAFB", border: "1px solid #E5E7EB",
                    borderRadius: "8px", padding: "7px 13px",
                    cursor: "pointer", fontFamily: "inherit",
                    transition: "background 0.18s, color 0.18s, border-color 0.18s",
                  }}
                  className="logout-btn"
                >
                  <LogOut size={13} />
                  Sign out
                </button>
              </>
            ) : (
              <>
                {/* Sign In — ghost */}
                <Link
                  href="/login"
                  className="signin-btn"
                  style={{
                    fontSize: "15px",
                    fontWeight: 500,
                    color: "#6366F1",
                    textDecoration: "none",
                    padding: "6px 4px",
                    transition: "color 0.18s ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  Sign In
                </Link>

                {/* Get Started — pill */}
                <Link
                  href="/register"
                  className="getstarted-btn"
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#ffffff",
                    background: "#6366F1",
                    borderRadius: "999px",
                    padding: "10px 24px",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    transition: "background 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",
                    boxShadow: "0 2px 10px rgba(99,102,241,0.22)",
                  }}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* ── Hamburger (mobile only) ── */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            className="hamburger-btn"
            style={{
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              width: "38px", height: "38px",
              borderRadius: "9px",
              border: "1px solid #E5E7EB",
              background: "transparent",
              color: "#374151",
              cursor: "pointer",
              marginLeft: "auto",
              flexShrink: 0,
            }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* ── Mobile dropdown ── */}
      {mobileOpen && (
        <div
          className="mobile-menu"
          style={{
            position: "fixed",
            top: "68px",
            left: 0,
            right: 0,
            zIndex: 49,
            background: "#ffffff",
            borderBottom: "1px solid #F3F4F6",
            boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
          }}
        >
          {/* Nav links */}
          <div style={{ padding: "8px 0" }}>
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "block",
                    padding: "14px 24px",
                    fontSize: "15px",
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? "#6366F1" : "#374151",
                    backgroundColor: isActive ? "#EEF2FF" : "transparent",
                    textDecoration: "none",
                    borderBottom: "1px solid #F9FAFB",
                    transition: "background 0.15s, color 0.15s",
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Auth actions */}
          <div style={{ padding: "16px 24px 20px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {user ? (
              <>
                <Link
                  href="/notifications"
                  onClick={() => setMobileOpen(false)}
                  style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", borderRadius: "10px", background: "#F9FAFB", color: "#374151", textDecoration: "none", fontWeight: 500, fontSize: "14px" }}
                >
                  <Bell size={18} />
                  Notifications {UNREAD_COUNT > 0 && <span style={{ marginLeft: "auto", background: "#EF4444", color: "#fff", borderRadius: "999px", fontSize: "11px", fontWeight: 700, padding: "1px 7px" }}>{UNREAD_COUNT}</span>}
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", borderRadius: "10px", background: "#F9FAFB", color: "#374151", textDecoration: "none", fontWeight: 500, fontSize: "14px" }}
                >
                  <div style={{ width: "26px", height: "26px", background: avatarGradient, borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "11px", fontWeight: 700 }}>{initials}</div>
                  My Profile
                </Link>
                <button
                  onClick={() => { setMobileOpen(false); handleLogout(); }}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "13px", borderRadius: "10px", background: "#FEF2F2", color: "#DC2626", border: "none", fontWeight: 600, fontSize: "14px", cursor: "pointer", fontFamily: "inherit" }}
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  style={{ display: "block", textAlign: "center", padding: "13px", borderRadius: "999px", border: "1.5px solid #E5E7EB", color: "#374151", fontWeight: 500, fontSize: "15px", textDecoration: "none" }}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  style={{ display: "block", textAlign: "center", padding: "13px", borderRadius: "999px", background: "#6366F1", color: "#ffffff", fontWeight: 600, fontSize: "15px", textDecoration: "none", boxShadow: "0 4px 14px rgba(99,102,241,0.3)" }}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        /* Logo icon hover */
        .logo-icon:hover {
          transform: scale(1.06);
          box-shadow: 0 6px 18px rgba(99,102,241,0.35) !important;
        }

        /* Nav center links hover */
        .nav-center-link:hover {
          color: #6366F1 !important;
        }
        .nav-center-link:hover span {
          transform: scaleX(0.55) !important;
          opacity: 0.5;
        }
        .nav-center-link--active:hover span {
          transform: scaleX(1) !important;
          opacity: 1;
        }

        /* Icon button hover */
        .icon-btn:hover {
          background: #F3F4F6 !important;
          color: #111827 !important;
        }

        /* Avatar hover */
        .avatar-btn:hover {
          transform: scale(1.07);
          box-shadow: 0 4px 14px rgba(99,102,241,0.35) !important;
        }

        /* Avatar tooltip */
        .avatar-wrapper { position: relative; }
        .avatar-tooltip {
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          background: #111827;
          color: #fff;
          font-size: 12px;
          font-weight: 500;
          white-space: nowrap;
          padding: 5px 10px;
          border-radius: 6px;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.15s ease;
          z-index: 100;
        }
        .avatar-tooltip::before {
          content: "";
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 5px solid transparent;
          border-bottom-color: #111827;
        }
        .avatar-wrapper:hover .avatar-tooltip {
          opacity: 1;
        }

        /* Logout hover */
        .logout-btn:hover {
          background: #FEF2F2 !important;
          color: #DC2626 !important;
          border-color: #FECACA !important;
        }

        /* Sign In hover */
        .signin-btn:hover {
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        /* Get Started hover */
        .getstarted-btn:hover {
          background: #4F46E5 !important;
          box-shadow: 0 6px 20px rgba(99,102,241,0.38) !important;
          transform: translateY(-1px);
        }
        .getstarted-btn:active {
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(99,102,241,0.22) !important;
        }

        /* ── Responsive ── */
        @media (max-width: 767px) {
          .gov-badge      { display: none !important; }
          .nav-links-center { display: none !important; }
          .nav-right-actions { display: none !important; }
          .hamburger-btn  { display: flex !important; }
        }
        @media (min-width: 768px) {
          .hamburger-btn  { display: none !important; }
          .mobile-menu    { display: none !important; }
        }
      `}} />
    </>
  );
}
