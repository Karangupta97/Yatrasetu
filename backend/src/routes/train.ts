import { Router, type Request, type Response } from "express";
import { type AxiosError } from "axios";
import { apiLimiter } from "../middleware/rateLimiter.js";
import { verifyJWT } from "../middleware/verifyJWT.js";
import rapidApiClient from "../utils/rapidapi.js";
import redisClient from "../config/redis.js";

const router = Router();

// ─── Middleware chain: rate limiter → JWT auth ────────────────────────────────
router.use(apiLimiter);
router.use(verifyJWT);

// ─── Helper: forward RapidAPI errors to the caller ───────────────────────────
function handleAxiosError(err: unknown, res: Response): void {
  const axErr = err as AxiosError<{ message?: string; error?: string }>;

  if (axErr.response) {
    const status = axErr.response.status;
    const body = axErr.response.data;
    const message =
      body?.message ?? body?.error ?? "RapidAPI returned an error.";
    res.status(status).json({ status: "error", message });
    return;
  }

  res.status(502).json({
    status: "error",
    message: "Could not reach the train data provider. Please try again.",
  });
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

/**
 * Parse a DD-MM-YYYY string into a Date at midnight IST (UTC+5:30).
 * Returns null if the string is malformed or represents an impossible date.
 */
function parseDDMMYYYY(dateStr: string): Date | null {
  const match = dateStr.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!match) return null;
  const [, dd, mm, yyyy] = match;
  const d = new Date(`${yyyy}-${mm}-${dd}T00:00:00+05:30`);
  return isNaN(d.getTime()) ? null : d;
}

/** Returns true if dateStr (DD-MM-YYYY) is strictly before today in IST. */
function isPastDate(dateStr: string): boolean {
  const d = parseDDMMYYYY(dateStr);
  if (!d) return false;
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
  now.setHours(0, 0, 0, 0);
  return d < now;
}

/**
 * Validate a DD-MM-YYYY date param — respond 400 and return true if invalid or past.
 * Returns false when the date is valid and the request should continue.
 */
function rejectInvalidDate(
  dateStr: string,
  paramName: string,
  res: Response
): boolean {
  if (!/^\d{2}-\d{2}-\d{4}$/.test(dateStr) || !parseDDMMYYYY(dateStr)) {
    res.status(400).json({
      status: "error",
      message: `Invalid format for '${paramName}'. Expected DD-MM-YYYY.`,
    });
    return true;
  }
  if (isPastDate(dateStr)) {
    res.status(400).json({
      status: "error",
      message: `'${paramName}' must be today or a future date.`,
    });
    return true;
  }
  return false;
}

// ─── GET /api/train/search-station ───────────────────────────────────────────
// Autocomplete: returns stations matching the query string.
router.get("/search-station", async (req: Request, res: Response): Promise<void> => {
  const { query } = req.query as { query?: string };

  if (!query) {
    res.status(400).json({ status: "error", message: "Missing required query parameter: query" });
    return;
  }

  try {
    const { data } = await rapidApiClient.get("/api/v1/searchStation", { params: { query } });
    res.status(200).json(data);
  } catch (err) {
    handleAxiosError(err, res);
  }
});

// ─── GET /api/train/search-train ─────────────────────────────────────────────
// Returns trains matching a name or number query.
router.get("/search-train", async (req: Request, res: Response): Promise<void> => {
  const { query } = req.query as { query?: string };

  if (!query) {
    res.status(400).json({ status: "error", message: "Missing required query parameter: query" });
    return;
  }

  try {
    const { data } = await rapidApiClient.get("/api/v1/searchTrain", { params: { query } });
    res.status(200).json(data);
  } catch (err) {
    handleAxiosError(err, res);
  }
});

