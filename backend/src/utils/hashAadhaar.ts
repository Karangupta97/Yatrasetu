import { createHash } from "crypto";

/**
 * Returns a SHA-256 hex digest of the Aadhaar number salted with
 * the AADHAAR_SALT environment variable.
 *
 * IMPORTANT: This function NEVER logs or returns the raw Aadhaar number.
 * Only the digest is ever exposed outside this function.
 */
export function hashAadhaar(rawAadhaar: string): string {
  const salt = process.env.AADHAAR_SALT ?? "";
  if (!salt) {
    throw new Error("AADHAAR_SALT environment variable is not set.");
  }
  return createHash("sha256")
    .update(rawAadhaar + salt)
    .digest("hex");
}
