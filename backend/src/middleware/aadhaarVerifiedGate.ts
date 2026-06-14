import type { Request, Response, NextFunction } from "express";
import User from "../models/User.js";

/**
 * Gate middleware — must run AFTER emailVerifiedGate.
 * Blocks the request with HTTP 403 if the user has not completed Aadhaar OKYC.
 */
export async function aadhaarVerifiedGate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ status: "error", message: "Unauthorized." });
      return;
    }

    const user = await User.findById(userId).select("isAadhaarVerified").lean();

    if (!user) {
      res.status(401).json({ status: "error", message: "User not found." });
      return;
    }

    if (!user.isAadhaarVerified) {
      res.status(403).json({
        status: "error",
        message:
          "Aadhaar verification is required. Please verify your Aadhaar from the Profile section before booking.",
      });
      return;
    }

    next();
  } catch (err) {
    console.error("aadhaarVerifiedGate error:", (err as Error).message);
    res.status(500).json({ status: "error", message: "Internal server error." });
  }
}
