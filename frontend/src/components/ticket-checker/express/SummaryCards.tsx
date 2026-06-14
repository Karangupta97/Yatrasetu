"use client";

import { memo } from "react";
import {
  CheckCircle2,
  IndianRupee,
  Ticket,
  TrendingDown,
  TrendingUp,
  XCircle,
} from "lucide-react";
import type { SummaryStats } from "@/types/expressTc";

interface SummaryCardsProps {
  summary: SummaryStats;
}

const ITEMS = [
  { key: "ticketsChecked" as const, label: "Tickets Checked", icon: Ticket, tone: "blue" },
  { key: "validTickets" as const, label: "Valid Tickets", icon: CheckCircle2, tone: "green" },
  { key: "invalidTickets" as const, label: "Invalid Tickets", icon: XCircle, tone: "red" },
  { key: "revenueRecovered" as const, label: "Revenue Recovered", icon: IndianRupee, tone: "indigo" },
];

function formatValue(key: keyof SummaryStats, value: number): string {
  if (key === "revenueRecovered") return `₹ ${value.toLocaleString("en-IN")}`;
  return value.toLocaleString("en-IN");
}

function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <section className="tc-panel tc-summary-panel" aria-labelledby="tc-summary-title">
      <h2 id="tc-summary-title" className="tc-panel__title">Today&apos;s Summary</h2>
      <div className="tc-summary-grid">
        {ITEMS.map(({ key, label, icon: Icon, tone }) => {
          const trend = summary.trends[key];
          const up = trend >= 0;
          return (
            <div key={key} className={`tc-summary-tile tc-summary-tile--${tone}`}>
              <div className={`tc-summary-tile__icon tc-summary-tile__icon--${tone}`}>
                <Icon size={18} strokeWidth={2} aria-hidden="true" />
              </div>
              <div className="tc-summary-tile__body">
                <span className="tc-summary-tile__label">{label}</span>
                <span className="tc-summary-tile__value">
                  {formatValue(key, summary[key] as number)}
                </span>
                <span className={`tc-summary-tile__trend${up ? " tc-summary-tile__trend--up" : " tc-summary-tile__trend--down"}`}>
                  {up ? <TrendingUp size={12} aria-hidden="true" /> : <TrendingDown size={12} aria-hidden="true" />}
                  {Math.abs(trend)}% vs yesterday
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default memo(SummaryCards);
