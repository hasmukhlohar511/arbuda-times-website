/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { FormEvent, useEffect, useState } from "react";
import AdminDashboard from "@/components/admin-dashboard";
import { API_URL, apiError } from "@/lib/backend-api";

type User = { id: string; name: string; email: string };

export default function AdminPageClient() {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/v1/auth/me`, { credentials: "include" })
      .then(async (response) => response.ok ? (await response.json() as { user: User }).user : null)
      .then(setUser).finally(() => setChecking(false));
  }, []);

  const login = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setError("");
    const response = await fetch(`${API_URL}/api/v1/auth/login`, { method: "POST", credentials: "include", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, password }) }).catch(() => null);
    setBusy(false);
    if (!response) return setError("Could not connect to the backend.");
    if (!response.ok) return setError(await apiError(response, "Could not sign in."));
    setUser((await response.json() as { user: User }).user);
  };

  const logout = async () => {
    await fetch(`${API_URL}/api/v1/auth/logout`, { method: "POST", credentials: "include" }); setUser(null); setPassword("");
  };

  if (checking) return <main className="grid min-h-screen place-items-center bg-[#f4f2ed]"><p>Checking admin session…</p></main>;
  if (user) return <AdminDashboard user={user.name || user.email} onLogout={logout}/>;
  return <main className="grid min-h-screen place-items-center bg-[#f4f2ed] p-5"><form className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl" onSubmit={login}><p className="eyebrow">Arbuda Times</p><h1 className="mt-2 font-serif text-4xl">Admin sign in</h1><p className="mt-3 text-sm text-neutral-500">Use the owner account configured in the backend.</p><label className="mt-7 block text-sm font-semibold">Email<input className="mt-2 w-full rounded border p-3 font-normal" type="email" autoComplete="username" value={email} onChange={(e)=>setEmail(e.target.value)} required/></label><label className="mt-4 block text-sm font-semibold">Password<input className="mt-2 w-full rounded border p-3 font-normal" type="password" autoComplete="current-password" value={password} onChange={(e)=>setPassword(e.target.value)} required/></label>{error&&<p className="error mt-4">{error}</p>}<button className="btn-dark mt-6 w-full justify-center" disabled={busy}>{busy?"Signing in…":"Sign in"}</button><a className="mt-5 block text-center text-sm text-neutral-500" href="/">Back to website</a></form></main>;
}
