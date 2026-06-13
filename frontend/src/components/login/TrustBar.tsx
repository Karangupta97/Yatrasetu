import { Award, Headphones, Users, ShieldCheck } from "lucide-react";

const items = [
  {
    icon: <Award size={20} strokeWidth={1.6} />,
    label: "IRCTC Authorized Partner",
    short: "IRCTC Partner",
  },
  {
    icon: <Headphones size={20} strokeWidth={1.6} />,
    label: "24/7 Customer Support",
    short: "24/7 Support",
  },
  {
    icon: <Users size={20} strokeWidth={1.6} />,
    label: "Trusted by Millions",
    short: "Trusted",
  },
  {
    icon: <ShieldCheck size={20} strokeWidth={1.6} />,
    label: "Safe, Secure & Reliable",
    short: "Secure",
  },
];

export default function TrustBar() {
  return (
    <div className="trust-bar">
      {items.map((item) => (
        <div key={item.label} className="trust-bar__item">
          <div className="trust-bar__icon">{item.icon}</div>
          <span className="trust-bar__label trust-bar__label--full">{item.label}</span>
          <span className="trust-bar__label trust-bar__label--short">{item.short}</span>
        </div>
      ))}
    </div>
  );
}
