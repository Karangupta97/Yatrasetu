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
            <div className="flex flex-col items-center gap-1">
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: "32px", height: "32px", borderRadius: "50%",
                  background: done ? "#748efe" : active ? "#748efe" : "#e8ebed",
                  color: done || active ? "white" : "#9ca3af",
                  fontSize: "13px", fontWeight: 700,
                  boxShadow: active ? "0 0 0 4px rgba(116,142,254,0.2)" : "none",
                  transition: "all 0.2s ease",
                }}
                aria-current={active ? "step" : undefined}
                aria-label={`Step ${step.n}: ${step.label}${done ? " (completed)" : active ? " (current)" : ""}`}
              >
                {done ? <Check size={14} strokeWidth={3} /> : step.n}
              </div>
              <span
                style={{
                  fontSize: "11px", fontWeight: active ? 600 : 400,
                  color: active ? "#748efe" : done ? "#181d2a" : "#9ca3af",
                  whiteSpace: "nowrap",
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
                  height: "2px", width: "40px", flexShrink: 0,
                  background: done ? "#748efe" : "#e8ebed",
                  margin: "0 4px", marginBottom: "18px",
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
