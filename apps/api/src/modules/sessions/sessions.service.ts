import { AppError } from "../../middlewares/errorHandler.js";
import {
  getSessionsByUser,
  deleteSession,
  deleteAllUserSessions,
} from "./sessions.repository.js";
import { logAction } from "../audit/audit.service.js";
import type { Request } from "express";

export async function listMySessions(userId: string) {
  return getSessionsByUser(userId);
}

export async function revokeSession(req: Request, sessionId: string) {
  const userId = req.session.userId!;
  const currentId = req.session.id;

  // Only allow revoking own sessions
  const sessions = await getSessionsByUser(userId);
  const target = sessions.find((s) => s.sessionId === sessionId);
  if (!target) throw new AppError("Session not found", 404);

  await deleteSession(sessionId);

  // If the session being revoked is the current one, destroy it
  if (sessionId === currentId) {
    await new Promise<void>((resolve, reject) =>
      req.session.destroy((err) => (err ? reject(err) : resolve())),
    );
  }

  await logAction(req, "SESSION_REVOKED", "UserSession", sessionId);
}

export async function revokeAllSessions(req: Request) {
  const userId = req.session.userId!;
  const currentId = req.session.id;

  await deleteAllUserSessions(userId, currentId);
  await logAction(req, "SESSION_REVOKED", "UserSession", userId, {
    type: "all_except_current",
  });
}