// ─── GET /api/train/trains-between-stations ───────────────────────────────────
// dateOfJourney format: DD-MM-YYYY — rejects past dates.
router.get(
  "/trains-between-stations",
  async (req: Request, res: Response): Promise<void> => {
    const { fromStationCode, toStationCode, dateOfJourney } = req.query as {
      fromStationCode?: string;
      toStationCode?: string;
      dateOfJourney?: string;
    };

    const missing: string[] = [];
    if (!fromStationCode) missing.push("fromStationCode");
    if (!toStationCode) missing.push("toStationCode");
    if (!dateOfJourney) missing.push("dateOfJourney");

    if (missing.length > 0) {
      res.status(400).json({
        status: "error",
        message: `Missing required query parameter(s): ${missing.join(", ")}`,
      });
      return;
    }

    if (rejectInvalidDate(dateOfJourney!, "dateOfJourney", res)) return;

    try {
      const { data } = await rapidApiClient.get("/api/v3/trainBetweenStations", {
        params: { fromStationCode, toStationCode, dateOfJourney },
      });
      res.status(200).json(data);
    } catch (err) {
      handleAxiosError(err, res);
    }
  }
);

// ─── GET /api/train/seat-availability ────────────────────────────────────────
// date format: DD-MM-YYYY — rejects past dates.
router.get(
  "/seat-availability",
  async (req: Request, res: Response): Promise<void> => {
    const { trainNo, fromStationCode, toStationCode, date, classType, quota } =
      req.query as {
        trainNo?: string;
        fromStationCode?: string;
        toStationCode?: string;
        date?: string;
        classType?: string;
        quota?: string;
      };

    const missing: string[] = [];
    if (!trainNo) missing.push("trainNo");
    if (!fromStationCode) missing.push("fromStationCode");
    if (!toStationCode) missing.push("toStationCode");
    if (!date) missing.push("date");
    if (!classType) missing.push("classType");
    if (!quota) missing.push("quota");

    if (missing.length > 0) {
      res.status(400).json({
        status: "error",
        message: `Missing required query parameter(s): ${missing.join(", ")}`,
      });
      return;
    }

    if (rejectInvalidDate(date!, "date", res)) return;

    try {
      const { data } = await rapidApiClient.get("/api/v1/checkSeatAvailability", {
        params: { trainNo, fromStationCode, toStationCode, date, classType, quota },
      });
      res.status(200).json(data);
    } catch (err) {
      handleAxiosError(err, res);
    }
  }
);

// ─── GET /api/train/train-schedule ───────────────────────────────────────────
// Returns full station-wise schedule and timings for a train.
router.get(
  "/train-schedule",
  async (req: Request, res: Response): Promise<void> => {
    const { trainNo } = req.query as { trainNo?: string };

    if (!trainNo) {
      res.status(400).json({ status: "error", message: "Missing required query parameter: trainNo" });
      return;
    }

    try {
      const { data } = await rapidApiClient.get("/api/v1/getTrainSchedule", { params: { trainNo } });
      res.status(200).json(data);
    } catch (err) {
      handleAxiosError(err, res);
    }
  }
);

// ─── GET /api/train/live-status ───────────────────────────────────────────────
// Returns real-time running status and delay information for a train.
router.get("/live-status", async (req: Request, res: Response): Promise<void> => {
  const { trainNo, startDay } = req.query as { trainNo?: string; startDay?: string };

  const missing: string[] = [];
  if (!trainNo) missing.push("trainNo");
  if (!startDay) missing.push("startDay");

  if (missing.length > 0) {
    res.status(400).json({
      status: "error",
      message: `Missing required query parameter(s): ${missing.join(", ")}`,
    });
    return;
  }

  try {
    const { data } = await rapidApiClient.get("/api/v1/liveTrainStatus", { params: { trainNo, startDay } });
    res.status(200).json(data);
  } catch (err) {
    handleAxiosError(err, res);
  }
});

// ─── GET /api/train/pnr-status ────────────────────────────────────────────────
// Returns current PNR status and passenger booking details.
router.get("/pnr-status", async (req: Request, res: Response): Promise<void> => {
  const { pnrNumber } = req.query as { pnrNumber?: string };

  if (!pnrNumber) {
    res.status(400).json({ status: "error", message: "Missing required query parameter: pnrNumber" });
    return;
  }

  try {
    const { data } = await rapidApiClient.get("/api/v3/getPNRStatus", { params: { pnrNumber } });
    res.status(200).json(data);
  } catch (err) {
    handleAxiosError(err, res);
  }
});

