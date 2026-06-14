"use client";

import { memo } from "react";
import { IndianRupee } from "lucide-react";
import type { RevenueStats } from "@/types/localTc";

interface LocalRevenueRecoveryProps {
  revenue: RevenueStats;
  onViewDetails: () => void;
}

function formatCurrency(amount: number): string {
  return `₹ ${amount.toLocaleString("en-IN")}`;
}

function LocalRevenueRecovery({ revenue, onViewDetails }: LocalRevenueRecoveryProps) {
  return (
    <section className="tc-panel tc-revenue-panel" aria-labelledby="tc-local-revenue-title">
      <div className="tc-panel__head">
        <h2 id="tc-local-revenue-title" className="tc-panel__title">Revenue Recovery</h2>
        <button type="button" className="tc-link-btn" onClick={onViewDetails}>View Details</button>
      </div>
      <div className="tc-revenue-hero">
        <div>
          <span className="tc-revenue-hero__label">Today&apos;s Recovery</span>
          <span className="tc-revenue-hero__value">{formatCurrency(revenue.today)}</span>
        </div>
        <div className="tc-revenue-hero__icon" aria-hidden="true">
          <IndianRupee size={28} strokeWidth={2} />
        </div>
      </div>
      <div className="tc-revenue-footer tc-revenue-footer--local">
        <div>
          <span className="tc-revenue-footer__label">This Week</span>
          <span className="tc-revenue-footer__value">{formatCurrency(revenue.thisWeek)}</span>
        </div>
        <div>
          <span className="tc-revenue-footer__label">This Month</span>
          <span className="tc-revenue-footer__value">{formatCurrency(revenue.thisMonth)}</span>
        </div>
      </div>
    </section>
  );
}

export default memo(LocalRevenueRecovery);
