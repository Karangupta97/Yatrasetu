"use client";

import { useState, useEffect } from "react";
import { Download, X, Ticket } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt(): Promise<void>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible,   setVisible]   = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("pwa-prompt-dismissed")) return;
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setVisible(true), 3000);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setVisible(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    sessionStorage.setItem("pwa-prompt-dismissed", "1");
  };

  if (!visible || dismissed) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Install YatraSetu app"
      style={{
        position: "fixed", bottom: "24px", left: "50%",
        transform: "translateX(-50%)", zIndex: 9999,
        background: "#181d2a", color: "white",
        borderRadius: "16px", padding: "16px 20px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        display: "flex", alignItems: "center", gap: "14px",
        maxWidth: "420px", width: "calc(100vw - 32px)",
        animation: "pwaSlideUp 0.35s cubic-bezier(0.34,1.56,0.64,1) both",
      }}
    >
      <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#748efe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }} aria-hidden="true">
        <Ticket size={22} style={{ color: "white" }} />
      </div>

      <div className="flex-1 min-w-0">
        <p style={{ fontSize: "14px", fontWeight: 700, marginBottom: "2px" }}>Add YatraSetu to home screen</p>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", lineHeight: "1.4" }}>Book tickets faster — works offline too.</p>
      </div>

      <button onClick={handleInstall} className="hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2" style={{ background: "#748efe", color: "white", border: "none", borderRadius: "10px", padding: "8px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", flexShrink: 0, whiteSpace: "nowrap" }}>
        <Download size={13} /> Install
      </button>

      <button onClick={handleDismiss} aria-label="Dismiss install prompt" className="focus:outline-none hover:opacity-80 transition-opacity" style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)", padding: "4px", display: "flex", flexShrink: 0 }}>
        <X size={16} />
      </button>

      <style>{`
        @keyframes pwaSlideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(24px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}
