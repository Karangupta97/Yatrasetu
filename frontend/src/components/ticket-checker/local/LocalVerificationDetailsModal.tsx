"use client";

import { Check, X } from "lucide-react";
import type { LocalVerification, VerificationStatus } from "@/types/localTc";
import { getTicketTypeLabel } from "@/types/localTc";

interface LocalVerificationDetailsModalProps {
  open: boolean;
  verification: LocalVerification | null;
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

export default function LocalVerificationDetailsModal({
  open,
  verification,
  onClose,
}: LocalVerificationDetailsModalProps) {
  if (!open || !verification) return null;

  return (
    <div className="auth-modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="auth-modal__close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
        <h2 className="auth-modal__title">
          {verification.isPass ? "Pass Details" : "Ticket Details"}
        </h2>
        <p className="auth-modal__subtitle">Verified at {verification.time}</p>
        <dl className="tc-detail-list">
          {verification.isPass ? (
            <>
              <div className="tc-detail-list__row">
                <dt>Passenger Name</dt>
                <dd>{verification.passengerName ?? "—"}</dd>
              </div>
              <div className="tc-detail-list__row">
                <dt>Pass Type</dt>
                <dd>{getTicketTypeLabel(verification.ticketType)}</dd>
              </div>
              <div className="tc-detail-list__row">
                <dt>Validity</dt>
                <dd>{verification.validity ?? "—"}</dd>
              </div>
              <div className="tc-detail-list__row">
                <dt>Source</dt>
                <dd>{verification.source}</dd>
              </div>
              <div className="tc-detail-list__row">
                <dt>Destination</dt>
                <dd>{verification.destination}</dd>
              </div>
            </>
          ) : (
            <>
              <div className="tc-detail-list__row">
                <dt>Ticket Type</dt>
                <dd>{getTicketTypeLabel(verification.ticketType)}</dd>
              </div>
              <div className="tc-detail-list__row">
                <dt>Ticket Number</dt>
                <dd>{verification.ticketNumber ?? "—"}</dd>
              </div>
              <div className="tc-detail-list__row">
                <dt>Source Station</dt>
                <dd>{verification.source}</dd>
              </div>
              <div className="tc-detail-list__row">
                <dt>Destination Station</dt>
                <dd>{verification.destination}</dd>
              </div>
              <div className="tc-detail-list__row">
                <dt>Issue Time</dt>
                <dd>{verification.issueTime ?? verification.time}</dd>
              </div>
              <div className="tc-detail-list__row">
                <dt>Expiry Time</dt>
                <dd>{verification.expiryTime ?? "—"}</dd>
              </div>
              <div className="tc-detail-list__row">
                <dt>Fare</dt>
                <dd>{verification.fare != null ? `₹ ${verification.fare}` : "—"}</dd>
              </div>
            </>
          )}
          <div className="tc-detail-list__row">
            <dt>Status</dt>
            <dd><StatusBadge status={verification.status} /></dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
