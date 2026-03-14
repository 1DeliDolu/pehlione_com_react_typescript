import type { RequestHandler } from "express";
import {
  listMySessions,
  revokeSession,
  revokeAllSessions,
} from "./sessions.service.js";

export const listSessionsController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const sessions = await listMySessions(req.session.userId!);
    const data = sessions.map(({ sessionId, data }) => ({
      sessionId,
      isCurrent: sessionId === req.session.id,
      createdAt: (data.cookie as Record<string, unknown>)?.expires ?? null,
    }));
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const revokeSessionController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    await revokeSession(req, req.params.sessionId as string);
    res.json({ success: true, message: "Session revoked" });
  } catch (err) {
    next(err);
  }
};

export const revokeAllSessionsController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    await revokeAllSessions(req);
    res.json({ success: true, message: "All other sessions revoked" });
  } catch (err) {
    next(err);
  }
};
