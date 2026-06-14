# Requirements Document

## Introduction

The Digital Ticket System extends the Yatrasetu backend with full lifecycle management for two classes of railway tickets: Local (suburban/UTS) tickets and Express (long-distance/PNR) tickets. Passengers can purchase, retrieve, and present digital tickets via the app. Ticket Travelling Examiners (TTEs) scan short-lived cryptographic tokens from passengers' devices to verify authenticity and detect fraud. A background expiry job keeps ticket statuses current without passenger action.

## Glossary

- **LocalTicket**: A suburban/local railway ticket identified by a UTS number of the form `X0` + 8 uppercase alphanumeric characters.
- **ExpressTicket**: A long-distance/express railway ticket identified by a 10-digit PNR number.
- **FraudAlert**: A record created when a ticket is scanned by two different TTEs within a 5-minute window, indicating a potential duplicate-scan fraud event.
- **Scan Token**: A short-lived JWT (90-second expiry) signed with `TICKET_SECRET` that encodes a ticket reference; presented as a QR code for TTE scanning.
- **TTE**: Ticket Travelling Examiner — a railway staff member authorised to verify passenger tickets. Must hold `role === "tte"` or `role === "admin"` in their JWT.
- **IST**: Indian Standard Time (UTC+5:30), used for all date boundary calculations.
- **UTS_Number**: A unique ticket identifier matching `/^X0[A-Z0-9]{8}$/`.
- **PNR_Number**: A unique 10-digit numeric string matching `/^\d{10}$/`.
- **TICKET_SECRET**: A 64-character random string environment variable separate from `JWT_SECRET`, used to sign and verify Scan Tokens.
- **Ticket_Router**: The Express router mounted at `/api/ticket` handling all passenger-facing ticket endpoints.
- **TTE_Router**: The Express router mounted at `/api/tte` handling TTE verification endpoints.
- **Validity_Engine**: The pair of pure functions `isLocalTicketValid` and `isExpressTicketValid` in `src/utils/ticketValidity.ts`.
- **Expire_Job**: The `runExpireJob` function in `src/jobs/expireTickets.ts`, invoked every 5 minutes.

---

## Requirements

### Requirement 1: Local Ticket Issuance

**User Story:** As a verified passenger, I want to purchase a local (suburban) railway ticket, so that I have a valid digital ticket stored in the app for my journey.

#### Acceptance Criteria

1. WHEN a passenger sends `POST /api/ticket/local/issue` with a valid Bearer token and a well-formed request body, THE Ticket_Router SHALL create a new LocalTicket document and return HTTP 201 with the full document.
2. THE Ticket_Router SHALL enforce `verifyJWT`, `emailVerifiedGate`, and `aadhaarVerifiedGate` middleware on `POST /api/ticket/local/issue` before processing the request.
3. WHEN the request body for local ticket issuance is missing any required field (`fromStation`, `toStation`, `distanceKm`, `ticketType`, `class`, `passengerCount`, `fare`), THE Ticket_Router SHALL return HTTP 400 with a descriptive error message.
4. WHEN a local ticket is issued, THE Ticket_Router SHALL call `generateUTSNumber()` and store the result as `utsNumber` on the new LocalTicket document.
5. WHEN a local ticket is issued, THE Ticket_Router SHALL set `status` to `ACTIVE` and `purchasedAt` to the current server time.
6. WHERE `passengerCount.adults` is provided, THE Ticket_Router SHALL reject values less than 1 with HTTP 400.
7. WHEN a local ticket is issued, THE Ticket_Router SHALL store `userId` from the verified JWT payload on the ticket document.

### Requirement 2: Express Ticket Issuance

**User Story:** As a verified passenger, I want to purchase an express railway ticket, so that I have a valid digital PNR ticket stored in the app for my journey.

#### Acceptance Criteria

