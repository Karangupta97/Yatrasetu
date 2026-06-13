"use client";

type SortBarProps = {
  activeSort: "cheapest" | "recommended";
  onSortChange: (s: "cheapest" | "recommended") => void;
};

export default function SortBar({ activeSort, onSortChange }: SortBarProps) {
  return (
    <div
      className="flex items-center"
      style={{
        background: "#ffffff",
        borderRadius: "12px",
        border: "1px solid #e8ebed",
        padding: "10px 16px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        marginBottom: "12px",
      }}
      role="toolbar"
      aria-label="Sort options"
    >
      <div className="flex items-center gap-2">
        <button
          onClick={() => onSortChange("cheapest")}
          className="inline-flex items-center rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
          style={{
            background: activeSort === "cheapest" ? "#f4632a" : "rgba(244,99,42,0.08)",
            color: activeSort === "cheapest" ? "#ffffff" : "#f4632a",
            padding: "6px 14px",
            fontSize: "13px",
            fontWeight: 600,
          }}
          aria-pressed={activeSort === "cheapest"}
          aria-label="Sort by cheapest"
        >
          Cheapest
        </button>

        <button
          onClick={() => onSortChange("recommended")}
          className="inline-flex items-center rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
          style={{
            background: activeSort === "recommended" ? "#748efe" : "rgba(116,142,254,0.08)",
            color: activeSort === "recommended" ? "#ffffff" : "#748efe",
            padding: "6px 14px",
            fontSize: "13px",
            fontWeight: 600,
          }}
          aria-pressed={activeSort === "recommended"}
          aria-label="Sort by recommended"
        >
          Recommended
        </button>
      </div>
    </div>
  );
}
