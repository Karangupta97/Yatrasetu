"use client";
import { Phone, MessageCircle, Mail } from "lucide-react";

export default function SupportCards() {
  const cards = [
    {
      icon: <Phone size={22} style={{ color: "#748efe" }} />,
      iconBg: "#eff6ff", iconBorder: "#bfdbfe",
      badge: "24 × 7", badgeBg: "#eff6ff", badgeBorder: "#bfdbfe",
      title: "Call Support",
      sub: "Talk to an agent now",
      ctaLabel: "1800-110-139",
      ctaBg: "#748efe", ctaColor: "#fff",
    },
    {
      icon: <MessageCircle size={22} style={{ color: "#22c55e" }} />,
      iconBg: "#f0fdf4", iconBorder: "#bbf7d0",
      badge: "~2 min wait", badgeBg: "#f0fdf4", badgeBorder: "#bbf7d0",
      title: "Chat Support",
      sub: "Instant help via live chat",
      ctaLabel: "Start Chat",
      ctaBg: "#181d2a", ctaColor: "#fff",
    },
    {
      icon: <Mail size={22} style={{ color: "#f59e0b" }} />,
      iconBg: "#fffbeb", iconBorder: "#fde68a",
      badge: "Reply in 4–6 h", badgeBg: "#fffbeb", badgeBorder: "#fde68a",
      title: "Email Support",
      sub: "support@yatrasetu.in",
      ctaLabel: "Send Email",
      ctaBg: "#f59e0b", ctaColor: "#fff",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {cards.map((c) => (
        <div key={c.title} style={{ background: "#fff", borderRadius: "14px", border: "1px solid #e8ebed", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", padding: "22px" }}>
          <div className="flex items-start justify-between mb-4">
            <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: c.iconBg, border: `1px solid ${c.iconBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {c.icon}
            </div>
            <span style={{ background: c.badgeBg, border: `1px solid ${c.badgeBorder}`, color: "#6b7280", fontSize: "11px", fontWeight: 600, borderRadius: "9999px", padding: "3px 10px" }}>
              {c.badge}
            </span>
          </div>
          <p style={{ fontSize: "16px", fontWeight: 700, color: "#181d2a", marginBottom: "3px" }}>{c.title}</p>
          <p style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "16px" }}>{c.sub}</p>
          <button className="w-full hover:opacity-90 active:scale-[0.97] transition-all" style={{ background: c.ctaBg, color: c.ctaColor, borderRadius: "10px", height: "40px", fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer" }}>
            {c.ctaLabel}
          </button>
        </div>
      ))}
    </div>
  );
}
