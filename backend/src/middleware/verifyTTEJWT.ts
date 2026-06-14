import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface TTEJWTPayload {
  id: string;
  role: "tte" | "admin";
  iat?: number;
  exp?: number;
}

// Extend Express Request to carry the decoded TTE JWT payload
declare global {
  namespace Express {
    interface Request {
      tte?: TTEJWTPayload;
    }
  }
}

/**
 * Verifies the Bearer JWT in the Authorization header for TTE/admin access.
 * Attaches the decoded payload to req.tte on success.
 * Returns HTTP 401 if the token is missing or invalid.
 * Returns HTTP 403 if the token does not carry a "tte" or "admin" role.
 */
export function verifyTTEJWT(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({
        status: "error",
        message: "TTE access token missing.",
      });
      return;
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as TTEJWTPayload;

    if (decoded.role !== "tte" && decoded.role !== "admin") {
      res.status(403).json({
        status: "error",
        message: "TTE role required.",
      });
      return;
    }

    req.tte = decoded;
    next();
  } catch (err) {
    const message =
      err instanceof jwt.TokenExpiredError
        ? "TTE session expired. Please log in again."
        : "Invalid TTE token.";

    res.status(401).json({ status: "error", message });
  }
}
