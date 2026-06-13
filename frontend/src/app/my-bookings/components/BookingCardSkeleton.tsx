export default function BookingCardSkeleton() {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e8ebed",
        borderRadius: "12px",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
      }}
      aria-hidden="true"
    >
      {/* Icon + PNR skeleton */}
      <div className="flex-shrink-0 flex flex-col items-center gap-2">
        <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#f1f5f9" }} className="animate-pulse" />
        <div style={{ width: "72px", height: "12px", borderRadius: "6px", background: "#f1f5f9" }} className="animate-pulse" />
      </div>

      {/* Content skeleton */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div style={{ width: "55%", height: "16px", borderRadius: "6px", background: "#f1f5f9" }} className="animate-pulse" />
        <div style={{ width: "70%", height: "13px", borderRadius: "6px", background: "#f1f5f9" }} className="animate-pulse" />
        <div className="flex gap-3">
          <div style={{ width: "90px", height: "12px", borderRadius: "6px", background: "#f1f5f9" }} className="animate-pulse" />
          <div style={{ width: "110px", height: "12px", borderRadius: "6px", background: "#f1f5f9" }} className="animate-pulse" />
          <div style={{ width: "60px", height: "12px", borderRadius: "6px", background: "#f1f5f9" }} className="animate-pulse" />
        </div>
      </div>

      {/* Right skeleton */}
      <div className="flex-shrink-0 flex flex-col items-end gap-2">
        <div style={{ width: "80px", height: "12px", borderRadius: "6px", background: "#f1f5f9" }} className="animate-pulse" />
        <div style={{ width: "72px", height: "24px", borderRadius: "9999px", background: "#f1f5f9" }} className="animate-pulse" />
      </div>
    </div>
  );
}
