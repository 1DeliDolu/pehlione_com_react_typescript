import { redis } from "../../lib/redis.js";

/**
 * express-session stores sessions under the key "sess:<sessionId>" (default prefix).
 * We list all session keys and filter by userId stored in the session data.
 */

interface SessionPayload {
  cookie: Record<string, unknown>;
  userId?: string;
  role?: string;
  membershipTier?: string;
}

const SESSION_PREFIX = "sess:";

async function getAllSessionIds(): Promise<string[]> {
  const keys = await redis.keys(`${SESSION_PREFIX}*`);
  return keys.map((k) => k.slice(SESSION_PREFIX.length));
}

export async function getSessionsByUser(userId: string) {
  const ids = await getAllSessionIds();
  const result: { sessionId: string; data: SessionPayload }[] = [];

  for (const sessionId of ids) {
    const raw = await redis.get(`${SESSION_PREFIX}${sessionId}`);
    if (!raw) continue;
    try {
      const data = JSON.parse(raw) as SessionPayload;
      if (data.userId === userId) result.push({ sessionId, data });
    } catch {
      // ignore malformed session
    }
  }

  return result;
}

export async function deleteSession(sessionId: string) {
  await redis.del(`${SESSION_PREFIX}${sessionId}`);
}

export async function deleteAllUserSessions(
  userId: string,
  exceptSessionId?: string,
) {
  const ids = await getAllSessionIds();
  for (const sessionId of ids) {
    if (exceptSessionId && sessionId === exceptSessionId) continue;
    const raw = await redis.get(`${SESSION_PREFIX}${sessionId}`);
    if (!raw) continue;
    try {
      const data = JSON.parse(raw) as SessionPayload;
      if (data.userId === userId)
        await redis.del(`${SESSION_PREFIX}${sessionId}`);
    } catch {
      // ignore
    }
  }
}
