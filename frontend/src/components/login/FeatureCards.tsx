import { ShieldCheck, Lock, Activity, Users } from "lucide-react";

const cards = [
  { icon: <ShieldCheck size={20} strokeWidth={1.75} />, title: "Official",   sub: "Railway Platform" },
  { icon: <Lock        size={20} strokeWidth={1.75} />, title: "Secure",     sub: "Ticket Booking"   },
  { icon: <Activity    size={20} strokeWidth={1.75} />, title: "Real-Time",  sub: "PNR Updates"      },
  { icon: <Users       size={20} strokeWidth={1.75} />, title: "Trusted by", sub: "Millions"         },
];

export default function FeatureCards() {
  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        width: "100%",
        padding: "0 32px",
      }}
    >
      {cards.map((c) => (
        <div
          key={c.title}
          style={{
            flex: 1,
            height: "88px",
            background: "rgba(255,255,255,0.82)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.9)",
            borderRadius: "16px",
            boxShadow: "0 4px 24px rgba(37,99,235,0.08)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "0 18px",
          }}
        >
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "rgba(37,99,235,0.08)",
              color: "#2563EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {c.icon}
          </div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#0F172A", lineHeight: 1.25 }}>
              {c.title}
            </div>
            <div style={{ fontSize: "11.5px", color: "#64748B", fontWeight: 400, marginTop: "2px", lineHeight: 1.25 }}>
              {c.sub}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
