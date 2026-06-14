import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL ?? "redis://localhost:6379";

// Upstash (and any rediss:// endpoint) requires TLS.
// ioredis handles rediss:// automatically but needs tls options set.
const isTLS = redisUrl.startsWith("rediss://");

const client = new Redis(redisUrl, {
  // TLS required for Upstash and other managed Redis providers
  tls: isTLS ? {} : undefined,

  // Disable auto-reconnect retries on individual commands so a bad
  // connection doesn't cascade into an unhandled MaxRetriesPerRequest crash
  maxRetriesPerRequest: null,

  // Reconnection strategy: exponential back-off, cap at 10s, give up after 5 attempts
  retryStrategy(times: number): number | null {
    if (times > 5) {
      console.error(`❌  Redis: giving up after ${times} reconnect attempts`);
      return null; // stop retrying
    }
    return Math.min(times * 200, 10_000);
  },

  // Don't crash the process if the connection is lost
  enableOfflineQueue: false,
  connectTimeout: 10_000,
  lazyConnect: false,
});

client.on("connect", () => {
  console.log("✅  Redis connected");
});

client.on("ready", () => {
  console.log("🟢  Redis ready");
});

client.on("error", (err: Error) => {
  // Log but don't throw — server.ts handles startup failure via ping()
  console.error("❌  Redis error:", err.message);
});

client.on("close", () => {
  console.warn("⚠️   Redis connection closed");
});

client.on("reconnecting", () => {
  console.log("🔄  Redis reconnecting…");
});

export default client;
