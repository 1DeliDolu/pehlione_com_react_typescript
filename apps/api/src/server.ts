import type { Server } from "node:http";

import { app } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./lib/prisma.js";
import { connectRedis, disconnectRedis } from "./lib/redis.js";

let server: Server | null = null;
let isShuttingDown = false;

async function startServer(): Promise<void> {
  await prisma.$connect();
  await connectRedis();

  server = app.listen(env.PORT, () => {
    console.log(`API listening on http://localhost:${env.PORT}`);
  });
}

async function shutdown(signal: NodeJS.Signals): Promise<void> {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  console.log(`${signal} received. Shutting down gracefully...`);

  try {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server?.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });
    }

    await prisma.$disconnect();
    await disconnectRedis();
    process.exit(0);
  } catch (error) {
    console.error("Graceful shutdown failed.", error);

    try {
      await prisma.$disconnect();
      await disconnectRedis();
    } catch {
      // ignore disconnect errors during forced shutdown
    }

    process.exit(1);
  }
}

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

void startServer().catch(async (error) => {
  console.error("Failed to start API server.", error);

  try {
    await prisma.$disconnect();
    await disconnectRedis();
  } catch {
    // ignore disconnect errors on startup failure
  }

  process.exit(1);
});

let server: Server | null = null;
let isShuttingDown = false;

async function startServer(): Promise<void> {
  await prisma.$connect();

  server = app.listen(env.PORT, () => {
    console.log(`API listening on http://localhost:${env.PORT}`);
  });
}

async function shutdown(signal: NodeJS.Signals): Promise<void> {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  console.log(`${signal} received. Shutting down gracefully...`);

  try {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server?.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });
    }

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Graceful shutdown failed.", error);

    try {
      await prisma.$disconnect();
    } catch {
      // ignore disconnect errors during forced shutdown
    }

    process.exit(1);
  }
}

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

void startServer().catch(async (error) => {
  console.error("Failed to start API server.", error);

  try {
    await prisma.$disconnect();
  } catch {
    // ignore disconnect errors on startup failure
  }

  process.exit(1);
});
