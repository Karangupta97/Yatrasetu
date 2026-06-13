"use client";

interface WelcomeModalProps {
  username: string;
  onContinue: () => void;
}

export default function WelcomeModal({ username, onContinue }: WelcomeModalProps) {
  return (
    <div className="auth-modal-overlay" role="dialog" aria-modal="true">
      <div className="auth-modal auth-modal--welcome">
        <div className="success-check" style={{ width: 64, height: 64, margin: "0 auto 20px" }}>
          <svg viewBox="0 0 96 96" fill="none" aria-hidden="true">
            <circle cx="48" cy="48" r="44" stroke="#2563EB" strokeWidth="4" fill="rgba(37,99,235,0.08)" />
            <path d="M28 48 L42 62 L68 34" stroke="#2563EB" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>
        <h2 className="auth-modal__title" style={{ textAlign: "center" }}>
          Welcome to YatraSetu 🎉
        </h2>
        <p className="auth-modal__subtitle" style={{ textAlign: "center" }}>
          Your account is fully verified and ready to use.
        </p>
        <p className="auth-welcome-username">
          Username: <strong>{username}</strong>
        </p>
        <button type="button" className="reg-btn reg-btn--primary" onClick={onContinue}>
          Continue
        </button>
      </div>
    </div>
  );
}
