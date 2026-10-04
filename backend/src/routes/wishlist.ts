import { Router } from "express";
import { isValidObjectId } from "mongoose";
import { env } from "../config/env.js";
import { asyncHandler } from "../lib/async-handler.js";
import { AppError } from "../lib/errors.js";
import { getProductModel } from "../models/product.js";
import { getWishlistModel } from "../models/wishlist.js";
import { authenticatedCustomer } from "../services/customer-session.js";

export const wishlistRouter=Router({mergeParams:true});
const context=(req:Parameters<Parameters<typeof asyncHandler>[0]>[0])=>authenticatedCustomer(String(req.params.siteSlug),req.cookies?.[env.CUSTOMER_SESSION_COOKIE_NAME] as string|undefined);

wishlistRouter.get("/",asyncHandler(async(req,res)=>{
  const {customer,connection}=await context(req);const WishlistItem=getWishlistModel(connection);
  const items=await WishlistItem.find({customerId:customer._id}).sort({createdAt:-1}).lean();
  res.json({data:items.map(item=>String(item.productId))});
}));

wishlistRouter.post("/:productId",asyncHandler(async(req,res)=>{
  const productId=String(req.params.productId);if(!isValidObjectId(productId))throw new AppError(404,"Product not found","PRODUCT_NOT_FOUND");
  const {customer,connection}=await context(req);const Product=getProductModel(connection);
  if(!await Product.exists({_id:productId,status:"published",archived:false}))throw new AppError(404,"Product not found","PRODUCT_NOT_FOUND");
  await getWishlistModel(connection).updateOne({customerId:customer._id,productId},{$setOnInsert:{customerId:customer._id,productId}},{upsert:true});
  res.status(201).json({ok:true});
}));

wishlistRouter.delete("/:productId",asyncHandler(async(req,res)=>{
  const productId=String(req.params.productId);if(!isValidObjectId(productId))throw new AppError(404,"Product not found","PRODUCT_NOT_FOUND");
  const {customer,connection}=await context(req);
  await getWishlistModel(connection).deleteOne({customerId:customer._id,productId});res.status(204).send();
}));
