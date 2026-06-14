# Implementation Plan: Digital Ticket System

## Overview

Implement the Digital Ticket System end-to-end in TypeScript on the existing Express 5 / Mongoose / Redis stack. The plan proceeds from data models → utilities → middleware → routes → background job → server wiring, with property-based tests (fast-check) placed immediately after the logic they validate.

## Tasks

- [x] 1. Create Mongoose models for LocalTicket, ExpressTicket, and FraudAlert
  - [x] 1.1 Create `src/models/LocalTicket.ts`
    - Define `IScanLogEntry`, `IPassengerCount`, `ILocalTicket` TypeScript interfaces
    - Implement the `localTicketSchema` with all fields, enums, defaults, and validations exactly as specified in the design
    - Add unique indexes on `ticketId` and `utsNumber`
    - Export `LocalTicket` model and `ILocalTicket` interface
    - _Requirements: 14.1, 1.5, 1.6_
  - [x] 1.2 Create `src/models/ExpressTicket.ts`
    - Define `IExpressPassenger` and `IExpressTicket` TypeScript interfaces
    - Implement `expressTicketSchema` with all fields, enums, defaults, and validations
    - Add unique indexes on `ticketId` and `pnrNumber`
    - Export `ExpressTicket` model and `IExpressTicket` interface
    - _Requirements: 14.2, 2.5, 2.7_
  - [x] 1.3 Create `src/models/FraudAlert.ts`
    - Define `IFraudAlert` TypeScript interface
    - Implement `fraudAlertSchema` with all fields as specified in the design
    - Export `FraudAlert` model and `IFraudAlert` interface
    - _Requirements: 14.3, 11.2_
  - [x] 1.4 Remove the old `src/models/Ticket.ts` placeholder
    - Delete the file (it will no longer be imported anywhere after this task set)
    - _Requirements: 14.4_

- [x] 2. Implement ticket identifier generation utilities
  - [x] 2.1 Create `src/utils/ticketId.ts`
    - Implement `generateUTSNumber()`: uses `crypto.randomBytes(8)`, maps bytes to `[A-Z0-9]` alphabet, prepends `X0`, retries against `LocalTicket.exists` until unique
    - Implement `generatePNR()`: uses `crypto.randomBytes(6)`, converts to 10-digit numeric string, retries against `ExpressTicket.exists` until unique
    - Export both functions with explicit return types `Promise<string>`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  - [x] 2.2 Write property tests for `generateUTSNumber`
    - **Property 1: UTS number format invariant** — for N calls with mocked `LocalTicket.exists` always returning false, all results match `/^X0[A-Z0-9]{8}$/`
    - **Property 3: Identifier generation retries on collision** — mock `exists` to return true K times then false; assert function returns valid result and `exists` was called K+1 times
    - **Validates: Requirements 3.1, 3.2**
  - [x] 2.3 Write property tests for `generatePNR`
    - **Property 2: PNR format invariant** — for N calls with mocked `ExpressTicket.exists` always returning false, all results match `/^\d{10}$/`
    - **Property 3: Identifier generation retries on collision** — same collision retry pattern as 2.2
    - **Validates: Requirements 3.3, 3.4**

