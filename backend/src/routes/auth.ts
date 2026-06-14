import { Router, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import { randomInt } from "crypto";
import User from "../models/User.js";
import { sendEmail } from "../config/ses.js";
import { deviceFingerprint } from "../utils/deviceFingerprint.js";
import redisClient from "../config/redis.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = Router();

const EMAIL_OTP_TTL = 600; // 10 minutes in seconds
const EMAIL_OTP_PREFIX = "email:otp:";

// ── Helpers ───────────────────────────────────────────────────────────────────

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongPassword(password: string): boolean {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
}

/** Generates a cryptographically random 6-digit OTP string. */
function generateOTP(): string {
  return String(randomInt(100000, 999999));
}

/**
 * Sends the email verification OTP.
 * In development, falls back to console if SES is not configured,
 * so the registration flow is never blocked during local dev.
 */
async function sendVerificationOTP(
  email: string,
  fullName: string,
  otp: string
): Promise<void> {
  try {
    await sendEmail(
      email,
      "Your Yatrasetu verification code",
      `
        <div style="font-family:sans-serif;max-width:480px;margin:auto">
          <h2 style="color:#1a73e8">Verify your email</h2>
          <p>Hi ${fullName},</p>
          <p>Use the code below to verify your Yatrasetu account.</p>
          <div style="font-size:36px;font-weight:bold;letter-spacing:8px;
                      text-align:center;padding:20px;background:#f5f5f5;
                      border-radius:8px;margin:24px 0">
            ${otp}
          </div>
          <p style="color:#888;font-size:13px">
            This code expires in 10 minutes. If you did not create this account,
            you can safely ignore this email.
          </p>
        </div>
      `
    );
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("⚠️  SES email failed — dev OTP fallback:");
      console.info(`📧  OTP for ${email}: ${otp}`);
    } else {
      throw err; // propagate in production so caller can roll back
    }
  }
}

// ── POST /api/auth/register ───────────────────────────────────────────────────
router.post("/register", authLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, fullName, email, mobile, password, confirmPassword } =
      req.body as {
        username?: string;
        fullName?: string;
        email?: string;
        mobile?: string;
        password?: string;
        confirmPassword?: string;
      };

    if (!username || !fullName || !email || !mobile || !password || !confirmPassword) {
      res.status(400).json({
        status: "error",
        message: "All fields are required: username, fullName, email, mobile, password, confirmPassword.",
      });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({ status: "error", message: "Passwords do not match." });
      return;
    }

    if (!isValidEmail(email)) {
      res.status(400).json({ status: "error", message: "Invalid email format." });
      return;
    }

    if (!isStrongPassword(password)) {
      res.status(400).json({
        status: "error",
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.",
      });
      return;
    }

    // ── Duplicate check ───────────────────────────────────────────────────
    const existingUser = await User.findOne({
      $or: [{ username }, { email: email.toLowerCase() }],
    }).lean();

    if (existingUser) {
      const field = existingUser.username === username ? "username" : "email";
      res.status(409).json({
        status: "error",
        message: `An account with this ${field} already exists.`,
      });
      return;
    }

    // ── Create user ───────────────────────────────────────────────────────
    const user = await User.create({ username, fullName, email, mobile, password });

    // ── Generate and store OTP ────────────────────────────────────────────
    const otp = generateOTP();
    await redisClient.setex(`${EMAIL_OTP_PREFIX}${user._id.toString()}`, EMAIL_OTP_TTL, otp);

    // ── Send OTP email ────────────────────────────────────────────────────
    try {
      await sendVerificationOTP(user.email, user.fullName, otp);
    } catch {
      // Production SES failure → rollback user creation
      await User.findByIdAndDelete(user._id);
      await redisClient.del(`${EMAIL_OTP_PREFIX}${user._id.toString()}`);
      res.status(502).json({
        status: "error",
        message: "Could not send verification email. Please try again.",
      });
      return;
    }

    res.status(201).json({
      status: "success",
      message: "Account created. A 6-digit OTP has been sent to your email address.",
      // Return userId so the frontend can pass it to /verify-email
      userId: user._id,
    });
  } catch (err) {
    console.error("Register error:", (err as Error).message);
    res.status(500).json({ status: "error", message: "Registration failed. Please try again." });
  }
});

