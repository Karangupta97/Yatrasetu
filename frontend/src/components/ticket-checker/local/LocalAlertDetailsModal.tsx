"use client";

import { X } from "lucide-react";
import type { LocalAlert } from "@/types/localTc";

interface LocalAlertDetailsModalProps {
  open: boolean;
  alert: LocalAlert | null;
  onClose: () => void;
}

export default function LocalAlertDetailsModal({
  open,
  alert,
  onClose,
}: LocalAlertDetailsModalProps) {
  if (!open || !alert) return null;

  return (
    <div className="auth-modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="auth-modal__close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
        <h2 className="auth-modal__title">{alert.title}</h2>
        <p className="auth-modal__subtitle">{alert.time}</p>
        <dl className="tc-detail-list">
          <div className="tc-detail-list__row">
            <dt>Type</dt>
            <dd className="tc-detail-list__capitalize">{alert.type.replace("_", " ")}</dd>
          </div>
          <div className="tc-detail-list__row">
            <dt>Message</dt>
            <dd>{alert.message}</dd>
          </div>
          <div className="tc-detail-list__row">
            <dt>Status</dt>
            <dd>{alert.read ? "Read" : "Unread"}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
