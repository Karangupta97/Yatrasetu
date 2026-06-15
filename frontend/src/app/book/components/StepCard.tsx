export default function StepCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        background: "#ffffff",
        borderRadius: "20px",
        border: "1px solid #e8ebed",
        boxShadow: "0 4px 20px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)",
        padding: "36px 40px",
        width: "100%",
      }}
    >
      {children}
    </div>
  );
}

export function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label
      style={{
        fontSize: "12px", fontWeight: 600, color: "#6b7280",
        letterSpacing: "0.04em", textTransform: "uppercase",
        display: "block", marginBottom: "6px",
      }}
    >
      {children}
      {required && <span style={{ color: "#dc2626", marginLeft: "2px" }}>*</span>}
    </label>
  );
}

export function FieldInput({
  value, onChange, placeholder, type = "text", error, icon, disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <div>
      <div
        className="flex items-center gap-2"
        style={{
          border: `1.5px solid ${error ? "#dc2626" : "#e8ebed"}`,
          borderRadius: "10px", padding: "0 14px",
          height: "48px", background: disabled ? "#f9fafb" : "#ffffff",
          transition: "border-color 0.15s",
        }}
        onFocus={(e) => e.currentTarget.style.borderColor = "#748efe"}
        onBlur={(e) => e.currentTarget.style.borderColor = error ? "#dc2626" : "#e8ebed"}
      >
        {icon && <span style={{ color: "#9ca3af", flexShrink: 0 }}>{icon}</span>}
        <input
          type={type}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-none outline-none focus:ring-0"
          style={{ fontSize: "14px", color: "#181d2a" }}
        />
      </div>
      {error && (
        <p style={{ fontSize: "12px", color: "#dc2626", marginTop: "4px" }}>{error}</p>
      )}
    </div>
  );
}

export function FieldSelect({
  value, onChange, options, error, icon,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  error?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <div
        className="flex items-center gap-2"
        style={{
          border: `1.5px solid ${error ? "#dc2626" : "#e8ebed"}`,
          borderRadius: "10px", padding: "0 14px",
          height: "48px", background: "#ffffff",
        }}
      >
        {icon && <span style={{ color: "#9ca3af", flexShrink: 0 }}>{icon}</span>}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none focus:ring-0"
          style={{ fontSize: "14px", color: value ? "#181d2a" : "#9ca3af" }}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
      {error && (
        <p style={{ fontSize: "12px", color: "#dc2626", marginTop: "4px" }}>{error}</p>
      )}
    </div>
  );
}

export function NavButtons({
  onBack, onNext, nextLabel = "Continue", nextDisabled = false, loading = false,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  loading?: boolean;
}) {
  return (
    <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: "1px solid #f0f1f3" }}>
      {onBack ? (
        <button
          onClick={onBack}
          className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 rounded-lg transition-all"
          style={{
            padding: "11px 22px", fontSize: "14px", fontWeight: 600,
            color: "#6b7280", border: "1.5px solid #e8ebed", borderRadius: "10px",
            background: "#ffffff", cursor: "pointer",
          }}
          onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.background = "#f8fafc"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#d1d5db"; }}
          onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.background = "#ffffff"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#e8ebed"; }}
        >
          ← Back
        </button>
      ) : <div />}

      <button
        onClick={onNext}
        disabled={nextDisabled || loading}
        className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.97] transition-all"
        style={{
          padding: "13px 32px", fontSize: "14px", fontWeight: 700,
          background: nextDisabled ? "#e8ebed" : "linear-gradient(135deg, #5b6efe 0%, #748efe 100%)",
          color: nextDisabled ? "#9ca3af" : "white",
          borderRadius: "12px", border: "none",
          cursor: nextDisabled ? "not-allowed" : "pointer",
          minWidth: "160px", justifyContent: "center",
          boxShadow: nextDisabled ? "none" : "0 4px 14px rgba(116,142,254,0.35)",
        }}
        onMouseOver={e => { if (!nextDisabled) (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(116,142,254,0.45)"; }}
        onMouseOut={e => { if (!nextDisabled) (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 14px rgba(116,142,254,0.35)"; }}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12" />
            </svg>
            Processing...
          </span>
        ) : (
          nextLabel
        )}
      </button>
    </div>
  );
}
