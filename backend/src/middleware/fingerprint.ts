import type { Request, Response, NextFunction } from "express";
import { deviceFingerprint } from "../utils/deviceFingerprint.js";
import redisClient from "../config/redis.js";

// Extend Express Request to carry the device fingerprint
declare global {
  namespace Express {
    interface Request {
      deviceId?: string;
    }
  }
}

/**
 * Computes a device fingerprint for the incoming request and attaches it
 * to req.deviceId.
 *
 * If the fingerprint is present in the Redis "banned:device:" namespace,
 * the request is rejected with HTTP 403.
 */
export async function fingerprintMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const hash = deviceFingerprint(req);
    req.deviceId = hash;

    const banned = await redisClient.get(`banned:device:${hash}`);
    if (banned) {
      res.status(403).json({
        status: "error",
        message: "This device has been blocked. Contact support for assistance.",
      });
      return;
    }

    next();
  } catch (err) {
    console.error("Fingerprint middleware error:", (err as Error).message);
    next();
  }
}
