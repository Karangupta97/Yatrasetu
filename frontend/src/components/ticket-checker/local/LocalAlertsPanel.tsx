"use client";

import { memo } from "react";
import { AlertTriangle, Bell, Copy, Clock } from "lucide-react";
import type { LocalAlert, LocalAlertType } from "@/types/localTc";

interface LocalAlertsPanelProps {
  alerts: LocalAlert[];
  onViewAll: () => void;
  onViewDetails: (alert: LocalAlert) => void;
}

const ALERT_ICONS: Record<LocalAlertType, typeof Bell> = {
  invalid: AlertTriangle,
  expired_pass: Clock,
  duplicate: Copy,
  system: Bell,
};

function LocalAlertsPanel({ alerts, onViewAll, onViewDetails }: LocalAlertsPanelProps) {
  return (
    <section className="tc-panel tc-alerts-panel" aria-labelledby="tc-local-alerts-title">
      <div className="tc-panel__head">
        <h2 id="tc-local-alerts-title" className="tc-panel__title">Alerts</h2>
        <button type="button" className="tc-link-btn" onClick={onViewAll}>View All</button>
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

export default memo(LocalAlertsPanel);