// ── POST /api/auth/verify-email ───────────────────────────────────────────────
// Body: { userId, otp }
router.post("/verify-email", authLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, otp } = req.body as { userId?: string; otp?: string };

    if (!userId || !otp) {
      res.status(400).json({ status: "error", message: "userId and otp are required." });
      return;
    }

    // ── Fetch stored OTP ──────────────────────────────────────────────────
    const stored = await redisClient.get(`${EMAIL_OTP_PREFIX}${userId}`);
    if (!stored) {
      res.status(410).json({
        status: "error",
        message: "OTP has expired. Please request a new one via /api/auth/resend-otp.",
      });
      return;
    }

    if (stored !== otp.trim()) {
      res.status(401).json({ status: "error", message: "Incorrect OTP. Please try again." });
      return;
    }

    // ── Mark email verified ───────────────────────────────────────────────
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ status: "error", message: "User not found." });
      return;
    }

    if (user.isEmailVerified) {
      res.status(200).json({ status: "success", message: "Email is already verified." });
      return;
    }

    user.isEmailVerified = true;
    await user.save();

    // Clean up OTP from Redis
    await redisClient.del(`${EMAIL_OTP_PREFIX}${userId}`);

    // Same as login: set refreshToken cookie and return accessToken + user
    const jwtSecret = process.env.JWT_SECRET;
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
    if (!jwtSecret || !jwtRefreshSecret) throw new Error("JWT secrets not configured.");

    const accessToken = jwt.sign(
      { id: user._id.toString(), role: user.role },
      jwtSecret,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id.toString() },
      jwtRefreshSecret,
      { expiresIn: "7d" }
    );

    await redisClient.setex(`refresh:${user._id.toString()}`, 7 * 24 * 60 * 60, refreshToken);

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        status: "success",
        message: "Email verified successfully. You are now logged in.",
        accessToken,
        user: {
          id: user._id,
          username: user.username,
          fullName: user.fullName,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          isAadhaarVerified: user.isAadhaarVerified,
        },
      });
  } catch (err) {
    console.error("Verify email error:", (err as Error).message);
    res.status(500).json({ status: "error", message: "Verification failed. Please try again." });
  }
});

// ── POST /api/auth/resend-otp ─────────────────────────────────────────────────
// Body: { userId }
router.post("/resend-otp", authLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.body as { userId?: string };

    if (!userId) {
      res.status(400).json({ status: "error", message: "userId is required." });
      return;
    }

    const user = await User.findById(userId).select("fullName email isEmailVerified");
    if (!user) {
      res.status(404).json({ status: "error", message: "User not found." });
      return;
    }

    if (user.isEmailVerified) {
      res.status(400).json({ status: "error", message: "Email is already verified." });
      return;
    }

    // Rate-limit resend: block if a valid OTP already exists and was issued recently
    const existing = await redisClient.ttl(`${EMAIL_OTP_PREFIX}${userId}`);
    if (existing > 540) {
      // OTP was issued less than 60 seconds ago (TTL > 9 min)
      res.status(429).json({
        status: "error",
        message: "Please wait at least 60 seconds before requesting a new OTP.",
        retryAfter: existing - 540,
      });
      return;
    }

    const otp = generateOTP();
    await redisClient.setex(`${EMAIL_OTP_PREFIX}${userId}`, EMAIL_OTP_TTL, otp);

    try {
      await sendVerificationOTP(user.email, user.fullName, otp);
    } catch {
      res.status(502).json({
        status: "error",
        message: "Could not send OTP email. Please try again.",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "A new OTP has been sent to your email address.",
    });
  } catch (err) {
    console.error("Resend OTP error:", (err as Error).message);
    res.status(500).json({ status: "error", message: "Failed to resend OTP. Please try again." });
  }
});

