import { Check } from "lucide-react";

const STEPS = [
  { n: 1, label: "Journey" },
  { n: 2, label: "Seats" },
  { n: 3, label: "Passengers" },
  { n: 4, label: "Review" },
  { n: 5, label: "Payment" },
  { n: 6, label: "Confirm" },
];

export default function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center w-full" aria-label="Booking progress">
      {STEPS.map((step, i) => {
        const done   = current > step.n;
        const active = current === step.n;
        return (
          <div key={step.n} className="flex items-center">
            {/* Step dot */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: "34px", height: "34px", borderRadius: "50%",
                  background: done
                    ? "linear-gradient(135deg, #5b6efe, #748efe)"
                    : active
                    ? "linear-gradient(135deg, #5b6efe, #748efe)"
                    : "#f1f5f9",
                  color: done || active ? "white" : "#9ca3af",
                  fontSize: "13px", fontWeight: 700,
                  boxShadow: active ? "0 0 0 4px rgba(116,142,254,0.18), 0 2px 8px rgba(116,142,254,0.25)" : done ? "0 2px 6px rgba(116,142,254,0.2)" : "none",
                  transition: "all 0.25s ease",
                  border: !done && !active ? "1.5px solid #e2e8f0" : "none",
                }}
                aria-current={active ? "step" : undefined}
                aria-label={`Step ${step.n}: ${step.label}${done ? " (completed)" : active ? " (current)" : ""}`}
              >
                {done ? <Check size={14} strokeWidth={3} /> : step.n}
              </div>
              <span
                style={{
                  fontSize: "11px", fontWeight: active ? 700 : done ? 500 : 400,
                  color: active ? "#5b6efe" : done ? "#181d2a" : "#9ca3af",
                  whiteSpace: "nowrap",
                  transition: "color 0.2s",
                }}
              >
                {step.label}
              </span>
            </div>

            {/* Connector */}
            {i < STEPS.length - 1 && (
              <div
                aria-hidden="true"
                style={{
                  height: "2.5px", width: "44px", flexShrink: 0,
                  background: done ? "linear-gradient(90deg, #5b6efe, #748efe)" : "#e8ebed",
                  margin: "0 6px", marginBottom: "20px",
                  borderRadius: "2px",
                  transition: "background 0.3s ease",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
