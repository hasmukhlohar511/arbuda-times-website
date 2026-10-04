/* eslint-disable @next/next/no-html-link-for-pages */
"use client";
import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, LogOut, Mail, ShieldCheck, UserPlus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { API_URL, SITE_SLUG, apiError } from "@/lib/backend-api";

type Customer={id:string;name:string;email:string;emailVerified:boolean};
const base=`${API_URL}/api/v1/sites/${SITE_SLUG}/auth`;

export default function CustomerAccount(){
 const searchParams=useSearchParams(),returnTo=searchParams.get("returnTo")==="/wishlist"?"/wishlist":"";
 const [customer,setCustomer]=useState<Customer|null>(null),[checking,setChecking]=useState(true),[mode,setMode]=useState<"login"|"register">("login"),[name,setName]=useState(""),[email,setEmail]=useState(""),[password,setPassword]=useState(""),[error,setError]=useState(""),[busy,setBusy]=useState(false);
 useEffect(()=>{fetch(`${base}/me`,{credentials:"include"}).then(async r=>r.ok?(await r.json() as {customer:Customer}).customer:null).then(value=>{if(value&&returnTo){window.location.replace(returnTo);return}setCustomer(value)}).finally(()=>setChecking(false))},[returnTo]);
 const submit=async(e:FormEvent)=>{e.preventDefault();setBusy(true);setError("");const payload=mode==="register"?{name,email,password}:{email,password};const r=await fetch(`${base}/${mode}`,{method:"POST",credentials:"include",headers:{"content-type":"application/json"},body:JSON.stringify(payload)}).catch(()=>null);setBusy(false);if(!r)return setError("Could not connect to the login service.");if(!r.ok)return setError(await apiError(r,mode==="register"?"Could not create your account.":"Could not sign in."));const nextCustomer=(await r.json() as {customer:Customer}).customer;if(returnTo){window.location.replace(returnTo);return}setCustomer(nextCustomer);setPassword("")};
 const logout=async()=>{await fetch(`${base}/logout`,{method:"POST",credentials:"include"});setCustomer(null);setPassword("")};
 const changeMode=()=>{setMode(current=>current==="login"?"register":"login");setError("");setPassword("")};
 if(checking)return <main className="account-page"><p>Checking your account…</p></main>;
 if(customer)return <main className="account-page"><section className="account-card"><div className="account-icon"><ShieldCheck/></div><p className="eyebrow">My account</p><h1>Welcome, {customer.name}.</h1><p className="account-phone">Signed in as {customer.email}</p><div className="account-actions"><a className="btn-outline" href="/"><ArrowLeft/> Continue shopping</a><button className="btn-dark" onClick={logout}><LogOut/> Sign out</button></div></section></main>;
 return <main className="account-page"><form className="account-card" onSubmit={submit}><div className="account-icon">{mode==="login"?<Mail/>:<UserPlus/>}</div><p className="eyebrow">Customer account</p><h1>{mode==="login"?"Welcome back":"Create account"}</h1><p>{mode==="login"?"Sign in to access your Arbuda Times account.":"Create your account to make future shopping easier."}</p>{mode==="register"&&<label>Full name<input autoComplete="name" value={name} onChange={e=>setName(e.target.value)} minLength={2} required/></label>}<label>Email address<input type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} required/></label><label>Password<input type="password" autoComplete={mode==="login"?"current-password":"new-password"} minLength={8} maxLength={200} value={password} onChange={e=>setPassword(e.target.value)} required/><small>Use at least 8 characters.</small></label>{error&&<p className="error">{error}</p>}<button className="btn-dark account-submit" disabled={busy}>{busy?"Please wait…":mode==="login"?"Sign in":"Create account"}</button><button type="button" className="account-change" onClick={changeMode}>{mode==="login"?"New customer? Create an account":"Already have an account? Sign in"}</button><a className="account-back" href="/"><ArrowLeft/> Back to store</a></form></main>;
}
