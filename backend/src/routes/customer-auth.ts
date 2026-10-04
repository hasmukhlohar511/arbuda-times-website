import { createHash, randomBytes } from "node:crypto";
import argon2 from "argon2";
import { Router } from "express";
import { z } from "zod";
import { env } from "../config/env.js";
import { getTenantConnection } from "../db/tenant.js";
import { asyncHandler } from "../lib/async-handler.js";
import { AppError } from "../lib/errors.js";
import { validateBody } from "../lib/validation.js";
import { getCustomerModels } from "../models/customer.js";
import { findActiveWebsite } from "../services/websites.js";

const email = z.email("Enter a valid email address").trim().toLowerCase();
const password = z.string().min(8, "Password must be at least 8 characters").max(200);
const registerSchema = z.object({ name: z.string().trim().min(2).max(100), email, password });
const loginSchema = z.object({ email, password });
const sessionHash = (token:string) => createHash("sha256").update(token).digest("hex");
const cookieSecurity = { secure: env.isProduction, sameSite: env.isProduction ? "none" as const : "lax" as const };
export const customerAuthRouter = Router({ mergeParams:true });

async function tenantModels(siteSlug:string){
  const website=await findActiveWebsite(siteSlug);
  return getCustomerModels(await getTenantConnection(String(website.databaseName)));
}

async function createSession(CustomerSession:ReturnType<typeof getCustomerModels>["CustomerSession"],customerId:unknown,res:Parameters<Parameters<typeof asyncHandler>[0]>[1]){
  const token=randomBytes(32).toString("base64url"),expiresAt=new Date(Date.now()+env.CUSTOMER_SESSION_TTL_DAYS*86_400_000);
  await CustomerSession.create({customerId,tokenHash:sessionHash(token),expiresAt,lastUsedAt:new Date()});
  res.cookie(env.CUSTOMER_SESSION_COOKIE_NAME,token,{httpOnly:true,...cookieSecurity,expires:expiresAt,path:"/"});
}

customerAuthRouter.post("/register",validateBody(registerSchema),asyncHandler(async(req,res)=>{
  const {Customer,CustomerSession}=await tenantModels(String(req.params.siteSlug));
  if(await Customer.exists({email:req.body.email}))throw new AppError(409,"An account with this email already exists","EMAIL_EXISTS");
  const customer=await Customer.create({name:req.body.name,email:req.body.email,passwordHash:await argon2.hash(req.body.password,{type:argon2.argon2id}),active:true,emailVerified:false,lastLoginAt:new Date()});
  await createSession(CustomerSession,customer._id,res);
  res.status(201).json({customer:{id:customer.id,name:customer.name,email:customer.email,emailVerified:customer.emailVerified}});
}));

customerAuthRouter.post("/login",validateBody(loginSchema),asyncHandler(async(req,res)=>{
  const {Customer,CustomerSession}=await tenantModels(String(req.params.siteSlug));
  const customer=await Customer.findOne({email:req.body.email,active:true}).select("+passwordHash");
  if(!customer||!await argon2.verify(customer.passwordHash,req.body.password))throw new AppError(401,"Invalid email or password","INVALID_CREDENTIALS");
  customer.lastLoginAt=new Date();await customer.save();await createSession(CustomerSession,customer._id,res);
  res.json({customer:{id:customer.id,name:customer.name,email:customer.email,emailVerified:customer.emailVerified}});
}));

customerAuthRouter.get("/me",asyncHandler(async(req,res)=>{
  const {Customer,CustomerSession}=await tenantModels(String(req.params.siteSlug));
  const token=req.cookies?.[env.CUSTOMER_SESSION_COOKIE_NAME] as string|undefined;if(!token)throw new AppError(401,"Customer login required","CUSTOMER_UNAUTHENTICATED");
  const session=await CustomerSession.findOne({tokenHash:sessionHash(token),expiresAt:{$gt:new Date()}});if(!session)throw new AppError(401,"Customer session expired","CUSTOMER_UNAUTHENTICATED");
  const customer=await Customer.findOne({_id:session.customerId,active:true});if(!customer)throw new AppError(401,"Customer is unavailable","CUSTOMER_UNAUTHENTICATED");
  session.lastUsedAt=new Date();void session.save();res.json({customer:{id:customer.id,name:customer.name,email:customer.email,emailVerified:customer.emailVerified}});
}));

customerAuthRouter.post("/logout",asyncHandler(async(req,res)=>{
  const {CustomerSession}=await tenantModels(String(req.params.siteSlug));
  const token=req.cookies?.[env.CUSTOMER_SESSION_COOKIE_NAME] as string|undefined;if(token)await CustomerSession.deleteOne({tokenHash:sessionHash(token)});
  res.clearCookie(env.CUSTOMER_SESSION_COOKIE_NAME,{httpOnly:true,...cookieSecurity,path:"/"});res.status(204).send();
}));
