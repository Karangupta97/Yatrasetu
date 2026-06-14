"use client";

import { memo } from "react";
import { Clock, MapPin, Navigation } from "lucide-react";
import type { JourneyState } from "@/types/expressTc";

interface JourneyInfoProps {
  journey: JourneyState;
}

function JourneyInfo({ journey }: JourneyInfoProps) {
  return (
    <section className="tc-stats-bar" aria-label="Journey status">
      <div className="tc-stats-bar__item">
        <Clock size={15} className="tc-stats-bar__icon" aria-hidden="true" />
        <div>
          <span className="tc-stats-bar__label">Duty Started</span>
          <span className="tc-stats-bar__value">{journey.dutyStart}</span>
        </div>
      </div>
      <div className="tc-stats-bar__item">
        <Clock size={15} className="tc-stats-bar__icon" aria-hidden="true" />
        <div>
          <span className="tc-stats-bar__label">Duty Ends</span>
          <span className="tc-stats-bar__value">{journey.dutyEnd}</span>
        </div>
      </div>
      <div className="tc-stats-bar__item tc-stats-bar__item--active">
        <MapPin size={15} className="tc-stats-bar__icon" aria-hidden="true" />
        <div>
          <span className="tc-stats-bar__label">Current Station</span>
          <span className="tc-stats-bar__value">
            {journey.currentStation} ({journey.currentStationCode})
          </span>
        </div>
      </div>
      <div className="tc-stats-bar__item">
        <Navigation size={15} className="tc-stats-bar__icon" aria-hidden="true" />
        <div>
          <span className="tc-stats-bar__label">Next Station</span>
          <span className="tc-stats-bar__value">
            {journey.nextStation} ({journey.nextStationCode})
          </span>
        </div>
      </div>
      <div className="tc-stats-bar__item">
        <Clock size={15} className="tc-stats-bar__icon" aria-hidden="true" />
        <div>
          <span className="tc-stats-bar__label">ETA</span>
          <span className="tc-stats-bar__value">{journey.eta}</span>
        </div>
      </div>
      <div className="tc-stats-bar__item tc-stats-bar__item--progress">
        <div className="tc-stats-bar__progress-wrap">
          <span className="tc-stats-bar__label">Journey Progress</span>
          <span className="tc-stats-bar__progress-text">{journey.progress}% Completed</span>
          <div
            className="tc-stats-bar__progress"
            role="progressbar"
            aria-valuenow={journey.progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Journey progress"
          >
            <div className="tc-stats-bar__progress-fill" style={{ width: `${journey.progress}%` }} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(JourneyInfo);
