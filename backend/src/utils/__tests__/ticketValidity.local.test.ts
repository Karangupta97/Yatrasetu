/**
 * Property-based tests for isLocalTicketValid
 *
 * Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5
 */

/// <reference types="jest" />

import * as fc from "fast-check";
import { isLocalTicketValid, toIST, istMidnightOffsetDays } from "../ticketValidity";
import { ILocalTicket } from "../../models/LocalTicket";
import { Types } from "mongoose";

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
 * Set the mocked "now" value.  Pass null to restore real Date.
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
 * Construct a minimal ILocalTicket partial mock that satisfies only the fields
 * `isLocalTicketValid` actually reads.
 */
function makeTicket(
  overrides: Partial<Pick<ILocalTicket, "status" | "ticketType" | "purchasedAt">>
): ILocalTicket {
  return {
    ticketId: "test-ticket-id",
    utsNumber: "X0AAAAAAAA",
    userId: new Types.ObjectId(),
    passengerCount: { adults: 1, children: 0 },
    fromStation: "CST",
    toStation: "THANE",
    distanceKm: 35,
    ticketType: "ONE_WAY",
    class: "SECOND",
    fare: 10,
    purchasedAt: new OriginalDate(),
    journeyCommencedAt: null,
    journeyCompletedAt: null,
    status: "ACTIVE",
    scanLog: [],
    createdAt: new OriginalDate(),
    updatedAt: new OriginalDate(),
    ...overrides,
  } as unknown as ILocalTicket;
}

// ─────────────────────────────────────────────────────────────────────────────
// Property 4: Local ticket — non-ACTIVE status always invalid
//
// For any ticket with status in [USED, EXPIRED, CANCELLED],
// isLocalTicketValid must return isValid === false regardless of other fields.
//
// Validates: Requirements 7.1
// ─────────────────────────────────────────────────────────────────────────────
describe("Property 4: non-ACTIVE status always invalid", () => {
  it("returns isValid: false for every non-ACTIVE status", () => {
    fc.assert(
      fc.property(
        fc.constantFrom("USED" as const, "EXPIRED" as const, "CANCELLED" as const),
        fc.constantFrom("ONE_WAY" as const, "RETURN" as const),
        fc.date({ min: new OriginalDate("2020-01-01"), max: new OriginalDate("2030-01-01") }),
        (status, ticketType, purchasedAt) => {
          const ticket = makeTicket({ status, ticketType, purchasedAt });
          const result = isLocalTicketValid(ticket);
          return result.isValid === false;
        }
      ),
      { numRuns: 200 }
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Property 5: Local ONE_WAY expiry window
//
// For ACTIVE ONE_WAY tickets, isValid === (now < purchasedAt + 3_600_000).
// We mock `new Date()` via our custom MockDateConstructor to control "now".
//
// Validates: Requirements 7.2, 7.3
// ─────────────────────────────────────────────────────────────────────────────
describe("Property 5: Local ONE_WAY expiry window", () => {
  it("isValid matches (now < purchasedAt + 1 hour) for any (purchasedAt, now) pair", () => {
    fc.assert(
      fc.property(
        // purchasedAt: any date in a 2-year window
        fc.date({ min: new OriginalDate("2024-01-01"), max: new OriginalDate("2026-01-01") }),
        // offset in ms: [-30 min, +2 hours] to cover both sides of the 1-hour boundary
        fc.integer({ min: -30 * 60 * 1000, max: 2 * 60 * 60 * 1000 }),
        (purchasedAt, offsetMs) => {
          const nowMs = purchasedAt.getTime() + offsetMs;
          setMockedNow(nowMs);

          const ticket = makeTicket({ status: "ACTIVE", ticketType: "ONE_WAY", purchasedAt });
          const result = isLocalTicketValid(ticket);

          const expectedValid = nowMs < purchasedAt.getTime() + 3_600_000;
          return result.isValid === expectedValid;
        }
      ),
      { numRuns: 200 }
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Property 6: RETURN ticket expiry day-of-week rule (IST)
//
// For ACTIVE RETURN tickets:
//   - purchasedAt on Friday IST (day=5)  → expiresAt = istMidnightOffsetDays(purchasedAt, 3)
//   - purchasedAt on Saturday IST (day=6) → expiresAt = istMidnightOffsetDays(purchasedAt, 2)
//   - purchasedAt on any other day        → expiresAt = istMidnightOffsetDays(purchasedAt, 1)
//
// Validates: Requirements 7.4, 7.5
// ─────────────────────────────────────────────────────────────────────────────
describe("Property 6: RETURN ticket expiry day-of-week rule", () => {
  /**
   * Build a UTC timestamp whose IST wall-clock day-of-week equals `targetDay`.
   * Anchor: 2024-01-01 06:00 UTC = Monday IST (day=1, since 06:00 + 5:30 = 11:30).
   */
  function utcTimestampForISTDay(targetDay: number): OriginalDate {
    const anchor = new OriginalDate("2024-01-01T06:00:00.000Z"); // Monday IST
    const anchorDay = toIST(anchor).getDay(); // 1
    const diff = (targetDay - anchorDay + 7) % 7;
    return new OriginalDate(anchor.getTime() + diff * 24 * 60 * 60 * 1000);
  }

  it("expiresAt follows the day-of-week rule for all 7 IST weekdays", () => {
    fc.assert(
      fc.property(
        // Pick one of the 7 IST weekdays
        fc.integer({ min: 0, max: 6 }),
        // Random intra-day offset (0–23h) to vary the time within the day
        fc.integer({ min: 0, max: 23 * 60 * 60 * 1000 - 1 }),
        (targetDay, intraDayOffsetMs) => {
          const basePurchasedAt = utcTimestampForISTDay(targetDay);
          const purchasedAt = new OriginalDate(basePurchasedAt.getTime() + intraDayOffsetMs);

          // Verify we're still on the intended IST calendar day
          const istDay = toIST(purchasedAt).getDay();
          if (istDay !== targetDay) {
            // Offset crossed midnight IST — discard this sample
            return true;
          }

          const expectedOffset = targetDay === 5 ? 3 : targetDay === 6 ? 2 : 1;
          const expectedExpiresAt = istMidnightOffsetDays(purchasedAt, expectedOffset);

          // Set "now" to 30 minutes before expiry so the ticket is valid
          const nowMs = expectedExpiresAt.getTime() - 30 * 60 * 1000;
          setMockedNow(nowMs);

          const ticket = makeTicket({ status: "ACTIVE", ticketType: "RETURN", purchasedAt });
          const result = isLocalTicketValid(ticket);

          return result.expiresAt.getTime() === expectedExpiresAt.getTime();
        }
      ),
      { numRuns: 200 }
    );
  });

  it("isValid is false when now > expiresAt for RETURN ticket", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 6 }),
        (targetDay) => {
          const purchasedAt = utcTimestampForISTDay(targetDay);
          const istDay = toIST(purchasedAt).getDay();
          if (istDay !== targetDay) return true;

          const expectedOffset = istDay === 5 ? 3 : istDay === 6 ? 2 : 1;
          const expiresAt = istMidnightOffsetDays(purchasedAt, expectedOffset);

          // Set "now" to 1 second after expiry
          setMockedNow(expiresAt.getTime() + 1000);

          const ticket = makeTicket({ status: "ACTIVE", ticketType: "RETURN", purchasedAt });
          const result = isLocalTicketValid(ticket);

          return result.isValid === false;
        }
      ),
      { numRuns: 50 }
    );
  });
});
