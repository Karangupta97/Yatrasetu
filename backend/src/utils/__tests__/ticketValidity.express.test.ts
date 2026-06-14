/**
 * Property-based tests for isExpressTicketValid
 *
 * Validates: Requirements 8.1, 8.2, 8.3, 8.4
 */

/// <reference types="jest" />

import * as fc from "fast-check";
import { isExpressTicketValid, toIST } from "../ticketValidity";
import { IExpressTicket } from "../../models/ExpressTicket";

// ── Mock mongoose models so the module can be imported without a DB ───────────
jest.mock("../../models/LocalTicket", () => ({
  __esModule: true,
  default: {},
}));
jest.mock("../../models/ExpressTicket", () => ({
  __esModule: true,
  default: {},
}));

// ── Date mock helper ──────────────────────────────────────────────────────────
// Avoids jest.useFakeTimers() which replaces all timers and hangs fast-check.
// Instead, we spy on Date to return a fixed "now" during each property run.

let mockedNowMs: number | null = null;
const OriginalDate = globalThis.Date;

/**
 * Set the mocked "now" value. Pass null to restore real Date.
 */
function setMockedNow(ms: number | null): void {
  mockedNowMs = ms;
}

// Patch global Date so that `new Date()` (no args) returns the mocked time,
// while `new Date(value)` and static methods work normally.
const MockDateConstructor = function (this: Date, ...args: unknown[]): Date {
  if (args.length === 0 && mockedNowMs !== null) {
    return new OriginalDate(mockedNowMs) as unknown as Date;
  }
  // @ts-expect-error spread into native constructor
  return new OriginalDate(...args) as unknown as Date;
} as unknown as typeof Date;

// Copy static methods (Date.now, Date.parse, Date.UTC) onto the mock
Object.setPrototypeOf(MockDateConstructor, OriginalDate);
MockDateConstructor.prototype = OriginalDate.prototype;
MockDateConstructor.now = () =>
  mockedNowMs !== null ? mockedNowMs : OriginalDate.now();
MockDateConstructor.parse = OriginalDate.parse.bind(OriginalDate);
MockDateConstructor.UTC = OriginalDate.UTC.bind(OriginalDate);

beforeAll(() => {
  globalThis.Date = MockDateConstructor as unknown as typeof Date;
});

afterAll(() => {
  globalThis.Date = OriginalDate;
  mockedNowMs = null;
});

afterEach(() => {
  mockedNowMs = null; // reset after every test
});

// ── Ticket factory ────────────────────────────────────────────────────────────

/**
 * Construct a minimal IExpressTicket partial mock that satisfies only the
 * fields `isExpressTicketValid` actually reads.
 */
function makeExpressTicket(
  overrides: Partial<
    Pick<
      IExpressTicket,
      "ticketStatus" | "ticketSubType" | "distanceKm" | "purchasedAt" | "journeyDate"
    >
  >
): IExpressTicket {
  return {
    ticketStatus: "ACTIVE",
    ticketSubType: "UNRESERVED_ONE_WAY",
    distanceKm: 50,
    purchasedAt: new OriginalDate(),
    journeyDate: new OriginalDate(),
    ...overrides,
  } as unknown as IExpressTicket;
}

