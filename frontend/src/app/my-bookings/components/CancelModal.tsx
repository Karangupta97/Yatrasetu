"use client";

import { X } from "lucide-react";

type CancelModalProps = {
  refundAmount: number;
  onConfirm: () => void;
  onClose: () => void;
};

export default function CancelModal({ refundAmount, onConfirm, onClose }: CancelModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.45)" }}
      role="dialog"
      aria-modal="true"
      aria-label="Cancel booking confirmation"
    >
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal card */}
      <div
        className="relative"
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          padding: "28px",
          width: "100%",
          maxWidth: "400px",
          margin: "0 16px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2"
          style={{ top: "16px", right: "16px", width: "32px", height: "32px" }}
          aria-label="Close modal"
        >
          <X size={16} style={{ color: "#6b7280" }} />
        </button>

        <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#181d2a", marginBottom: "8px" }}>
          Cancel Booking
        </h2>
        <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "20px" }}>
          Are you sure you want to cancel this booking?
        </p>

        {/* Refund estimate */}
        <div
          style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "10px",
            padding: "14px 16px",
            marginBottom: "24px",
          }}
        >
          <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>
            Estimated refund amount
          </p>
          <p style={{ fontSize: "24px", fontWeight: 700, color: "#16a34a", lineHeight: 1 }}>
            ₹{refundAmount.toLocaleString("en-IN")}.00
          </p>
          <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>
            (After deduction of total cancellation charges)
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 focus:outline-none focus-visible:ring-2 hover:bg-gray-50 transition-colors"
            style={{
              background: "#ffffff",
              border: "1px solid #e8ebed",
              borderRadius: "10px",
              height: "44px",
              fontSize: "14px",
              fontWeight: 600,
              color: "#181d2a",
              cursor: "pointer",
            }}
          >
            Keep Booking
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 focus:outline-none focus-visible:ring-2 hover:opacity-90 active:scale-[0.97] transition-all"
            style={{
              background: "#dc2626",
              color: "white",
              borderRadius: "10px",
              height: "44px",
              fontSize: "14px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            Confirm Cancellation
          </button>
        </div>
      </div>
    </div>
  );
}
