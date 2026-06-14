"use client";

import { memo } from "react";
import { ArrowRight, MapPin, Navigation, Route, Train } from "lucide-react";
import type { RouteState } from "@/types/localTc";

interface RouteInfoProps {
  route: RouteState;
}

function RouteInfo({ route }: RouteInfoProps) {
  return (
    <section className="tc-stats-bar" aria-label="Route status">
      <div className="tc-stats-bar__item">
        <MapPin size={15} className="tc-stats-bar__icon" aria-hidden="true" />
        <div>
          <span className="tc-stats-bar__label">Zone</span>
          <span className="tc-stats-bar__value">{route.zone}</span>
        </div>
      </div>
      <div className="tc-stats-bar__item">
        <Route size={15} className="tc-stats-bar__icon" aria-hidden="true" />
        <div>
          <span className="tc-stats-bar__label">Route</span>
          <span className="tc-stats-bar__value">{route.routeLabel}</span>
        </div>
      </div>
      <div className="tc-stats-bar__item tc-stats-bar__item--active">
        <Train size={15} className="tc-stats-bar__icon" aria-hidden="true" />
        <div>
          <span className="tc-stats-bar__label">Current Station</span>
          <span className="tc-stats-bar__value">
            {route.currentStation} ({route.currentStationCode})
          </span>
        </div>
      </div>
      <div className="tc-stats-bar__item">
        <Navigation size={15} className="tc-stats-bar__icon" aria-hidden="true" />
        <div>
          <span className="tc-stats-bar__label">Next Station</span>
          <span className="tc-stats-bar__value">
            {route.nextStation} ({route.nextStationCode})
          </span>
        </div>
      </div>
      <div className="tc-stats-bar__item">
        <ArrowRight size={15} className="tc-stats-bar__icon" aria-hidden="true" />
        <div>
          <span className="tc-stats-bar__label">Direction</span>
          <span className="tc-stats-bar__value">{route.direction}</span>
        </div>
      </div>
      <div className="tc-stats-bar__item tc-stats-bar__item--progress">
        <div className="tc-stats-bar__progress-wrap">
          <span className="tc-stats-bar__label">Journey Progress</span>
          <span className="tc-stats-bar__progress-text">{route.progress}% Completed</span>
          <div
            className="tc-stats-bar__progress"
            role="progressbar"
            aria-valuenow={route.progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="tc-stats-bar__progress-fill" style={{ width: `${route.progress}%` }} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(RouteInfo);
