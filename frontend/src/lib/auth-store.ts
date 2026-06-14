/**
 * YatraSetu — client-side auth store
 *
 * Security model:
 *  - Access token is held in memory (via api.ts) — never written to localStorage.
 *  - Only non-sensitive user metadata is persisted to sessionStorage so the UI
 *    can re-hydrate across soft navigations without storing secrets.
 *  - On hard reload the access token is gone; the app calls /api/auth/refresh
 *    using the httpOnly refresh cookie to silently re-authenticate.
 */

import type { AuthUser } from "./api";

const SESSION_KEY = "ys_user";

// ── Persisted user metadata (no tokens) ─────────────────────────────────────

export function saveSessionUser(user: AuthUser): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function loadSessionUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function clearSessionUser(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
}

// ── Redirect helpers ─────────────────────────────────────────────────────────

/** Where to land after login (saved before redirect to /login). */
const RETURN_KEY = "ys_return_to";

export function saveReturnTo(path: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(RETURN_KEY, path);
}

export function consumeReturnTo(): string {
  if (typeof window === "undefined") return "/dashboard";
  const path = sessionStorage.getItem(RETURN_KEY) ?? "/dashboard";
  sessionStorage.removeItem(RETURN_KEY);
  return path;
}
