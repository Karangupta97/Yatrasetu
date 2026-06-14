"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Bell, CheckCircle, AlertTriangle, Info, XCircle,
  ArrowLeft, Check, Trash2, Tag, ShoppingBag,
  CreditCard, RotateCcw, AlertCircle, User,
} from "lucide-react";
import BookingsNavbar from "../my-bookings/components/BookingsNavbar";
import {
  ALL_NOTIFICATIONS, CATEGORY_LABELS,
  type Notification, type NotifType,
} from "./data";

/* ── Helpers ──────────────────────────────────────────────── */
const TYPE_ICON: Record<NotifType, React.ReactNode> = {
  success: <CheckCircle size={18} style={{ color: "#16a34a" }} />,
  warning: <AlertTriangle size={18} style={{ color: "#d97706" }} />,
  info: <Info size={18} style={{ color: "#748efe" }} />,
  error: <XCircle size={18} style={{ color: "#dc2626" }} />,
};

const TYPE_RING: Record<NotifType, string> = {
  success: "#f0fdf4",
  warning: "#fffbeb",
  info: "#eff6ff",
  error: "#fef2f2",
};

const TYPE_DOT: Record<NotifType, string> = {
  success: "#16a34a",
  warning: "#d97706",
  info: "#748efe",
  error: "#dc2626",
};

const CAT_ICON: Record<Notification["category"], React.ReactNode> = {
  booking: <ShoppingBag size={13} />,
  payment: <CreditCard size={13} />,
  refund: <RotateCcw size={13} />,
  alert: <AlertCircle size={13} />,
  offer: <Tag size={13} />,
  account: <User size={13} />,
};

const CAT_COLOR: Record<Notification["category"], { bg: string; color: string }> = {
  booking: { bg: "#eff6ff", color: "#2563eb" },
  payment: { bg: "#f0fdf4", color: "#16a34a" },
  refund: { bg: "#fdf4ff", color: "#9333ea" },
  alert: { bg: "#fffbeb", color: "#d97706" },
  offer: { bg: "#fff7ed", color: "#ea580c" },
  account: { bg: "#f8fafc", color: "#475569" },
};

const TABS = ["All", "Booking", "Payment", "Refund", "Alerts", "Offers"] as const;
type Tab = typeof TABS[number];

