"use client";

import { memo } from "react";
import { Check, X } from "lucide-react";
import type { RecentVerification, VerificationStatus } from "@/types/expressTc";

interface RecentVerificationsProps {
  verifications: RecentVerification[];
  onViewAll: () => void;
  onViewDetails: (verification: RecentVerification) => void;
}

function StatusCell({ status }: { status: VerificationStatus }) {
  if (status === "valid") {
    return (
      <span className="tc-status tc-status--valid">
        <Check size={12} strokeWidth={3} aria-hidden="true" />
        Valid
      </span>
    );
  }
  if (status === "invalid") {
    return (
      <span className="tc-status tc-status--invalid">
        <X size={12} strokeWidth={3} aria-hidden="true" />
        Invalid
      </span>
    );
  }
  return <span className="tc-status tc-status--pending">{status}</span>;
}

function RecentVerifications({
  verifications,
  onViewAll,
  onViewDetails,
}: RecentVerificationsProps) {
  const rows = verifications.slice(0, 5);

  return (
    <section className="tc-panel tc-recent-panel" aria-labelledby="tc-recent-title">
      <div className="tc-panel__head">
        <h2 id="tc-recent-title" className="tc-panel__title">Recent Verifications</h2>
        <button type="button" className="tc-link-btn" onClick={onViewAll}>
          View All
        </button>
      </div>

      <div className="tc-recent-table-wrap">
        <table className="tc-recent-table">
          <thead>
            <tr>
              <th scope="col">Time</th>
              <th scope="col">Passenger Name</th>
              <th scope="col">PNR</th>
              <th scope="col">Coach/Berth</th>
              <th scope="col">From</th>
              <th scope="col">To</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="tc-recent-table__empty">
                  No verifications yet. Scan a ticket to begin.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className="tc-recent-table__row"
                  onClick={() => onViewDetails(row)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onViewDetails(row);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`View details for ${row.passenger}`}
                >
                  <td>{row.time}</td>
                  <td>{row.passenger}</td>
                  <td className="tc-recent-table__pnr">{row.pnr}</td>
                  <td>{row.coachBerth}</td>
                  <td>{row.source}</td>
                  <td>{row.destination}</td>
                  <td><StatusCell status={row.status} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="tc-recent-cards">
        {rows.length === 0 ? (
          <p className="tc-recent-cards__empty">No verifications yet. Scan a ticket to begin.</p>
        ) : (
          rows.map((row) => (
            <article key={row.id} className="tc-recent-card">
              <div className="tc-recent-card__head">
                <span className="tc-recent-card__name">{row.passenger}</span>
                <StatusCell status={row.status} />
              </div>
              <div className="tc-recent-card__meta">
                <span>{row.time}</span>
                <span className="tc-recent-card__pnr">{row.pnr}</span>
              </div>
              <div className="tc-recent-card__route">
                {row.coachBerth} · {row.source} → {row.destination}
              </div>
              <button
                type="button"
                className="tc-link-btn"
                onClick={() => onViewDetails(row)}
              >
                View Details
              </button>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

export default memo(RecentVerifications);
