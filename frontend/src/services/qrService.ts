import type { QrScanResult } from "@/types/expressTc";
import {
  formatScanTimestamp,
  parseTicketPayload,
} from "@/lib/ticketParse";

export function isCameraSupported(): boolean {
  return typeof navigator !== "undefined" && Boolean(navigator.mediaDevices?.getUserMedia);
}

export type CameraStreamResult =
  | { ok: true; stream: MediaStream }
  | { ok: false; message: string; errorName?: string };

export function mapCameraError(error: unknown): string {
  if (error instanceof DOMException) {
    switch (error.name) {
      case "NotAllowedError":
        return "Camera permission denied. Allow camera access in your browser settings.";
      case "NotReadableError":
        return "Camera is in use by another application. Close other apps and try again.";
      case "OverconstrainedError":
        return "No compatible camera found. Try a different device or browser.";
      case "NotFoundError":
        return "No camera detected on this device.";
      case "SecurityError":
        return "Camera access blocked. Use HTTPS or localhost.";
      default:
        return error.message || "Unable to access the camera.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to access the camera.";
}

async function queryCameraPermission(): Promise<PermissionState | "unknown"> {
  if (typeof navigator === "undefined" || !navigator.permissions?.query) {
    return "unknown";
  }

  try {
    const status = await navigator.permissions.query({ name: "camera" as PermissionName });
    console.info("[QR] Camera permission status:", status.state);
    return status.state;
  } catch {
    console.info("[QR] Camera permission status: unknown (Permissions API unavailable)");
    return "unknown";
  }
}

export async function getCameraStream(): Promise<CameraStreamResult> {
  if (!isCameraSupported()) {
    return { ok: false, message: "Camera access is unavailable on this device." };
  }

  await queryCameraPermission();

  const constraintSets: MediaStreamConstraints[] = [
    { video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } } },
    { video: { facingMode: "user" } },
    { video: true },
  ];

  let lastError: unknown = null;

  for (const constraints of constraintSets) {
    try {
      console.info("[QR] Requesting getUserMedia with constraints:", constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const videoTracks = stream.getVideoTracks();

      console.info("[QR] Stream received:", stream.id);
      console.info("[QR] Video tracks count:", videoTracks.length);
      videoTracks.forEach((track, index) => {
        console.info(`[QR] Track ${index}:`, track.label, track.readyState, track.getSettings());
      });

      if (videoTracks.length === 0) {
        stream.getTracks().forEach((track) => track.stop());
        lastError = new Error("Camera stream has no video tracks.");
        continue;
      }

      return { ok: true, stream };
    } catch (error) {
      lastError = error;
      console.warn("[QR] getUserMedia failed:", error);
    }
  }

  return {
    ok: false,
    message: mapCameraError(lastError),
    errorName: lastError instanceof DOMException ? lastError.name : undefined,
  };
}

export async function requestCameraPermission(): Promise<boolean> {
  const result = await getCameraStream();
  if (!result.ok) return false;
  result.stream.getTracks().forEach((track) => track.stop());
  return true;
}

export function parseQrTicketPayload(raw: string): QrScanResult {
  const ticket = parseTicketPayload(raw);
  if (!ticket) {
    return {
      success: false,
      message: "Invalid QR code. This does not appear to be a valid ticket.",
      timestamp: formatScanTimestamp(),
    };
  }

  return {
    success: true,
    message: `QR verified — ${ticket.passenger} (${ticket.pnr})`,
    timestamp: formatScanTimestamp(),
    data: ticket,
  };
}

export async function startQrScan(): Promise<QrScanResult> {
  if (typeof window === "undefined") {
    return {
      success: false,
      message: "QR scanning is only available in the browser.",
      timestamp: formatScanTimestamp(),
    };
  }

  if (!isCameraSupported()) {
    return {
      success: false,
      message: "Camera access is unavailable on this device.",
      timestamp: formatScanTimestamp(),
    };
  }

  const result = await getCameraStream();
  if (!result.ok) {
    return {
      success: false,
      message: result.message,
      timestamp: formatScanTimestamp(),
    };
  }

  result.stream.getTracks().forEach((track) => track.stop());

  return {
    success: false,
    message: "Open the camera scanner to scan a QR code.",
    timestamp: formatScanTimestamp(),
    cancelled: true,
  };
}

export type BarcodeDetectorLike = {
  detect: (source: ImageBitmapSource) => Promise<Array<{ rawValue: string }>>;
};

export function getBarcodeDetector(): BarcodeDetectorLike | null {
  if (typeof window === "undefined") return null;
  const Detector = (window as Window & { BarcodeDetector?: new (opts: { formats: string[] }) => BarcodeDetectorLike }).BarcodeDetector;
  if (!Detector) return null;
  try {
    return new Detector({ formats: ["qr_code"] });
  } catch {
    return null;
  }
}

export function stopMediaStream(stream: MediaStream | null): void {
  stream?.getTracks().forEach((track) => {
    console.info("[QR] Stopping track:", track.label);
    track.stop();
  });
}