/* ── Page ──────────────────────────────────────────────────── */
export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notification[]>(ALL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<Tab>("All");

  const unread = notifs.filter((n) => !n.read).length;

  const filtered = useMemo(() => {
    if (activeTab === "All") return notifs;
    const map: Record<Tab, Notification["category"] | null> = {
      All: null, Booking: "booking", Payment: "payment",
      Refund: "refund", Alerts: "alert", Offers: "offer",
    };
    return notifs.filter((n) => n.category === map[activeTab]);
  }, [notifs, activeTab]);

  // Group by date label
  const grouped = useMemo(() => {
    const order = ["Today", "Yesterday", "This week", "Older"];
    const map: Record<string, Notification[]> = {};
    filtered.forEach((n) => {
      if (!map[n.date]) map[n.date] = [];
      map[n.date].push(n);
    });
    return order.filter((d) => map[d]).map((d) => ({ date: d, items: map[d] }));
  }, [filtered]);

  const markAllRead = () => setNotifs((p) => p.map((n) => ({ ...n, read: true })));
  const markRead = (id: number) => setNotifs((p) => p.map((n) => n.id === id ? { ...n, read: true } : n));
  const dismiss = (id: number) => setNotifs((p) => p.filter((n) => n.id !== id));
  const clearAll = () => setNotifs([]);

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <BookingsNavbar />

      <main className="mx-auto" style={{ maxWidth: "760px", padding: "24px 16px 56px" }}>

        {/* ── Page header ── */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div className="flex items-center gap-3">
            <Link
              href="/passenger"
              className="flex items-center gap-1.5 hover:opacity-70 transition-opacity focus:outline-none"
              style={{ fontSize: "13px", color: "#6b7280", textDecoration: "none" }}
            >
              <ArrowLeft size={14} /> Back
            </Link>
            <div style={{ width: "1px", height: "18px", background: "#e8ebed" }} />
            <div className="flex items-center gap-2">
              <Bell size={20} style={{ color: "#181d2a" }} />
              <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#181d2a", margin: 0 }}>
                Notifications
              </h1>
              {unread > 0 && (
                <span style={{
                  background: "#748efe", color: "white",
                  borderRadius: "9999px", padding: "2px 8px",
                  fontSize: "12px", fontWeight: 700,
                }}>
                  {unread} new
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1.5 hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 rounded-lg"
                style={{ fontSize: "13px", fontWeight: 600, color: "#748efe", background: "rgba(116,142,254,0.08)", border: "1px solid rgba(116,142,254,0.2)", borderRadius: "8px", padding: "6px 12px", cursor: "pointer" }}
              >
                <Check size={13} /> Mark all read
              </button>
            )}
            {notifs.length > 0 && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1.5 hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 rounded-lg"
                style={{ fontSize: "13px", fontWeight: 600, color: "#dc2626", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "6px 12px", cursor: "pointer" }}
              >
                <Trash2 size={13} /> Clear all
              </button>
            )}
          </div>
        </div>

        {/* ── Filter tabs ── */}
        <div
          className="flex items-center gap-1 mb-5 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Notification categories"
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            const count = tab === "All" ? notifs.filter((n) => !n.read).length
              : notifs.filter((n) => !n.read && CATEGORY_LABELS[n.category] === tab).length;
            return (
              <button
                key={tab}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab)}
                className="flex-shrink-0 flex items-center gap-1.5 transition-all focus:outline-none focus-visible:ring-2 rounded-lg"
                style={{
                  padding: "7px 14px",
                  borderRadius: "9px",
                  fontSize: "13px",
                  fontWeight: isActive ? 600 : 500,
                  background: isActive ? "#748efe" : "#ffffff",
                  color: isActive ? "#ffffff" : "#6b7280",
                  border: isActive ? "none" : "1px solid #e8ebed",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {tab}
                {count > 0 && (
                  <span style={{
                    background: isActive ? "rgba(255,255,255,0.3)" : "#748efe",
                    color: "white", borderRadius: "9999px",
                    padding: "0px 6px", fontSize: "11px", fontWeight: 700,
                  }}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Notification list ── */}
        {notifs.length === 0 ? (
          /* Empty state */
          <div
            className="flex flex-col items-center justify-center py-20"
            style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #e8ebed" }}
          >
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#f0f2f5", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
              <Bell size={28} style={{ color: "#9ca3af" }} />
            </div>
            <p style={{ fontSize: "16px", fontWeight: 600, color: "#181d2a", marginBottom: "6px" }}>No notifications</p>
            <p style={{ fontSize: "14px", color: "#9ca3af" }}>You&apos;re all caught up!</p>
          </div>
        ) : grouped.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20"
            style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #e8ebed" }}
          >
            <p style={{ fontSize: "14px", color: "#9ca3af" }}>No {activeTab.toLowerCase()} notifications.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {grouped.map(({ date, items }) => (
              <div key={date}>
                {/* Date group label */}
                <p style={{ fontSize: "12px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "10px", paddingLeft: "4px" }}>
                  {date}
                </p>

                {/* Cards */}
                <div
                  style={{ background: "#ffffff", borderRadius: "14px", border: "1px solid #e8ebed", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", overflow: "hidden" }}
                >
                  {items.map((n, idx) => (
                    <div
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      style={{
                        display: "flex", alignItems: "flex-start", gap: "14px",
                        padding: "16px 18px",
                        background: n.read ? "#ffffff" : "rgba(116,142,254,0.03)",
                        borderBottom: idx < items.length - 1 ? "1px solid #f3f4f6" : "none",
                        cursor: n.read ? "default" : "pointer",
                        transition: "background 0.15s",
                        position: "relative",
                      }}
                    >
                      {/* Unread dot */}
                      {!n.read && (
                        <span
                          aria-hidden="true"
                          style={{
                            position: "absolute", top: "20px", left: "6px",
                            width: "6px", height: "6px", borderRadius: "50%",
                            background: TYPE_DOT[n.type],
                          }}
                        />
                      )}

                      {/* Type icon circle */}
                      <div style={{
                        width: "38px", height: "38px", borderRadius: "50%",
                        background: TYPE_RING[n.type],
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        {TYPE_ICON[n.type]}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p style={{ fontSize: "14px", fontWeight: n.read ? 500 : 700, color: "#181d2a" }}>
                              {n.title}
                            </p>
                            {/* Category pill */}
                            <span
                              className="flex items-center gap-1"
                              style={{
                                background: CAT_COLOR[n.category].bg,
                                color: CAT_COLOR[n.category].color,
                                borderRadius: "9999px",
                                padding: "2px 8px",
                                fontSize: "11px",
                                fontWeight: 600,
                              }}
                            >
                              {CAT_ICON[n.category]}
                              {CATEGORY_LABELS[n.category]}
                            </span>
                          </div>
                          {/* Dismiss */}
                          <button
                            onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                            className="flex-shrink-0 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
                            style={{ width: "26px", height: "26px" }}
                            aria-label={`Dismiss: ${n.title}`}
                          >
                            <Trash2 size={13} style={{ color: "#9ca3af" }} />
                          </button>
                        </div>

                        <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: "1.6", marginBottom: "6px" }}>
                          {n.body}
                        </p>

                        {/* Meta chips */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span style={{ fontSize: "11px", color: "#9ca3af" }}>{n.time}</span>
                          {n.pnr && (
                            <span style={{ fontSize: "11px", color: "#748efe", background: "rgba(116,142,254,0.08)", borderRadius: "6px", padding: "1px 7px", fontWeight: 600 }}>
                              PNR: {n.pnr}
                            </span>
                          )}
                          {n.amount && (
                            <span style={{ fontSize: "11px", color: "#16a34a", background: "#f0fdf4", borderRadius: "6px", padding: "1px 7px", fontWeight: 600 }}>
                              {n.amount}
                            </span>
                          )}
                          {n.trainName && (
                            <span style={{ fontSize: "11px", color: "#6b7280", background: "#f8fafc", borderRadius: "6px", padding: "1px 7px" }}>
                              {n.trainName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
