import type { Request, Response, NextFunction } from "express";
import User from "../models/User.js";

/**
 * Gate middleware — must run AFTER verifyJWT.
 * Blocks the request with HTTP 403 if the user has not verified their email.
 */
export async function emailVerifiedGate(
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

    const user = await User.findById(userId).select("isEmailVerified").lean();

    if (!user) {
      res.status(401).json({ status: "error", message: "User not found." });
      return;
    }

    if (!user.isEmailVerified) {
      res.status(403).json({
        status: "error",
        message:
          "Please verify your email address before proceeding. Check your inbox for the verification link.",
      });
      return;
    }

    next();
  } catch (err) {
    console.error("emailVerifiedGate error:", (err as Error).message);
    res.status(500).json({ status: "error", message: "Internal server error." });
  }
}
