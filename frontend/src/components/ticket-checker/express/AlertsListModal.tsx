"use client";

import { AlertTriangle, Bell, Copy, X } from "lucide-react";
import type { AlertType, TcAlert } from "@/types/expressTc";

interface AlertsListModalProps {
  open: boolean;
  alerts: TcAlert[];
  onClose: () => void;
  onSelect: (alert: TcAlert) => void;
}

const ALERT_ICONS: Record<AlertType, typeof Bell> = {
  duplicate: Copy,
  invalid: AlertTriangle,
  journey: AlertTriangle,
  system: Bell,
};

export default function AlertsListModal({
  open,
  alerts,
  onClose,
  onSelect,
}: AlertsListModalProps) {
  if (!open) return null;

  return (
    <div
      className="auth-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="alerts-all-title"
      onClick={onClose}
    >
      <div className="auth-modal auth-modal--wide" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="auth-modal__close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <h2 id="alerts-all-title" className="auth-modal__title">All Alerts</h2>
        <p className="auth-modal__subtitle">Select an alert to view details.</p>

        <ul className="tc-modal-alerts-list">
          {alerts.map((alert) => {
            const Icon = ALERT_ICONS[alert.type];
            return (
              <li key={alert.id} className="tc-modal-alerts-list__item">
                <div className={`tc-alerts-list__icon tc-alerts-list__icon--${alert.type}`}>
                  <Icon size={14} strokeWidth={2.5} aria-hidden="true" />
                </div>
                <div className="tc-modal-alerts-list__body">
                  <p className="tc-alerts-list__message">{alert.message}</p>
                  <time className="tc-alerts-list__time">{alert.time}</time>
                </div>
                <button type="button" className="tc-link-btn" onClick={() => onSelect(alert)}>
                  View Details
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
