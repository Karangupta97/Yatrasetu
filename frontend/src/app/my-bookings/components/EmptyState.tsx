type EmptyStateProps = {
  onBookTicket?: () => void;
};

export default function EmptyState({ onBookTicket }: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-8"
      style={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #e8ebed" }}
    >
      {/* Illustration */}
      <div
        className="flex items-center justify-center mb-6"
        style={{ width: "120px", height: "120px", borderRadius: "50%", background: "rgba(116,142,254,0.08)" }}
        aria-hidden="true"
      >
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="18" width="48" height="32" rx="6" fill="#e8ebed" />
          <rect x="14" y="24" width="20" height="4" rx="2" fill="#748efe" opacity="0.5" />
          <rect x="14" y="32" width="32" height="3" rx="1.5" fill="#748efe" opacity="0.3" />
          <rect x="14" y="38" width="24" height="3" rx="1.5" fill="#748efe" opacity="0.2" />
          <circle cx="44" cy="44" r="12" fill="#f0f2f5" />
          <path d="M40 44h8M44 40v8" stroke="#748efe" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#181d2a", marginBottom: "8px" }}>
        No bookings found
      </h3>
      <p style={{ fontSize: "14px", color: "#9ca3af", marginBottom: "24px", textAlign: "center", maxWidth: "280px" }}>
        You don&apos;t have any bookings in this category.
      </p>

      <button
        onClick={onBookTicket}
        className="inline-flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 hover:opacity-90 active:scale-[0.97] transition-all"
        style={{
          background: "#748efe", color: "white",
          borderRadius: "12px", padding: "12px 28px",
          fontSize: "14px", fontWeight: 600,
          border: "none", cursor: "pointer",
        }}
      >
        Book a train
      </button>
    </div>
  );
}
