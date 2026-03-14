import { createHash, randomBytes } from "node:crypto";

/**
 * Generates a cryptographically secure random token.
 * Returns { raw: string (hex), hash: string (sha-256 hex) }
 * Store only the hash in DB; send raw to user.
 */
export function generateToken(byteLength = 32): {
  raw: string;
  hash: string;
} {
  const raw = randomBytes(byteLength).toString("hex");
  const hash = hashToken(raw);
  return { raw, hash };
}

export function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}
