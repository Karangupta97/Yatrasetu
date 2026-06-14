"use client";

import { X } from "lucide-react";
import type { RevenueStats } from "@/types/localTc";

interface LocalRevenueDetailsModalProps {
  open: boolean;
  revenue: RevenueStats;
  onClose: () => void;
}

function formatCurrency(amount: number): string {
  return `₹ ${amount.toLocaleString("en-IN")}`;
}

export default function LocalRevenueDetailsModal({
  open,
  revenue,
  onClose,
}: LocalRevenueDetailsModalProps) {
  if (!open) return null;

  return (
    <div className="auth-modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="auth-modal__close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
        <h2 className="auth-modal__title">Revenue Recovery Details</h2>
        <p className="auth-modal__subtitle">Breakdown of recovered revenue for this duty session.</p>
        <dl className="tc-detail-list">
          <div className="tc-detail-list__row">
            <dt>Today&apos;s Recovery</dt>
            <dd>{formatCurrency(revenue.today)}</dd>
          </div>
          <div className="tc-detail-list__row">
            <dt>This Week</dt>
            <dd>{formatCurrency(revenue.thisWeek)}</dd>
          </div>
          <div className="tc-detail-list__row">
            <dt>This Month</dt>
            <dd>{formatCurrency(revenue.thisMonth)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
