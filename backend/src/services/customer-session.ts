import { createHash } from "node:crypto";
import { getTenantConnection } from "../db/tenant.js";
import { AppError } from "../lib/errors.js";
import { getCustomerModels } from "../models/customer.js";
import { findActiveWebsite } from "./websites.js";

const sessionHash = (token:string) => createHash("sha256").update(token).digest("hex");

export async function authenticatedCustomer(siteSlug:string,token?:string){
  if(!token)throw new AppError(401,"Customer login required","CUSTOMER_UNAUTHENTICATED");
  const website=await findActiveWebsite(siteSlug),connection=await getTenantConnection(String(website.databaseName));
  const models=getCustomerModels(connection);
  const session=await models.CustomerSession.findOne({tokenHash:sessionHash(token),expiresAt:{$gt:new Date()}});
  if(!session)throw new AppError(401,"Customer session expired","CUSTOMER_UNAUTHENTICATED");
  const customer=await models.Customer.findOne({_id:session.customerId,active:true});
  if(!customer)throw new AppError(401,"Customer is unavailable","CUSTOMER_UNAUTHENTICATED");
  session.lastUsedAt=new Date();void session.save();
  return {customer,connection};
}
