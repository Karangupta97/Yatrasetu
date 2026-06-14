import type { Request, Response, NextFunction } from "express";
import LocalTicket from "../models/LocalTicket.js";

const AADHAAR_QUOTA = 4; // max tickets per Aadhaar per event
const ACCOUNT_QUOTA = 6; // max tickets per account per event

/**
 * Quota enforcement middleware (legacy — not used by the new ticket router).
 * Kept for potential future use but updated to use LocalTicket instead of
 * the removed Ticket model.
 */

// Extend Request to carry aadhaarHash
declare global {
  namespace Express {
    interface Request {
      aadhaarHash?: string;
    }
  }
}

export async function quotaCheck(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { eventId } = req.body as { eventId?: string };
    const aadhaarHash = req.aadhaarHash;
    const userId = req.user?.id;

    if (!eventId || !aadhaarHash || !userId) {
      res.status(400).json({
        status: "error",
        message: "Missing required booking context (eventId, aadhaarHash, userId).",
      });
      return;
    }

    // ── Aadhaar quota ─────────────────────────────────────────────────────────
    const aadhaarCount = await LocalTicket.countDocuments({ aadhaarHash, eventId });
    if (aadhaarCount >= AADHAAR_QUOTA) {
      res.status(403).json({
        status: "error",
        message: `Aadhaar quota reached for this event. Maximum ${AADHAAR_QUOTA} tickets per Aadhaar.`,
      });
      return;
    }

    // ── Account quota ─────────────────────────────────────────────────────────
    const accountCount = await LocalTicket.countDocuments({ userId, eventId });
    if (accountCount >= ACCOUNT_QUOTA) {
      res.status(403).json({
        status: "error",
        message: `Account quota reached for this event. Maximum ${ACCOUNT_QUOTA} tickets per account.`,
      });
      return;
    }

    next();
  } catch (err) {
    console.error("quotaCheck error:", (err as Error).message);
    res.status(500).json({ status: "error", message: "Internal server error." });
  }
}
