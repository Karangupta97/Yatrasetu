import type { Request, Response, NextFunction } from "express";
import redisClient from "../config/redis.js";

const WINDOW_SECONDS = 60;
const MAX_REQUESTS = 100;

/**
 * Redis-backed sliding-window rate limiter.
 * Allows MAX_REQUESTS per IP per WINDOW_SECONDS.
 * Returns HTTP 429 with a retryAfter value when the limit is exceeded.
 */
export async function redisRateLimiter(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const ip = req.ip ?? req.socket.remoteAddress ?? "unknown";
    const key = `rate:${ip}`;

    const count = await redisClient.incr(key);

    if (count === 1) {
      // First request in this window — set the expiry
      await redisClient.expire(key, WINDOW_SECONDS);
    }

    if (count > MAX_REQUESTS) {
      res.status(429).json({
        status: "error",
        message: "Too many requests. Please slow down.",
        retryAfter: WINDOW_SECONDS,
      });
      return;
    }

    next();
  } catch (err) {
    // If Redis is down, fail open (do not block the request)
    console.error("Rate limiter error:", (err as Error).message);
    next();
  }
}
