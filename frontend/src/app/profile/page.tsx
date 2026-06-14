"use client";

import { useState, useEffect } from "react";
import { loadSessionUser } from "@/lib/auth-store";
import BookingsNavbar      from "../my-bookings/components/BookingsNavbar";
import ProfileInfo         from "./components/ProfileInfo";
import AadhaarVerification from "./components/AadhaarVerification";
import BillingPayment      from "./components/BillingPayment";
import Link                from "next/link";
import {
  ArrowLeft, User, ShieldCheck, CreditCard,
  Train, Bell, Menu, X,
} from "lucide-react";

/* ── Left nav items ───────────────────────────────────────── */
type Section = "profile" | "aadhaar" | "billing";

const NAV_ITEMS: { id: Section; label: string; sub: string; Icon: React.ElementType; color: string; bg: string }[] = [
  {
    id: "profile",
    label: "Personal Details",
    sub: "Name, age, gender, contact",
    Icon: User,
    color: "#748efe",
    bg: "#eff6ff",
  },
  {
    id: "aadhaar",
    label: "Aadhaar Verification",
    sub: "KYC & identity status",
    Icon: ShieldCheck,
    color: "#22c55e",
    bg: "#f0fdf4",
  },
  {
    id: "billing",
    label: "Billing & Payment",
    sub: "UPI, cards, saved methods",
    Icon: CreditCard,
    color: "#f59e0b",
    bg: "#fffbeb",
  },
];

/* ── Right sidebar quick links ────────────────────────────── */
const QUICK_LINKS = [
  { icon: <Train size={15} style={{ color: "#748efe" }} />, label: "My Bookings",   href: "/my-bookings", bg: "#eff6ff" },
  { icon: <Bell  size={15} style={{ color: "#f59e0b" }} />, label: "Notifications", href: "/notifications", bg: "#fffbeb" },
];

/* ── Section title map ────────────────────────────────────── */
const SECTION_TITLE: Record<Section, string> = {
  profile: "Personal Details",
  aadhaar: "Aadhaar Verification",
  billing: "Billing & Payment",
};

