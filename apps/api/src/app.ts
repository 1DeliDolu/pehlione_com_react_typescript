import express from "express";
import cors from "cors";
import helmet from "helmet";
import session from "express-session";
import { RedisStore } from "connect-redis";
import rateLimit from "express-rate-limit";

import { prisma } from "./lib/prisma.js";
import { redis } from "./lib/redis.js";
import { env } from "./config/env.js";
import { sessionCookieOptions } from "./lib/cookie.js";
import { requestLogger } from "./middlewares/requestLogger.js";
import { setCsrfToken } from "./middlewares/csrf.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";

import { authRouter } from "./modules/auth/auth.routes.js";
import { usersRouter } from "./modules/users/users.routes.js";
import { sessionsRouter } from "./modules/sessions/sessions.routes.js";
import { adminRouter } from "./modules/admin/admin.routes.js";
import { membershipsRouter } from "./modules/memberships/memberships.routes.js";

export const app = express();

// ── Security headers ────────────────────────────────────────────────────────
app.disable("x-powered-by");
app.use(helmet());

// ── CORS ────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: env.APP_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);

// ── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ── Rate limiting ─────────────────────────────────────────────────────────────
app.use(
  rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX_REQUESTS,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

// ── Session ──────────────────────────────────────────────────────────────────
const sessionStore = new RedisStore({ client: redis });

app.use(
  session({
    store: sessionStore,
    name: env.SESSION_NAME,
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: sessionCookieOptions(),
  }),
);

// ── Request logger ────────────────────────────────────────────────────────────
app.use(requestLogger);

// ── CSRF token on every request (sets into session if absent) ─────────────────
app.use(setCsrfToken);

// ── Health ────────────────────────────────────────────────────────────────────
app.get("/health", async (_request, response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    response.status(200).json({ ok: true, service: "api", database: "up" });
  } catch {
    response.status(503).json({ ok: false, service: "api", database: "down" });
  }
});

// ── API routes ────────────────────────────────────────────────────────────────
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/memberships", membershipsRouter);

// ── Error handling ────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);
