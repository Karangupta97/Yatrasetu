"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, X } from "lucide-react";
import {
  getBarcodeDetector,
  getCameraStream,
  stopMediaStream,
} from "@/services/qrService";
import { formatScanTimestamp } from "@/lib/ticketParse";

export interface QrScannerModalResult<T> {
  success: boolean;
  message: string;
  timestamp: string;
  data?: T;
  cancelled?: boolean;
}

interface QrScannerModalProps<T> {
  open: boolean;
  onClose: () => void;
  onResult: (result: QrScannerModalResult<T>) => void;
  parsePayload: (raw: string) => T | null;
  getSimulatedPayload: () => T;
  formatSuccessMessage: (data: T) => string;
  invalidMessage?: string;
  subtitle?: string;
}

async function attachStreamToVideo(
  video: HTMLVideoElement,
  stream: MediaStream,
): Promise<void> {
  video.srcObject = stream;
  video.muted = true;
  video.playsInline = true;
  video.autoplay = true;

  await new Promise<void>((resolve) => {
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      resolve();
      return;
    }
    video.onloadedmetadata = () => resolve();
  });

  try {
    await video.play();
  } catch {
    await video.play();
  }
}

function QrScannerContent<T>({
  onClose,
  onResult,
  parsePayload,
  getSimulatedPayload,
  formatSuccessMessage,
  invalidMessage = "Invalid QR code. Could not parse ticket data.",
  subtitle = "Point your camera at the passenger ticket QR code.",
}: Omit<QrScannerModalProps<T>, "open">) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewReady, setPreviewReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState("");

  const stopCamera = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    stopMediaStream(streamRef.current);
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const emitResult = useCallback(
    (result: QrScannerModalResult<T>) => {
      stopCamera();
      onResult(result);
      onClose();
    },
    [onClose, onResult, stopCamera],
  );

  const handleClose = useCallback(() => {
    emitResult({
      success: false,
      message: "QR scan cancelled.",
      timestamp: formatScanTimestamp(),
      cancelled: true,
    });
  }, [emitResult]);

  const completeScan = useCallback(
    (raw: string) => {
      const data = parsePayload(raw);
      if (!data) {
        emitResult({
          success: false,
          message: invalidMessage,
          timestamp: formatScanTimestamp(),
        });
        return;
      }
      emitResult({
        success: true,
        message: formatSuccessMessage(data),
        timestamp: formatScanTimestamp(),
        data,
      });
    },
    [emitResult, formatSuccessMessage, invalidMessage, parsePayload],
  );

  const startDetectionLoop = useCallback(() => {
    const detector = getBarcodeDetector();
    const video = videoRef.current;
    if (!detector || !video) return;

    const scan = async () => {
      const activeVideo = videoRef.current;
      if (!activeVideo || activeVideo.readyState < HTMLMediaElement.HAVE_ENOUGH_DATA) {
        rafRef.current = requestAnimationFrame(scan);
        return;
      }

      try {
        const codes = await detector.detect(activeVideo);
        const value = codes[0]?.rawValue;
        if (value) {
          completeScan(value);
          return;
        }
      } catch {
        // continue scanning
      }

      rafRef.current = requestAnimationFrame(scan);
    };

    rafRef.current = requestAnimationFrame(scan);
  }, [completeScan]);

  useEffect(() => {
    let cancelled = false;

    async function startCamera() {
      const video = videoRef.current;
      if (!video) {
        setError("Camera preview unavailable. Enter the QR payload manually below.");
        setLoading(false);
        return;
      }

      const result = await getCameraStream();
      if (cancelled) {
        if (result.ok) stopMediaStream(result.stream);
        return;
      }

      if (!result.ok) {
        setError(result.message);
        setLoading(false);
        return;
      }

      streamRef.current = result.stream;

      try {
        await attachStreamToVideo(video, result.stream);
        if (cancelled) {
          stopMediaStream(result.stream);
          return;
        }

        setPreviewReady(true);
        setLoading(false);
        startDetectionLoop();
      } catch {
        stopMediaStream(result.stream);
        streamRef.current = null;
        setError("Unable to display camera preview. Enter the QR payload manually below.");
        setLoading(false);
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [startDetectionLoop, stopCamera]);

  function handleManualSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!manualCode.trim()) {
      setError("Enter a valid QR code payload.");
      return;
    }
    completeScan(manualCode.trim());
  }

  function handleSimulateScan() {
    completeScan(JSON.stringify(getSimulatedPayload()));
  }

  return (
    <div className="auth-modal auth-modal--qr" onClick={(e) => e.stopPropagation()}>
      <button type="button" className="auth-modal__close" onClick={handleClose} aria-label="Close">
        <X size={20} />
      </button>

      <h2 id="qr-scanner-title" className="auth-modal__title">Scan QR Code</h2>
      <p className="auth-modal__subtitle">{subtitle}</p>

      <div className="tc-qr-scanner">
        <video
          ref={videoRef}
          className={`tc-qr-scanner__video${previewReady ? " tc-qr-scanner__video--active" : ""}`}
          autoPlay
          playsInline
          muted
          aria-label="QR scanner camera feed"
        />
        {loading && (
          <div className="tc-qr-scanner__placeholder tc-qr-scanner__overlay" aria-hidden="true">
            <Loader2 size={28} className="tc-spin" />
            <span>Opening camera…</span>
          </div>
        )}
      </div>

      {error && <p className="auth-modal__error">{error}</p>}

      <form onSubmit={handleManualSubmit} className="tc-qr-manual">
        <input
          className="reg-input"
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
          placeholder="Paste QR payload if camera unavailable"
          aria-label="Manual QR code input"
        />
        <button type="submit" className="reg-btn reg-btn--primary">
          Verify Code
        </button>
      </form>

      <button type="button" className="tc-link-btn tc-qr-simulate" onClick={handleSimulateScan}>
        Simulate scan (dev)
      </button>
    </div>
  );
}

export default function QrScannerModal<T>({
  open,
  onClose,
  onResult,
  parsePayload,
  getSimulatedPayload,
  formatSuccessMessage,
  invalidMessage,
  subtitle,
}: QrScannerModalProps<T>) {
  if (!open) return null;

  return (
    <div
      className="auth-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-scanner-title"
    >
      <QrScannerContent
        onClose={onClose}
        onResult={onResult}
        parsePayload={parsePayload}
        getSimulatedPayload={getSimulatedPayload}
        formatSuccessMessage={formatSuccessMessage}
        invalidMessage={invalidMessage}
        subtitle={subtitle}
      />
    </div>
  );
}
