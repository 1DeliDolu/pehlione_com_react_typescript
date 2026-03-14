import express from "express";

import { prisma } from "./lib/prisma.js";

export const app = express();

app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/health", async (_request, response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    response.status(200).json({
      ok: true,
      service: "api",
      database: "up",
    });
  } catch {
    response.status(503).json({
      ok: false,
      service: "api",
      database: "down",
    });
  }
});
