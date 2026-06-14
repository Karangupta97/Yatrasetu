"use client";

import { useState, useEffect, useCallback } from "react";
import { loadSessionUser, saveSessionUser } from "@/lib/auth-store";
import type { AuthUser } from "@/lib/api";

// ── Extended profile fields stored separately ────────────────────────────────
const PROFILE_EXT_KEY = "ys_profile_ext";

interface ProfileExtended {
  age?: string;
  gender?: string;
  memberSince?: string;    // e.g. "Aug 2023"
  bookingCount?: number;
  totalSaved?: number;     // in ₹
  aadhaarLast4?: string;   // last 4 digits only
  aadhaarVerifiedOn?: string;
  paymentMethods?: PaymentMethod[];
  recentActivity?: ActivityItem[];
  travelStats?: TravelStats;
}

export interface PaymentMethod {
  id: string;
  type: "upi" | "card" | "netbanking";
  label: string;
  sub: string;
  default: boolean;
}

export interface ActivityItem {
  id: string;
  color: string;   // dot color
  text: string;
  time: string;
}

export interface TravelStats {
  totalDistance: number;   // km
  journeysCompleted: number;
  favouriteRoute: string;
}

// ── Default/seed values (only used when no stored data exists) ───────────────
const SEED_EXTENDED: ProfileExtended = {
  memberSince: "Aug 2023",
  bookingCount: 6,
  totalSaved: 3420,
  paymentMethods: [
    { id: "m1", type: "upi",        label: "jidnyasa@paytm",      sub: "Paytm UPI",            default: true  },
    { id: "m2", type: "card",       label: "•••• •••• •••• 4242", sub: "HDFC Visa Credit",      default: false },
    { id: "m3", type: "netbanking", label: "SBI Net Banking",      sub: "State Bank of India",  default: false },
  ],
  recentActivity: [
    { id: "a1", color: "#6366F1", text: "Booked Garib Rath Express",  time: "2 days ago"  },
    { id: "a2", color: "#22c55e", text: "Profile updated",            time: "5 days ago"  },
    { id: "a3", color: "#f59e0b", text: "Aadhaar submitted",          time: "1 week ago"  },
  ],
  travelStats: {
    totalDistance: 4820,
    journeysCompleted: 4,
    favouriteRoute: "NDLS → CSMT",
  },
};

function loadExtended(): ProfileExtended {
  if (typeof window === "undefined") return SEED_EXTENDED;
  try {
    const raw = sessionStorage.getItem(PROFILE_EXT_KEY);
    return raw ? { ...SEED_EXTENDED, ...(JSON.parse(raw) as ProfileExtended) } : SEED_EXTENDED;
  } catch {
    return SEED_EXTENDED;
  }
}

function saveExtended(data: ProfileExtended): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PROFILE_EXT_KEY, JSON.stringify(data));
}

// ── Public shape exposed by the hook ─────────────────────────────────────────
export interface UserProfile {
  // Core identity (from AuthUser)
  id: string | null;
  username: string | null;
  fullName: string | null;
  email: string | null;
  phone: string | null;              // AuthUser.mobile
  role: string | null;
  isEmailVerified: boolean;
  isAadhaarVerified: boolean;

  // Extended profile
  age: string | null;
  gender: string | null;
  memberSince: string | null;
  bookingCount: number;
  totalSaved: number;
  aadhaarLast4: string | null;
  aadhaarVerifiedOn: string | null;
  paymentMethods: PaymentMethod[];
  recentActivity: ActivityItem[];
  travelStats: TravelStats;

  // Derived helpers
  initials: string;
  displayName: string;
  avatarColor: string;   // deterministic from username

  // Mutators
  updateProfile: (fields: Partial<Pick<UserProfile, "fullName" | "email" | "phone" | "age" | "gender">>) => void;
  markAadhaarVerified: (last4: string) => void;
  setPaymentMethods: (methods: PaymentMethod[]) => void;
}

