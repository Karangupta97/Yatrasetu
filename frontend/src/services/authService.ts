/**
 * authService.ts — TC Login authentication service (mock implementation).
 * Replace API simulation with real calls in production.
 */

export type TCType = "express" | "local";

export interface TCCredentials {
  tcId: string;
  password: string;
  tcType: TCType;
  captchaAnswer: string;
  captchaExpected: string;
  rememberDevice?: boolean;
}

export interface OTPRequest {
  tcId: string;
  tcType: TCType;
}

export interface OTPVerifyRequest {
  tcId: string;
  otp: string;
  tcType: TCType;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  tcId?: string;
  tcType?: TCType;
  name?: string;
  redirectPath?: string;
}

export interface DeviceAuthResult {
  authorized: boolean;
  deviceId?: string;
}

/** Mock TC accounts for demo purposes */
const MOCK_TC_ACCOUNTS: Record<
  string,
  { password: string; name: string; tcType: TCType; authorizedDevices: string[] }
> = {
  TC1024: {
    password: "pass1234",
    name: "Rajesh Kumar",
    tcType: "express",
    authorizedDevices: ["DEMO_DEVICE_001"],
  },
  TC2048: {
    password: "pass5678",
    name: "Priya Sharma",
    tcType: "local",
    authorizedDevices: ["DEMO_DEVICE_001"],
  },
  TC9999: {
    password: "admin123",
    name: "Admin TC",
    tcType: "express",
    authorizedDevices: [],
  },
};

const DEMO_OTP = "123456";
const TC_SESSION_KEY = "yatrasetu_tc_session";
const TC_DEVICE_KEY = "yatrasetu_tc_device_id";

/** Get or create a persistent browser device ID */
export function getDeviceId(): string {
  if (typeof window === "undefined") return "SSR_DEVICE";
  let deviceId = localStorage.getItem(TC_DEVICE_KEY);
  if (!deviceId) {
    deviceId = `DEMO_DEVICE_001`; // Always use demo device for testing
    localStorage.setItem(TC_DEVICE_KEY, deviceId);
  }
  return deviceId;
}

/** Validate captcha answer against expected string (case-insensitive) */
export async function validateCaptcha(
  answer: string,
  expected: string
): Promise<boolean> {
  await simulateTCDelay(200);
  return answer.trim().toUpperCase() === expected.trim().toUpperCase();
}

/** Check if the current device is authorized for a given TC account */
export async function validateAuthorizedDevice(
  tcId: string
): Promise<DeviceAuthResult> {
  await simulateTCDelay(300);
  const deviceId = getDeviceId();
  const account = MOCK_TC_ACCOUNTS[tcId.toUpperCase()];
  if (!account) {
    // Unknown account — allow device check to pass (login will fail anyway)
    return { authorized: true, deviceId };
  }
  const authorized = account.authorizedDevices.includes(deviceId);
  return { authorized, deviceId };
}

/** Login with TC ID + password + captcha */
export async function loginTC(credentials: TCCredentials): Promise<AuthResult> {
  await simulateTCDelay(1400);

  const { tcId, password, tcType, captchaAnswer, captchaExpected } = credentials;

  // Validate captcha first
  const captchaValid = await validateCaptcha(captchaAnswer, captchaExpected);
  if (!captchaValid) {
    return { success: false, error: "Incorrect CAPTCHA. Please try again." };
  }

  // Look up account
  const account = MOCK_TC_ACCOUNTS[tcId.toUpperCase()];
  if (!account) {
    return { success: false, error: "TC ID not found. Contact Railway Administrator." };
  }

  if (account.password !== password) {
    return { success: false, error: "Incorrect password. Please try again." };
  }

  if (account.tcType !== tcType) {
    return {
      success: false,
      error: `This TC ID is registered as ${account.tcType === "express" ? "Express TC" : "Local TC"}. Please select the correct type.`,
    };
  }

  // Device check
  const deviceCheck = await validateAuthorizedDevice(tcId);
  if (!deviceCheck.authorized) {
    return {
      success: false,
      error: "UNAUTHORIZED_DEVICE",
    };
  }

  const redirectPath =
    tcType === "express"
      ? "/ticket-checker/express/dashboard"
      : "/ticket-checker/local/dashboard";

  // Persist session
  if (typeof window !== "undefined") {
    sessionStorage.setItem(
      TC_SESSION_KEY,
      JSON.stringify({ tcId: tcId.toUpperCase(), tcType, name: account.name })
    );
  }

  return {
    success: true,
    tcId: tcId.toUpperCase(),
    tcType,
    name: account.name,
    redirectPath,
  };
}

/** Initiate OTP login — send OTP to registered mobile */
export async function loginWithOTP(request: OTPRequest): Promise<AuthResult> {
  await simulateTCDelay(1000);

  const account = MOCK_TC_ACCOUNTS[request.tcId.toUpperCase()];
  if (!account) {
    return { success: false, error: "TC ID not found. Contact Railway Administrator." };
  }

  // Device check
  const deviceCheck = await validateAuthorizedDevice(request.tcId);
  if (!deviceCheck.authorized) {
    return { success: false, error: "UNAUTHORIZED_DEVICE" };
  }

  // In production: send OTP via SMS/IVRS
  // Mock: OTP is always DEMO_OTP
  return {
    success: true,
    tcId: request.tcId.toUpperCase(),
    tcType: account.tcType,
    name: account.name,
  };
}

/** Verify OTP submitted by TC */
export async function verifyOTP(request: OTPVerifyRequest): Promise<AuthResult> {
  await simulateTCDelay(900);

  if (request.otp !== DEMO_OTP) {
    return { success: false, error: "Invalid OTP. Please try again." };
  }

  const account = MOCK_TC_ACCOUNTS[request.tcId.toUpperCase()];
  if (!account) {
    return { success: false, error: "TC ID not found." };
  }

  const redirectPath =
    request.tcType === "express"
      ? "/ticket-checker/express/dashboard"
      : "/ticket-checker/local/dashboard";

  if (typeof window !== "undefined") {
    sessionStorage.setItem(
      TC_SESSION_KEY,
      JSON.stringify({ tcId: request.tcId.toUpperCase(), tcType: request.tcType, name: account.name })
    );
  }

  return {
    success: true,
    tcId: request.tcId.toUpperCase(),
    tcType: request.tcType,
    name: account.name,
    redirectPath,
  };
}

/** Get current TC session (if any) */
export function getTCSession(): { tcId: string; tcType: TCType; name: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(TC_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Clear TC session */
export function clearTCSession(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(TC_SESSION_KEY);
  }
}

async function simulateTCDelay(ms: number): Promise<void> {
  await new Promise((r) => setTimeout(r, ms));
}
