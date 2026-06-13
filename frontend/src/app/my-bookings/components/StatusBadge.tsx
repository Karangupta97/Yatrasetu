import { BookingStatus } from "../data/mockBookings";

const STATUS_STYLES: Record<BookingStatus, React.CSSProperties> = {
  Confirmed:        { background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" },
  RAC:              { background: "#fffbeb", color: "#d97706", border: "1px solid #fde68a" },
  Waitlisted:       { background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe" },
  Cancelled:        { background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" },
  Completed:        { background: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0" },
  "Refund Initiated": { background: "#fdf4ff", color: "#9333ea", border: "1px solid #e9d5ff" },
};

export default function StatusBadge({ status, size = "md" }: { status: BookingStatus; size?: "sm" | "md" | "lg" }) {
  const fontSize = size === "sm" ? "11px" : size === "lg" ? "14px" : "12px";
  const padding  = size === "sm" ? "2px 8px" : size === "lg" ? "6px 16px" : "4px 12px";

  return (
    <span
      style={{
        ...STATUS_STYLES[status],
        fontSize,
        fontWeight: 600,
        padding,
        borderRadius: "9999px",
        display: "inline-flex",
        alignItems: "center",
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}