- [x] 3. Implement IST-aware ticket validity engine
  - [x] 3.1 Create `src/utils/ticketValidity.ts`
    - Implement `toIST(date: Date): Date` helper (adds 330-minute offset)
    - Implement `istMidnightOffsetDays(date: Date, days: number): Date` helper
    - Implement `isLocalTicketValid(ticket: ILocalTicket): ValidityResult` with all rules from the design:
      - Non-ACTIVE status → invalid
      - ONE_WAY: valid within 1 hour of purchasedAt
      - RETURN: expiry is next-day midnight IST; Friday/Saturday purchase extends to Monday midnight IST
    - Implement `isExpressTicketValid(ticket: IExpressTicket): ValidityResult` with all rules:
      - Non-ACTIVE ticketStatus → invalid
      - RESERVED_ONE_WAY / RESERVED_RETURN: IST journey date must match IST today
      - UNRESERVED_ONE_WAY < 200km: valid within 3 hours of purchasedAt
      - UNRESERVED_ONE_WAY ≥ 200km: IST purchase date must match IST today
    - Export `ValidityResult` interface and both functions
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 8.1, 8.2, 8.3, 8.4, 8.5_
  - [x] 3.2 Write property tests for `isLocalTicketValid`
    - **Property 4: Local ticket — non-ACTIVE status always invalid** — generate tickets with status in [USED, EXPIRED, CANCELLED] with random other fields; assert isValid: false
    - **Property 5: Local ONE_WAY expiry window** — generate (purchasedAt, mockedNow) pairs; assert isValid matches (now < purchasedAt + 3_600_000)
    - **Property 6: RETURN ticket expiry day-of-week rule** — generate purchasedAt values for each day of week; assert expiresAt follows Friday/Saturday/other rules
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**
  - [x] 3.3 Write property tests for `isExpressTicketValid`
    - **Property 7: Express ticket — non-ACTIVE status always invalid** — generate tickets with ticketStatus in [USED, EXPIRED, CANCELLED]; assert isValid: false
    - **Property 8: UNRESERVED_ONE_WAY < 200km expiry window** — generate (purchasedAt, mockedNow, distanceKm < 200) triples; assert isValid matches (now < purchasedAt + 10_800_000)
    - **Property 9: RESERVED ticket journey-date match** — generate (journeyDate, mockedNow) pairs; assert isValid matches IST date equality
    - **Property 10: UNRESERVED_ONE_WAY ≥ 200km same-day rule** — generate (purchasedAt, mockedNow, distanceKm ≥ 200) triples; assert isValid matches IST date equality
    - **Validates: Requirements 8.1, 8.2, 8.3, 8.4**

- [x] 4. Checkpoint — core logic verified
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement TTE JWT middleware
  - [x] 5.1 Create `src/middleware/verifyTTEJWT.ts`
    - Define `TTEJWTPayload` interface (`id`, `role: "tte" | "admin"`, `iat?`, `exp?`)
    - Extend `Express.Request` to add `tte?: TTEJWTPayload` (add to the global namespace declaration)
    - Implement `verifyTTEJWT` middleware:
      - Extract Bearer token from `Authorization` header → 401 if missing
      - Verify with `JWT_SECRET` (not TICKET_SECRET)
      - Reject role !== "tte" | "admin" → 403
      - Attach decoded payload to `req.tte`
      - Return 401 with expired-session message on `TokenExpiredError`
    - Export `verifyTTEJWT` and `TTEJWTPayload`
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  - [x] 5.2 Write unit tests for `verifyTTEJWT`
    - Test: missing token → 401
    - Test: valid TTE token → req.tte populated
    - Test: valid admin token → req.tte populated
    - Test: user-role token → 403
    - Test: expired token → 401 with correct message
    - _Requirements: 9.2, 9.3, 9.4, 9.5_