// ── POST /api/auth/login ──────────────────────────────────────────────────────
router.post("/login", authLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body as {
      username?: string;
      password?: string;
    };

    if (!username || !password) {
      res.status(400).json({ status: "error", message: "Username and password are required." });
      return;
    }

    const user = await User.findOne({ username });
    if (!user) {
      res.status(404).json({ status: "error", message: "No account found with this username." });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ status: "error", message: "Incorrect password." });
      return;
    }

    if (!user.isEmailVerified) {
      res.status(403).json({
        status: "error",
        message: "Please verify your email before logging in.",
        userId: user._id, // so frontend can redirect to OTP screen
      });
      return;
    }

    // ── Device fingerprint ────────────────────────────────────────────────
    const fpHash = deviceFingerprint(req);
    const isNewDevice = !user.deviceFingerprints.includes(fpHash);

    if (isNewDevice) {
      user.deviceFingerprints.push(fpHash);
      await user.save();

      sendEmail(
        user.email,
        "New device login – Yatrasetu",
        `
          <p>Hi ${user.fullName},</p>
          <p>We detected a login from a new device.</p>
          <p><strong>Time:</strong> ${new Date().toUTCString()}</p>
          <p>If this was not you, please change your password immediately.</p>
        `
      ).catch((e: unknown) =>
        console.error("Device alert email failed:", (e as Error).message)
      );
    }

    const jwtSecret = process.env.JWT_SECRET;
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
    if (!jwtSecret || !jwtRefreshSecret) throw new Error("JWT secrets not configured.");

    const accessToken = jwt.sign(
      { id: user._id.toString(), role: user.role },
      jwtSecret,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id.toString() },
      jwtRefreshSecret,
      { expiresIn: "7d" }
    );

    await redisClient.setex(`refresh:${user._id.toString()}`, 7 * 24 * 60 * 60, refreshToken);

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        status: "success",
        accessToken,
        user: {
          id: user._id,
          username: user.username,
          fullName: user.fullName,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          isAadhaarVerified: user.isAadhaarVerified,
        },
      });
  } catch (err) {
    console.error("Login error:", (err as Error).message);
    res.status(500).json({ status: "error", message: "Login failed. Please try again." });
  }
});

// ── POST /api/auth/logout ─────────────────────────────────────────────────────
router.post("/logout", async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refreshToken as string | undefined;

    if (refreshToken) {
      const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
      if (jwtRefreshSecret) {
        try {
          const decoded = jwt.verify(refreshToken, jwtRefreshSecret) as { id: string };
          await redisClient.del(`refresh:${decoded.id}`);
        } catch {
          // Already invalid — just clear the cookie
        }
      }
    }

    res
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .status(200)
      .json({ status: "success", message: "Logged out successfully." });
  } catch (err) {
    console.error("Logout error:", (err as Error).message);
    res.status(500).json({ status: "error", message: "Logout failed." });
  }
});

// ── POST /api/auth/refresh ────────────────────────────────────────────────────
router.post("/refresh", async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refreshToken as string | undefined;

    if (!refreshToken) {
      res.status(401).json({ status: "error", message: "Refresh token not found. Please log in." });
      return;
    }

    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtRefreshSecret || !jwtSecret) throw new Error("JWT secrets not configured.");

    const decoded = jwt.verify(refreshToken, jwtRefreshSecret) as { id: string };

    const stored = await redisClient.get(`refresh:${decoded.id}`);
    if (stored !== refreshToken) {
      res.status(401).json({
        status: "error",
        message: "Refresh token is invalid or has been revoked. Please log in again.",
      });
      return;
    }

    const user = await User.findById(decoded.id).select("role").lean();
    if (!user) {
      res.status(401).json({ status: "error", message: "User not found." });
      return;
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id, role: user.role },
      jwtSecret,
      { expiresIn: "15m" }
    );

    res.status(200).json({ status: "success", accessToken: newAccessToken });
  } catch (err) {
    const message =
      err instanceof jwt.TokenExpiredError
        ? "Refresh token expired. Please log in again."
        : "Invalid refresh token.";
    res.status(401).json({ status: "error", message });
  }
});

export default router;
