"use client";

import { memo } from "react";
import { AlertTriangle, Bell, Copy } from "lucide-react";
import type { AlertType, TcAlert } from "@/types/expressTc";

interface AlertsPanelProps {
  alerts: TcAlert[];
  onViewAll: () => void;
  onViewDetails: (alert: TcAlert) => void;
}

const ALERT_ICONS: Record<AlertType, typeof Bell> = {
  duplicate: Copy,
  invalid: AlertTriangle,
  journey: AlertTriangle,
  system: Bell,
};

function AlertsPanel({ alerts, onViewAll, onViewDetails }: AlertsPanelProps) {
  return (
    <section className="tc-panel tc-alerts-panel" aria-labelledby="tc-alerts-title">
      <div className="tc-panel__head">
        <h2 id="tc-alerts-title" className="tc-panel__title">Alerts</h2>
        <button type="button" className="tc-link-btn" onClick={onViewAll}>
          View All
        </button>
      </div>

      <ul className="tc-alerts-list">
        {alerts.length === 0 ? (
          <li className="tc-alerts-list__empty">No alerts for this duty session.</li>
        ) : (
          alerts.map((alert) => {
            const Icon = ALERT_ICONS[alert.type];
            return (
              <li key={alert.id} className={`tc-alerts-list__item tc-alerts-list__item--${alert.type}`}>
                <button
                  type="button"
                  className="tc-alerts-list__button"
                  onClick={() => onViewDetails(alert)}
                  aria-label={`View alert: ${alert.title}`}
                >
                  <div className={`tc-alerts-list__icon tc-alerts-list__icon--${alert.type}`}>
                    <Icon size={14} strokeWidth={2.5} aria-hidden="true" />
                  </div>
                  <div className="tc-alerts-list__body">
                    <p className="tc-alerts-list__message">{alert.message}</p>
                    <time className="tc-alerts-list__time">{alert.time}</time>
                  </div>
                </button>
              </li>
            );
          })
        )}
      </ul>
    </section>
  );
}

export default memo(AlertsPanel);
