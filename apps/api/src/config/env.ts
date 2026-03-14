import { z } from "zod";

const booleanFromString = z.preprocess((value) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (normalized === "true") {
      return true;
    }

    if (normalized === "false") {
      return false;
    }
  }

  return value;
}, z.boolean());

function numberFromString<T extends z.ZodNumber>(
  schema: T = z.number().finite() as unknown as T,
) {
  return z.preprocess((value) => {
    if (typeof value === "number") {
      return value;
    }

    if (typeof value === "string" && value.trim() !== "") {
      return Number(value);
    }

    return value;
  }, schema);
}

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: numberFromString(z.number().int().min(1).max(65535)).default(4000),
  APP_NAME: z.string().min(1).default("pehlione-api"),
  APP_ORIGIN: z.string().url(),
  API_BASE_URL: z.string().url(),

  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),

  SESSION_SECRET: z
    .string()
    .min(32, "SESSION_SECRET must be at least 32 characters."),
  SESSION_NAME: z.string().min(1).default("pehlione.sid"),
  SESSION_COOKIE_HTTP_ONLY: booleanFromString.default(true),
  SESSION_COOKIE_SECURE: booleanFromString.default(false),
  SESSION_COOKIE_SAME_SITE: z.enum(["lax", "strict", "none"]).default("lax"),
  SESSION_COOKIE_MAX_AGE: numberFromString(z.number().int().positive()).default(
    604800000,
  ),

  MAIL_HOST: z.string().min(1),
  MAIL_PORT: numberFromString(z.number().int().min(1).max(65535)).default(1025),
  MAIL_SECURE: booleanFromString.default(false),
  MAIL_FROM_NAME: z.string().min(1),
  MAIL_FROM_ADDRESS: z.string().email(),
  MAIL_USER: z.string().optional(),
  MAIL_PASS: z.string().optional(),

  BCRYPT_SALT_ROUNDS: numberFromString(
    z.number().int().min(10).max(14),
  ).default(12),

  CSRF_ENABLED: booleanFromString.default(true),
  RATE_LIMIT_WINDOW_MS: numberFromString(z.number().int().positive()).default(
    900000,
  ),
  RATE_LIMIT_MAX_REQUESTS: numberFromString(
    z.number().int().positive(),
  ).default(100),

  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("debug"),
  TZ: z.string().min(1).default("Europe/Berlin"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const issues = parsedEnv.error.issues
    .map((issue) => `${issue.path.join(".") || "env"}: ${issue.message}`)
    .join("\n");

  throw new Error(`Invalid environment variables:\n${issues}`);
}

export const env = parsedEnv.data;

export type Env = typeof env;
