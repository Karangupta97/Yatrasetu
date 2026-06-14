/**
 * Property-based tests for generatePNR
 *
 * Validates: Requirements 3.3, 3.4
 */

/// <reference types="jest" />

import * as fc from "fast-check";

// ── Mock ExpressTicket BEFORE importing the module under test ─────────────────
// The model is at src/models/ExpressTicket.ts
// From src/utils/__tests__/, the relative path is ../../models/ExpressTicket
jest.mock("../../models/ExpressTicket", () => ({
  __esModule: true,
  default: {
    exists: jest.fn(),
  },
}));

// Also mock LocalTicket (imported by ticketId.ts but unused in these tests)
jest.mock("../../models/LocalTicket", () => ({
  __esModule: true,
  default: {
    exists: jest.fn(),
  },
}));

import { generatePNR } from "../ticketId";
import ExpressTicket from "../../models/ExpressTicket";

// Cast to a Jest mock so TypeScript lets us configure return values
const mockExists = ExpressTicket.exists as jest.MockedFunction<typeof ExpressTicket.exists>;

const PNR_PATTERN = /^\d{10}$/;

// ── Reset mocks between tests ─────────────────────────────────────────────────
beforeEach(() => {
  mockExists.mockReset();
});

// ─────────────────────────────────────────────────────────────────────────────
// Property 2: PNR format invariant
//
// For N calls with mocked ExpressTicket.exists always returning false/null,
// all results match /^\d{10}$/
//
// Validates: Requirement 3.3
// ─────────────────────────────────────────────────────────────────────────────
describe("Property 2: PNR format invariant", () => {
  it("always returns a string matching /^\\d{10}$/ when no collision", async () => {
    // exists always returns null (no collision) — set once, stays for all runs
    mockExists.mockResolvedValue(null);

    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 5 }),
        async (n) => {
          for (let i = 0; i < n; i++) {
            const pnr = await generatePNR();
            if (!PNR_PATTERN.test(pnr)) return false;
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
// Mock exists to return truthy K times then null/false; assert function returns
// a valid result and exists was called K+1 times.
//
// Validates: Requirement 3.4
// ─────────────────────────────────────────────────────────────────────────────
describe("Property 3: Identifier generation retries on collision", () => {
  it("retries exactly K times and returns a valid PNR after K collisions", async () => {
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

          const result = await generatePNR();

          if (!PNR_PATTERN.test(result)) return false;
          if (mockExists.mock.calls.length !== k + 1) return false;

          return true;
        }
      ),
      { numRuns: 25 }
    );
  });
});