1. WHEN a passenger sends `POST /api/ticket/express/issue` with a valid Bearer token and a well-formed request body, THE Ticket_Router SHALL create a new ExpressTicket document and return HTTP 201 with the full document.
2. THE Ticket_Router SHALL enforce `verifyJWT`, `emailVerifiedGate`, and `aadhaarVerifiedGate` middleware on `POST /api/ticket/express/issue` before processing the request.
3. WHEN the request body for express ticket issuance is missing any required field (`trainNo`, `trainName`, `fromStation`, `toStation`, `journeyDate`, `departureTime`, `arrivalTime`, `distanceKm`, `ticketSubType`, `class`, `passengers`, `fare`, `totalFare`), THE Ticket_Router SHALL return HTTP 400 with a descriptive error message.
4. WHEN an express ticket is issued, THE Ticket_Router SHALL call `generatePNR()` and store the result as `pnrNumber` on the new ExpressTicket document.
5. WHEN an express ticket is issued, THE Ticket_Router SHALL set `ticketStatus` to `ACTIVE` and `purchasedAt` to the current server time.
6. WHERE `ticketSubType` is `RESERVED_RETURN`, THE Ticket_Router SHALL accept and store optional `returnJourneyDate` and `returnTrainNo` fields on the ticket document.
7. WHEN an express ticket is issued, THE Ticket_Router SHALL default `quota` to `"GN"` when not provided by the client.

### Requirement 3: Unique Identifier Generation

**User Story:** As the system, I want every ticket to have a globally unique identifier, so that no two tickets can be confused or spoofed.

#### Acceptance Criteria

1. THE `generateUTSNumber` function SHALL return a string matching the pattern `/^X0[A-Z0-9]{8}$/`.
2. THE `generateUTSNumber` function SHALL verify that the generated UTS number does not already exist in the LocalTicket collection before returning it, retrying until a unique value is found.
3. THE `generatePNR` function SHALL return a string matching the pattern `/^\d{10}$/`.
4. THE `generatePNR` function SHALL verify that the generated PNR does not already exist in the ExpressTicket collection before returning it, retrying until a unique value is found.
5. WHEN generating identifiers, THE `generateUTSNumber` and `generatePNR` functions SHALL use Node.js `crypto.randomBytes` as the source of entropy.

### Requirement 4: Passenger Ticket Listing

**User Story:** As a passenger, I want to view a list of my past and present bookings, so that I can manage and reference my tickets.

#### Acceptance Criteria

1. WHEN a passenger sends `GET /api/ticket/local/my-bookings` with a valid Bearer token, THE Ticket_Router SHALL return only LocalTickets belonging to that passenger's `userId`, sorted by `purchasedAt` descending.
2. WHEN a passenger sends `GET /api/ticket/express/my-bookings` with a valid Bearer token, THE Ticket_Router SHALL return only ExpressTickets belonging to that passenger's `userId`, sorted by `purchasedAt` descending.
3. WHEN the `status` query parameter is `UPCOMING`, THE Ticket_Router SHALL filter local bookings to documents with `status === "ACTIVE"`.
4. WHEN the `status` query parameter is `COMPLETED`, THE Ticket_Router SHALL filter local bookings to documents with `status` in `["USED", "EXPIRED"]`.
5. WHEN the `status` query parameter is `CANCELLED`, THE Ticket_Router SHALL filter bookings to documents with `status === "CANCELLED"`.
6. WHEN the `status` query parameter is `ALL` or absent, THE Ticket_Router SHALL return all bookings regardless of status.
7. THE Ticket_Router SHALL return local bookings with only these projected fields: `utsNumber`, `ticketType`, `fromStation`, `toStation`, `distanceKm`, `purchasedAt`, `fare`, `status`, `passengerCount`.
8. THE Ticket_Router SHALL return express bookings with only these projected fields: `pnrNumber`, `trainNo`, `trainName`, `fromStation`, `toStation`, `journeyDate`, `departureTime`, `class`, `totalFare`, `ticketStatus`, `passengers.name`, `passengers.status`.

### Requirement 5: Ticket Detail Retrieval

**User Story:** As a passenger, I want to view the full details of a specific ticket including its current validity, so that I can confirm my ticket is ready for travel.

#### Acceptance Criteria

1. WHEN a passenger sends `GET /api/ticket/local/:ticketId` with a valid Bearer token, THE Ticket_Router SHALL return the full LocalTicket document along with a `validityInfo` field containing the result of `isLocalTicketValid(ticket)`.
2. WHEN a passenger sends `GET /api/ticket/express/:ticketId` with a valid Bearer token, THE Ticket_Router SHALL return the full ExpressTicket document along with a `validityInfo` field containing the result of `isExpressTicketValid(ticket)`.
3. IF the requested ticket does not exist in the database, THEN THE Ticket_Router SHALL return HTTP 404.
4. IF the authenticated passenger's `userId` does not match the ticket's `userId`, THEN THE Ticket_Router SHALL return HTTP 403.

