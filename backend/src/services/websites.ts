import { AppError } from "../lib/errors.js";
import { Website } from "../models/platform.js";
export async function findActiveWebsite(slug: string) {
  const website = await Website.findOne({ slug: slug.toLowerCase(), active: true });
  if (!website) throw new AppError(404, "Website not found", "WEBSITE_NOT_FOUND");
  return website;
}
