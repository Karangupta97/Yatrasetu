"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { RAILWAY_ZONES, SHIFTS, getRoutesForZone } from "@/lib/localRouteCatalog";

interface LocalStartDutyModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (zone: string, route: string, shift: string) => void;
}

function LocalStartDutyForm({
  onClose,
  onSubmit,
}: Omit<LocalStartDutyModalProps, "open">) {
  const [zone, setZone] = useState<string>(RAILWAY_ZONES[0]);
  const [route, setRoute] = useState("");
  const [shift, setShift] = useState<string>(SHIFTS[0]);
  const [error, setError] = useState("");

  const routes = getRoutesForZone(zone);
  const selectedRoute = route || routes[0] || "";

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!zone.trim()) {
      setError("Railway zone is required.");
      return;
    }
    if (!selectedRoute) {
      setError("Route is required.");
      return;
    }
    if (!shift.trim()) {
      setError("Shift is required.");
      return;
    }
    onSubmit(zone, selectedRoute, shift);
  }

  return (
    <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
      <button type="button" className="auth-modal__close" onClick={onClose} aria-label="Close">
        <X size={20} />
      </button>
      <h2 className="auth-modal__title">Start Duty</h2>
      <p className="auth-modal__subtitle">Select zone, route, and shift to begin local ticket checking.</p>
      <form onSubmit={handleSubmit}>
        <div className="reg-field">
          <label className="reg-label" htmlFor="local-duty-zone">Railway Zone</label>
          <select
            id="local-duty-zone"
            className="reg-input"
            value={zone}
            onChange={(e) => {
              setZone(e.target.value);
              setRoute("");
            }}
          >
            {RAILWAY_ZONES.map((z) => (
              <option key={z} value={z}>{z}</option>
            ))}
          </select>
        </div>
        <div className="reg-field">
          <label className="reg-label" htmlFor="local-duty-route">Route</label>
          <select
            id="local-duty-route"
            className="reg-input"
            value={selectedRoute}
            onChange={(e) => setRoute(e.target.value)}
          >
            {routes.length === 0 ? (
              <option value="">No routes available for this zone</option>
            ) : (
              routes.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))
            )}
          </select>
        </div>
        <div className="reg-field">
          <label className="reg-label" htmlFor="local-duty-shift">Shift</label>
          <select id="local-duty-shift" className="reg-input" value={shift} onChange={(e) => setShift(e.target.value)}>
            {SHIFTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        {error && <p className="auth-modal__error">{error}</p>}
        <button type="submit" className="reg-btn reg-btn--primary">Start Duty</button>
      </form>
    </div>
  );
}

export default function LocalStartDutyModal({ open, onClose, onSubmit }: LocalStartDutyModalProps) {
  if (!open) return null;
  return (
    <div className="auth-modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <LocalStartDutyForm onClose={onClose} onSubmit={onSubmit} />
    </div>
  );
}
