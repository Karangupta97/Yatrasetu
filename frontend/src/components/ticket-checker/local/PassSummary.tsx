"use client";

import { memo } from "react";
import { TrendingUp } from "lucide-react";
import type { PassSummaryStats } from "@/types/localTc";

interface PassSummaryProps {
  passSummary: PassSummaryStats;
}

const ITEMS = [
  { key: "dailyPass" as const, label: "Daily Pass" },
  { key: "monthlyPass" as const, label: "Monthly Pass" },
  { key: "quarterlyPass" as const, label: "Quarterly Pass" },
  { key: "yearlyPass" as const, label: "Yearly Pass" },
  { key: "studentPass" as const, label: "Student Pass" },
];

function PassSummary({ passSummary }: PassSummaryProps) {
  return (
    <section className="tc-panel tc-pass-panel" aria-labelledby="tc-pass-title">
      <h2 id="tc-pass-title" className="tc-panel__title">Pass Type Summary</h2>
      <div className="tc-pass-row">
        {ITEMS.map(({ key, label }) => {
          const trend = passSummary.trends[key];
          return (
            <div key={key} className="tc-pass-chip">
              <span className="tc-pass-chip__label">{label}</span>
              <span className="tc-pass-chip__count">{passSummary[key]}</span>
              <span className="tc-pass-chip__trend">
                <TrendingUp size={11} aria-hidden="true" />
                {trend}%
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default memo(PassSummary);
