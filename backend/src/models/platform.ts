import { Schema } from "mongoose";
import { platformConnection } from "../db/platform.js";
const websiteSchema = new Schema({
  name: { type: String, required: true, trim: true }, slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  domains: { type: [String], required: true, default: [] }, databaseName: { type: String, required: true, unique: true, immutable: true },
  mediaBucket: { type: String, required: true, unique: true, immutable: true }, active: { type: Boolean, required: true, default: true },
}, { timestamps: true });
const userSchema = new Schema({ name: { type: String, required: true, trim: true }, email: { type: String, required: true, unique: true, lowercase: true, trim: true }, passwordHash: { type: String, required: true }, active: { type: Boolean, required: true, default: true } }, { timestamps: true });
const membershipSchema = new Schema({ userId: { type: Schema.Types.ObjectId, required: true, ref: "User" }, websiteId: { type: Schema.Types.ObjectId, required: true, ref: "Website" }, role: { type: String, enum: ["owner", "admin", "editor", "viewer"], required: true } }, { timestamps: true });
membershipSchema.index({ userId: 1, websiteId: 1 }, { unique: true });
const sessionSchema = new Schema({ userId: { type: Schema.Types.ObjectId, required: true, ref: "User" }, tokenHash: { type: String, required: true, unique: true }, expiresAt: { type: Date, required: true, index: { expires: 0 } }, lastUsedAt: { type: Date, required: true } }, { timestamps: true });
export const Website = platformConnection.model("Website", websiteSchema);
export const User = platformConnection.model("User", userSchema);
export const Membership = platformConnection.model("Membership", membershipSchema);
export const Session = platformConnection.model("Session", sessionSchema);
