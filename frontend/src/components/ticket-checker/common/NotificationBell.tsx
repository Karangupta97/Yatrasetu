"use client";

import { memo } from "react";
import { Bell } from "lucide-react";

interface NotificationBellProps {
  count: number;
}

function NotificationBell({ count }: NotificationBellProps) {
  return (
    <button
      type="button"
      className="tc-icon-btn"
      aria-label={`Notifications${count > 0 ? `, ${count} unread` : ""}`}
    >
      <Bell size={20} strokeWidth={2} />
      {count > 0 && (
        <span className="tc-icon-btn__badge" aria-hidden="true">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
}

export default memo(NotificationBell);