// ─── GET /api/train/fare ──────────────────────────────────────────────────────
// Returns fare for a train between two stations for a given class and quota.
router.get("/fare", async (req: Request, res: Response): Promise<void> => {
  const { trainNo, fromStationCode, toStationCode, classType, quota } =
    req.query as {
      trainNo?: string;
      fromStationCode?: string;
      toStationCode?: string;
      classType?: string;
      quota?: string;
    };

  const missing: string[] = [];
  if (!trainNo) missing.push("trainNo");
  if (!fromStationCode) missing.push("fromStationCode");
  if (!toStationCode) missing.push("toStationCode");
  if (!classType) missing.push("classType");
  if (!quota) missing.push("quota");

  if (missing.length > 0) {
    res.status(400).json({
      status: "error",
      message: `Missing required query parameter(s): ${missing.join(", ")}`,
    });
    return;
  }

  try {
    const { data } = await rapidApiClient.get("/api/v1/getFare", {
      params: { trainNo, fromStationCode, toStationCode, classType, quota },
    });
    res.status(200).json(data);
  } catch (err) {
    handleAxiosError(err, res);
  }
});

// ─── GET /api/train/trains-by-station ────────────────────────────────────────
// Returns all trains passing through a given station.
router.get(
  "/trains-by-station",
  async (req: Request, res: Response): Promise<void> => {
    const { stationCode } = req.query as { stationCode?: string };

    if (!stationCode) {
      res.status(400).json({ status: "error", message: "Missing required query parameter: stationCode" });
      return;
    }

    try {
      const { data } = await rapidApiClient.get("/api/v1/getTrainsByStation", { params: { stationCode } });
      res.status(200).json(data);
    } catch (err) {
      handleAxiosError(err, res);
    }
  }
);

// ─── Types for search-full ────────────────────────────────────────────────────

interface TrainBetweenStationsItem {
  train_number?: string;
  train_no?: string;
  train_name?: string;
  from_station_code?: string;
  to_station_code?: string;
  from?: string;
  to?: string;
  departure_time?: string;
  from_std?: string;
  arrival_time?: string;
  to_std?: string;
  duration?: string;
  run_days?: string[];
  days?: Record<string, boolean | string>;
  class_type?: string[];
  [key: string]: unknown;
}

interface AvailabilityItem {
  current_status?: string;
  available_seats?: number | string;
  updated_at?: string;
  [key: string]: unknown;
}

interface FareItem {
  fare?: number | string;
  total_fare?: number | string;
  [key: string]: unknown;
}

interface ClassResult {
  type: string;
  fare: number | null;
  status: string;
  availableSeats: number | null;
  lastUpdated: string | null;
}

interface TrainFullResult {
  trainNo: string;
  trainName: string;
  departure: string;
  arrival: string;
  duration: string;
  daysOfRunning: string[];
  from: string;
  to: string;
  classes: ClassResult[];
}

// ─── Helpers for search-full ──────────────────────────────────────────────────

// Used as fallback when class_type is absent from a train object.
const FALLBACK_CLASSES = ["SL", "3A", "2A", "1A", "CC", "2S"] as const;

// Classes supported by checkSeatAvailability and getFare endpoints.
// 3E (economy AC) appears in trainBetweenStations class_type arrays but is
// not accepted by the availability/fare APIs — filter it out before calling.
const AVAILABILITY_SUPPORTED = new Set(["SL", "3A", "2A", "1A", "CC", "2S"]);

const DAY_MAP: Record<string, string> = {
  mon: "M",  monday: "M",
  tue: "T",  tuesday: "T",
  wed: "W",  wednesday: "W",
  thu: "Th", thursday: "Th",
  fri: "F",  friday: "F",
  sat: "Sa", saturday: "Sa",
  sun: "Su", sunday: "Su",
};

