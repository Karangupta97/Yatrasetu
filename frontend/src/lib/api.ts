/**
 * YatraSetu — typed API client
 *
 * Security properties:
 *  - Access token stored in memory only (not localStorage) to mitigate XSS token theft.
 *  - Refresh token is an httpOnly cookie managed by the backend (never readable by JS).
 *  - Automatic silent refresh: on a 401 response the client calls /api/auth/refresh once
 *    and retries the original request with the new access token.
 *  - All requests include credentials: "include" so the browser sends the refresh cookie.
 *  - Request body is JSON-encoded; Content-Type header is set explicitly.
 */

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

// ── In-memory access token (reset on page reload — by design) ────────────────
let _accessToken: string | null = null;
let _refreshing: Promise<string | null> | null = null;

export function setAccessToken(token: string | null) {
  _accessToken = token;
}

export function getAccessToken(): string | null {
  return _accessToken;
}

// ── Core types ────────────────────────────────────────────────────────────────

export interface ApiError {
  status: "error";
  message: string;
  /** Present when the backend wants the frontend to redirect (e.g. unverified email) */
  userId?: string;
  retryAfter?: number;
}

export interface ApiSuccess<T = Record<string, unknown>> {
  status: "success";
  message?: string;
  data?: T;
}

export type ApiResult<T = Record<string, unknown>> = ApiSuccess<T> | ApiError;

// ── Low-level fetch wrapper ───────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {},
  retry = true
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (_accessToken) {
    headers["Authorization"] = `Bearer ${_accessToken}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
    credentials: "include", // send httpOnly refresh cookie
  });

  // Silent token refresh on 401
  if (res.status === 401 && retry) {
    const newToken = await silentRefresh();
    if (newToken) {
      return request<T>(path, options, false);
    }
  }

  const body = (await res.json()) as T;
  if (!res.ok) {
    // Attach status code for callers that need it
    (body as Record<string, unknown>)._httpStatus = res.status;
    throw body as ApiError;
  }
  return body;
}

/** Attempts a token refresh; returns the new access token or null on failure. */
async function silentRefresh(): Promise<string | null> {
  // Deduplicate concurrent refresh calls
  if (_refreshing) return _refreshing;

  _refreshing = (async () => {
    try {
      const data = await request<{ status: string; accessToken: string }>(
        "/api/auth/refresh",
        { method: "POST" },
        false // never recurse
      );
      if (data.status === "success" && data.accessToken) {
        _accessToken = data.accessToken;
        return data.accessToken;
      }
      return null;
    } catch {
      _accessToken = null;
      return null;
    } finally {
      _refreshing = null;
    }
  })();

  return _refreshing;
}

// ── Auth API ──────────────────────────────────────────────────────────────────

export interface RegisterPayload {
  username: string;
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  status: "success";
  message: string;
  userId: string;
}

export async function apiRegister(
  payload: RegisterPayload
): Promise<RegisterResponse> {
  return request<RegisterResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export interface VerifyEmailPayload {
  userId: string;
  otp: string;
}

export interface VerifyEmailResponse {
  status: "success";
  message: string;
  accessToken?: string;
  user?: AuthUser;
}

export async function apiVerifyEmail(
  payload: VerifyEmailPayload
): Promise<VerifyEmailResponse> {
  return request<VerifyEmailResponse>("/api/auth/verify-email", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ── Aadhaar OKYC API ──────────────────────────────────────────────────────────

export interface AadhaarOtpPayload {
  aadhaarNumber: string;
  consent: "y";
}

export async function apiGenerateAadhaarOtp(
  payload: AadhaarOtpPayload
): Promise<{ status: string; message: string }> {
  return request("/api/profile/aadhaar/generate-otp", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export interface VerifyAadhaarOtpPayload {
  otp: string;
  aadhaarNumber: string;
}

export interface VerifyAadhaarOtpResponse {
  status: "success";
  message: string;
  data: {
    name: string;
    maskedAadhaar: string;
  };
}

export async function apiVerifyAadhaarOtp(
  payload: VerifyAadhaarOtpPayload
): Promise<VerifyAadhaarOtpResponse> {
  return request<VerifyAadhaarOtpResponse>("/api/profile/aadhaar/verify-otp", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}


export interface ResendOtpPayload {
  userId: string;
}

export async function apiResendOtp(
  payload: ResendOtpPayload
): Promise<{ status: string; message: string; retryAfter?: number }> {
  return request("/api/auth/resend-otp", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  mobile: string;
  role: "user" | "admin";
  isEmailVerified: boolean;
  isAadhaarVerified: boolean;
}

export interface LoginResponse {
  status: "success";
  accessToken: string;
  user: AuthUser;
}

export async function apiLogin(
  payload: LoginPayload
): Promise<LoginResponse> {
  return request<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiLogout(): Promise<void> {
  try {
    await request("/api/auth/logout", { method: "POST" });
  } finally {
    _accessToken = null;
  }
}

export async function apiRefresh(): Promise<string | null> {
  return silentRefresh();
}
