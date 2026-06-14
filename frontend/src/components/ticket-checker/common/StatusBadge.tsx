"use client";

import { memo } from "react";
import type { VerificationStatus } from "@/types/expressTc";

const STATUS_CONFIG: Record<
  VerificationStatus,
  { label: string; className: string }
> = {
  valid: { label: "Valid", className: "tc-badge--valid" },
  invalid: { label: "Invalid", className: "tc-badge--invalid" },
  duplicate: { label: "Duplicate", className: "tc-badge--duplicate" },
  pending: { label: "Pending", className: "tc-badge--pending" },
};

interface StatusBadgeProps {
  status: VerificationStatus;
}

function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={`tc-badge ${config.className}`}>
      {config.label}
    </span>
  );
}

export default memo(StatusBadge);
