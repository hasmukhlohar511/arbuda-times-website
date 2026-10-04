import { Router } from "express";
import { platformConnection } from "../db/platform.js";
export const healthRouter = Router();
healthRouter.get("/", (_req, res) => { const ready = platformConnection.readyState === 1; res.status(ready ? 200 : 503).json({ status: ready ? "ok" : "degraded", database: ready ? "connected" : "disconnected" }); });
