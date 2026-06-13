/** Client-side auth helpers (demo — replace with API calls in production). */

export function formatAadhaar(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 12);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

export function formatPan(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
}

export function generateUsername(firstName: string, mobile: string): string {
  const base = firstName.toLowerCase().replace(/[^a-z]/g, "") || "user";
  return `${base}${mobile.slice(-6)}`;
}

export function generateCaptchaText(length = 5): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export interface StoredUser {
  username: string;
  mobile: string;
  fullName: string;
}

const USERS_KEY = "yatrasetu_users";
const SUCCESS_KEY = "yatrasetu_registration_success";
const WELCOME_KEY = "yatrasetu_pending_welcome";

export function saveRegisteredUser(aadhaar: string, user: StoredUser) {
  const users = loadUsers();
  users[aadhaar.replace(/\s/g, "")] = user;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function loadUsers(): Record<string, StoredUser> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
  } catch {
    return {};
  }
}

export function lookupUserByAadhaar(aadhaar: string): StoredUser | null {
  const digits = aadhaar.replace(/\s/g, "");
  return loadUsers()[digits] ?? null;
}

export interface RegistrationSuccess {
  username: string;
  fullName: string;
  mobile: string;
  email: string;
}

export function saveRegistrationSuccess(data: RegistrationSuccess) {
  sessionStorage.setItem(SUCCESS_KEY, JSON.stringify(data));
}

export function loadRegistrationSuccess(): RegistrationSuccess | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SUCCESS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearRegistrationSuccess() {
  sessionStorage.removeItem(SUCCESS_KEY);
}

export function setPendingWelcome(username: string) {
  localStorage.setItem(WELCOME_KEY, username);
}

export function consumePendingWelcome(): string | null {
  if (typeof window === "undefined") return null;
  const username = localStorage.getItem(WELCOME_KEY);
  if (username) localStorage.removeItem(WELCOME_KEY);
  return username;
}

export async function simulateDelay(ms = 1000) {
  await new Promise((r) => setTimeout(r, ms));
}
