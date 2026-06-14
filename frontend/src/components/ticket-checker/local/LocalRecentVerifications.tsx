"use client";

import { memo } from "react";
import { Check, X } from "lucide-react";
import type { LocalVerification, VerificationStatus } from "@/types/localTc";
import { getTicketTypeLabel } from "@/types/localTc";

interface LocalRecentVerificationsProps {
  verifications: LocalVerification[];
  onViewAll: () => void;
  onViewDetails: (verification: LocalVerification) => void;
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

function TypePill({ type }: { type: LocalVerification["ticketType"] }) {
  return (
    <span className={`tc-ticket-pill tc-ticket-pill--${type}`}>
      {getTicketTypeLabel(type)}
    </span>
  );
}

function LocalRecentVerifications({
  verifications,
  onViewAll,
  onViewDetails,
}: LocalRecentVerificationsProps) {
  const rows = verifications.slice(0, 5);

  return (
    <section className="tc-panel tc-recent-panel" aria-labelledby="tc-local-recent-title">
      <div className="tc-panel__head">
        <h2 id="tc-local-recent-title" className="tc-panel__title">Recent Verifications</h2>
        <button type="button" className="tc-link-btn" onClick={onViewAll}>View All</button>
      </div>

      <div className="tc-recent-table-wrap">
        <table className="tc-recent-table">
          <thead>
            <tr>
              <th scope="col">Time</th>
              <th scope="col">Type</th>
              <th scope="col">Details</th>
              <th scope="col">From</th>
              <th scope="col">To</th>
              <th scope="col">Fare</th>
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
                >
                  <td>{row.time}</td>
                  <td><TypePill type={row.ticketType} /></td>
                  <td>{row.isPass ? row.passengerName : row.ticketNumber}</td>
                  <td>{row.source}</td>
                  <td>{row.destination}</td>
                  <td>{row.fare != null ? `₹ ${row.fare}` : "—"}</td>
                  <td><StatusCell status={row.status} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="tc-recent-cards">
        {rows.length === 0 ? (
          <p className="tc-recent-cards__empty">No verifications yet.</p>
        ) : (
          rows.map((row) => (
            <article key={row.id} className="tc-recent-card">
              <div className="tc-recent-card__head">
                {row.isPass ? (
                  <span className="tc-recent-card__name">{row.passengerName}</span>
                ) : (
                  <TypePill type={row.ticketType} />
                )}
                <StatusCell status={row.status} />
              </div>
              <div className="tc-recent-card__meta">
                <span>{row.time}</span>
                {!row.isPass && row.ticketNumber && (
                  <span className="tc-recent-card__pnr">{row.ticketNumber}</span>
                )}
              </div>
              <div className="tc-recent-card__route">
                {row.isPass ? (
                  <>{getTicketTypeLabel(row.ticketType)} · {row.source} → {row.destination}</>
                ) : (
                  <>{row.source} → {row.destination}{row.fare != null ? ` · ₹ ${row.fare}` : ""}</>
                )}
              </div>
              <button type="button" className="tc-link-btn" onClick={() => onViewDetails(row)}>
                View Details
              </button>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

export default memo(LocalRecentVerifications);
