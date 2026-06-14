export interface RegisterData {
  /** MongoDB _id returned by POST /api/auth/register — needed for verify-email and resend-otp */
  userId: string;
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  username: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  addressLine1: string;
  addressLine2: string;
  state: string;
  district: string;
  pincode: string;
  aadhaar: string;
  aadhaarVerified: boolean;
}

const KEY = "yatrasetu_register";

export const defaultRegisterData: RegisterData = {
  userId: "",
  fullName: "",
  email: "",
  mobile: "",
  password: "",
  username: "",
  emailVerified: false,
  firstName: "",
  lastName: "",
  dob: "",
  gender: "",
  addressLine1: "",
  addressLine2: "",
  state: "",
  district: "",
  pincode: "",
  aadhaar: "",
  aadhaarVerified: false,
};

export function loadRegisterData(): RegisterData {
  if (typeof window === "undefined") return defaultRegisterData;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return defaultRegisterData;
    const parsed = JSON.parse(raw);
    // migrate legacy otpVerified field
    if (parsed.otpVerified && !parsed.emailVerified) {
      parsed.emailVerified = parsed.otpVerified;
    }
    return { ...defaultRegisterData, ...parsed };
  } catch {
    return defaultRegisterData;
  }
}

export function saveRegisterData(data: Partial<RegisterData>) {
  const current = loadRegisterData();
  sessionStorage.setItem(KEY, JSON.stringify({ ...current, ...data }));
}

export function clearRegisterData() {
  sessionStorage.removeItem(KEY);
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const visible = local.slice(0, 2);
  return `${visible}***@${domain}`;
}

export { maskEmail };
