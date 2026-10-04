import { createHash } from "node:crypto";
import type { RequestHandler } from "express";
import { env } from "../config/env.js";
import { AppError } from "../lib/errors.js";
import { Membership, Session, User } from "../models/platform.js";
import { findActiveWebsite } from "../services/websites.js";
const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");
export const requireUser: RequestHandler = async (req, _res, next) => {
  try {
    const token = req.cookies?.[env.SESSION_COOKIE_NAME] as string | undefined;
    if (!token) throw new AppError(401, "Authentication required", "UNAUTHENTICATED");
    const session = await Session.findOne({ tokenHash: hashToken(token), expiresAt: { $gt: new Date() } });
    if (!session) throw new AppError(401, "Session expired", "UNAUTHENTICATED");
    const user = await User.findOne({ _id: session.userId, active: true });
    if (!user) throw new AppError(401, "User is unavailable", "UNAUTHENTICATED");
    req.authUser = { id: user.id, email: String(user.email), name: String(user.name) };
    session.lastUsedAt = new Date(); void session.save(); next();
  } catch (error) { next(error); }
};
export const requireWebsiteRole = (allowed: Array<"owner" | "admin" | "editor" | "viewer">): RequestHandler => async (req, _res, next) => {
  try {
    if (!req.authUser) throw new AppError(401, "Authentication required", "UNAUTHENTICATED");
    const website = await findActiveWebsite(String(req.params.siteSlug));
    const membership = await Membership.findOne({ userId: req.authUser.id, websiteId: website._id });
    if (!membership || !allowed.includes(membership.role as typeof allowed[number])) throw new AppError(403, "You cannot access this website", "FORBIDDEN");
    req.website = website; req.membershipRole = membership.role as typeof req.membershipRole; next();
  } catch (error) { next(error); }
};