/* ═══════════════════════════════════════════════════════════ */
export default function ProfilePage() {
  const [active, setActive]         = useState<Section>("profile");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(loadSessionUser());
  }, []);

  const initial = user?.fullName
    ? user.fullName.charAt(0).toUpperCase()
    : user?.username
    ? user.username.charAt(0).toUpperCase()
    : "U";

  const displayName = user?.fullName || user?.username || "YatraSetu Member";

  const activeItem = NAV_ITEMS.find((n) => n.id === active)!;

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <BookingsNavbar />

      <main className="mx-auto" style={{ maxWidth: "1060px", padding: "20px 16px 56px" }}>

        {/* ── Page header ───────────────────────────────── */}
        <div className="flex items-center gap-3 mb-5">
          <Link href="/passenger"
            className="flex items-center gap-1.5 hover:opacity-70 transition-opacity focus:outline-none"
            style={{ fontSize: "13px", color: "#6b7280", textDecoration: "none" }}>
            <ArrowLeft size={14} /> Back
          </Link>
          <span style={{ width: "1px", height: "18px", background: "#e8ebed", display: "inline-block" }} />
          <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#181d2a", margin: 0 }}>My Profile</h1>
        </div>

        {/* ── Three-column layout ───────────────────────── */}
        <div className="flex gap-5 items-start" style={{ flexWrap: "nowrap" }}>

          {/* ══ LEFT NAV SIDEBAR ════════════════════════ */}
          {/* Desktop: always visible */}
          <aside
            className="hidden md:flex flex-col gap-2 flex-shrink-0"
            style={{ width: "220px", position: "sticky", top: "80px", alignSelf: "flex-start" }}
          >
            {/* ── Stats card (avatar + name + stats) — top of left sidebar ── */}
            <div style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #e8ebed", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", overflow: "hidden", marginBottom: "4px" }}>
              {/* Gradient header */}
              <div style={{ background: "linear-gradient(135deg,#748efe,#a78bfa)", padding: "20px 16px 18px", textAlign: "center" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                  <span style={{ fontSize: "22px", fontWeight: 800, color: "white" }}>{initial}</span>
                </div>
                <p style={{ fontSize: "15px", fontWeight: 700, color: "white", marginBottom: "2px" }}>{displayName}</p>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.75)" }}>YatraSetu Member</p>
              </div>
              {/* Stats rows */}
              <div style={{ padding: "14px 16px" }}>
                {[
                  { label: "Bookings",     value: "6" },
                  { label: "Total saved",  value: "₹3,420" },
                  { label: "Member since", value: "Aug 2023" },
                ].map(({ label, value }, i, arr) => (
                  <div key={label} className="flex justify-between items-center"
                    style={{ padding: "8px 0", borderBottom: i < arr.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                    <span style={{ fontSize: "13px", color: "#9ca3af" }}>{label}</span>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#181d2a" }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Nav items */}
            <div
              style={{
                background: "#ffffff", borderRadius: "14px",
                border: "1px solid #e8ebed",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                padding: "8px",
              }}
            >
              <p style={{ fontSize: "10px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em", padding: "6px 8px 4px" }}>
                ACCOUNT SETTINGS
              </p>
              {NAV_ITEMS.map(({ id, label, sub, Icon, color, bg }) => {
                const isActive = active === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActive(id)}
                    className="w-full flex items-center gap-3 text-left transition-all focus:outline-none focus-visible:ring-2 rounded-xl"
                    style={{
                      padding: "10px 12px",
                      borderRadius: "10px",
                      background: isActive ? bg : "transparent",
                      border: isActive ? `1.5px solid ${color}22` : "1.5px solid transparent",
                      cursor: "pointer",
                      marginBottom: "2px",
                    }}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {/* Icon circle */}
                    <div
                      style={{
                        width: "32px", height: "32px", borderRadius: "9px",
                        background: isActive ? bg : "#f8fafc",
                        border: `1px solid ${isActive ? color + "33" : "#e8ebed"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                        transition: "all 0.15s",
                      }}
                    >
                      <Icon size={15} style={{ color: isActive ? color : "#9ca3af" }} />
                    </div>
                    {/* Labels */}
                    <div className="min-w-0">
                      <p style={{
                        fontSize: "13px", fontWeight: isActive ? 700 : 500,
                        color: isActive ? "#181d2a" : "#6b7280",
                        marginBottom: "1px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>
                        {label}
                      </p>
                      <p style={{ fontSize: "10px", color: "#9ca3af", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {sub}
                      </p>
                    </div>
                    {/* Active indicator dot */}
                    {isActive && (
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: color, flexShrink: 0, marginLeft: "auto" }} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick links */}
            <div style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #e8ebed", padding: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <p style={{ fontSize: "10px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em", marginBottom: "8px", paddingLeft: "2px" }}>QUICK LINKS</p>
              {QUICK_LINKS.map(({ icon, label, href, bg }) => (
                <Link key={label} href={href}
                  className="flex items-center gap-2.5 hover:opacity-80 transition-opacity focus:outline-none rounded-lg"
                  style={{ textDecoration: "none", padding: "8px 10px", borderRadius: "9px", background: bg, marginBottom: "4px", display: "flex" }}>
                  {icon}
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "#181d2a" }}>{label}</span>
                </Link>
              ))}
            </div>

            {/* Security badge */}
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "12px" }}>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck size={13} style={{ color: "#16a34a" }} />
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#15803d" }}>Secure Account</span>
              </div>
              <p style={{ fontSize: "11px", color: "#166534", lineHeight: "1.5" }}>
                256-bit encryption &amp; secure authentication.
              </p>
            </div>
          </aside>

          {/* ══ MOBILE NAV — pill tabs + bottom sheet ═══ */}
          <div className="flex md:hidden w-full mb-4 flex-col gap-3">
            {/* Tab pills */}
            <div className="flex gap-2 overflow-x-auto pb-1" role="tablist">
              {NAV_ITEMS.map(({ id, label, Icon, color, bg }) => {
                const isActive = active === id;
                return (
                  <button
                    key={id}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActive(id)}
                    className="flex-shrink-0 flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 rounded-full transition-all"
                    style={{
                      padding: "8px 14px",
                      borderRadius: "9999px",
                      border: `1.5px solid ${isActive ? color : "#e8ebed"}`,
                      background: isActive ? bg : "#ffffff",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? "#181d2a" : "#6b7280",
                    }}
                  >
                    <Icon size={13} style={{ color: isActive ? color : "#9ca3af" }} />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ══ MAIN CONTENT ════════════════════════════ */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">
            {/* Section breadcrumb label — desktop only */}
            <div className="hidden md:flex items-center gap-2 mb-1">
              <activeItem.Icon size={15} style={{ color: activeItem.color }} />
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#6b7280" }}>
                {SECTION_TITLE[active]}
              </span>
            </div>

            {/* Render active section */}
            {active === "profile" && <ProfileInfo />}
            {active === "aadhaar" && <AadhaarVerification />}
            {active === "billing" && <BillingPayment />}
          </div>

          {/* ══ RIGHT STATS SIDEBAR ═════════════════════ */}
          <aside
            className="hidden lg:flex flex-col gap-4 flex-shrink-0"
            style={{ width: "210px", position: "sticky", top: "80px", alignSelf: "flex-start" }}
          >
            {/* Security indicator */}
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "14px" }}>
              <div className="flex items-center gap-2 mb-1.5">
                <ShieldCheck size={14} style={{ color: "#16a34a" }} />
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#15803d" }}>Secure Account</span>
              </div>
              <p style={{ fontSize: "11px", color: "#166534", lineHeight: "1.5" }}>
                Your data is protected with 256-bit encryption and secure authentication.
              </p>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}