// ── Deterministic avatar color ───────────────────────────────────────────────
const AVATAR_PALETTE = [
  "linear-gradient(135deg, #6366F1, #8B5CF6)",   // indigo → violet
  "linear-gradient(135deg, #0EA5E9, #6366F1)",   // sky → indigo
  "linear-gradient(135deg, #10B981, #0EA5E9)",   // emerald → sky
  "linear-gradient(135deg, #8B5CF6, #EC4899)",   // violet → pink
  "linear-gradient(135deg, #F59E0B, #EF4444)",   // amber → red
  "linear-gradient(135deg, #14B8A6, #6366F1)",   // teal → indigo
];

export function getAvatarGradient(username: string | null): string {
  if (!username) return AVATAR_PALETTE[0];
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = (hash * 31 + username.charCodeAt(i)) >>> 0;
  }
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}

function getInitials(fullName: string | null, username: string | null): string {
  if (fullName) {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  }
  if (username) return username[0].toUpperCase();
  return "U";
}

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useUserProfile(): UserProfile {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [ext, setExt] = useState<ProfileExtended>(SEED_EXTENDED);

  useEffect(() => {
    setAuthUser(loadSessionUser());
    setExt(loadExtended());
  }, []);

  const updateProfile = useCallback(
    (fields: Partial<Pick<UserProfile, "fullName" | "email" | "phone" | "age" | "gender">>) => {
      // Update core AuthUser fields
      setAuthUser((prev) => {
        if (!prev) return prev;
        const updated: AuthUser = {
          ...prev,
          fullName: fields.fullName ?? prev.fullName,
          email:    fields.email    ?? prev.email,
          mobile:   fields.phone    ?? prev.mobile,
        };
        saveSessionUser(updated);
        return updated;
      });
      // Update extended fields
      setExt((prev) => {
        const updated = {
          ...prev,
          age:    fields.age    ?? prev.age,
          gender: fields.gender ?? prev.gender,
        };
        saveExtended(updated);
        return updated;
      });
    },
    []
  );

  const markAadhaarVerified = useCallback((last4: string) => {
    setAuthUser((prev) => {
      if (!prev) return prev;
      const updated: AuthUser = { ...prev, isAadhaarVerified: true };
      saveSessionUser(updated);
      return updated;
    });
    const now = new Date();
    const verifiedOn = now.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    setExt((prev) => {
      const updated = { ...prev, aadhaarLast4: last4, aadhaarVerifiedOn: verifiedOn };
      saveExtended(updated);
      return updated;
    });
  }, []);

  const setPaymentMethods = useCallback((methods: PaymentMethod[]) => {
    setExt((prev) => {
      const updated = { ...prev, paymentMethods: methods };
      saveExtended(updated);
      return updated;
    });
  }, []);

  const fullName = authUser?.fullName ?? null;
  const username = authUser?.username ?? null;

  return {
    // Core
    id:               authUser?.id       ?? null,
    username,
    fullName,
    email:            authUser?.email    ?? null,
    phone:            authUser?.mobile   ?? null,
    role:             authUser?.role     ?? null,
    isEmailVerified:  authUser?.isEmailVerified  ?? false,
    isAadhaarVerified: authUser?.isAadhaarVerified ?? false,

    // Extended
    age:              ext.age    ?? null,
    gender:           ext.gender ?? null,
    memberSince:      ext.memberSince      ?? null,
    bookingCount:     ext.bookingCount     ?? 0,
    totalSaved:       ext.totalSaved       ?? 0,
    aadhaarLast4:     ext.aadhaarLast4     ?? null,
    aadhaarVerifiedOn: ext.aadhaarVerifiedOn ?? null,
    paymentMethods:   ext.paymentMethods   ?? [],
    recentActivity:   ext.recentActivity   ?? [],
    travelStats:      ext.travelStats      ?? SEED_EXTENDED.travelStats!,

    // Derived
    initials:     getInitials(fullName, username),
    displayName:  fullName || username || "YatraSetu Member",
    avatarColor:  getAvatarGradient(username),

    // Mutators
    updateProfile,
    markAadhaarVerified,
    setPaymentMethods,
  };
}
