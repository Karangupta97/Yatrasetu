import { Phone, Mail, MapPin, Clock } from "lucide-react";

const INFO = [
  { icon: <Phone size={16} style={{ color: "#748efe" }} />, label: "24×7 Helpline",     value: "1800-110-139",          sub: "Toll-free · All operators" },
  { icon: <Phone size={16} style={{ color: "#748efe" }} />, label: "Alternate Number",  value: "+91 11 2334 5600",      sub: "Mon–Sat, 8 AM – 10 PM" },
  { icon: <Mail  size={16} style={{ color: "#f59e0b" }} />, label: "Support Email",     value: "support@yatrasetu.in",  sub: "Reply within 4–6 hours" },
  { icon: <Mail  size={16} style={{ color: "#f59e0b" }} />, label: "Escalation Email",  value: "grievance@yatrasetu.in",sub: "For unresolved complaints" },
  { icon: <MapPin size={16} style={{ color: "#f4632a" }} />, label: "Registered Office",value: "YatraSetu Technologies Pvt. Ltd.", sub: "B-14, Sector 62, Noida – 201309, UP" },
  { icon: <Clock size={16} style={{ color: "#22c55e" }} />, label: "Office Hours",      value: "Mon – Sat: 9 AM – 6 PM", sub: "IST · Closed on public holidays" },
];

export default function ContactInfo() {
  return (
    <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #e8ebed", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", padding: "22px", marginBottom: "20px" }}>
      <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#181d2a", marginBottom: "18px" }}>Contact Information</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {INFO.map(({ icon, label, value, sub }) => (
          <div key={label} className="flex items-start gap-3">
            <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: "#f8fafc", border: "1px solid #e8ebed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {icon}
            </div>
            <div>
              <p style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 600, letterSpacing: "0.05em", marginBottom: "2px" }}>{label}</p>
              <p style={{ fontSize: "13px", fontWeight: 700, color: "#181d2a" }}>{value}</p>
              <p style={{ fontSize: "12px", color: "#9ca3af" }}>{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