function normaliseDays(train: TrainBetweenStationsItem): string[] {
  // Shape 1: array of strings e.g. ["Mon","Tue","Sat"]
  if (Array.isArray(train.run_days)) {
    return (train.run_days as string[]).map(
      (d) => DAY_MAP[d.toLowerCase()] ?? d
    );
  }
  // Shape 2: object e.g. { monday: true, tuesday: false, ... }
  if (train.days && typeof train.days === "object") {
    return Object.entries(train.days)
      .filter(([, v]) => v === true || v === "Y" || v === "1")
      .map(([k]) => DAY_MAP[k.toLowerCase()] ?? k);
  }
  return [];
}

function parseAvailability(
  rawData: unknown
): Pick<ClassResult, "status" | "availableSeats" | "lastUpdated"> {
  const arr = Array.isArray(rawData) ? rawData : [];
  const first = (arr[0] ?? {}) as AvailabilityItem;
  const status = first.current_status ?? "UNAVAILABLE";
  const rawSeats = first.available_seats;
  const availableSeats =
    rawSeats !== undefined && rawSeats !== null ? Number(rawSeats) : null;
  const lastUpdated = first.updated_at ?? null;
  return { status, availableSeats, lastUpdated };
}

function parseFare(rawData: unknown): number | null {
  const obj = (rawData ?? {}) as FareItem;
  const raw = obj.fare ?? obj.total_fare;
  if (raw === undefined || raw === null) return null;
  const n = Number(raw);
  return isNaN(n) ? null : n;
}

