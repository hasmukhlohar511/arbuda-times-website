import "dotenv/config";
import argon2 from "argon2";
import { z } from "zod";
import { closePlatformDatabase, connectPlatformDatabase } from "../db/platform.js";
import { Membership, User, Website } from "../models/platform.js";
const input = z.object({
  BOOTSTRAP_SITE_NAME: z.string().min(1), BOOTSTRAP_SITE_SLUG: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), BOOTSTRAP_SITE_DOMAIN: z.string().min(1),
  BOOTSTRAP_ADMIN_NAME: z.string().min(1), BOOTSTRAP_ADMIN_EMAIL: z.email().transform((v) => v.toLowerCase()), BOOTSTRAP_ADMIN_PASSWORD: z.string().min(12),
}).parse(process.env);
await connectPlatformDatabase();
try {
  const databaseName = `site_${input.BOOTSTRAP_SITE_SLUG.replaceAll("-", "_")}`;
  const website = await Website.findOneAndUpdate({ slug: input.BOOTSTRAP_SITE_SLUG }, { $setOnInsert: { name: input.BOOTSTRAP_SITE_NAME, domains: [input.BOOTSTRAP_SITE_DOMAIN], databaseName, mediaBucket: `${input.BOOTSTRAP_SITE_SLUG}-media`, active: true } }, { upsert: true, new: true });
  const oldUser = await User.findOne({ email: input.BOOTSTRAP_ADMIN_EMAIL });
  const user = oldUser ?? await User.create({ name: input.BOOTSTRAP_ADMIN_NAME, email: input.BOOTSTRAP_ADMIN_EMAIL, passwordHash: await argon2.hash(input.BOOTSTRAP_ADMIN_PASSWORD, { type: argon2.argon2id }), active: true });
  await Membership.updateOne({ userId: user._id, websiteId: website._id }, { $setOnInsert: { role: "owner" } }, { upsert: true });
  console.log(`Bootstrapped ${website.slug} with owner ${user.email}`);
} finally { await closePlatformDatabase(); }
