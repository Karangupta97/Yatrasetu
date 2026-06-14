import "dotenv/config";
import express, { type Request, type Response } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDB, disconnectDB } from "./config/db.js";
import redisClient from "./config/redis.js";
import { mongoSanitize } from "./middleware/sanitize.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import healthRouter from "./routes/healthRouter.js";
import authRouter from "./routes/auth.js";
import profileRouter from "./routes/profile.js";
import ticketRouter from "./routes/ticket.js";
import trainRouter from "./routes/train.js";

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// ─── Security headers ─────────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin && process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy violation: origin '${origin}' blocked`));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ─── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ─── Cookie parser (required for refresh token cookie) ───────────────────────
app.use(cookieParser());

// ─── Input sanitization ───────────────────────────────────────────────────────
app.use(mongoSanitize);

// ─── Routes ──────────────────────────────────────────────────────────────────
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ message: "Welcome to Yatrasetu API 🚀" });
});

app.use("/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/ticket", ticketRouter);
app.use("/api/train", trainRouter);

// ─── 404 & error handling (must be last) ─────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Bootstrap ───────────────────────────────────────────────────────────────
async function bootstrap(): Promise<void> {
  // Both DB and Redis must be ready before accepting traffic
  await connectDB();

  // Verify Redis is reachable before accepting traffic
  try {
    const pong = await redisClient.ping();
    if (pong !== "PONG") throw new Error(`Unexpected ping response: ${pong}`);
    console.log("✅  Redis ping successful");
  } catch (err) {
    console.error("❌  Redis ping failed:", (err as Error).message);
    console.error("    Check REDIS_URL in .env — Upstash requires rediss:// (TLS)");
    process.exit(1);
  }

  const server = app.listen(PORT, () => {
    console.log(
      `🚀  Server running in ${process.env.NODE_ENV ?? "development"} mode → http://localhost:${PORT}`
    );
  });

  async function shutdown(signal: string): Promise<void> {
    console.log(`\n${signal} received. Shutting down gracefully…`);
    server.close(async () => {
      console.log("🔒  HTTP server closed");
      await disconnectDB();
      await redisClient.quit();
      console.log("🔌  Redis connection closed");
      process.exit(0);
    });
    setTimeout(() => {
      console.error("⚠️   Forced shutdown after timeout");
      process.exit(1);
    }, 10_000);
  }

  process.on("SIGTERM", () => { void shutdown("SIGTERM"); });
  process.on("SIGINT", () => { void shutdown("SIGINT"); });

  process.on("unhandledRejection", (reason: unknown) => {
    console.error("Unhandled Promise Rejection:", reason);
    void shutdown("unhandledRejection");
  });
}

bootstrap().catch((err) => {
  console.error("❌  Failed to start server:", err);
  process.exit(1);
});
