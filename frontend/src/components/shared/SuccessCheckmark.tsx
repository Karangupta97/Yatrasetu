export default function SuccessCheckmark({ size = 96 }: { size?: number }) {
  return (
    <div className="success-check" style={{ width: size, height: size }}>
      <svg viewBox="0 0 96 96" fill="none" aria-hidden="true">
        <circle className="success-check__circle" cx="48" cy="48" r="44" stroke="#22C55E" strokeWidth="4" fill="rgba(34,197,94,0.08)" />
        <path
          className="success-check__tick"
          d="M28 48 L42 62 L68 34"
          stroke="#22C55E"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
