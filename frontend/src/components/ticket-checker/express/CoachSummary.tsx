"use client";

import { memo } from "react";
import type { CoachStats } from "@/types/expressTc";

interface CoachSummaryProps {
  coaches: CoachStats[];
}

const STATUS_LABELS = {
  verified: "Verified",
  pending: "Pending",
  not_started: "Not Started",
} as const;

function CoachSummary({ coaches }: CoachSummaryProps) {
  return (
    <section className="tc-panel tc-coach-panel" aria-labelledby="tc-coach-title">
      <div className="tc-panel__head">
        <h2 id="tc-coach-title" className="tc-panel__title">Coach Summary</h2>
        <button type="button" className="tc-link-btn">View All</button>
      </div>

      <div className="tc-coach-row">
        {coaches.map((coach) => (
          <div key={coach.code} className={`tc-coach-chip tc-coach-chip--${coach.status}`}>
            <span className="tc-coach-chip__code">{coach.code}</span>
            <span className="tc-coach-chip__count">
              {String(coach.verified).padStart(2, "0")}/{coach.capacity}
            </span>
            <span className={`tc-coach-chip__status tc-coach-chip__status--${coach.status}`}>
              {STATUS_LABELS[coach.status]}
            </span>
          </div>
        ))}
      </div>

      <div className="tc-coach-legend" aria-hidden="true">
        <span><i className="tc-coach-legend__dot tc-coach-legend__dot--verified" />Verified</span>
        <span><i className="tc-coach-legend__dot tc-coach-legend__dot--pending" />Pending</span>
        <span><i className="tc-coach-legend__dot tc-coach-legend__dot--not_started" />Not Started</span>
      </div>
    </section>
  );
}

export default memo(CoachSummary);
