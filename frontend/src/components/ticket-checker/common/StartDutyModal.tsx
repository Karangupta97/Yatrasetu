"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { getSupportedTrainNumbers } from "@/lib/trainCatalog";

interface StartDutyModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (trainNumber: string, coachAssignment?: string) => void;
}

function StartDutyForm({
  onClose,
  onSubmit,
}: Omit<StartDutyModalProps, "open">) {
  const [trainNumber, setTrainNumber] = useState("");
  const [coachAssignment, setCoachAssignment] = useState("");
  const [error, setError] = useState("");
  const supported = getSupportedTrainNumbers();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = trainNumber.trim();
    if (!trimmed) {
      setError("Train number is required.");
      return;
    }
    onSubmit(trimmed, coachAssignment.trim() || undefined);
  }

  return (
    <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
      <button type="button" className="auth-modal__close" onClick={onClose} aria-label="Close">
        <X size={20} />
      </button>

      <h2 id="start-duty-title" className="auth-modal__title">Start Duty</h2>
      <p className="auth-modal__subtitle">
        Enter train details to begin verification. Supported trains: {supported.join(", ")}.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="reg-field">
          <label className="reg-label" htmlFor="start-duty-train">
            Train Number <span aria-hidden="true">*</span>
          </label>
          <input
            id="start-duty-train"
            className="reg-input"
            value={trainNumber}
            onChange={(e) => setTrainNumber(e.target.value)}
            placeholder="e.g. 12295"
            autoComplete="off"
          />
        </div>

        <div className="reg-field">
          <label className="reg-label" htmlFor="start-duty-coach">
            Coach Assignment
          </label>
          <input
            id="start-duty-coach"
            className="reg-input"
            value={coachAssignment}
            onChange={(e) => setCoachAssignment(e.target.value)}
            placeholder="e.g. A1 (optional)"
            autoComplete="off"
          />
        </div>

        {error && <p className="auth-modal__error">{error}</p>}

        <button type="submit" className="reg-btn reg-btn--primary">
          Start Duty
        </button>
      </form>
    </div>
  );
}

export default function StartDutyModal({ open, onClose, onSubmit }: StartDutyModalProps) {
  if (!open) return null;

  return (
    <div
      className="auth-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="start-duty-title"
      onClick={onClose}
    >
      <StartDutyForm onClose={onClose} onSubmit={onSubmit} />
    </div>
  );
}
