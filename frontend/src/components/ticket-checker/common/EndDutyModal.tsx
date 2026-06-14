"use client";

import { X } from "lucide-react";

interface EndDutyModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function EndDutyModal({ open, onClose, onConfirm }: EndDutyModalProps) {
  if (!open) return null;

  return (
    <div
      className="auth-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="end-duty-title"
      onClick={onClose}
    >
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="auth-modal__close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <h2 id="end-duty-title" className="auth-modal__title">End Duty</h2>
        <p className="auth-modal__subtitle">
          Are you sure you want to end duty? Verification will be disabled and the active session will be cleared.
        </p>

        <div className="tc-modal-actions">
          <button type="button" className="reg-btn reg-btn--secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="reg-btn reg-btn--primary" onClick={onConfirm}>
            End Duty
          </button>
        </div>
      </div>
    </div>
  );
}
