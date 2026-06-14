"use client";

import { Check, X } from "lucide-react";
import type { LocalVerification, VerificationStatus } from "@/types/localTc";
import { getTicketTypeLabel } from "@/types/localTc";

interface LocalRecentVerificationsModalProps {
  open: boolean;
  verifications: LocalVerification[];
  onClose: () => void;
  onSelect: (verification: LocalVerification) => void;
}

function StatusCell({ status }: { status: VerificationStatus }) {
  if (status === "valid") {
    return <span className="tc-status tc-status--valid"><Check size={12} strokeWidth={3} /> Valid</span>;
  }
  if (status === "invalid") {
    return <span className="tc-status tc-status--invalid"><X size={12} strokeWidth={3} /> Invalid</span>;
  }
  return <span className="tc-status tc-status--pending">{status}</span>;
}

export default function LocalRecentVerificationsModal({
  open,
  verifications,
  onClose,
  onSelect,
}: LocalRecentVerificationsModalProps) {
  if (!open) return null;

  return (
    <div className="auth-modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="auth-modal auth-modal--wide" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="auth-modal__close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
        <h2 className="auth-modal__title">All Verifications</h2>
        <p className="auth-modal__subtitle">Select a verification to view details.</p>
        <div className="tc-modal-table-wrap">
          <table className="tc-recent-table">
            <thead>
              <tr>
                <th scope="col">Time</th>
                <th scope="col">Type</th>
                <th scope="col">Details</th>
                <th scope="col">Status</th>
                <th scope="col" />
              </tr>
            </thead>
            <tbody>
              {verifications.map((row) => (
                <tr key={row.id}>
                  <td>{row.time}</td>
                  <td>{getTicketTypeLabel(row.ticketType)}</td>
                  <td>{row.isPass ? row.passengerName : row.ticketNumber}</td>
                  <td><StatusCell status={row.status} /></td>
                  <td>
                    <button type="button" className="tc-link-btn" onClick={() => onSelect(row)}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
