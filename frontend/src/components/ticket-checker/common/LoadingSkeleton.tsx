"use client";

import { memo } from "react";

export function DashboardSkeleton() {
  return (
    <div className="tc-dashboard tc-dashboard--loading" aria-busy="true" aria-label="Loading dashboard">
      <div className="tc-skeleton tc-skeleton--header" />
      <div className="tc-skeleton tc-skeleton--stats" />
      <div className="tc-skeleton tc-skeleton--main" />
    </div>
  );
}

function LoadingSkeleton({ className = "" }: { className?: string }) {
  return <div className={`tc-skeleton ${className}`} aria-hidden="true" />;
}

export default memo(LoadingSkeleton);