- [ ] 6. Implement passenger ticket routes
  - [ ] 6.1 Replace `src/routes/ticket.ts` with the new implementation
    - Remove all imports and code from the existing placeholder
    - Add `POST /api/ticket/local/issue` handler:
      - Guard chain: `verifyJWT`, `emailVerifiedGate`, `aadhaarVerifiedGate`
      - Validate required body fields; return 400 on missing/invalid fields
      - Validate `passengerCount.adults >= 1`; return 400 otherwise
      - Call `generateUTSNumber()`, call `uuidv4()` for `ticketId`
      - `LocalTicket.create({...})` and return 201 with full doc
    - Add `POST /api/ticket/express/issue` handler (same guards):
      - Validate required fields
      - Call `generatePNR()`, call `uuidv4()` for `ticketId`
      - `ExpressTicket.create({...})` and return 201 with full doc
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_
  - [~] 6.2 Add `GET /api/ticket/local/my-bookings` and `GET /api/ticket/express/my-bookings` handlers
    - Guard: `verifyJWT`
    - Map `status` query param: UPCOMING→ACTIVE filter, COMPLETED→{$in:["USED","EXPIRED"]}, CANCELLED→CANCELLED, ALL/absent→no filter
    - Apply field projections exactly as specified in the design
    - Sort by `purchasedAt` descending
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8_
  - [~] 6.3 Add `GET /api/ticket/local/:ticketId` and `GET /api/ticket/express/:ticketId` handlers
    - Guard: `verifyJWT`
    - Fetch ticket by `ticketId`; return 404 if not found
    - Return 403 if `ticket.userId` !== `req.user.id`
    - Append `validityInfo` from the appropriate validity function to the response
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  - [~] 6.4 Add `GET /api/ticket/local/:ticketId/token` and `GET /api/ticket/express/:ticketId/token` handlers
    - Guard: `verifyJWT`
    - Fetch ticket; return 404 if not found; return 403 if ownership mismatch
    - Call validity function; return 410 with reason if invalid
    - Check `TICKET_SECRET` is set; return 500 if missing
    - Sign JWT with `TICKET_SECRET`, correct payload, `exp = now + 90s`; return 200 with token
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 13.2_
  - [~] 6.5 Write property tests for token endpoint
    - **Property 11: Scan token 90-second expiry invariant** — generate valid tickets (mock validity engine returning true), call token endpoint, decode JWT with TICKET_SECRET, assert exp − iat === 90 and payload.ticketId matches
    - **Property 12: Invalid ticket returns 410 with validity reason** — mock validity engine to return random reason strings with isValid: false; assert 410 with matching reason in body
    - **Validates: Requirements 6.2, 6.3, 6.5, 6.6**
  - [~] 6.6 Write property tests for my-bookings isolation and projection
    - **Property 13: My-bookings response field isolation** — generate random LocalTickets, call endpoint, assert response items have exactly the specified fields
    - **Property 14: My-bookings user isolation** — generate tickets across random user IDs, call endpoint as user U, assert all returned tickets have userId === U
    - **Validates: Requirements 4.1, 4.2, 4.7**

- [~] 7. Checkpoint — passenger routes verified
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Implement TTE verification route
  - [~] 8.1 Create `src/routes/tte.ts`
    - Apply `verifyTTEJWT` middleware to the router
    - Implement `POST /api/tte/verify` handler:
      - Extract `token` and `scanType` from request body; return 400 if missing
      - `jwt.verify(token, TICKET_SECRET)` — catch `JsonWebTokenError` → 401 "INVALID TICKET — DO NOT SCAN AGAIN"; catch `TokenExpiredError` → 401 "TICKET EXPIRED — ASK PASSENGER TO REFRESH"
      - Extract `ticketModel` and `ticketId` from decoded payload
      - Load ticket from appropriate model; return 404 if not found
      - Call validity function; return 200 `{ verified: false, reason, displayColor: "RED" }` if invalid
      - Append `scanLog` entry (`scannedAt: new Date()`, `scannedBy: req.tte.id`, `scanType`)
      - Run duplicate scan check: query scanLog for entries in last 5 minutes from a different TTE ID
      - If duplicate detected: `FraudAlert.create({...})`; add `warning` to response
      - Build TTE display payload per ticket model/subtype as specified in the design
      - Return 200 `{ verified: true, displayColor: "GREEN", ticket: <payload>, warning?: string }`
    - _Requirements: 9.1, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9, 10.10, 10.11, 10.12, 11.1, 11.2, 11.3, 11.4_
  - [~] 8.2 Write property tests for scan log growth
    - **Property 15: Scan log growth invariant** — generate valid tickets with existing scanLogs of varying lengths; call verify; assert scanLog.length increased by exactly 1 and last entry has correct fields
    - **Validates: Requirements 10.8**
  - [~] 8.3 Write property tests for fraud detection
    - **Property 16: Fraud alert creation on duplicate scan** — generate tickets with existing scanLog entries from TTE A at various past times; call verify as TTE B; assert FraudAlert is created iff previousScan was < 5 minutes ago and from a different TTE ID
    - **Validates: Requirements 11.1, 11.2, 11.3**

