import { createClient } from "redis";

import { env } from "../config/env.js";

export const redis = createClient({ url: env.REDIS_URL });

redis.on("error", (err) => {
  console.error("Redis client error:", err);
});

export async function connectRedis(): Promise<void> {
  if (!redis.isOpen) {
    await redis.connect();
    console.log("Redis connected.");
  }
}

export async function disconnectRedis(): Promise<void> {
  if (redis.isOpen) {
    await redis.disconnect();
    console.log("Redis disconnected.");
  }
}
