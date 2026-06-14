"use client";

import { memo } from "react";
import { Loader2, Nfc, Smartphone } from "lucide-react";

interface NfcScannerProps {
  loading: boolean;
  disabled: boolean;
  onScan: () => void;
  description?: string;
}

function NfcScanner({
  loading,
  disabled,
  onScan,
  description = "Tap passenger's device to verify ticket",
}: NfcScannerProps) {
  return (
    <div className="tc-verify-split__side tc-verify-split__side--nfc">
      <div className="tc-verify-split__icon">
        <Smartphone size={32} strokeWidth={1.5} aria-hidden="true" />
        <Nfc size={18} className="tc-verify-split__nfc-badge" aria-hidden="true" />
      </div>
      <h3 className="tc-verify-split__heading">NFC Verification</h3>
      <p className="tc-verify-split__desc">{description}</p>
      <button
        type="button"
        className="tc-verify-btn tc-verify-btn--nfc"
        onClick={onScan}
        disabled={disabled}
        aria-busy={loading}
      >
        {loading ? (
          <>
            <Loader2 size={16} className="tc-spin" aria-hidden="true" />
            Scanning…
          </>
        ) : (
          "Tap to Scan NFC"
        )}
      </button>
    </div>
  );
}

export default memo(NfcScanner);
