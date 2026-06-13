import Link from "next/link";
import { Train } from "lucide-react";

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

export default function Navbar() {
  return (
    <nav className="login-nav">
      <Link
        href="/"
        style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}
        aria-label="YatraSetu home"
      >
        <div
          className="login-nav__logo"
          style={{
            width: "38px",
            height: "38px",
            background: "linear-gradient(135deg, #1E40AF 0%, #2563EB 100%)",
            borderRadius: "11px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 4px 12px rgba(37,99,235,0.28)",
          }}
        >
          <Train size={18} color="white" strokeWidth={2.2} />
        </div>
        <div style={{ lineHeight: 1.2 }}>
          <div className="login-nav__brand" style={{ fontSize: "18px", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.4px", lineHeight: 1 }}>
            Yatra<span style={{ color: "#2563EB" }}>Setu</span>
          </div>
          <div className="login-nav__tagline" style={{ fontSize: "11px", color: "#94A3B8", fontWeight: 400, marginTop: "3px" }}>
            Your bridge to every journey.
          </div>
        </div>
      </Link>

      <div className="login-nav__gov-badge">
        <AshokaEmblem />
        <div className="login-nav__gov-text" style={{ lineHeight: 1.35 }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#0F172A" }}>Government of India</div>
          <div style={{ fontSize: "11px", color: "#475569", fontWeight: 500 }}>Official Railway Initiative</div>
        </div>
      </div>
    </nav>
  );
}
