"use client";

import { memo } from "react";
import type { TcProfile } from "@/types/expressTc";

interface UserProfileProps {
  profile: TcProfile;
  online?: boolean;
}

function UserProfile({ profile, online = true }: UserProfileProps) {
  return (
    <div className="tc-profile">
      <div className="tc-profile__avatar" aria-hidden="true">
        {profile.avatarInitials}
      </div>
      <div className="tc-profile__info">
        <span className="tc-profile__name">{profile.name}</span>
        <span className="tc-profile__id">{profile.id}</span>
      </div>
      {online && (
        <span className="tc-profile__status" title="Online">
          <span className="tc-profile__dot" aria-hidden="true" />
          <span className="tc-profile__status-label">Online</span>
        </span>
      )}
    </div>
  );
}

export default memo(UserProfile);
