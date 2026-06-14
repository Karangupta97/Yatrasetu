/**
 * Property-based tests for generateUTSNumber
 *
 * Validates: Requirements 3.1, 3.2
 */

/// <reference types="jest" />

import * as fc from "fast-check";

// ── Mock LocalTicket BEFORE importing the module under test ───────────────────
// The model is at src/models/LocalTicket.ts
// From src/utils/__tests__/, the relative path is ../../models/LocalTicket
jest.mock("../../models/LocalTicket", () => ({
  __esModule: true,
  default: {
    exists: jest.fn(),
  },
}));

// Also mock ExpressTicket (imported by ticketId.ts but unused in these tests)
jest.mock("../../models/ExpressTicket", () => ({
  __esModule: true,
  default: {
    exists: jest.fn(),
  },
}));

import { generateUTSNumber } from "../ticketId";
import LocalTicket from "../../models/LocalTicket";

// Cast to a Jest mock so TypeScript lets us configure return values
const mockExists = LocalTicket.exists as jest.MockedFunction<typeof LocalTicket.exists>;

const UTS_PATTERN = /^X0[A-Z0-9]{8}$/;

// ── Reset mocks between tests ─────────────────────────────────────────────────
beforeEach(() => {
  mockExists.mockReset();
});

// ─────────────────────────────────────────────────────────────────────────────
// Property 1: UTS number format invariant
//
// For N calls with mocked LocalTicket.exists always returning false,
// all results match /^X0[A-Z0-9]{8}$/
//
// Validates: Requirement 3.1
// ─────────────────────────────────────────────────────────────────────────────
describe("Property 1: UTS number format invariant", () => {
  it("always returns a string matching /^X0[A-Z0-9]{8}$/ when no collision", async () => {
    // exists always returns null (no collision) — set once, stays for all runs
    mockExists.mockResolvedValue(null);

    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 5 }),
        async (n) => {
          for (let i = 0; i < n; i++) {
            const uts = await generateUTSNumber();
            if (!UTS_PATTERN.test(uts)) return false;
          }
          return true;
        }
      ),
      { numRuns: 25 }
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Property 3: Identifier generation retries on collision
//
// Mock exists to return truthy K times then null; assert function returns
// a valid result and exists was called K+1 times.
//
// Validates: Requirement 3.2
// ─────────────────────────────────────────────────────────────────────────────
describe("Property 3: Identifier generation retries on collision", () => {
  it("retries exactly K times and returns a valid UTS number after K collisions", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 5 }),
        async (k) => {
          // Reset and set up mock fresh for each fc run
          mockExists.mockReset();
          let callCount = 0;
          mockExists.mockImplementation(() => {
            callCount++;
            if (callCount <= k) {
              return Promise.resolve({ _id: "some-id" } as any);
            }
            return Promise.resolve(null);
          });

          const result = await generateUTSNumber();

          if (!UTS_PATTERN.test(result)) return false;
          if (mockExists.mock.calls.length !== k + 1) return false;

          return true;
        }
      ),
      { numRuns: 25 }
    );
  });
});
