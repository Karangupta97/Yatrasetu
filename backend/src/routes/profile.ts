import { Router, type Request, type Response } from "express";
import axios, { type AxiosError } from "axios";
import { verifyJWT } from "../middleware/verifyJWT.js";
import { emailVerifiedGate } from "../middleware/emailVerifiedGate.js";
import { hashAadhaar } from "../utils/hashAadhaar.js";
import { getSandboxToken } from "../utils/sandboxAuth.js";
import redisClient from "../config/redis.js";
import User from "../models/User.js";

const router = Router();

// All profile routes require a valid JWT + verified email
router.use(verifyJWT);
router.use(emailVerifiedGate);

const SANDBOX_BASE = "https://api.sandbox.co.in";
const SANDBOX_API_VERSION = "2.0";
const OTP_TTL_SECONDS = 600; // 10 minutes

// ── POST /api/profile/aadhaar/generate-otp ───────────────────────────────────
router.post(
  "/aadhaar/generate-otp",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { aadhaarNumber, consent } = req.body as {
        aadhaarNumber?: string;
        consent?: string;
      };

      // ── Validation ───────────────────────────────────────────────────────
      if (!aadhaarNumber || !/^\d{12}$/.test(aadhaarNumber)) {
        res.status(400).json({
          status: "error",
          message: "A valid 12-digit Aadhaar number is required.",
        });
        return;
      }

      if (!consent || consent.toLowerCase() !== "y") {
        res.status(400).json({
          status: "error",
          message: "Consent is required. Set consent to 'y' to proceed.",
        });
        return;
      }

      const userId = req.user!.id;

      // ── Dev mock mode — set AADHAAR_MOCK=true to bypass Sandbox ─────────
      if (process.env.AADHAAR_MOCK === "true") {
        const mockOtp = "123456";
        await redisClient.setex(`aadhaar:ref:${userId}`, OTP_TTL_SECONDS, `MOCK:${mockOtp}`);
        console.info(`[Aadhaar Mock] userId=${userId} OTP=123456`);
        res.status(200).json({
          status: "success",
          message: "[MOCK] OTP sent. Use 123456 to verify.",
        });
        return;
      }

      // ── Step 1: Get fresh sandbox JWT ────────────────────────────────────
      let sandboxToken: string;
      try {
        sandboxToken = await getSandboxToken();
      } catch (authErr) {
        console.error("[Sandbox] Authentication failed:", (authErr as Error).message);
        res.status(502).json({
          status: "error",
          message: "Could not authenticate with KYC provider. Please try again.",
        });
        return;
      }

      // ── Step 2: Generate OTP ─────────────────────────────────────────────
      // aadhaarNumber is passed to Sandbox but never logged or stored
      let referenceId: string;
      try {
        const response = await axios.post(
          `${SANDBOX_BASE}/kyc/aadhaar/okyc/otp`,
          {
            "@entity": "in.co.sandbox.kyc.aadhaar.okyc.otp.request",
            aadhaar_number: aadhaarNumber,
            consent: "y",
            reason: "For KYC",
          },
          {
            headers: {
              Authorization: sandboxToken,          // no "Bearer" prefix
              "x-api-key": process.env.SANDBOX_API_KEY ?? "",
              "x-api-version": SANDBOX_API_VERSION,
              "Content-Type": "application/json",
            },
          }
        );

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const rawRef = response.data?.data?.reference_id as string | number | undefined;
        if (!rawRef) {
          console.error("[Sandbox] generate-otp: no reference_id in response", response.data);
          res.status(502).json({
            status: "error",
            message: "KYC provider did not return a reference ID. Please try again.",
          });
          return;
        }
        referenceId = String(rawRef);
      } catch (otpErr) {
        const axErr = otpErr as AxiosError;
        const status = axErr.response?.status;
        const body = axErr.response?.data as Record<string, unknown> | undefined;
        console.error(`[Sandbox] generate-otp failed — HTTP ${status ?? "?"}:`, JSON.stringify(body));

        if (status === 403) {
          res.status(403).json({
            status: "error",
            message:
              "KYC provider denied access (Insufficient privilege). " +
              "Ensure Aadhaar OKYC is enabled for your Sandbox account.",
          });
          return;
        }
        res.status(502).json({
          status: "error",
          message: "Failed to send Aadhaar OTP. Please try again.",
        });
        return;
      }

      // Store reference_id in Redis — keyed to userId, never to the Aadhaar number
      await redisClient.setex(`aadhaar:ref:${userId}`, OTP_TTL_SECONDS, referenceId);

      // aadhaarNumber is NOT logged, stored, or returned
      res.status(200).json({
        status: "success",
        message: "OTP has been sent to your Aadhaar-registered mobile number.",
      });
    } catch (err) {
      console.error("generate-otp unexpected error:", (err as Error).message);
      res.status(500).json({
        status: "error",
        message: "Failed to generate OTP. Please try again.",
      });
    }
  }
);

