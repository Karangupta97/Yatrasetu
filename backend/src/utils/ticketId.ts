import crypto from "crypto";
import LocalTicket from "../models/LocalTicket.js";
import ExpressTicket from "../models/ExpressTicket.js";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/**
 * Generates a unique UTS number of the form "X0" + 8 uppercase alphanumeric chars.
 * Retries until the generated candidate does not already exist in the LocalTicket collection.
 */
export async function generateUTSNumber(): Promise<string> {
  while (true) {
    const bytes = crypto.randomBytes(8);
    const suffix = Array.from(bytes)
      .map(b => CHARS[b % CHARS.length])
      .join("");
    const candidate = "X0" + suffix;
    const exists = await LocalTicket.exists({ utsNumber: candidate });
    if (!exists) return candidate;
  }
}

/**
 * Generates a unique 10-digit numeric PNR string.
 * Retries until the generated candidate does not already exist in the ExpressTicket collection.
 */
export async function generatePNR(): Promise<string> {
  while (true) {
    const bytes = crypto.randomBytes(6);
    const num = parseInt(bytes.toString("hex"), 16);
    const candidate = String(num % 10_000_000_000).padStart(10, "0");
    const exists = await ExpressTicket.exists({ pnrNumber: candidate });
    if (!exists) return candidate;
  }
}
