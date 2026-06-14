import { Router, type Request, type Response } from "express";
import mongoose from "mongoose";
import redisClient from "../config/redis.js";

const router = Router();

/**
 * GET /health
 * Returns app uptime, MongoDB connection state, and Redis ping status.
 * No authentication required — safe for load-balancer health checks.
 */
router.get("/", async (_req: Request, res: Response): Promise<void> => {
  const dbState = mongoose.connection.readyState;
  const dbStatus =
    dbState === 1 ? "connected" : dbState === 2 ? "connecting" : "disconnected";

  let redisStatus = "disconnected";
  try {
    const pong = await redisClient.ping();
    redisStatus = pong === "PONG" ? "connected" : "degraded";
  } catch {
    redisStatus = "disconnected";
  }

  const healthy = dbState === 1 && redisStatus === "connected";

  res.status(healthy ? 200 : 503).json({
    status: healthy ? "ok" : "degraded",
    uptime: process.uptime(),
    database: dbStatus,
    redis: redisStatus,
    timestamp: new Date().toISOString(),
  });
});

export default router;
