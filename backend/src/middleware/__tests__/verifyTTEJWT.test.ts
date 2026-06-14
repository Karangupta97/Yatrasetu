/**
 * Unit tests for verifyTTEJWT middleware
 *
 * Validates: Requirements 9.2, 9.3, 9.4, 9.5
 */

/// <reference types="jest" />

import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { verifyTTEJWT } from "../../middleware/verifyTTEJWT";

const TEST_SECRET = "test-secret";

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeReq(authHeader?: string): Partial<Request> {
  return {
    headers: authHeader ? { authorization: authHeader } : {},
  };
}

function makeRes(): { res: Partial<Response>; statusCode: number | null; body: unknown } {
  const ctx = { statusCode: null as number | null, body: undefined as unknown };
  const res = {
    status(code: number) {
      ctx.statusCode = code;
      return res;
    },
    json(data: unknown) {
      ctx.body = data;
      return res;
    },
  } as unknown as Partial<Response>;
  return { res, statusCode: ctx.statusCode, body: ctx.body };
}

function makeNext(): NextFunction {
  return jest.fn() as unknown as NextFunction;
}

function signToken(payload: object, options?: jwt.SignOptions): string {
  return jwt.sign(payload, TEST_SECRET, options);
}

// ── Setup ─────────────────────────────────────────────────────────────────────

beforeAll(() => {
  process.env.JWT_SECRET = TEST_SECRET;
});

afterAll(() => {
  delete process.env.JWT_SECRET;
});

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("verifyTTEJWT", () => {
  // ── 1. Missing token → 401 ─────────────────────────────────────────────────
  it("returns 401 when Authorization header is missing (Req 9.2)", () => {
    const req = makeReq();
    const { res, statusCode } = makeRes();
    const ctx = { code: 0, body: {} as unknown };
    const mockRes = {
      status(c: number) { ctx.code = c; return mockRes; },
      json(d: unknown) { ctx.body = d; return mockRes; },
    } as unknown as Response;
    const next = makeNext();

    verifyTTEJWT(req as Request, mockRes, next);

    expect(ctx.code).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });

  // ── 2. Valid TTE token → req.tte populated ─────────────────────────────────
  it("calls next() and populates req.tte for a valid TTE-role token (Req 9.3)", () => {
    const payload = { id: "tte-001", role: "tte" as const };
    const token = signToken(payload, { expiresIn: 3600 });
    const req = makeReq(`Bearer ${token}`) as Request;
    const ctx = { code: 0, body: {} as unknown };
    const mockRes = {
      status(c: number) { ctx.code = c; return mockRes; },
      json(d: unknown) { ctx.body = d; return mockRes; },
    } as unknown as Response;
    const next = makeNext();

    verifyTTEJWT(req, mockRes, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.tte).toBeDefined();
    expect(req.tte!.id).toBe("tte-001");
    expect(req.tte!.role).toBe("tte");
  });

  // ── 3. Valid admin token → req.tte populated ───────────────────────────────
  it("calls next() and populates req.tte for a valid admin-role token (Req 9.3)", () => {
    const payload = { id: "admin-007", role: "admin" as const };
    const token = signToken(payload, { expiresIn: 3600 });
    const req = makeReq(`Bearer ${token}`) as Request;
    const ctx = { code: 0, body: {} as unknown };
    const mockRes = {
      status(c: number) { ctx.code = c; return mockRes; },
      json(d: unknown) { ctx.body = d; return mockRes; },
    } as unknown as Response;
    const next = makeNext();

    verifyTTEJWT(req, mockRes, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.tte).toBeDefined();
    expect(req.tte!.id).toBe("admin-007");
    expect(req.tte!.role).toBe("admin");
  });

  // ── 4. User-role token → 403 ───────────────────────────────────────────────
  it("returns 403 when the JWT carries a user role (Req 9.4)", () => {
    const payload = { id: "user-123", role: "user" };
    const token = signToken(payload, { expiresIn: 3600 });
    const req = makeReq(`Bearer ${token}`) as Request;
    const ctx = { code: 0, body: {} as unknown };
    const mockRes = {
      status(c: number) { ctx.code = c; return mockRes; },
      json(d: unknown) { ctx.body = d; return mockRes; },
    } as unknown as Response;
    const next = makeNext();

    verifyTTEJWT(req, mockRes, next);

    expect(ctx.code).toBe(403);
    expect(next).not.toHaveBeenCalled();
  });

  // ── 5. Expired token → 401 with specific message ───────────────────────────
  it('returns 401 with "TTE session expired. Please log in again." for an expired token (Req 9.5)', () => {
    // Sign with a past exp to force an expired token
    const payload = { id: "tte-expired", role: "tte" as const };
    const token = jwt.sign(payload, TEST_SECRET, { expiresIn: -1 });
    const req = makeReq(`Bearer ${token}`) as Request;
    const ctx = { code: 0, body: {} as unknown };
    const mockRes = {
      status(c: number) { ctx.code = c; return mockRes; },
      json(d: unknown) { ctx.body = d; return mockRes; },
    } as unknown as Response;
    const next = makeNext();

    verifyTTEJWT(req, mockRes, next);

    expect(ctx.code).toBe(401);
    expect(ctx.body).toMatchObject({
      status: "error",
      message: "TTE session expired. Please log in again.",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
