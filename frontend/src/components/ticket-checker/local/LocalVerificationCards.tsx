"use client";

import { memo } from "react";
import { Camera, Info, Loader2 } from "lucide-react";
import NfcScanner from "@/components/ticket-checker/common/NfcScanner";

interface LocalVerificationCardsProps {
  nfcLoading: boolean;
  qrLoading: boolean;
  scanMessage: string | null;
  verificationEnabled: boolean;
  onNfcScan: () => void;
  onQrScan: () => void;
}

function LocalVerificationCards({
  nfcLoading,
  qrLoading,
  scanMessage,
  verificationEnabled,
  onNfcScan,
  onQrScan,
}: LocalVerificationCardsProps) {
  const disabled = !verificationEnabled || nfcLoading || qrLoading;

  return (
    <section className="tc-panel tc-verify-panel" aria-labelledby="tc-local-verify-title">
      <h2 id="tc-local-verify-title" className="tc-panel__title">Verify Ticket</h2>
      <div className={`tc-verify-split${verificationEnabled ? "" : " tc-verify-split--disabled"}`}>
        <NfcScanner
          loading={nfcLoading}
          disabled={disabled}
          onScan={onNfcScan}
          description="Tap passenger's device to verify ticket/pass"
        />

        <div className="tc-verify-split__or" aria-hidden="true">OR</div>

        <div className="tc-verify-split__side tc-verify-split__side--qr">
          <div className="tc-verify-split__icon tc-verify-split__icon--qr">
            <Camera size={32} strokeWidth={1.5} aria-hidden="true" />
          </div>
          <h3 className="tc-verify-split__heading">QR Verification</h3>
          <p className="tc-verify-split__desc">Scan ticket QR code to verify ticket/pass</p>
          <button
            type="button"
            className="tc-verify-btn tc-verify-btn--qr"
            onClick={onQrScan}
            disabled={disabled}
            aria-busy={qrLoading}
          >
            {qrLoading ? (
              <>
                <Loader2 size={16} className="tc-spin" aria-hidden="true" />
                Opening…
              </>
            ) : (
              "Scan QR Code"
            )}
          </button>
        </div>
      </div>

      <p className="tc-local-verify-note">
        <Info size={13} aria-hidden="true" />
        Ensure passenger has opened their ticket/pass in the YatraSetu app
      </p>

      {scanMessage && (
        <p className="tc-verify-toast" role="status" aria-live="polite">{scanMessage}</p>
      )}
    </section>
  );
}

export default memo(LocalVerificationCards);