### Requirement 6: Scan Token Generation

**User Story:** As a passenger, I want to generate a short-lived QR code token for my ticket, so that a TTE can scan and verify my ticket without needing internet access to the backend on the passenger's device.

#### Acceptance Criteria

1. WHEN a passenger sends `GET /api/ticket/local/:ticketId/token` with a valid Bearer token, THE Ticket_Router SHALL call `isLocalTicketValid(ticket)` before issuing a token.
2. IF `isLocalTicketValid` returns `{ isValid: false }`, THEN THE Ticket_Router SHALL return HTTP 410 with the validity `reason`.
3. WHEN `isLocalTicketValid` returns `{ isValid: true }`, THE Ticket_Router SHALL sign a JWT with `TICKET_SECRET` containing `{ ticketId, ticketModel: "local", utsNumber, userId }` and set expiry to 90 seconds from the current time.
4. WHEN a passenger sends `GET /api/ticket/express/:ticketId/token` with a valid Bearer token, THE Ticket_Router SHALL call `isExpressTicketValid(ticket)` before issuing a token.
5. IF `isExpressTicketValid` returns `{ isValid: false }`, THEN THE Ticket_Router SHALL return HTTP 410 with the validity `reason`.
6. WHEN `isExpressTicketValid` returns `{ isValid: true }`, THE Ticket_Router SHALL sign a JWT with `TICKET_SECRET` containing `{ ticketId, ticketModel: "express", pnrNumber, userId }` and set expiry to 90 seconds from the current time.
7. IF `TICKET_SECRET` is not set in the environment, THEN THE Ticket_Router SHALL return HTTP 500 and log a configuration error.

### Requirement 7: Local Ticket Validity Rules

**User Story:** As the system, I want to enforce correct validity windows for local tickets, so that expired or misused tickets are reliably detected.

#### Acceptance Criteria

1. WHEN `isLocalTicketValid` is called on a LocalTicket with `status !== "ACTIVE"`, THE Validity_Engine SHALL return `{ isValid: false }` with a reason indicating the current status.
2. WHEN `isLocalTicketValid` is called on a `ONE_WAY` ticket with `status === "ACTIVE"`, THE Validity_Engine SHALL return `{ isValid: true }` if the current time is within 1 hour of `purchasedAt`, and `{ isValid: false }` otherwise.
3. WHEN `isLocalTicketValid` is called on a `RETURN` ticket with `status === "ACTIVE"`, THE Validity_Engine SHALL compute `expiresAt` as midnight of the next calendar day (IST) after `purchasedAt`.
4. WHEN a `RETURN` ticket's `purchasedAt` falls on a Friday (IST), THE Validity_Engine SHALL extend `expiresAt` to midnight of the following Monday (IST).
5. WHEN a `RETURN` ticket's `purchasedAt` falls on a Saturday (IST), THE Validity_Engine SHALL extend `expiresAt` to midnight of the following Monday (IST).
6. THE Validity_Engine SHALL express all date boundaries in IST (UTC+5:30) when computing expiry for local tickets.

### Requirement 8: Express Ticket Validity Rules

**User Story:** As the system, I want to enforce correct validity windows for express tickets based on ticket sub-type and distance, so that passengers can only travel on the correct date and within the correct time window.

#### Acceptance Criteria

1. WHEN `isExpressTicketValid` is called on an ExpressTicket with `ticketStatus !== "ACTIVE"`, THE Validity_Engine SHALL return `{ isValid: false }` with a reason indicating the current status.
2. WHEN `isExpressTicketValid` is called on a `RESERVED_ONE_WAY` or `RESERVED_RETURN` ticket, THE Validity_Engine SHALL return `{ isValid: true }` if and only if the current calendar date (IST) matches `journeyDate` (IST).
3. WHEN `isExpressTicketValid` is called on an `UNRESERVED_ONE_WAY` ticket with `distanceKm < 200`, THE Validity_Engine SHALL return `{ isValid: true }` if the current time is within 3 hours of `purchasedAt`, and `{ isValid: false }` otherwise.
4. WHEN `isExpressTicketValid` is called on an `UNRESERVED_ONE_WAY` ticket with `distanceKm >= 200`, THE Validity_Engine SHALL return `{ isValid: true }` if the current calendar date (IST) matches the `purchasedAt` calendar date (IST), and `{ isValid: false }` otherwise.
5. THE Validity_Engine SHALL express all date boundaries in IST (UTC+5:30) when computing expiry for express tickets.

