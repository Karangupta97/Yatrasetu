import { ShieldCheck, Lock, BadgeCheck } from "lucide-react";

const BADGES = [
  { icon: ShieldCheck, label: "Secure Registration" },
  { icon: BadgeCheck, label: "Aadhaar Verified" },
  { icon: Lock, label: "Encrypted Data" },
];

export default function SecurityBadges() {
  return (
    <div className="reg-security-badges" aria-label="Security assurances">
      {BADGES.map(({ icon: Icon, label }) => (
        <div key={label} className="reg-security-badge">
          <Icon size={14} strokeWidth={2} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
