import { BookingStatus } from "../data/mockBookings";

const STATUS_STYLES: Record<BookingStatus, React.CSSProperties> = {
  Confirmed:        { background: "#DCFCE7", color: "#16A34A", border: "1px solid #BBF7D0" },
  RAC:              { background: "#FEF9C3", color: "#A16207", border: "1px solid #FDE68A" },
  Waitlisted:       { background: "#FEF3C7", color: "#D97706", border: "1px solid #FDE68A" },
  Cancelled:        { background: "#FEE2E2", color: "#DC2626", border: "1px solid #FECACA" },
  Completed:        { background: "#F1F5F9", color: "#64748B", border: "1px solid #E2E8F0" },
  "Refund Initiated": { background: "#FEE2E2", color: "#DC2626", border: "1px solid #FECACA" },
};

export default function StatusBadge({ status, size = "md" }: { status: BookingStatus; size?: "sm" | "md" | "lg" }) {
  // Use 13px bold and 6px 16px padding for standard/default ("large pill" styling as per prompt)
  const fontSize = size === "sm" ? "11px" : "13px";
  const padding  = size === "sm" ? "3px 10px" : "6px 16px";

  return (
    <span
      style={{
        ...STATUS_STYLES[status],
        fontSize,
        fontWeight: 700,
        padding,
        borderRadius: "999px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}

