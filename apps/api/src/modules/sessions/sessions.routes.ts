import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import { verifyCsrfToken } from "../../middlewares/csrf.js";
import {
  listSessionsController,
  revokeSessionController,
  revokeAllSessionsController,
} from "./sessions.controller.js";

export const sessionsRouter = Router();

sessionsRouter.use(authenticate);

sessionsRouter.get("/", listSessionsController);
sessionsRouter.delete("/all", verifyCsrfToken, revokeAllSessionsController);
sessionsRouter.delete("/:sessionId", verifyCsrfToken, revokeSessionController);
