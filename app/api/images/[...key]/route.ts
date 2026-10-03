import { NextRequest, NextResponse } from "next/server";
import { env } from "cloudflare:workers";
export async function GET(_req:NextRequest,{params}:{params:Promise<{key:string[]}>}){if(!env.BUCKET)return new NextResponse("Not configured",{status:404});const {key}=await params,obj=await env.BUCKET.get(key.join("/"));if(!obj)return new NextResponse("Not found",{status:404});return new NextResponse(obj.body,{headers:{"content-type":obj.httpMetadata?.contentType||"application/octet-stream","cache-control":"public, max-age=31536000, immutable"}})}