// ─────────────────────────────────────────────────────────────────────────────
// Property 7: Express ticket — non-ACTIVE status always invalid
//
// For any ticket with ticketStatus in [USED, EXPIRED, CANCELLED],
// isExpressTicketValid must return isValid === false regardless of other fields.
//
// Validates: Requirements 8.1
// ─────────────────────────────────────────────────────────────────────────────
describe("Property 7: non-ACTIVE ticketStatus always invalid", () => {
  it("returns isValid: false for every non-ACTIVE ticketStatus", () => {
    fc.assert(
      fc.property(
        fc.constantFrom("USED" as const, "EXPIRED" as const, "CANCELLED" as const),
        fc.constantFrom(
          "UNRESERVED_ONE_WAY" as const,
          "RESERVED_ONE_WAY" as const,
          "RESERVED_RETURN" as const
        ),
        fc.date({
          min: new OriginalDate("2020-01-01"),
          max: new OriginalDate("2030-01-01"),
        }),
        fc.integer({ min: 1, max: 1000 }),
        (ticketStatus, ticketSubType, purchasedAt, distanceKm) => {
          const ticket = makeExpressTicket({
            ticketStatus,
            ticketSubType,
            purchasedAt,
            distanceKm,
          });
          const result = isExpressTicketValid(ticket);
          return result.isValid === false;
        }
      ),
      { numRuns: 200 }
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Property 8: UNRESERVED_ONE_WAY < 200km expiry window
//
// For ACTIVE UNRESERVED_ONE_WAY tickets with distanceKm < 200,
// isValid === (now < purchasedAt + 10_800_000) i.e. 3 hours.
//
// Validates: Requirements 8.2
// ─────────────────────────────────────────────────────────────────────────────
describe("Property 8: UNRESERVED_ONE_WAY < 200km expiry window", () => {
  it("isValid matches (now < purchasedAt + 3 hours) for any (purchasedAt, now, distanceKm < 200)", () => {
    fc.assert(
      fc.property(
        // purchasedAt: any date in a 2-year window (noInvalidDate prevents NaN dates)
        fc.date({
          min: new OriginalDate("2024-01-01"),
          max: new OriginalDate("2026-01-01"),
          noInvalidDate: true,
        }),
        // offset: covers both sides of the 3-hour boundary
        fc.integer({ min: -30 * 60 * 1000, max: 4 * 60 * 60 * 1000 }),
        // distanceKm strictly < 200
        fc.integer({ min: 1, max: 199 }),
        (purchasedAt, offsetMs, distanceKm) => {
          const nowMs = purchasedAt.getTime() + offsetMs;
          setMockedNow(nowMs);

          const ticket = makeExpressTicket({
            ticketStatus: "ACTIVE",
            ticketSubType: "UNRESERVED_ONE_WAY",
            purchasedAt,
            distanceKm,
          });
          const result = isExpressTicketValid(ticket);

          const expectedValid = nowMs < purchasedAt.getTime() + 10_800_000;
          return result.isValid === expectedValid;
        }
      ),
      { numRuns: 200 }
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Property 9: RESERVED ticket journey-date match
//
// For ACTIVE RESERVED_ONE_WAY and RESERVED_RETURN tickets,
// isValid === (journeyDate IST day === now IST day).
//
// Validates: Requirements 8.3
// ─────────────────────────────────────────────────────────────────────────────
describe("Property 9: RESERVED ticket journey-date IST match", () => {
  /**
   * Returns true if two dates represent the same IST calendar day.
   */
  function sameISTDay(a: Date, b: Date): boolean {
    const aIST = toIST(a);
    const bIST = toIST(b);
    return (
      aIST.getFullYear() === bIST.getFullYear() &&
      aIST.getMonth() === bIST.getMonth() &&
      aIST.getDate() === bIST.getDate()
    );
  }

  it("isValid matches IST journey-date === IST today for RESERVED_ONE_WAY and RESERVED_RETURN", () => {
    fc.assert(
      fc.property(
        fc.constantFrom("RESERVED_ONE_WAY" as const, "RESERVED_RETURN" as const),
        // journeyDate: any day in a 2-year window
        fc.date({
          min: new OriginalDate("2024-01-01"),
          max: new OriginalDate("2026-01-01"),
        }),
        // nowOffset: -2 days to +2 days relative to journeyDate, to probe same/different days
        fc.integer({ min: -2 * 24 * 60 * 60 * 1000, max: 2 * 24 * 60 * 60 * 1000 }),
        (ticketSubType, journeyDate, nowOffset) => {
          const nowMs = journeyDate.getTime() + nowOffset;
          setMockedNow(nowMs);

          const ticket = makeExpressTicket({
            ticketStatus: "ACTIVE",
            ticketSubType,
            journeyDate,
          });
          const result = isExpressTicketValid(ticket);

          const now = new OriginalDate(nowMs);
          const expectedValid = sameISTDay(journeyDate, now);
          return result.isValid === expectedValid;
        }
      ),
      { numRuns: 300 }
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Property 10: UNRESERVED_ONE_WAY ≥ 200km same-day rule
//
// For ACTIVE UNRESERVED_ONE_WAY tickets with distanceKm ≥ 200,
// isValid === (purchasedAt IST date === now IST date).
//
// Validates: Requirements 8.4
// ─────────────────────────────────────────────────────────────────────────────
describe("Property 10: UNRESERVED_ONE_WAY ≥ 200km same-day rule", () => {
  /**
   * Returns true if two dates represent the same IST calendar day.
   */
  function sameISTDay(a: Date, b: Date): boolean {
    const aIST = toIST(a);
    const bIST = toIST(b);
    return (
      aIST.getFullYear() === bIST.getFullYear() &&
      aIST.getMonth() === bIST.getMonth() &&
      aIST.getDate() === bIST.getDate()
    );
  }

  it("isValid matches (purchasedAt IST date === now IST date) for distanceKm ≥ 200", () => {
    fc.assert(
      fc.property(
        // purchasedAt: any date in a 2-year window
        fc.date({
          min: new OriginalDate("2024-01-01"),
          max: new OriginalDate("2026-01-01"),
        }),
        // nowOffset: -2 days to +2 days to probe same/different days
        fc.integer({ min: -2 * 24 * 60 * 60 * 1000, max: 2 * 24 * 60 * 60 * 1000 }),
        // distanceKm ≥ 200
        fc.integer({ min: 200, max: 5000 }),
        (purchasedAt, nowOffset, distanceKm) => {
          const nowMs = purchasedAt.getTime() + nowOffset;
          setMockedNow(nowMs);

          const ticket = makeExpressTicket({
            ticketStatus: "ACTIVE",
            ticketSubType: "UNRESERVED_ONE_WAY",
            purchasedAt,
            distanceKm,
          });
          const result = isExpressTicketValid(ticket);

          const now = new OriginalDate(nowMs);
          const expectedValid = sameISTDay(purchasedAt, now);
          return result.isValid === expectedValid;
        }
      ),
      { numRuns: 200 }
    );
  });
});
