import { createHash } from "crypto";
import type { Request } from "express";

/**
 * Generates a device fingerprint hash from the request's IP,
 * User-Agent, and Accept-Language headers.
 *
 * Returns a SHA-256 hex digest — never the raw concatenated string.
 */
export function deviceFingerprint(req: Request): string {
  const ip = req.ip ?? req.socket.remoteAddress ?? "unknown";
  const ua = req.headers["user-agent"] ?? "unknown";
  const lang = req.headers["accept-language"] ?? "unknown";

  const raw = `${ip}|${ua}|${lang}`;

  return createHash("sha256").update(raw).digest("hex");
}