// ─── GET /api/train/search-full ───────────────────────────────────────────────
// Aggregated search: trains + seat availability + fare in one response.
// Only queries classes advertised by each train (class_type field).
// Redis cache key: train:search:{from}:{to}:{date}:{quota}  TTL: 300s
router.get(
  "/search-full",
  async (req: Request, res: Response): Promise<void> => {
    const {
      fromStationCode,
      toStationCode,
      date,
      quota = "GN",
    } = req.query as {
      fromStationCode?: string;
      toStationCode?: string;
      date?: string;
      quota?: string;
    };

    // ── Parameter validation ───────────────────────────────────────────────
    const missing: string[] = [];
    if (!fromStationCode) missing.push("fromStationCode");
    if (!toStationCode) missing.push("toStationCode");
    if (!date) missing.push("date");

    if (missing.length > 0) {
      res.status(400).json({
        status: "error",
        message: `Missing required query parameter(s): ${missing.join(", ")}`,
      });
      return;
    }

    if (rejectInvalidDate(date!, "date", res)) return;

    // ── Redis cache check ──────────────────────────────────────────────────
    const cacheKey = `train:search:${fromStationCode}:${toStationCode}:${date}:${quota}`;
    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        res.status(200).json({
          status: "success",
          cached: true,
          data: JSON.parse(cached) as TrainFullResult[],
        });
        return;
      }
    } catch {
      // Redis error — proceed to live fetch, never block the request
    }

    try {
      // ── Step 1: trains between stations ─────────────────────────────────
      const trainListRes = await rapidApiClient.get("/api/v3/trainBetweenStations", {
        params: {
          fromStationCode,
          toStationCode,
          dateOfJourney: date,  // RapidAPI requires this exact param name
        },
      });

      const trains = (
        Array.isArray(trainListRes.data?.data) ? trainListRes.data.data : []
      ) as TrainBetweenStationsItem[];

      if (trains.length === 0) {
        res.status(200).json({ status: "success", cached: false, data: [] });
        return;
      }

      // ── Steps 2 + 3: availability + fare — single Promise.allSettled ────
      // Only check classes the train advertises via class_type.
      // Falls back to FALLBACK_CLASSES when the field is absent.
      type Task = { trainIdx: number; classType: string; kind: "avail" | "fare" };

      const tasks: Task[] = [];
      const promises: Promise<unknown>[] = [];

      for (let i = 0; i < trains.length; i++) {
        const trainNo = trains[i].train_number ?? trains[i].train_no ?? "";
        const classesToCheck: string[] =
          Array.isArray(trains[i].class_type) && trains[i].class_type!.length > 0
            ? trains[i].class_type!.filter((c) => AVAILABILITY_SUPPORTED.has(c))
            : [...FALLBACK_CLASSES];

        for (const classType of classesToCheck) {
          tasks.push({ trainIdx: i, classType, kind: "avail" });
          promises.push(
            rapidApiClient.get("/api/v1/checkSeatAvailability", {
              params: { trainNo, fromStationCode, toStationCode, date, classType, quota },
            })
          );

          tasks.push({ trainIdx: i, classType, kind: "fare" });
          promises.push(
            rapidApiClient.get("/api/v1/getFare", {
              params: { trainNo, fromStationCode, toStationCode, classType, quota },
            })
          );
        }
      }

      const results = await Promise.allSettled(promises);

      // ── Step 4: merge per train ───────────────────────────────────────────
      type ClassStore = {
        avail?: ReturnType<typeof parseAvailability>;
        fare?: number | null;
      };
      const store = new Map<number, Map<string, ClassStore>>();
      for (let i = 0; i < trains.length; i++) store.set(i, new Map());

      for (let idx = 0; idx < results.length; idx++) {
        const task = tasks[idx];
        const result = results[idx];
        const classMap = store.get(task.trainIdx)!;

        if (!classMap.has(task.classType)) classMap.set(task.classType, {});
        const entry = classMap.get(task.classType)!;

        if (result.status === "fulfilled") {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const resData = (result.value as any)?.data?.data;
          if (task.kind === "avail") {
            entry.avail = parseAvailability(resData);
          } else {
            entry.fare = parseFare(resData);
          }
        } else {
          if (task.kind === "avail") {
            entry.avail = { status: "UNAVAILABLE", availableSeats: null, lastUpdated: null };
          } else {
            entry.fare = null;
          }
        }
      }

      // ── Build response ────────────────────────────────────────────────────
      const data: TrainFullResult[] = trains.map((train, i) => {
        const classMap = store.get(i)!;
        const classesToCheck: string[] =
          Array.isArray(train.class_type) && train.class_type!.length > 0
            ? train.class_type!.filter((c) => AVAILABILITY_SUPPORTED.has(c))
            : [...FALLBACK_CLASSES];

        const classes: ClassResult[] = [];
        for (const classType of classesToCheck) {
          const entry = classMap.get(classType);
          if (!entry?.avail || entry.avail.status === "UNAVAILABLE") continue;

          classes.push({
            type: classType,
            fare: entry.fare ?? null,
            status: entry.avail.status,
            availableSeats: entry.avail.availableSeats,
            lastUpdated: entry.avail.lastUpdated,
          });
        }

        return {
          trainNo:       train.train_number ?? train.train_no ?? "",
          trainName:     train.train_name ?? "",
          departure:     train.departure_time ?? train.from_std ?? "",
          arrival:       train.arrival_time   ?? train.to_std   ?? "",
          duration:      train.duration       ?? "",
          daysOfRunning: normaliseDays(train),
          from: train.from ?? train.from_station_code ?? (fromStationCode as string),
          to:   train.to   ?? train.to_station_code   ?? (toStationCode   as string),
          classes,
        };
      });

      // ── Cache assembled response ──────────────────────────────────────────
      try {
        await redisClient.setex(cacheKey, 300, JSON.stringify(data));
      } catch {
        // Non-fatal — serve response regardless
      }

      res.status(200).json({ status: "success", cached: false, data });
    } catch (err) {
      // trainBetweenStations itself failed — return 502
      const axErr = err as AxiosError<{ message?: string; error?: string }>;
      const message =
        axErr.response?.data?.message ??
        axErr.response?.data?.error ??
        "Failed to fetch train list from provider. Please try again.";
      res.status(502).json({ status: "error", message });
    }
  }
);

export default router;
