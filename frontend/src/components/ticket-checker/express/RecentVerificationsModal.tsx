"use client";

import { Check, X } from "lucide-react";
import type { RecentVerification, VerificationStatus } from "@/types/expressTc";

interface RecentVerificationsModalProps {
  open: boolean;
  verifications: RecentVerification[];
  onClose: () => void;
  onSelect: (verification: RecentVerification) => void;
}

function StatusCell({ status }: { status: VerificationStatus }) {
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

export default function RecentVerificationsModal({
  open,
  verifications,
  onClose,
  onSelect,
}: RecentVerificationsModalProps) {
  if (!open) return null;

  return (
    <div
      className="auth-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="recent-all-title"
      onClick={onClose}
    >
      <div className="auth-modal auth-modal--wide" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="auth-modal__close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <h2 id="recent-all-title" className="auth-modal__title">All Verifications</h2>
        <p className="auth-modal__subtitle">Select a verification to view passenger details.</p>

        <div className="tc-modal-table-wrap">
          <table className="tc-recent-table">
            <thead>
              <tr>
                <th scope="col">Time</th>
                <th scope="col">Passenger</th>
                <th scope="col">PNR</th>
                <th scope="col">Status</th>
                <th scope="col" />
              </tr>
            </thead>
            <tbody>
              {verifications.map((row) => (
                <tr key={row.id}>
                  <td>{row.time}</td>
                  <td>{row.passenger}</td>
                  <td className="tc-recent-table__pnr">{row.pnr}</td>
                  <td><StatusCell status={row.status} /></td>
                  <td>
                    <button
                      type="button"
                      className="tc-link-btn"
                      onClick={() => onSelect(row)}
                    >
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
