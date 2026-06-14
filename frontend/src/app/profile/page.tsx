"use client";

import React, { useState } from "react";
import BookingsNavbar from "../my-bookings/components/BookingsNavbar";
import ProfileInfo from "./components/ProfileInfo";
import AadhaarVerification from "./components/AadhaarVerification";
import BillingPayment from "./components/BillingPayment";
import Link from "next/link";
import {
  ArrowLeft, User, ShieldCheck, CreditCard,
  Train, Bell, Clock, Route, Star,
} from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";

/* ── Section types ─────────────────────────────────────────── */
type Section = "profile" | "aadhaar" | "billing";

const NAV_ITEMS: {
  id: Section;
  label: string;
  sub: string;
  Icon: React.ElementType;
  color: string;
  bg: string;
  activeBorder: string;
}[] = [
  {
    id: "profile",
    label: "Personal Details",
    sub: "Name, age, gender, contact",
    Icon: User,
    color: "#6366F1",
    bg: "#EEF2FF",
    activeBorder: "#6366F1",
  },
  {
    id: "aadhaar",
    label: "Aadhaar Verification",
    sub: "KYC & identity status",
    Icon: ShieldCheck,
    color: "#22c55e",
    bg: "#f0fdf4",
    activeBorder: "#22c55e",
  },
  {
    id: "billing",
    label: "Billing & Payment",
    sub: "UPI, cards, saved methods",
    Icon: CreditCard,
    color: "#f59e0b",
    bg: "#fffbeb",
    activeBorder: "#f59e0b",
  },
];

const SECTION_TITLE: Record<Section, string> = {
  profile: "Personal Details",
  aadhaar: "Aadhaar Verification",
  billing: "Billing & Payment",
};