### Requirement 9: TTE Authentication

**User Story:** As the system, I want only authorised TTE staff to call ticket verification endpoints, so that passenger ticket data is not exposed to unauthorised parties.

#### Acceptance Criteria

1. THE TTE_Router SHALL apply `verifyTTEJWT` middleware to all routes under `/api/tte`.
2. WHEN a request to `/api/tte/*` carries a valid Bearer JWT with `role === "tte"` or `role === "admin"`, THE `verifyTTEJWT` middleware SHALL attach the decoded payload to `req.tte` and call `next()`.
3. IF a request to `/api/tte/*` carries a Bearer JWT with a role other than `"tte"` or `"admin"`, THEN THE `verifyTTEJWT` middleware SHALL return HTTP 403.
4. IF a request to `/api/tte/*` carries no Bearer token or an invalid token, THEN THE `verifyTTEJWT` middleware SHALL return HTTP 401.
5. IF the Bearer JWT presented to `verifyTTEJWT` is expired, THEN THE `verifyTTEJWT` middleware SHALL return HTTP 401 with message `"TTE session expired. Please log in again."`.

### Requirement 10: TTE Ticket Verification

**User Story:** As a TTE, I want to scan a passenger's QR code to instantly verify their ticket's authenticity and validity, so that I can confirm they are travelling legitimately.

#### Acceptance Criteria

1. WHEN a TTE sends `POST /api/tte/verify` with a `token` and `scanType`, THE TTE_Router SHALL verify the token's signature using `TICKET_SECRET`.
2. IF the token signature is invalid, THEN THE TTE_Router SHALL return HTTP 401 with message `"INVALID TICKET — DO NOT SCAN AGAIN"`.
3. IF the token is expired, THEN THE TTE_Router SHALL return HTTP 401 with message `"TICKET EXPIRED — ASK PASSENGER TO REFRESH"`.
4. WHEN the token is valid, THE TTE_Router SHALL extract `ticketModel` and `ticketId` from the payload and load the corresponding ticket document.
5. IF the ticket document is not found, THEN THE TTE_Router SHALL return HTTP 404.
6. WHEN the ticket document is loaded, THE TTE_Router SHALL run the appropriate validity check (`isLocalTicketValid` or `isExpressTicketValid`).
7. IF the validity check returns `{ isValid: false }`, THEN THE TTE_Router SHALL return HTTP 200 `{ verified: false, reason, displayColor: "RED" }`.
8. WHEN the validity check returns `{ isValid: true }`, THE TTE_Router SHALL append a `scanLog` entry with `scannedAt`, `scannedBy` (TTE ID from `req.tte.id`), and `scanType`, then save the ticket document.
9. WHEN the validity check returns `{ isValid: true }`, THE TTE_Router SHALL return HTTP 200 `{ verified: true, displayColor: "GREEN", ticket: <TTE display payload> }`.
10. WHERE the ticket model is `local`, THE TTE_Router SHALL include in the `ticket` payload: `utsNumber`, `passengerCount`, `fromStation`, `toStation`, `purchasedAt` (formatted), `ticketType`, `class`, `fare`, `validUntil`, `status`.
11. WHERE the ticket model is `express` and `ticketSubType` is `RESERVED_ONE_WAY` or `RESERVED_RETURN`, THE TTE_Router SHALL include in the `ticket` payload: `pnrNumber`, `trainNo`, `trainName`, `fromStation`, `toStation`, `journeyDate`, `departureTime`, `class`, `coach`, `passengers` (with `name`, `age`, `gender`, `seat`, `berthType`, `status`), `totalFare`, `quota`.
12. WHERE the ticket model is `express` and `ticketSubType` is `UNRESERVED_ONE_WAY`, THE TTE_Router SHALL include in the `ticket` payload: `pnrNumber`, `trainNo`, `fromStation`, `toStation`, `distanceKm`, `purchasedAt`, `validUntil`, `class: "GEN"`, `passengerCount` (derived as `passengers.length`), `fare`.

