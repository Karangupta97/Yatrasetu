import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

/**
 * Creates a structured operational error with an HTTP status code.
 */
export function createError(
  message: string,
  statusCode = 500,
  isOperational = true
): AppError {
  const err: AppError = new Error(message);
  err.statusCode = statusCode;
  err.isOperational = isOperational;
  return err;
}

/**
 * Centralized error handler middleware.
 * Must be registered LAST in the Express middleware chain.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Mongoose validation error → 422
  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map((e) => e.message);
    res.status(422).json({
      status: "error",
      message: "Validation failed",
      errors: messages,
    });
    return;
  }

  // Mongoose duplicate key error → 409
  if ((err as NodeJS.ErrnoException & { code?: number }).code === 11000) {
    res.status(409).json({
      status: "error",
      message: "Duplicate key: a record with that value already exists.",
    });
    return;
  }

  // Mongoose cast error (bad ObjectId) → 400
  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({
      status: "error",
      message: `Invalid value for field '${err.path}'.`,
    });
    return;
  }

  const statusCode = err.statusCode ?? 500;
  const isProduction = process.env.NODE_ENV === "production";

  // Never leak stack traces in production
  res.status(statusCode).json({
    status: "error",
    message:
      isProduction && statusCode === 500
        ? "Internal server error"
        : err.message,
    ...(isProduction ? {} : { stack: err.stack }),
  });
}
