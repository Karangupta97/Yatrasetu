import redisClient from "../config/redis.js";

const LOCK_TTL_SECONDS = 30;

/**
 * Attempts to acquire a distributed lock for a user+event combination.
 * Uses SET NX EX so only one booking process can run at a time per slot.
 *
 * @returns true  if the lock was acquired
 * @returns false if a lock already exists (booking in progress)
 */
export async function acquireSlot(
  userId: string,
  eventId: string
): Promise<boolean> {
  const key = `lock:booking:${userId}:${eventId}`;
  const result = await redisClient.set(key, "1", "EX", LOCK_TTL_SECONDS, "NX");
  return result === "OK";
}

/**
 * Releases the distributed lock for a user+event combination.
 * Must be called in a finally block to guarantee cleanup.
 */
export async function releaseSlot(
  userId: string,
  eventId: string
): Promise<void> {
  const key = `lock:booking:${userId}:${eventId}`;
  await redisClient.del(key);
}