// ── POST /api/profile/aadhaar/verify-otp ─────────────────────────────────────
router.post(
  "/aadhaar/verify-otp",
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;

    try {
      const { otp, aadhaarNumber } = req.body as {
        otp?: string;
        aadhaarNumber?: string;
      };

      // ── Validation ───────────────────────────────────────────────────────
      if (!otp || !/^\d{6}$/.test(otp)) {
        res.status(400).json({
          status: "error",
          message: "A valid 6-digit OTP is required.",
        });
        return;
      }

      if (!aadhaarNumber || !/^\d{12}$/.test(aadhaarNumber)) {
        res.status(400).json({
          status: "error",
          message: "A valid 12-digit Aadhaar number is required.",
        });
        return;
      }

      // ── Fetch reference_id from Redis ────────────────────────────────────
      const redisKey = `aadhaar:ref:${userId}`;
      const storedRef = await redisClient.get(redisKey);
      if (!storedRef) {
        res.status(410).json({
          status: "error",
          message: "OTP session has expired. Please request a new OTP.",
        });
        return;
      }

      // ── Dev mock mode ────────────────────────────────────────────────────
      if (process.env.AADHAAR_MOCK === "true") {
        const mockOtp = storedRef.startsWith("MOCK:") ? storedRef.split(":")[1] : null;
        if (!mockOtp || otp !== mockOtp) {
          res.status(401).json({ status: "error", message: "Incorrect OTP." });
          return;
        }
        await redisClient.del(redisKey);

        const aadhaarHash = hashAadhaar(aadhaarNumber);
        const conflict = await User.findOne({ aadhaarHash, _id: { $ne: userId } }).lean();
        if (conflict) {
          res.status(409).json({
            status: "error",
            message: "This Aadhaar is already linked to another account.",
          });
          return;
        }
        await User.findByIdAndUpdate(userId, { aadhaarHash, isAadhaarVerified: true });
        res.status(200).json({
          status: "success",
          message: "Aadhaar verified successfully. You can now book tickets.",
          data: {
            name: "Test User",
            maskedAadhaar: `XXXX XXXX ${aadhaarNumber.slice(-4)}`,
          },
        });
        return;
      }

      // ── Step 1: Get fresh sandbox JWT ────────────────────────────────────
      let sandboxToken: string;
      try {
        sandboxToken = await getSandboxToken();
      } catch (authErr) {
        console.error("[Sandbox] Authentication failed:", (authErr as Error).message);
        res.status(502).json({
          status: "error",
          message: "Could not authenticate with KYC provider. Please try again.",
        });
        return;
      }

      // ── Step 3: Verify OTP ───────────────────────────────────────────────
      let verifiedName: string;
      try {
        const response = await axios.post(
          `${SANDBOX_BASE}/kyc/aadhaar/okyc/otp/verify`,
          {
            "@entity": "in.co.sandbox.kyc.aadhaar.okyc.request",
            reference_id: storedRef,
            otp,
          },
          {
            headers: {
              Authorization: sandboxToken,
              "x-api-key": process.env.SANDBOX_API_KEY ?? "",
              "x-api-version": SANDBOX_API_VERSION,
              "Content-Type": "application/json",
            },
          }
        );

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const data = response.data?.data as Record<string, unknown> | undefined;
        const responseStatus = data?.status as string | undefined;

        if (responseStatus !== "VALID") {
          await redisClient.del(redisKey); // always clean up
          res.status(401).json({
            status: "error",
            message: "Aadhaar OTP verification failed. Please check the OTP and try again.",
          });
          return;
        }

        verifiedName = (data?.name as string | undefined) ?? "Verified User";
      } catch (verifyErr) {
        // Always delete the Redis key — never leave it dangling
        await redisClient.del(redisKey);

        const axErr = verifyErr as AxiosError;
        const status = axErr.response?.status;
        const body = axErr.response?.data as Record<string, unknown> | undefined;
        console.error(`[Sandbox] verify-otp failed — HTTP ${status ?? "?"}:`, JSON.stringify(body));

        res.status(401).json({
          status: "error",
          message: "Aadhaar OTP verification failed. Please check the OTP and try again.",
        });
        return;
      }

      // ── Clean up Redis key immediately after success ──────────────────────
      await redisClient.del(redisKey);

      // ── Hash Aadhaar and persist — raw number is never stored ────────────
      const aadhaarHash = hashAadhaar(aadhaarNumber);

      const conflict = await User.findOne({ aadhaarHash, _id: { $ne: userId } }).lean();
      if (conflict) {
        res.status(409).json({
          status: "error",
          message: "This Aadhaar is already linked to another account.",
        });
        return;
      }

      await User.findByIdAndUpdate(userId, {
        aadhaarHash,
        isAadhaarVerified: true,
      });

      // Return only safe fields — never return full Aadhaar number or raw KYC data
      res.status(200).json({
        status: "success",
        message: "Aadhaar verified successfully. You can now book tickets.",
        data: {
          name: verifiedName,
          maskedAadhaar: `XXXX XXXX ${aadhaarNumber.slice(-4)}`,
        },
      });
    } catch (err) {
      // Ensure Redis key is cleaned up on unexpected errors too
      await redisClient.del(`aadhaar:ref:${userId}`).catch(() => null);
      console.error("verify-otp unexpected error:", (err as Error).message);
      res.status(500).json({
        status: "error",
        message: "Aadhaar verification failed. Please try again.",
      });
    }
  }
);

// ── GET /api/profile/me ───────────────────────────────────────────────────────
router.get("/me", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const user = await User.findById(userId)
      .select("-password -aadhaarHash -deviceFingerprints -__v")
      .lean();

    if (!user) {
      res.status(404).json({ status: "error", message: "User not found." });
      return;
    }

    res.status(200).json({ status: "success", user });
  } catch (err) {
    console.error("GET /me error:", (err as Error).message);
    res.status(500).json({ status: "error", message: "Failed to fetch profile." });
  }
});

export default router;
