import { Train } from "lucide-react";
import Link from "next/link";

export default function EmptyState() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 0",
        textAlign: "center",
      }}
    >
      <Train size={64} style={{ color: "#E5E7EB", marginBottom: "16px" }} />

      <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#374151", margin: "0 0 8px 0" }}>
        No bookings found
      </h3>
      <p style={{ fontSize: "13px", color: "#9CA3AF", margin: "0 0 20px 0" }}>
        Try a different filter or search term
      </p>

      <Link
        href="/browse-tickets"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: "#6366F1",
          color: "white",
          borderRadius: "10px",
          padding: "10px 20px 10px 16px",
          fontSize: "14px",
          fontWeight: 600,
          border: "none",
          cursor: "pointer",
          textDecoration: "none",
          transition: "background-color 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#4F46E5";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#6366F1";
        }}
      >
        <Train size={14} />
        <span>Book a Ticket</span>
      </Link>
    </div>
  );
}
