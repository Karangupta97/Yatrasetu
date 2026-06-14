import { Router, type Request, type Response } from "express";
import crypto from "crypto";
import { verifyJWT } from "../middleware/verifyJWT.js";
import { emailVerifiedGate } from "../middleware/emailVerifiedGate.js";
import { aadhaarVerifiedGate } from "../middleware/aadhaarVerifiedGate.js";
import LocalTicket from "../models/LocalTicket.js";
import ExpressTicket from "../models/ExpressTicket.js";
import { generateUTSNumber, generatePNR } from "../utils/ticketId.js";

const router = Router();

// ── Guard chain applied to all ticket routes ──────────────────────────────────
router.use(verifyJWT, emailVerifiedGate, aadhaarVerifiedGate);

// ── POST /api/ticket/local/issue ──────────────────────────────────────────────
router.post(
  "/local/issue",
  async (req: Request, res: Response): Promise<void> => {
    const {
      fromStation,
      toStation,
      distanceKm,
      ticketType,
      class: ticketClass,
      passengerCount,
      fare,
    } = req.body as {
      fromStation?: string;
      toStation?: string;
      distanceKm?: number;
      ticketType?: string;
      class?: string;
      passengerCount?: { adults?: number; children?: number };
      fare?: number;
    };

    // Required field validation
    if (
      fromStation === undefined ||
      toStation === undefined ||
      distanceKm === undefined ||
      ticketType === undefined ||
      ticketClass === undefined ||
      passengerCount === undefined ||
      fare === undefined
    ) {
      res.status(400).json({
        status: "error",
        message:
          "Missing required fields: fromStation, toStation, distanceKm, ticketType, class, passengerCount, fare.",
      });
      return;
    }

    // Validate passengerCount.adults >= 1
    if (!passengerCount.adults || passengerCount.adults < 1) {
      res.status(400).json({
        status: "error",
        message: "passengerCount.adults must be at least 1.",
      });
      return;
    }

    try {
      const ticketId = crypto.randomUUID();
      const utsNumber = await generateUTSNumber();

      const ticket = await LocalTicket.create({
        ticketId,
        utsNumber,
        userId: req.user!.id,
        fromStation,
        toStation,
        distanceKm,
        ticketType,
        class: ticketClass,
        passengerCount,
        fare,
      });

      res.status(201).json({
        status: "success",
        message: "Local ticket issued successfully.",
        ticket,
      });
    } catch (err) {
      console.error("local/issue error:", (err as Error).message);
      res
        .status(500)
        .json({ status: "error", message: "Failed to issue ticket. Please try again." });
    }
  }
);

// ── POST /api/ticket/express/issue ────────────────────────────────────────────
router.post(
  "/express/issue",
  async (req: Request, res: Response): Promise<void> => {
    const {
      trainNo,
      trainName,
      fromStation,
      toStation,
      journeyDate,
      departureTime,
      arrivalTime,
      distanceKm,
      ticketSubType,
      class: ticketClass,
      passengers,
      fare,
      totalFare,
      // Optional fields
      quota,
      returnJourneyDate,
      returnTrainNo,
    } = req.body as {
      trainNo?: string;
      trainName?: string;
      fromStation?: string;
      toStation?: string;
      journeyDate?: string;
      departureTime?: string;
      arrivalTime?: string;
      distanceKm?: number;
      ticketSubType?: string;
      class?: string;
      passengers?: unknown[];
      fare?: number;
      totalFare?: number;
      quota?: string;
      returnJourneyDate?: string;
      returnTrainNo?: string;
    };

    // Required field validation
    if (
      trainNo === undefined ||
      trainName === undefined ||
      fromStation === undefined ||
      toStation === undefined ||
      journeyDate === undefined ||
      departureTime === undefined ||
      arrivalTime === undefined ||
      distanceKm === undefined ||
      ticketSubType === undefined ||
      ticketClass === undefined ||
      passengers === undefined ||
      fare === undefined ||
      totalFare === undefined
    ) {
      res.status(400).json({
        status: "error",
        message:
          "Missing required fields: trainNo, trainName, fromStation, toStation, journeyDate, departureTime, arrivalTime, distanceKm, ticketSubType, class, passengers, fare, totalFare.",
      });
      return;
    }

    try {
      const ticketId = crypto.randomUUID();
      const pnrNumber = await generatePNR();

      const ticket = await ExpressTicket.create({
        ticketId,
        pnrNumber,
        userId: req.user!.id,
        trainNo,
        trainName,
        fromStation,
        toStation,
        journeyDate,
        departureTime,
        arrivalTime,
        distanceKm,
        ticketSubType,
        class: ticketClass,
        passengers,
        fare,
        totalFare,
        quota: quota ?? "GN",
        returnJourneyDate: returnJourneyDate ?? null,
        returnTrainNo: returnTrainNo ?? null,
      });

      res.status(201).json({
        status: "success",
        message: "Express ticket issued successfully.",
        ticket,
      });
    } catch (err) {
      console.error("express/issue error:", (err as Error).message);
      res
        .status(500)
        .json({ status: "error", message: "Failed to issue ticket. Please try again." });
    }
  }
);

export default router;