/* ═══════════════════════════════════════════════════════════ */
export default function ProfilePage() {
  const [active, setActive] = useState<Section>("profile");
  const profile = useUserProfile();

  const activeItem = NAV_ITEMS.find((n) => n.id === active)!;

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <BookingsNavbar />

      <main
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "32px 24px 64px",
        }}
      >
        {/* ── Page header ─────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <Link
            href="/passenger"
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              fontSize: "13px", color: "#6b7280", textDecoration: "none",
              transition: "color 0.15s",
            }}
            className="back-link"
          >
            <ArrowLeft size={14} /> Back
          </Link>
          <span style={{ width: "1px", height: "18px", background: "#e8ebed" }} />
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#181d2a", margin: 0 }}>
            My Profile
          </h1>
        </div>

        {/* ── Three-column layout ──────────────────────── */}
        <div className="profile-layout">

          {/* ══ LEFT SIDEBAR ════════════════════════════ */}
          <aside className="profile-sidebar">

            {/* Avatar + name card */}
            <div className="profile-card" style={{ overflow: "hidden", marginBottom: "12px" }}>
              {/* Gradient header */}
              <div
                style={{
                  background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                  padding: "28px 20px 24px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "80px", height: "80px", borderRadius: "50%",
                    background: "rgba(255,255,255,0.2)",
                    border: "3px solid rgba(255,255,255,0.35)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 14px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                  }}
                >
                  <span style={{ fontSize: "32px", fontWeight: 700, color: "white", lineHeight: 1 }}>
                    {profile.initials}
                  </span>
                </div>
                <p style={{ fontSize: "18px", fontWeight: 700, color: "white", margin: "0 0 6px" }}>
                  {profile.displayName}
                </p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: "rgba(255,255,255,0.15)", borderRadius: "9999px", padding: "3px 10px" }}>
                  <Train size={11} style={{ color: "rgba(255,255,255,0.8)" }} />
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>
                    YatraSetu Member
                  </span>
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr 1px 1fr", padding: "16px 0" }}>
                {[
                  { label: "Bookings",     value: String(profile.bookingCount) },
                  { label: "Total Saved",  value: `₹${profile.totalSaved.toLocaleString("en-IN")}` },
                  { label: "Member Since", value: profile.memberSince ?? "—" },
                ].map(({ label, value }, i, arr) => (
                  <React.Fragment key={label}>
                    <div style={{ textAlign: "center", padding: "4px 8px" }}>
                      <p style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "4px", fontWeight: 500 }}>
                        {label}
                      </p>
                      <p style={{ fontSize: "14px", fontWeight: 700, color: "#181d2a", margin: 0 }}>
                        {value}
                      </p>
                    </div>
                    {i < arr.length - 1 && (
                      <div style={{ background: "#F3F4F6", width: "1px", margin: "4px 0" }} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Account Settings nav */}
            <div className="profile-card" style={{ padding: "10px", marginBottom: "12px" }}>
              <p style={{
                fontSize: "10px", fontWeight: 700, color: "#9ca3af",
                letterSpacing: "0.1em", padding: "6px 10px 8px",
                textTransform: "uppercase",
              }}>
                Account Settings
              </p>
              {NAV_ITEMS.map(({ id, label, sub, Icon, color, bg }) => {
                const isActive = active === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActive(id)}
                    aria-current={isActive ? "page" : undefined}
                    className="sidebar-nav-item"
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: "12px",
                      padding: "10px 12px", borderRadius: "10px", cursor: "pointer",
                      background: isActive ? bg : "transparent",
                      borderTopWidth: "0px",
                      borderRightWidth: "0px",
                      borderBottomWidth: "0px",
                      borderLeftWidth: "3px",
                      borderStyle: "solid",
                      borderColor: isActive ? color : "transparent",
                      marginBottom: "2px",
                      minHeight: "48px",
                      textAlign: "left",
                      transition: "background 0.15s, border-color 0.15s",
                    }}
                  >
                    <div style={{
                      width: "32px", height: "32px", borderRadius: "9px", flexShrink: 0,
                      background: isActive ? bg : "#f8fafc",
                      border: `1px solid ${isActive ? color + "44" : "#e8ebed"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.15s",
                    }}>
                      <Icon size={15} style={{ color: isActive ? color : "#9ca3af" }} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{
                        fontSize: "13px", fontWeight: isActive ? 700 : 500,
                        color: isActive ? "#181d2a" : "#6b7280",
                        margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>
                        {label}
                      </p>
                      <p style={{
                        fontSize: "10px", color: "#9ca3af", margin: 0,
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>
                        {sub}
                      </p>
                    </div>
                    {isActive && (
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: color, flexShrink: 0, marginLeft: "auto" }} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Links */}
            <div className="profile-card" style={{ padding: "12px", marginBottom: "12px" }}>
              <p style={{ fontSize: "10px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.1em", marginBottom: "8px", paddingLeft: "2px", textTransform: "uppercase" }}>
                Quick Links
              </p>
              {[
                { Icon: Train, label: "My Bookings",   href: "/my-bookings",    color: "#6366F1", bg: "#EEF2FF" },
                { Icon: Bell,  label: "Notifications", href: "/notifications",  color: "#f59e0b", bg: "#fffbeb" },
              ].map(({ Icon, label, href, color, bg }) => (
                <Link key={label} href={href}
                  className="quick-link"
                  style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "9px 10px", borderRadius: "9px", background: bg,
                    textDecoration: "none", marginBottom: "6px",
                    transition: "opacity 0.15s",
                  }}>
                  <Icon size={15} style={{ color, flexShrink: 0 }} />
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#181d2a" }}>{label}</span>
                </Link>
              ))}
            </div>

            {/* Security badge */}
            <div style={{
              background: "#f0fdf4", border: "1px solid #bbf7d0",
              borderRadius: "12px", padding: "12px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "4px" }}>
                <ShieldCheck size={13} style={{ color: "#16a34a" }} />
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#15803d" }}>Secure Account</span>
              </div>
              <p style={{ fontSize: "11px", color: "#166534", lineHeight: "1.5", margin: 0 }}>
                256-bit encryption &amp; secure authentication.
              </p>
            </div>
          </aside>

          {/* ══ MAIN CONTENT ════════════════════════════ */}
          <div className="profile-main">

            {/* Mobile tab pills */}
            <div
              className="profile-tabs-mobile"
              role="tablist"
              style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px", marginBottom: "16px" }}
            >
              {NAV_ITEMS.map(({ id, label, Icon, color, bg }) => {
                const isActive = active === id;
                return (
                  <button
                    key={id} role="tab" aria-selected={isActive}
                    onClick={() => setActive(id)}
                    style={{
                      flexShrink: 0, display: "flex", alignItems: "center", gap: "6px",
                      padding: "8px 14px", borderRadius: "9999px",
                      border: `1.5px solid ${isActive ? color : "#e8ebed"}`,
                      background: isActive ? bg : "#fff",
                      cursor: "pointer", fontSize: "13px",
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? "#181d2a" : "#6b7280",
                      transition: "all 0.15s",
                    }}
                  >
                    <Icon size={13} style={{ color: isActive ? color : "#9ca3af" }} />
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Breadcrumb (desktop) */}
            <div
              className="profile-breadcrumb"
              style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}
            >
              <activeItem.Icon size={15} style={{ color: activeItem.color }} />
              <span style={{ fontSize: "14px", fontWeight: 600, color: "#6b7280" }}>
                {SECTION_TITLE[active]}
              </span>
            </div>

            {/* Active section — animated tab switch */}
            <div
              key={active}
              className="profile-tab-panel"
            >
              {active === "profile" && <ProfileInfo />}
              {active === "aadhaar" && <AadhaarVerification />}
              {active === "billing" && <BillingPayment />}
            </div>
          </div>

          {/* ══ RIGHT PANEL ═════════════════════════════ */}
          <aside className="profile-right-panel">

            {/* Secure Account */}
            <div style={{
              background: "#f0fdf4", border: "1px solid #bbf7d0",
              borderRadius: "14px", padding: "16px", marginBottom: "16px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <ShieldCheck size={15} style={{ color: "#16a34a" }} />
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#15803d" }}>Secure Account</span>
              </div>
              <p style={{ fontSize: "12px", color: "#166534", lineHeight: "1.6", margin: 0 }}>
                Your data is protected with 256-bit encryption and secure authentication.
              </p>
            </div>

            {/* Recent Activity */}
            <div className="profile-card" style={{ padding: "16px 18px", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <Clock size={14} style={{ color: "#9ca3af" }} />
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#181d2a" }}>Recent Activity</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {profile.recentActivity.map((item) => (
                  <div key={item.id} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <div style={{
                      width: "8px", height: "8px", borderRadius: "50%",
                      background: item.color, flexShrink: 0, marginTop: "4px",
                    }} />
                    <div>
                      <p style={{ fontSize: "13px", color: "#374151", margin: 0, lineHeight: "1.4" }}>
                        {item.text}
                      </p>
                      <p style={{ fontSize: "11px", color: "#9ca3af", margin: "2px 0 0" }}>
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Travel Stats */}
            <div className="profile-card" style={{ padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <Train size={14} style={{ color: "#9ca3af" }} />
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#181d2a" }}>Travel Stats</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Route size={14} style={{ color: "#6366F1" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: "#181d2a", margin: 0 }}>
                      {profile.travelStats.totalDistance.toLocaleString("en-IN")} km
                    </p>
                    <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0 }}>Total Distance</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Train size={14} style={{ color: "#22c55e" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: "#181d2a", margin: 0 }}>
                      {profile.travelStats.journeysCompleted}
                    </p>
                    <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0 }}>Journeys Completed</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "#fffbeb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Star size={14} style={{ color: "#f59e0b" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: "#181d2a", margin: 0 }}>
                      {profile.travelStats.favouriteRoute}
                    </p>
                    <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0 }}>Favourite Route</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        /* Layout */
        .profile-layout {
          display: grid;
          grid-template-columns: 280px 1fr 320px;
          gap: 24px;
          align-items: start;
        }
        .profile-sidebar {
          position: sticky;
          top: 88px;
          align-self: start;
        }
        .profile-right-panel {
          position: sticky;
          top: 88px;
          align-self: start;
        }
        .profile-card {
          background: #fff;
          border-radius: 14px;
          border: 1px solid #e8ebed;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
        }

        /* Mobile tabs: hidden on desktop */
        .profile-tabs-mobile { display: none !important; }
        /* Breadcrumb: visible on desktop */
        .profile-breadcrumb { display: flex !important; }

        /* Tab panel animation */
        .profile-tab-panel {
          animation: tab-fade-slide 0.2s ease both;
        }
        @keyframes tab-fade-slide {
          from { opacity: 0; transform: translateX(8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .profile-tab-panel { animation: none; }
        }

        /* Sidebar nav item hover */
        .sidebar-nav-item:hover {
          background: #f8fafc !important;
        }

        /* Quick link hover */
        .quick-link:hover { opacity: 0.75; }

        /* Back link hover */
        .back-link:hover { color: #181d2a !important; }

        /* Tablet (< 1024px): hide right panel, merge to 2 col */
        @media (max-width: 1023px) {
          .profile-layout {
            grid-template-columns: 240px 1fr;
          }
          .profile-right-panel { display: none !important; }
        }

        /* Mobile (< 768px): single column */
        @media (max-width: 767px) {
          .profile-layout {
            grid-template-columns: 1fr;
          }
          .profile-sidebar {
            position: static;
          }
          .profile-tabs-mobile { display: flex !important; }
          .profile-breadcrumb  { display: none   !important; }
          /* Hide full sidebar on mobile, show only the top card */
          .profile-sidebar > *:not(:first-child) { display: none !important; }
        }
      `}} />
    </div>
  );
}
