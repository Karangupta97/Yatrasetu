"use client";

import { memo } from "react";
import Link from "next/link";
import { ChevronDown, Train, Wifi } from "lucide-react";
import type { LocalDutySession, RouteState, TcProfile } from "@/types/localTc";
import NotificationBell from "@/components/ticket-checker/common/NotificationBell";

interface LocalDashboardHeaderProps {
  route: RouteState;
  profile: TcProfile;
  notificationCount: number;
  dutySession: LocalDutySession | null;
  onStartDuty: () => void;
  onEndDuty: () => void;
}

function LocalDashboardHeader({
  route,
  profile,
  notificationCount,
  dutySession,
  onStartDuty,
  onEndDuty,
}: LocalDashboardHeaderProps) {
  const dutyActive = dutySession?.active ?? false;

  return (
    <header className="tc-header">
      <div className="tc-header__inner">
        <div className="tc-header__brand">
          <Link href="/" className="tc-header__logo-link" aria-label="YatraSetu home">
            <div className="tc-header__logo">
              <Train size={20} strokeWidth={2.5} />
            </div>
            <div>
              <span className="tc-header__wordmark">YatraSetu</span>
              <span className="tc-header__subtitle">TC Dashboard — Local Mode</span>
            </div>
          </Link>
        </div>

        <div className="tc-header__train">
          <div className="tc-header__train-top">
            <span className="tc-header__train-route">{route.routeLabel}</span>
            <span className="tc-local-badge">Local Mode</span>
          </div>
          <div className="tc-header__train-meta">
            {dutyActive ? (
              <>
                <span className="tc-header__duty-active">Duty Active</span>
                <span className="tc-header__meta-sep">|</span>
                <span>{dutySession?.zone}</span>
                <span className="tc-header__meta-sep">|</span>
                <span>Shift: <strong>{dutySession?.shift}</strong></span>
              </>
            ) : (
              <span>Unreserved Ticket Checking Dashboard</span>
            )}
          </div>
        </div>

        <div className="tc-header__actions">
          {dutyActive ? (
            <button type="button" className="tc-header__duty-btn tc-header__duty-btn--end" onClick={onEndDuty}>
              End Duty
            </button>
          ) : (
            <button type="button" className="tc-header__duty-btn tc-header__duty-btn--start" onClick={onStartDuty}>
              Start Duty
            </button>
          )}
          <span className="tc-header__online">
            <Wifi size={14} strokeWidth={2.5} aria-hidden="true" />
            Online
          </span>
          <NotificationBell count={notificationCount} />
          <div className="tc-header__profile">
            <div className="tc-header__avatar" aria-hidden="true">{profile.avatarInitials}</div>
            <div className="tc-header__profile-text">
              <span className="tc-header__profile-name">{profile.name}</span>
              <span className="tc-header__profile-id">TC ID: {profile.id}</span>
            </div>
            <ChevronDown size={16} className="tc-header__profile-chevron" aria-hidden="true" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default memo(LocalDashboardHeader);
