export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000";
export const SITE_SLUG = process.env.NEXT_PUBLIC_SITE_SLUG || "arbuda-times";

export async function apiError(response: Response, fallback: string) {
  try {
    const payload = await response.json() as { error?: { message?: string } | string };
    return typeof payload.error === "string" ? payload.error : payload.error?.message || fallback;
  } catch {
    return fallback;
  }
}
