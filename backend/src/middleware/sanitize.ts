import { Request, Response, NextFunction } from "express";

/**
 * Recursively removes keys that start with '$' or contain '.'
 * to prevent NoSQL injection attacks.
 *
 * Written as an Express-5-compatible replacement for express-mongo-sanitize,
 * which breaks on Express 5 because it tries to reassign the read-only
 * req.query getter.
 *
 * Instead of reassigning req.query, we mutate its existing keys in-place.
 */

const PROHIBITED = /^\$|\./;

function sanitizeObject(obj: Record<string, unknown>): void {
  for (const key of Object.keys(obj)) {
    if (PROHIBITED.test(key)) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete obj[key];
    } else if (obj[key] !== null && typeof obj[key] === "object") {
      sanitizeObject(obj[key] as Record<string, unknown>);
    }
  }
}

export function mongoSanitize(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  // body and params are plain writable objects — sanitize directly
  if (req.body && typeof req.body === "object") {
    sanitizeObject(req.body as Record<string, unknown>);
  }
  if (req.params && typeof req.params === "object") {
    sanitizeObject(req.params as Record<string, unknown>);
  }
  // req.query is a read-only getter in Express 5 — mutate in-place instead
  if (req.query && typeof req.query === "object") {
    sanitizeObject(req.query as Record<string, unknown>);
  }

  next();
}
