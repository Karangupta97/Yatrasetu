"use client";

import { Check, X } from "lucide-react";
import type { RecentVerification, VerificationStatus } from "@/types/expressTc";

interface PassengerDetailsModalProps {
  open: boolean;
  verification: RecentVerification | null;
  onClose: () => void;
}

function StatusBadge({ status }: { status: VerificationStatus }) {
  if (status === "valid") {
    return (
      <span className="tc-status tc-status--valid">
        <Check size={12} strokeWidth={3} aria-hidden="true" />
        Valid
      </span>
    );
  }
  if (status === "invalid") {
    return (
      <span className="tc-status tc-status--invalid">
        <X size={12} strokeWidth={3} aria-hidden="true" />
        Invalid
      </span>
    );
  }
  return <span className="tc-status tc-status--pending">{status}</span>;
}

export default function PassengerDetailsModal({
  open,
  verification,
  onClose,
}: PassengerDetailsModalProps) {
  if (!open || !verification) return null;

  return (
    <div
      className="auth-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="passenger-details-title"
      onClick={onClose}
    >
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="auth-modal__close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <h2 id="passenger-details-title" className="auth-modal__title">Passenger Details</h2>
        <p className="auth-modal__subtitle">Verification at {verification.time}</p>

        <dl className="tc-detail-list">
          <div className="tc-detail-list__row">
            <dt>Passenger</dt>
            <dd>{verification.passenger}</dd>
          </div>
          <div className="tc-detail-list__row">
            <dt>PNR</dt>
            <dd>{verification.pnr}</dd>
          </div>
          <div className="tc-detail-list__row">
            <dt>Coach / Berth</dt>
            <dd>{verification.coachBerth}</dd>
          </div>
          <div className="tc-detail-list__row">
            <dt>From</dt>
            <dd>{verification.source}</dd>
          </div>
          <div className="tc-detail-list__row">
            <dt>To</dt>
            <dd>{verification.destination}</dd>
          </div>
          <div className="tc-detail-list__row">
            <dt>Status</dt>
            <dd><StatusBadge status={verification.status} /></dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
