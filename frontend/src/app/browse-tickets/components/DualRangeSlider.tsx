"use client";

import { useRef, useCallback, useEffect, useState } from "react";

type DualRangeSliderProps = {
  min: number;
  max: number;
  step?: number;
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
  formatLabel?: (v: number) => string;
};

function clamp(val: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, val));
}

function snap(val: number, step: number, min: number) {
  return Math.round((val - min) / step) * step + min;
}

export default function DualRangeSlider({
  min,
  max,
  step = 1,
  valueMin,
  valueMax,
  onChange,
  formatLabel,
}: DualRangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<"min" | "max" | null>(null);

  // % positions 0–100
  const minPct = ((valueMin - min) / (max - min)) * 100;
  const maxPct = ((valueMax - min) / (max - min)) * 100;

  const pctToValue = useCallback(
    (pct: number) => {
      const raw = (pct / 100) * (max - min) + min;
      return snap(clamp(raw, min, max), step, min);
    },
    [min, max, step]
  );

  const getTrackPct = useCallback((clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    return clamp(((clientX - rect.left) / rect.width) * 100, 0, 100);
  }, []);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!dragging.current) return;
      const pct = getTrackPct(clientX);
      const val = pctToValue(pct);
      if (dragging.current === "min") {
        const newMin = clamp(val, min, valueMax - step);
        if (newMin !== valueMin) onChange(newMin, valueMax);
      } else {
        const newMax = clamp(val, valueMin + step, max);
        if (newMax !== valueMax) onChange(valueMin, newMax);
      }
    },
    [dragging, getTrackPct, pctToValue, min, max, step, valueMin, valueMax, onChange]
  );

  // Mouse events
  const handleMouseMove = useCallback(
    (e: MouseEvent) => handleMove(e.clientX),
    [handleMove]
  );
  const handleMouseUp = useCallback(() => {
    dragging.current = null;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  const startDragMin = (e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = "min";
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };
  const startDragMax = (e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = "max";
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Touch events
  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();
      handleMove(e.touches[0].clientX);
    },
    [handleMove]
  );
  const handleTouchEnd = useCallback(() => {
    dragging.current = null;
    window.removeEventListener("touchmove", handleTouchMove);
    window.removeEventListener("touchend", handleTouchEnd);
  }, [handleTouchMove]);

  const startTouchMin = (e: React.TouchEvent) => {
    dragging.current = "min";
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
  };
  const startTouchMax = (e: React.TouchEvent) => {
    dragging.current = "max";
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
  };

  // Keyboard support
  const handleKeyMin = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      const v = clamp(valueMin - step, min, valueMax - step);
      onChange(v, valueMax);
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      const v = clamp(valueMin + step, min, valueMax - step);
      onChange(v, valueMax);
    }
  };
  const handleKeyMax = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      const v = clamp(valueMax - step, valueMin + step, max);
      onChange(valueMin, v);
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      const v = clamp(valueMax + step, valueMin + step, max);
      onChange(valueMin, v);
    }
  };

  const fmt = formatLabel ?? ((v: number) => String(v));

  return (
    <div style={{ userSelect: "none" }}>
      {/* Price labels */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <span style={{ fontSize: "11px", color: "#9ca3af" }}>{fmt(valueMin)}</span>
        <span style={{ fontSize: "11px", color: "#9ca3af" }}>{fmt(valueMax)}</span>
      </div>

      {/* Track + thumbs */}
      <div
        ref={trackRef}
        style={{
          position: "relative",
          height: "20px",
          display: "flex",
          alignItems: "center",
          cursor: "default",
        }}
        role="group"
        aria-label="Price range"
      >
        {/* Grey base track */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: "4px",
            borderRadius: "9999px",
            background: "#e8ebed",
          }}
        />

        {/* Indigo active fill */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: `${minPct}%`,
            width: `${maxPct - minPct}%`,
            height: "4px",
            borderRadius: "9999px",
            background: "#748efe",
            pointerEvents: "none",
          }}
        />

        {/* Min thumb */}
        <div
          role="slider"
          tabIndex={0}
          aria-label="Minimum price"
          aria-valuemin={min}
          aria-valuemax={valueMax - step}
          aria-valuenow={valueMin}
          aria-valuetext={fmt(valueMin)}
          onMouseDown={startDragMin}
          onTouchStart={startTouchMin}
          onKeyDown={handleKeyMin}
          style={{
            position: "absolute",
            left: `${minPct}%`,
            transform: "translateX(-50%)",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background: "#ffffff",
            border: "2.5px solid #748efe",
            boxShadow: "0 1px 5px rgba(116,142,254,0.4)",
            cursor: "grab",
            zIndex: 3,
            outline: "none",
            transition: "box-shadow 0.15s ease",
          }}
          className="slider-thumb"
        />

        {/* Max thumb */}
        <div
          role="slider"
          tabIndex={0}
          aria-label="Maximum price"
          aria-valuemin={valueMin + step}
          aria-valuemax={max}
          aria-valuenow={valueMax}
          aria-valuetext={fmt(valueMax)}
          onMouseDown={startDragMax}
          onTouchStart={startTouchMax}
          onKeyDown={handleKeyMax}
          style={{
            position: "absolute",
            left: `${maxPct}%`,
            transform: "translateX(-50%)",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background: "#ffffff",
            border: "2.5px solid #748efe",
            boxShadow: "0 1px 5px rgba(116,142,254,0.4)",
            cursor: "grab",
            zIndex: 4,
            outline: "none",
            transition: "box-shadow 0.15s ease",
          }}
          className="slider-thumb"
        />
      </div>
    </div>
  );
}
