import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { Router } from "express";
import multer from "multer";
import { env } from "../config/env.js";
import { asyncHandler } from "../lib/async-handler.js";
import { AppError } from "../lib/errors.js";
import { requireUser, requireWebsiteRole } from "../middleware/auth.js";
import { findActiveWebsite } from "../services/websites.js";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 1 } });
const signatures = [
  { type: "image/jpeg", ext: "jpg", matches: (b: Buffer) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { type: "image/png", ext: "png", matches: (b: Buffer) => b.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) },
  { type: "image/webp", ext: "webp", matches: (b: Buffer) => b.subarray(0, 4).toString() === "RIFF" && b.subarray(8, 12).toString() === "WEBP" },
];

export const adminMediaRouter = Router({ mergeParams: true });
adminMediaRouter.post("/", requireUser, requireWebsiteRole(["owner", "admin", "editor"]), upload.single("file"), asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError(400, "Choose an image", "IMAGE_REQUIRED");
  const format = signatures.find((item) => item.type === req.file!.mimetype && item.matches(req.file!.buffer));
  if (!format) throw new AppError(400, "Use a valid JPG, PNG or WebP image", "INVALID_IMAGE");
  const directory = path.resolve(env.MEDIA_ROOT, String(req.website!.mediaBucket));
  const filename = `${randomUUID()}.${format.ext}`;
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, filename), req.file.buffer, { flag: "wx" });
  res.status(201).json({ url: `${env.API_PUBLIC_URL}/media/${req.website!.slug}/${filename}` });
}));

export const publicMediaRouter = Router({ mergeParams: true });
publicMediaRouter.get("/:filename", asyncHandler(async (req, res) => {
  const filename = String(req.params.filename);
  if (!/^[0-9a-f-]{36}\.(jpg|png|webp)$/.test(filename)) throw new AppError(404, "Image not found", "IMAGE_NOT_FOUND");
  const website = await findActiveWebsite(String(req.params.siteSlug));
  const file = await readFile(path.resolve(env.MEDIA_ROOT, String(website.mediaBucket), filename)).catch(() => null);
  if (!file) throw new AppError(404, "Image not found", "IMAGE_NOT_FOUND");
  const ext = path.extname(filename); const type = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";
  res.set({ "Content-Type": type, "Cache-Control": "public, max-age=31536000, immutable", "Cross-Origin-Resource-Policy": "cross-origin" }).send(file);
}));
