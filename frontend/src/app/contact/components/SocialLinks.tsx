import { ExternalLink } from "lucide-react";

const SOCIALS = [
  { label: "@YatraSetuIN",     platform: "Twitter",   color: "#1d9bf0", bg: "#eff6ff", border: "#bfdbfe" },
  { label: "YatraSetu",        platform: "Facebook",  color: "#1877f2", bg: "#eff6ff", border: "#bfdbfe" },
  { label: "@yatrasetu_india", platform: "Instagram", color: "#e1306c", bg: "#fdf2f8", border: "#f0abfc" },
  { label: "YatraSetu",        platform: "YouTube",   color: "#ff0000", bg: "#fef2f2", border: "#fecaca" },
];

export default function SocialLinks() {
  return (
    <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #e8ebed", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", padding: "22px" }}>
      <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#181d2a", marginBottom: "14px" }}>Connect With Us</h2>
      <div className="flex flex-wrap gap-3">
        {SOCIALS.map(({ label, platform, color, bg, border }) => (
          <a
            key={label + platform}
            href="#"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 rounded-lg"
            style={{ background: bg, border: `1px solid ${border}`, borderRadius: "10px", padding: "8px 14px", color, fontSize: "13px", fontWeight: 600, textDecoration: "none" }}
          >
            {platform} · {label}
            <ExternalLink size={11} style={{ opacity: 0.6 }} />
          </a>
        ))}
      </div>
    </div>
  );
}