### Requirement 11: Duplicate Scan Fraud Detection

**User Story:** As a railway supervisor, I want the system to flag when the same ticket is scanned by two different TTEs within 5 minutes, so that potential ticket-sharing fraud can be investigated.

#### Acceptance Criteria

1. WHEN a ticket is verified successfully by a TTE, THE TTE_Router SHALL check whether any prior `scanLog` entry for the same ticket was created within the last 5 minutes by a different TTE ID.
2. IF a duplicate scan is detected, THEN THE TTE_Router SHALL create a FraudAlert document recording `ticketId`, `ticketModel`, `scannedAt`, `tteId`, `previousScanAt`, and `previousTteId`.
3. IF a duplicate scan is detected, THEN THE TTE_Router SHALL include a `warning` field in the HTTP 200 response indicating a possible duplicate scan, while still returning `verified: true` and `displayColor: "GREEN"`.
4. WHEN no duplicate scan is detected, THE TTE_Router SHALL omit the `warning` field from the response.

### Requirement 12: Automatic Ticket Expiry

**User Story:** As the system, I want tickets to be automatically marked as expired when their validity window closes, so that the stored status accurately reflects whether each ticket is still usable.

#### Acceptance Criteria

1. THE Expire_Job SHALL be invoked every 5 minutes via `setInterval` after the database connection is established in `server.ts`.
2. WHEN the Expire_Job runs, THE Expire_Job SHALL update all LocalTicket documents with `status === "ACTIVE"` and `purchasedAt` more than 2 hours before the current time to `status === "EXPIRED"`.
3. WHEN the Expire_Job runs, THE Expire_Job SHALL update all ExpressTicket documents with `ticketStatus === "ACTIVE"`, `ticketSubType === "UNRESERVED_ONE_WAY"`, `distanceKm < 200`, and `purchasedAt` more than 3 hours before the current time to `ticketStatus === "EXPIRED"`.
4. WHEN the Expire_Job runs, THE Expire_Job SHALL update all ExpressTicket documents with `ticketStatus === "ACTIVE"`, `ticketSubType === "UNRESERVED_ONE_WAY"`, `distanceKm >= 200`, and `purchasedAt` before the current day's midnight (IST) to `ticketStatus === "EXPIRED"`.
5. THE Expire_Job SHALL NOT modify any ticket document whose `status` (or `ticketStatus`) is already `"EXPIRED"`, `"USED"`, or `"CANCELLED"`.

### Requirement 13: Environment Configuration

**User Story:** As a developer, I want all required environment variables documented, so that deployments are correctly configured.

#### Acceptance Criteria

1. THE `.env.example` file SHALL include a `TICKET_SECRET` entry with a comment indicating it must be a 64-character random string separate from `JWT_SECRET`.
2. IF `TICKET_SECRET` is absent from the runtime environment when a scan token is requested, THEN THE Ticket_Router SHALL return HTTP 500 and log a descriptive configuration error.
3. THE `verifyTTEJWT` middleware SHALL continue to use `JWT_SECRET` (not `TICKET_SECRET`) for authenticating TTE login sessions.

### Requirement 14: Model Migration

**User Story:** As a developer, I want the old generic Ticket model replaced by the new typed models, so that the codebase is consistent and the placeholder is not accidentally used.

#### Acceptance Criteria

1. THE `src/models/LocalTicket.ts` file SHALL define and export the `LocalTicket` Mongoose model and `ILocalTicket` TypeScript interface.
2. THE `src/models/ExpressTicket.ts` file SHALL define and export the `ExpressTicket` Mongoose model and `IExpressTicket` TypeScript interface.
3. THE `src/models/FraudAlert.ts` file SHALL define and export the `FraudAlert` Mongoose model and `IFraudAlert` TypeScript interface.
4. THE existing `src/models/Ticket.ts` placeholder SHALL be removed or replaced so that no route or utility imports from it.
5. THE `src/routes/ticket.ts` file SHALL be fully replaced with the new implementation and SHALL NOT import from the old `Ticket` model.
