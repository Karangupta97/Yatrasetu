"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";

type TimeVal = { hour: number; minute: number; period: "AM" | "PM" };

type TimePickerProps = {
  value: TimeVal;
  onChange: (v: TimeVal) => void;
  onClose: () => void;
  /** The button element that opened this picker — used to compute position */
  triggerRef: React.RefObject<HTMLButtonElement | null>;
};

const ITEM_HEIGHT = 36;
const POPUP_WIDTH = 210; // px — must match minWidth below
const POPUP_HEIGHT = 168; // approximate rendered height (label + 3×36 drum + padding)
const MARGIN = 8;

const HOURS   = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
const PERIODS = ["AM", "PM"];

/* ─── Drum scroll column ─────────────────────────────────── */
function DrumColumn({
  items,
  selected,
  onSelect,
  label,
}: {
  items: string[];
  selected: string;
  onSelect: (v: string) => void;
  label: string;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const selectedIdx = items.indexOf(selected);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = selectedIdx * ITEM_HEIGHT;
    }
  }, [selectedIdx]);

  const handleScroll = useCallback(() => {
    if (!listRef.current) return;
    const idx = Math.round(listRef.current.scrollTop / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(items.length - 1, idx));
    if (items[clamped] !== selected) onSelect(items[clamped]);
  }, [items, selected, onSelect]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 1 : -1;
    const newIdx = Math.max(0, Math.min(items.length - 1, selectedIdx + delta));
    onSelect(items[newIdx]);
    if (listRef.current) listRef.current.scrollTop = newIdx * ITEM_HEIGHT;
  };

  return (
    <div className="flex flex-col items-center" role="listbox" aria-label={label}>
      <div
        ref={listRef}
        className="drum-scroll relative overflow-y-scroll"
        style={{ height: `${ITEM_HEIGHT * 3}px`, width: "52px" }}
        onScroll={handleScroll}
        onWheel={handleWheel}
      >
        <div style={{ height: ITEM_HEIGHT }} />
        {items.map((item) => (
          <button
            key={item}
            role="option"
            aria-selected={item === selected}
            onClick={() => {
              onSelect(item);
              if (listRef.current)
                listRef.current.scrollTop = items.indexOf(item) * ITEM_HEIGHT;
            }}
            className="flex items-center justify-center w-full transition-all focus:outline-none"
            style={{
              height: `${ITEM_HEIGHT}px`,
              fontSize: "15px",
              fontWeight: item === selected ? 700 : 400,
              color: item === selected ? "white" : "#9ca3af",
              background: item === selected ? "var(--indigo)" : "transparent",
              borderRadius: item === selected ? "8px" : "0",
            }}
          >
            {item}
          </button>
        ))}
        <div style={{ height: ITEM_HEIGHT }} />
      </div>
    </div>
  );
}

/* ─── Compute fixed (viewport) position from trigger rect ── */
function computePosition(trigger: HTMLButtonElement): React.CSSProperties {
  const r  = trigger.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Vertical: prefer below, flip above if not enough room
  const spaceBelow = vh - r.bottom - MARGIN;
  const spaceAbove = r.top - MARGIN;
  const top = spaceBelow >= POPUP_HEIGHT || spaceBelow >= spaceAbove
    ? r.bottom + MARGIN
    : r.top - POPUP_HEIGHT - MARGIN;

  // Horizontal: align left edge of popup with left edge of trigger,
  // but clamp so the right edge doesn't exceed the viewport.
  const rawLeft  = r.left;
  const maxLeft  = vw - POPUP_WIDTH - MARGIN;
  const left     = Math.max(MARGIN, Math.min(rawLeft, maxLeft));

  return { position: "fixed", top, left, zIndex: 9999 };
}

/* ─── TimePicker rendered into document.body via portal ──── */
export default function TimePicker({ value, onChange, onClose, triggerRef }: TimePickerProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const [local, setLocal] = useState<TimeVal>(value);
  const [style, setStyle]  = useState<React.CSSProperties>({ position: "fixed", opacity: 0, zIndex: 9999 });
  const [mounted, setMounted] = useState(false);

  // Only render portal on client
  useEffect(() => { setMounted(true); }, []);

  // Compute position once trigger ref is available
  useEffect(() => {
    if (!triggerRef.current) return;
    const s = computePosition(triggerRef.current);
    setStyle({ ...s, opacity: 1, transition: "opacity 0.1s ease" });
  }, [triggerRef]);

  // Close on outside click (checks both popup and trigger)
  useEffect(() => {
    function handlePointerDown(e: MouseEvent) {
      const target = e.target as Node;
      const clickedPopup   = popupRef.current?.contains(target);
      const clickedTrigger = triggerRef.current?.contains(target);
      if (!clickedPopup && !clickedTrigger) onClose();
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [onClose, triggerRef]);

  // Recompute on scroll / resize so it never drifts off-screen
  useEffect(() => {
    function reposition() {
      if (!triggerRef.current) return;
      const s = computePosition(triggerRef.current);
      setStyle({ ...s, opacity: 1, transition: "none" });
    }
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [triggerRef]);

  const commit = (updated: TimeVal) => {
    setLocal(updated);
    onChange(updated);
  };

  if (!mounted) return null;

  const popup = (
    <div
      ref={popupRef}
      style={{
        ...style,
        background: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.16)",
        border: "1px solid var(--mist)",
        padding: "12px",
        minWidth: `${POPUP_WIDTH}px`,
      }}
      role="dialog"
      aria-label="Select time"
      aria-modal="true"
    >
      <p className="text-center mb-2" style={{ fontSize: "12px", color: "#9ca3af", fontWeight: 500 }}>
        Select time
      </p>

      {/* Highlight bar for center (selected) row */}
      <div className="relative">
        <div
          className="absolute left-0 right-0 pointer-events-none rounded-lg"
          style={{
            top: ITEM_HEIGHT,
            height: ITEM_HEIGHT,
            background: "rgba(116,142,254,0.08)",
            zIndex: 0,
          }}
        />
        <div className="flex items-center gap-0 relative z-10">
          <DrumColumn
            items={HOURS}
            selected={String(local.hour).padStart(2, "0")}
            onSelect={(v) => commit({ ...local, hour: parseInt(v) })}
            label="Hour"
          />
          <div
            className="flex flex-col justify-center items-center"
            style={{ height: `${ITEM_HEIGHT * 3}px` }}
          >
            <span className="font-bold text-lg" style={{ color: "var(--charcoal)" }}>:</span>
          </div>
          <DrumColumn
            items={MINUTES}
            selected={String(local.minute).padStart(2, "0")}
            onSelect={(v) => commit({ ...local, minute: parseInt(v) })}
            label="Minute"
          />
          <div className="w-2" />
          <DrumColumn
            items={PERIODS}
            selected={local.period}
            onSelect={(v) => commit({ ...local, period: v as "AM" | "PM" })}
            label="Period"
          />
        </div>
      </div>
    </div>
  );

  return createPortal(popup, document.body);
}
