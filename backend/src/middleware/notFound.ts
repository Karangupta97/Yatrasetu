import { Request, Response, NextFunction } from "express";
import { createError } from "./errorHandler.js";

/**
 * Catch-all for unmatched routes – forwards a 404 to the error handler.
 */
export function notFound(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  next(createError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
}
