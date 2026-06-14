import type { TicketPassengerData } from "@/types/expressTc";
import {
  formatScanTimestamp,
  getSimulatedTicket,
  parseTicketPayload,
} from "@/lib/ticketParse";

const NFC_TIMEOUT_MS = 20_000;
const SIMULATION_DELAY_MS = 1500;

export interface NfcScanResult<T = TicketPassengerData> {
  success: boolean;
  message: string;
  timestamp: string;
  data?: T;
}

export interface NfcScanOptions<T> {
  parsePayload: (raw: string) => T | null;
  getSimulatedData: () => T;
  formatSuccessMessage: (data: T) => string;
  invalidMessage?: string;
}

interface NdefMessageLike {
  records: Array<{ recordType: string; data: DataView }>;
}

interface NdefReadingEventLike extends Event {
  message: NdefMessageLike;
}

interface NdefReaderLike {
  scan: (options?: { signal?: AbortSignal }) => Promise<void>;
  addEventListener: (
    type: "reading" | "readingerror",
    listener: (event: NdefReadingEventLike | Event) => void,
  ) => void;
}

type WindowWithNfc = Window & {
  NDEFReader?: new () => NdefReaderLike;
};

const EXPRESS_NFC_OPTIONS: NfcScanOptions<TicketPassengerData> = {
  parsePayload: parseTicketPayload,
  getSimulatedData: getSimulatedTicket,
  formatSuccessMessage: (ticket) => `NFC verified — ${ticket.passenger} (${ticket.pnr})`,
  invalidMessage: "Invalid NFC ticket data. Could not parse passenger details.",
};

function decodeNdefRecord(record: { recordType: string; data: DataView }): string {
  if (record.recordType === "text") {
    const decoder = new TextDecoder(record.data.getUint8(0) === 0 ? "utf-16" : "utf-8");
    const langLen = record.data.getUint8(0) & 0x3f;
    const payload = new Uint8Array(
      record.data.buffer,
      record.data.byteOffset + 1 + langLen,
      record.data.byteLength - 1 - langLen,
    );
    return decoder.decode(payload);
  }

  const bytes = new Uint8Array(
    record.data.buffer,
    record.data.byteOffset,
    record.data.byteLength,
  );
  return new TextDecoder().decode(bytes);
}

function decodeNdefMessage(message: NdefMessageLike): string {
  const parts = message.records.map(decodeNdefRecord).filter(Boolean);
  return parts.join("\n");
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

async function simulateNfcScan<T>(options: NfcScanOptions<T>): Promise<NfcScanResult<T>> {
  await delay(SIMULATION_DELAY_MS);
  const ticket = options.getSimulatedData();
  return {
    success: true,
    message: options.formatSuccessMessage(ticket),
    timestamp: formatScanTimestamp(),
    data: ticket,
  };
}

async function scanWithWebNfc<T>(options: NfcScanOptions<T>): Promise<NfcScanResult<T>> {
  const NDEFReader = (window as WindowWithNfc).NDEFReader;
  if (!NDEFReader) {
    return simulateNfcScan(options);
  }

  const reader = new NDEFReader();
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), NFC_TIMEOUT_MS);

  try {
    const raw = await new Promise<string>((resolve, reject) => {
      reader.addEventListener("reading", (event) => {
        const reading = event as NdefReadingEventLike;
        resolve(decodeNdefMessage(reading.message));
      });
      reader.addEventListener("readingerror", () => {
        reject(new Error("Failed to read NFC tag. Hold the device closer and try again."));
      });
      reader.scan({ signal: controller.signal }).catch(reject);
    });

    const ticket = options.parsePayload(raw);
    if (!ticket) {
      return {
        success: false,
        message: options.invalidMessage ?? "Invalid NFC ticket data.",
        timestamp: formatScanTimestamp(),
      };
    }

    return {
      success: true,
      message: options.formatSuccessMessage(ticket),
      timestamp: formatScanTimestamp(),
      data: ticket,
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === "NotAllowedError") {
      return {
        success: false,
        message: "NFC permission denied. Allow NFC access in your browser settings.",
        timestamp: formatScanTimestamp(),
      };
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      return {
        success: false,
        message: "NFC scan timed out. Tap the device again to retry.",
        timestamp: formatScanTimestamp(),
      };
    }

    const message =
      error instanceof Error ? error.message : "NFC scan failed. Please try again.";
    return {
      success: false,
      message,
      timestamp: formatScanTimestamp(),
    };
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export function isNfcSupported(): boolean {
  if (typeof window === "undefined") return false;
  return "NDEFReader" in window;
}

export async function startNfcScan(): Promise<NfcScanResult<TicketPassengerData>>;
export async function startNfcScan<T>(options: NfcScanOptions<T>): Promise<NfcScanResult<T>>;
export async function startNfcScan<T = TicketPassengerData>(
  options?: NfcScanOptions<T>,
): Promise<NfcScanResult<T>> {
  const resolved = (options ?? EXPRESS_NFC_OPTIONS) as NfcScanOptions<T>;
  if (typeof window === "undefined") {
    return {
      success: false,
      message: "NFC is only available in the browser.",
      timestamp: formatScanTimestamp(),
    };
  }

  if (!isNfcSupported()) {
    return simulateNfcScan(resolved);
  }

  return scanWithWebNfc(resolved);
}
