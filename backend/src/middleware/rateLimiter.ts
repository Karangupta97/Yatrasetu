import rateLimit from "express-rate-limit";

/**
 * General API rate limiter – 100 requests per IP per 15 minutes.
 * Tune windowMs / max per endpoint sensitivity.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: "draft-7", // Return rate-limit info in RateLimit-* headers
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many requests from this IP, please try again later.",
  },
});

/**
 * Stricter limiter for auth endpoints – 10 requests per IP per 15 minutes.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    status: "error",
    message:
      "Too many authentication attempts from this IP. Please try again later.",
  },
});
