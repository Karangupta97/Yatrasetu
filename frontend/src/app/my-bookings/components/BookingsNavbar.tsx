"use client";

import { Ticket, Bell } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Browse tickets", href: "/passenger" },
  { label: "My Bookings",    href: "/my-bookings" },
  { label: "Contact Us",     href: "/contact" },
];

const UNREAD_COUNT = 2; // static badge count shown on bell

export default function BookingsNavbar() {
  const pathname = usePathname();

  return (
    <nav
      className="w-full sticky top-0 z-50"
      style={{ background: "#ffffff", height: "64px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div
        className="mx-auto h-full flex items-center justify-between"
        style={{ maxWidth: "1200px", paddingLeft: "24px", paddingRight: "24px" }}
      >
        {/* ── Logo ── */}
        <Link
          href="/passenger"
          className="flex items-center gap-2 flex-shrink-0 focus:outline-none focus-visible:ring-2 rounded"
          aria-label="YatraSetu home"
        >
          <Ticket size={22} style={{ color: "#748efe" }} aria-hidden="true" />
          <span style={{ color: "#181d2a", fontSize: "18px", fontWeight: 700, letterSpacing: "-0.3px" }}>
            yatrasetu
          </span>
        </Link>

        {/* ── Nav links ── */}
        <div className="hidden md:flex items-center gap-6" role="menubar">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={label}
                href={href}
                role="menuitem"
                className="relative focus:outline-none focus-visible:ring-2 rounded-sm transition-colors duration-150"
                style={{
                  fontSize: "14px",
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "#748efe" : "#6b7280",
                  paddingBottom: "4px",
                  textDecoration: "none",
                }}
              >
                {label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute", bottom: "-2px", left: 0, right: 0,
                      height: "2px", borderRadius: "9999px", background: "#748efe",
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* ── Right actions: Bell + Avatar + Search ── */}
        <div className="flex items-center gap-1">

          {/* ── Notification bell → navigates to /notifications ── */}
          <div className="relative">
            <Link
              href="/notifications"
              className="relative flex items-center justify-center rounded-full transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2"
              style={{ width: "44px", height: "44px", color: "#6b7280", display: "flex" }}
              aria-label={`Notifications — ${UNREAD_COUNT} unread`}            >
              <Bell size={20} />
              {UNREAD_COUNT > 0 && (
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute", top: "8px", right: "8px",
                    width: "8px", height: "8px", borderRadius: "50%",
                    background: "#f4632a", border: "2px solid white",
                  }}
                />
              )}
            </Link>
          </div>

          {/* Avatar → navigates to /profile */}
          <Link
            href="/profile"
            className="flex items-center justify-center rounded-full flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 hover:opacity-90 transition-opacity"
            style={{ width: "36px", height: "36px", background: "#748efe", color: "white", fontSize: "14px", fontWeight: 700 }}
            aria-label="User profile"
          >
            J
          </Link>
        </div>
      </div>
    </nav>
  );
}