- [ ] 9. Implement background ticket expiry job
  - [~] 9.1 Create `src/jobs/expireTickets.ts`
    - Import `LocalTicket`, `ExpressTicket`
    - Import `istMidnightOffsetDays` helper from `ticketValidity.ts` (or duplicate the helper locally)
    - Implement `runExpireJob()`:
      - Compute `twoHoursAgo`, `threeHoursAgo`, `todayMidnightIST`
      - `LocalTicket.updateMany({ status: "ACTIVE", purchasedAt: { $lt: twoHoursAgo } }, { $set: { status: "EXPIRED" } })`
      - `ExpressTicket.updateMany` for UNRESERVED_ONE_WAY < 200km (purchasedAt < threeHoursAgo)
      - `ExpressTicket.updateMany` for UNRESERVED_ONE_WAY ≥ 200km (purchasedAt < todayMidnightIST)
    - Export `runExpireJob`
    - _Requirements: 12.2, 12.3, 12.4, 12.5_
  - [~] 9.2 Write property tests for `runExpireJob`
    - **Property 17: Expire job only modifies ACTIVE tickets** — generate sets of tickets with statuses USED/EXPIRED/CANCELLED with various purchasedAt values; run job with mocked updateMany; assert filter predicate always includes `status: "ACTIVE"` (or `ticketStatus: "ACTIVE"`)
    - **Property 18: Expire job correctly classifies eligible local tickets** — generate LocalTickets with varying purchasedAt and status; run job; assert status transitions are correct
    - **Validates: Requirements 12.2, 12.5**

- [ ] 10. Wire everything into server.ts and update .env.example
  - [~] 10.1 Update `src/server.ts`
    - Import `tteRouter` from `./routes/tte.js`
    - Register `app.use("/api/tte", tteRouter)` after the existing ticket route
    - Import `runExpireJob` from `./jobs/expireTickets.js`
    - Inside `bootstrap()`, after DB connects and Redis ping succeeds, add:
      `setInterval(() => { void runExpireJob(); }, 5 * 60 * 1000)`
    - _Requirements: 12.1_
  - [~] 10.2 Update `.env.example`
    - Add `TICKET_SECRET=` entry with a comment: `# 64-character random string, separate from JWT_SECRET — used to sign scan tokens`
    - _Requirements: 13.1_

- [~] 11. Final checkpoint — full system verified
  - Ensure all tests pass, ask the user if questions arise.
  - Verify TypeScript compiles cleanly with `tsc --noEmit`
  - Confirm no remaining imports reference the old `src/models/Ticket.ts`

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- `fast-check` is the recommended property-test library; install with `npm install --save-dev fast-check`
- All date/time logic must use the `toIST` / `istMidnightOffsetDays` helpers — never rely on local system timezone
- The `TICKET_SECRET` JWT is separate from `JWT_SECRET`; `verifyTTEJWT` still uses `JWT_SECRET`
- The old `src/routes/ticket.ts` (placeholder) is fully replaced in task 6.1 — not extended
- Property tests should mock `LocalTicket.exists` / `ExpressTicket.exists` to avoid requiring a live DB connection

## Task Dependency Graph

```json
{
  "waves": [
    { "wave": 1, "tasks": ["1"] },
    { "wave": 2, "tasks": ["2", "3"] },
    { "wave": 3, "tasks": ["4"] },
    { "wave": 4, "tasks": ["5"] },
    { "wave": 5, "tasks": ["6"] },
    { "wave": 6, "tasks": ["7"] },
    { "wave": 7, "tasks": ["8"] },
    { "wave": 8, "tasks": ["9"] },
    { "wave": 9, "tasks": ["10"] },
    { "wave": 10, "tasks": ["11"] }
  ]
}
```
