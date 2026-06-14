# Yatrasetu Backend — API Reference

Base URL: `http://localhost:5000`

All API routes are prefixed with `/api`. All request and response bodies use `application/json`. Authenticated routes require an `Authorization: Bearer <accessToken>` header unless stated otherwise.

---

## Table of Contents

1. [Auth Routes](#1-auth-routes)
   - [POST /api/auth/register](#11-register)
   - [POST /api/auth/verify-email](#12-verify-email-otp)
   - [POST /api/auth/resend-otp](#13-resend-otp)
   - [POST /api/auth/login](#14-login)
   - [POST /api/auth/logout](#15-logout)
   - [POST /api/auth/refresh](#16-refresh-token)
2. [Profile Routes](#2-profile-routes)
   - [POST /api/profile/aadhaar/generate-otp](#21-generate-aadhaar-otp)
   - [POST /api/profile/aadhaar/verify-otp](#22-verify-aadhaar-otp)
   - [GET /api/profile/me](#23-get-my-profile)
3. [Ticket Routes](#3-ticket-routes)
   - [POST /api/ticket/book](#31-book-ticket)
4. [Train Routes](#4-train-routes)
   - [GET /api/train/search-station](#41-search-station)
   - [GET /api/train/search-train](#42-search-train)
   - [GET /api/train/trains-between-stations](#43-trains-between-stations)
   - [GET /api/train/seat-availability](#44-seat-availability)
   - [GET /api/train/train-schedule](#45-train-schedule)
   - [GET /api/train/live-status](#46-live-status)
   - [GET /api/train/pnr-status](#47-pnr-status)
   - [GET /api/train/fare](#48-fare)
   - [GET /api/train/trains-by-station](#49-trains-by-station)
   - [GET /api/train/search-full](#410-search-full-aggregated)
5. [Health Check](#5-health-check)
6. [Error Format](#6-error-format)
7. [Middleware Stack & Security Model](#7-middleware-stack--security-model)
8. [Sandbox.co.in Auth Flow](#8-sandboxcoin-auth-flow)
9. [Environment Variables](#9-environment-variables)

---

## 1. Auth Routes

### 1.1 Register

**`POST /api/auth/register`**

Creates a new user account and sends a 6-digit OTP to the provided email for verification.

**Request Body**

| Field           | Type   | Required | Description                                    |
|-----------------|--------|----------|------------------------------------------------|
| username        | string | ✅        | Unique username (trimmed)                      |
| fullName        | string | ✅        | User's full name                               |
| email           | string | ✅        | Valid email address                            |
| mobile          | string | ✅        | Mobile number                                  |
| password        | string | ✅        | Min 8 chars, upper + lower + digit + special   |
| confirmPassword | string | ✅        | Must exactly match `password`                  |

**Example Request**

```json
{
  "username": "rahul_traveller",
  "fullName": "Rahul Sharma",
  "email": "rahul@example.com",
  "mobile": "9876543210",
  "password": "Secure@123",
  "confirmPassword": "Secure@123"
}
```

**Responses**

| Status | Meaning                                                    |
|--------|------------------------------------------------------------|
| 201    | Account created, 6-digit OTP sent to email                 |
| 400    | Validation error (missing fields, password mismatch, etc.) |
| 409    | Username or email already exists                           |
| 502    | Email send failure (production — user creation rolled back)|
| 500    | Server error                                               |

**201 Response**

```json
{
  "status": "success",
  "message": "Account created. A 6-digit OTP has been sent to your email address.",
  "userId": "64f1a2b3c4d5e6f7a8b9c0d1"
}
```

> Save the returned `userId` — it is required by `/verify-email` and `/resend-otp`.
> In development, if SES is not configured the OTP is printed to the server console as a fallback.

---

### 1.2 Verify Email (OTP)

**`POST /api/auth/verify-email`**

Verifies the user's email address using the 6-digit OTP sent during registration. The OTP is valid for **10 minutes** and stored in Redis.

**Request Body**

| Field  | Type   | Required | Description                              |
|--------|--------|----------|------------------------------------------|
| userId | string | ✅        | `userId` returned by `/register`         |
| otp    | string | ✅        | 6-digit OTP received in the email        |

**Example Request**

```json
{
  "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
  "otp": "482910"
}
```

**Responses**

| Status | Meaning                                   |
|--------|-------------------------------------------|
| 200    | Email verified successfully               |
| 400    | Missing `userId` or `otp`                 |
| 401    | Incorrect OTP                             |
| 404    | User not found                            |
| 410    | OTP expired — request a new one           |
| 500    | Server error                              |

**200 Response**

```json
{
  "status": "success",
  "message": "Email verified successfully. You can now log in."
}
```

**410 Response (expired)**

```json
{
  "status": "error",
  "message": "OTP has expired. Please request a new one via /api/auth/resend-otp."
}
```

---

### 1.3 Resend OTP

**`POST /api/auth/resend-otp`**

Sends a fresh 6-digit OTP to the user's registered email. Rate-limited to **one request per 60 seconds** per user.

**Request Body**

| Field  | Type   | Required | Description                              |
|--------|--------|----------|------------------------------------------|
| userId | string | ✅        | `userId` returned by `/register`         |

**Example Request**

```json
{
  "userId": "64f1a2b3c4d5e6f7a8b9c0d1"
}
```

**Responses**

| Status | Meaning                                          |
|--------|--------------------------------------------------|
| 200    | New OTP sent successfully                        |
| 400    | Missing `userId` or email already verified       |
| 404    | User not found                                   |
| 429    | Too soon — previous OTP was issued < 60s ago     |
| 502    | Email send failure                               |
| 500    | Server error                                     |

**200 Response**

```json
{
  "status": "success",
  "message": "A new OTP has been sent to your email address."
}
```

**429 Response**

```json
{
  "status": "error",
  "message": "Please wait at least 60 seconds before requesting a new OTP.",
  "retryAfter": 45
}
```

---

### 1.4 Login

**`POST /api/auth/login`**

Authenticates a user. Returns a short-lived access token and sets a long-lived `refreshToken` httpOnly cookie.

**Request Body**

| Field    | Type   | Required | Description          |
|----------|--------|----------|----------------------|
| username | string | ✅        | Registered username  |
| password | string | ✅        | Account password     |

**Example Request**

```json
{
  "username": "rahul_traveller",
  "password": "Secure@123"
}
```

**Responses**

| Status | Meaning                                              |
|--------|------------------------------------------------------|
| 200    | Login successful — access token + user info returned |
| 400    | Missing fields                                       |
| 401    | Incorrect password                                   |
| 403    | Email not verified (includes `userId` to resume OTP) |
| 404    | Username not found                                   |
| 500    | Server error                                         |

**200 Response**

```json
{
  "status": "success",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "username": "rahul_traveller",
    "fullName": "Rahul Sharma",
    "email": "rahul@example.com",
    "mobile": "9876543210",
    "role": "user",
    "isEmailVerified": true,
    "isAadhaarVerified": false
  }
}
```

**Cookie Set**

```
Set-Cookie: refreshToken=<jwt>; HttpOnly; Secure; SameSite=Strict; Max-Age=604800
```

**403 Response (email not verified)**

```json
{
  "status": "error",
  "message": "Please verify your email before logging in.",
  "userId": "64f1a2b3c4d5e6f7a8b9c0d1"
}
```

> If a login originates from a new device fingerprint, a security alert email is sent to the registered address automatically.

---

### 1.5 Logout

**`POST /api/auth/logout`**

Invalidates the refresh token in Redis and clears the `refreshToken` cookie. The short-lived access token must be discarded client-side.

**Cookie Required**

| Cookie       | Description                       |
|--------------|-----------------------------------|
| refreshToken | httpOnly cookie set during login  |

**Responses**

| Status | Meaning                 |
|--------|-------------------------|
| 200    | Logged out successfully |
| 500    | Server error            |

**200 Response**

```json
{
  "status": "success",
  "message": "Logged out successfully."
}
```

---

### 1.6 Refresh Token

**`POST /api/auth/refresh`**

Issues a new 15-minute access token using the `refreshToken` cookie. Call this when the access token expires rather than prompting the user to log in again.

**Cookie Required**

| Cookie       | Description                       |
|--------------|-----------------------------------|
| refreshToken | httpOnly cookie set during login  |

**Responses**

| Status | Meaning                                        |
|--------|------------------------------------------------|
| 200    | New access token issued                        |
| 401    | Refresh token missing, invalid, or revoked     |

**200 Response**

```json
{
  "status": "success",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 2. Profile Routes

All profile routes require:
- `Authorization: Bearer <accessToken>`
- Email must be verified (enforced by `emailVerifiedGate`)

---

### 2.1 Generate Aadhaar OTP

**`POST /api/profile/aadhaar/generate-otp`**

Initiates Aadhaar OKYC verification. Internally authenticates with Sandbox.co.in using a two-step token flow, then triggers an OTP to the user's Aadhaar-registered mobile number.

**Request Body**

| Field         | Type   | Required | Description                              |
|---------------|--------|----------|------------------------------------------|
| aadhaarNumber | string | ✅        | Exactly 12 digits — never stored raw     |
| consent       | string | ✅        | Must be `"y"` to confirm user consent    |

**Example Request**

```json
{
  "aadhaarNumber": "123456789012",
  "consent": "y"
}
```

**Responses**

| Status | Meaning                                                          |
|--------|------------------------------------------------------------------|
| 200    | OTP dispatched to Aadhaar-registered mobile                      |
| 400    | Invalid Aadhaar format or consent missing/not `"y"`              |
| 401    | Unauthorized — missing or invalid access token                   |
| 403    | Email not verified **or** Sandbox API access denied (see note)   |
| 502    | Sandbox returned success but no `reference_id`                   |
| 500    | Server error                                                     |

**200 Response**

```json
{
  "status": "success",
  "message": "OTP has been sent to your Aadhaar-registered mobile number."
}
```

**403 Response (Sandbox denied)**

```json
{
  "status": "error",
  "message": "Sandbox API access denied (Insufficient privilege). Go to dashboard.sandbox.co.in → Products → KYC → Aadhaar OKYC and activate the product for your API key."
}
```

> The Aadhaar number is **never** logged, stored raw, or returned in any response.
> The Sandbox `reference_id` is stored in Redis under `aadhaar:otp:<userId>` with a 10-minute TTL.

---

### 2.2 Verify Aadhaar OTP

**`POST /api/profile/aadhaar/verify-otp`**

Verifies the OTP received on the Aadhaar-registered mobile. On success, a SHA-256 hash of the Aadhaar number (salted with `AADHAAR_SALT`) is stored against the user account.

**Request Body**

| Field         | Type   | Required | Description                                       |
|---------------|--------|----------|---------------------------------------------------|
| otp           | string | ✅        | OTP received on Aadhaar-registered mobile         |
| aadhaarNumber | string | ✅        | Same 12-digit number used to generate the OTP     |

**Example Request**

```json
{
  "otp": "123456",
  "aadhaarNumber": "123456789012"
}
```

**Responses**

| Status | Meaning                                                           |
|--------|-------------------------------------------------------------------|
| 200    | Aadhaar verified and linked to account                            |
| 400    | Missing fields or invalid Aadhaar format                          |
| 401    | OTP verification failed (wrong OTP or Sandbox rejection)          |
| 409    | This Aadhaar is already linked to a different account             |
| 410    | Reference ID expired — request a new OTP                          |
| 500    | Server error                                                      |

**200 Response**

```json
{
  "status": "success",
  "message": "Aadhaar verified successfully. You can now book tickets."
}
```

---

### 2.3 Get My Profile

**`GET /api/profile/me`**

Returns the authenticated user's safe profile fields. Password, Aadhaar hash, and device fingerprints are always excluded.

**Responses**

| Status | Meaning                |
|--------|------------------------|
| 200    | Profile returned       |
| 401    | Unauthorized           |
| 403    | Email not verified     |
| 404    | User not found         |

**200 Response**

```json
{
  "status": "success",
  "user": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "username": "rahul_traveller",
    "fullName": "Rahul Sharma",
    "email": "rahul@example.com",
    "mobile": "9876543210",
    "isEmailVerified": true,
    "isAadhaarVerified": true,
    "role": "user",
    "createdAt": "2024-08-15T10:00:00.000Z",
    "updatedAt": "2024-08-15T12:00:00.000Z"
  }
}
```

---

## 3. Ticket Routes

All ticket routes pass through this middleware stack **in exact order**:

| # | Middleware           | Purpose                                              |
|---|----------------------|------------------------------------------------------|
| 1 | `redisRateLimiter`   | 100 req/min per IP via Redis INCR                    |
| 2 | `fingerprintMiddleware` | SHA-256 device fingerprint + Redis ban check      |
| 3 | `verifyJWT`          | Validates Bearer access token                        |
| 4 | `emailVerifiedGate`  | Blocks accounts with unverified email                |
| 5 | `aadhaarVerifiedGate`| Blocks accounts without completed Aadhaar OKYC       |
| 6 | `attachAadhaarHash`  | Fetches `aadhaarHash` from DB → attaches to `req`    |
| 7 | `quotaCheck`         | Enforces 4/Aadhaar and 6/account per-event limits    |

---

### 3.1 Book Ticket

**`POST /api/ticket/book`**

Books a ticket. Uses a Redis distributed lock (TTL 30s) to prevent duplicate bookings from concurrent requests.

**Headers**

```
Authorization: Bearer <accessToken>
```

**Request Body**

| Field   | Type   | Required | Description                     |
|---------|--------|----------|---------------------------------|
| eventId | string | ✅        | Unique identifier for the event |
| seat    | string | ✅        | Seat number / coach-seat code   |

**Example Request**

```json
{
  "eventId": "TRAIN_12345_2024-12-01",
  "seat": "B3-42"
}
```

**Responses**

| Status | Meaning                                                        |
|--------|----------------------------------------------------------------|
| 201    | Ticket booked successfully                                     |
| 400    | Missing `eventId` or `seat`                                    |
| 401    | Unauthorized                                                   |
| 403    | Email/Aadhaar not verified, device blocked, or quota exceeded  |
| 409    | Booking already in progress for this slot (Redis lock active)  |
| 429    | Rate limit exceeded — 100 req/min per IP                       |
| 500    | Booking failed                                                 |

**201 Response**

```json
{
  "status": "success",
  "message": "Ticket booked successfully.",
  "ticketId": "64f1a2b3c4d5e6f7a8b9c0d2"
}
```

**403 — Aadhaar quota exceeded**

```json
{
  "status": "error",
  "message": "Aadhaar quota reached for this event. Maximum 4 tickets per Aadhaar."
}
```

**403 — Account quota exceeded**

```json
{
  "status": "error",
  "message": "Account quota reached for this event. Maximum 6 tickets per account."
}
```

**409 — Redis lock active**

```json
{
  "status": "error",
  "message": "A booking is already in progress for this event. Please wait and try again."
}
```

**429 — Rate limited**

```json
{
  "status": "error",
  "message": "Too many requests. Please slow down.",
  "retryAfter": 60
}
```

---

## 4. Train Routes

All train routes require:
- `Authorization: Bearer <accessToken>`
- Email must be verified
- Rate-limited: **100 requests per IP per 15 minutes** (enforced by `apiLimiter`)

All data is proxied from the **IRCTC RapidAPI** (`irctc1` by IRCTCAPI on RapidAPI). If the upstream API returns a non-200 status, the same status code and error message are forwarded to the client — no error swallowing.

---

### 4.1 Search Station

**`GET /api/train/search-station`**

Returns a list of stations matching a search string. Use this for autocomplete when a user types a station name.

**Query Parameters**

| Parameter | Type   | Required | Description                              |
|-----------|--------|----------|------------------------------------------|
| query     | string | ✅        | Partial or full station name to search   |

**Example Request**

```
GET /api/train/search-station?query=Mumbai
Authorization: Bearer <accessToken>
```

**Responses**

| Status | Meaning                            |
|--------|------------------------------------|
| 200    | Station list returned              |
| 400    | `query` parameter is missing       |
| 401    | Unauthorized                       |
| 429    | Rate limit exceeded                |
| 502    | Could not reach RapidAPI           |

**200 Response**

```json
{
  "status": true,
  "message": "Success",
  "data": [
    { "station_name": "MUMBAI CENTRAL", "station_code": "BCT" },
    { "station_name": "MUMBAI CST", "station_code": "CSTM" }
  ]
}
```

---

### 4.2 Search Train

**`GET /api/train/search-train`**

Returns trains matching a name or number query.

**Query Parameters**

| Parameter | Type   | Required | Description                              |
|-----------|--------|----------|------------------------------------------|
| query     | string | ✅        | Train name or number (full or partial)   |

**Example Request**

```
GET /api/train/search-train?query=Rajdhani
Authorization: Bearer <accessToken>
```

**Responses**

| Status | Meaning                            |
|--------|------------------------------------|
| 200    | Matching trains returned           |
| 400    | `query` parameter is missing       |
| 401    | Unauthorized                       |
| 429    | Rate limit exceeded                |
| 502    | Could not reach RapidAPI           |

**200 Response**

```json
{
  "status": true,
  "message": "Success",
  "data": [
    { "train_name": "RAJDHANI EXP", "train_no": "12951" },
    { "train_name": "AUGUST KRANTI RAJDHANI", "train_no": "12953" }
  ]
}
```

---

### 4.3 Trains Between Stations

**`GET /api/train/trains-between-stations`**

Returns all trains running between two stations on a specified date.

**Query Parameters**

| Parameter        | Type   | Required | Description                                  |
|------------------|--------|----------|----------------------------------------------|
| fromStationCode  | string | ✅        | Origin station code (e.g. `NDLS`)            |
| toStationCode    | string | ✅        | Destination station code (e.g. `BCT`)        |
| dateOfJourney    | string | ✅        | Date of journey in `DD-MM-YYYY` format. Must be today or a future date.       |

**Example Request**

```
GET /api/train/trains-between-stations?fromStationCode=NDLS&toStationCode=BCT&dateOfJourney=25-12-2025
Authorization: Bearer <accessToken>
```

**Responses**

| Status | Meaning                                                      |
|--------|--------------------------------------------------------------|
| 200    | Train list returned                                          |
| 400    | One or more required parameters are missing (listed in msg) |
| 401    | Unauthorized                                                 |
| 429    | Rate limit exceeded                                          |
| 502    | Could not reach RapidAPI                                     |

**400 Response (missing params)**

```json
{
  "status": "error",
  "message": "Missing required query parameter(s): toStationCode, dateOfJourney"
}
```

**200 Response**

```json
{
  "status": true,
  "message": "Success",
  "data": [
    {
      "train_no": "12951",
      "train_name": "MUMBAI RAJDHANI",
      "from": "NDLS",
      "to": "BCT",
      "departure": "16:55",
      "arrival": "08:15",
      "duration": "15:20"
    }
  ]
}
```

---

### 4.4 Seat Availability

**`GET /api/train/seat-availability`**

Returns seat availability for a specific train, class, and quota on a given date.

**Query Parameters**

| Parameter       | Type   | Required | Description                                        |
|-----------------|--------|----------|----------------------------------------------------|
| trainNo         | string | ✅        | Train number (e.g. `12951`)                        |
| fromStationCode | string | ✅        | Boarding station code                              |
| toStationCode   | string | ✅        | Destination station code                           |
| date            | string | ✅        | Date in `DD-MM-YYYY` format. Must be today or a future date.                        |
| classType       | string | ✅        | Class code — e.g. `2A`, `3A`, `SL`, `1A`, `CC`    |
| quota           | string | ✅        | Quota code — e.g. `GN`, `TQ`, `LD`, `PT`          |

**Example Request**

```
GET /api/train/seat-availability?trainNo=12951&fromStationCode=NDLS&toStationCode=BCT&date=25-12-2025&classType=3A&quota=GN
Authorization: Bearer <accessToken>
```

**Responses**

| Status | Meaning                                                       |
|--------|---------------------------------------------------------------|
| 200    | Availability data returned                                    |
| 400    | One or more required parameters are missing (listed in msg)  |
| 401    | Unauthorized                                                  |
| 429    | Rate limit exceeded                                           |
| 502    | Could not reach RapidAPI                                      |

**200 Response**

```json
{
  "status": true,
  "message": "Success",
  "data": [
    {
      "date": "25-12-2025",
      "available_seats": 42,
      "current_status": "AVAILABLE-42",
      "fare": 1550
    }
  ]
}
```

---

### 4.5 Train Schedule

**`GET /api/train/train-schedule`**

Returns the full station-wise schedule — arrival, departure, halt, and distance — for a given train.

**Query Parameters**

| Parameter | Type   | Required | Description           |
|-----------|--------|----------|-----------------------|
| trainNo   | string | ✅        | Train number          |

**Example Request**

```
GET /api/train/train-schedule?trainNo=12951
Authorization: Bearer <accessToken>
```

**Responses**

| Status | Meaning                       |
|--------|-------------------------------|
| 200    | Schedule returned             |
| 400    | `trainNo` is missing          |
| 401    | Unauthorized                  |
| 429    | Rate limit exceeded           |
| 502    | Could not reach RapidAPI      |

**200 Response**

```json
{
  "status": true,
  "message": "Success",
  "data": [
    {
      "station_name": "NEW DELHI",
      "station_code": "NDLS",
      "arrival": "Source",
      "departure": "16:55",
      "halt": "-",
      "distance": 0,
      "day": 1
    },
    {
      "station_name": "MUMBAI CENTRAL",
      "station_code": "BCT",
      "arrival": "08:15",
      "departure": "Destination",
      "halt": "-",
      "distance": 1384,
      "day": 2
    }
  ]
}
```

---

### 4.6 Live Status

**`GET /api/train/live-status`**

Returns the real-time running status of a train — current location, delay, and next station.

**Query Parameters**

| Parameter | Type   | Required | Description                                              |
|-----------|--------|----------|----------------------------------------------------------|
| trainNo   | string | ✅        | Train number                                             |
| startDay  | string | ✅        | Days since the train started its journey — `0`, `1`, `2` |

**Example Request**

```
GET /api/train/live-status?trainNo=12951&startDay=0
Authorization: Bearer <accessToken>
```

**Responses**

| Status | Meaning                                                      |
|--------|--------------------------------------------------------------|
| 200    | Live status returned                                         |
| 400    | One or more required parameters are missing (listed in msg) |
| 401    | Unauthorized                                                 |
| 429    | Rate limit exceeded                                          |
| 502    | Could not reach RapidAPI                                     |

**200 Response**

```json
{
  "status": true,
  "message": "Success",
  "data": {
    "train_no": "12951",
    "train_name": "MUMBAI RAJDHANI",
    "current_station": "KOTA JN",
    "delay": "10 minutes late",
    "last_update": "2025-12-25T09:30:00"
  }
}
```

---

### 4.7 PNR Status

**`GET /api/train/pnr-status`**

Returns the current booking status for a PNR — confirmed, waitlisted, or RAC — along with passenger details.

**Query Parameters**

| Parameter | Type   | Required | Description                         |
|-----------|--------|----------|-------------------------------------|
| pnrNumber | string | ✅        | 10-digit PNR number                 |

**Example Request**

```
GET /api/train/pnr-status?pnrNumber=1234567890
Authorization: Bearer <accessToken>
```

**Responses**

| Status | Meaning                    |
|--------|----------------------------|
| 200    | PNR status returned        |
| 400    | `pnrNumber` is missing     |
| 401    | Unauthorized               |
| 429    | Rate limit exceeded        |
| 502    | Could not reach RapidAPI   |

**200 Response**

```json
{
  "status": true,
  "message": "Success",
  "data": {
    "pnr": "1234567890",
    "train_no": "12951",
    "train_name": "MUMBAI RAJDHANI",
    "doj": "25-12-2025",
    "from": "NDLS",
    "to": "BCT",
    "class": "3A",
    "passengers": [
      {
        "serial_no": 1,
        "booking_status": "CNF/B3/42",
        "current_status": "CNF/B3/42"
      }
    ]
  }
}
```

---

### 4.8 Fare

**`GET /api/train/fare`**

Returns the fare for a train journey between two stations for a given class and quota.

**Query Parameters**

| Parameter       | Type   | Required | Description                                     |
|-----------------|--------|----------|-------------------------------------------------|
| trainNo         | string | ✅        | Train number                                    |
| fromStationCode | string | ✅        | Boarding station code                           |
| toStationCode   | string | ✅        | Destination station code                        |
| classType       | string | ✅        | Class code — e.g. `2A`, `3A`, `SL`, `1A`, `CC` |
| quota           | string | ✅        | Quota code — e.g. `GN`, `TQ`, `LD`, `PT`       |

**Example Request**

```
GET /api/train/fare?trainNo=12951&fromStationCode=NDLS&toStationCode=BCT&classType=3A&quota=GN
Authorization: Bearer <accessToken>
```

**Responses**

| Status | Meaning                                                       |
|--------|---------------------------------------------------------------|
| 200    | Fare details returned                                         |
| 400    | One or more required parameters are missing (listed in msg)  |
| 401    | Unauthorized                                                  |
| 429    | Rate limit exceeded                                           |
| 502    | Could not reach RapidAPI                                      |

**200 Response**

```json
{
  "status": true,
  "message": "Success",
  "data": {
    "train_no": "12951",
    "class_type": "3A",
    "quota": "GN",
    "fare": 1550,
    "tatkal_fare": 1920,
    "premium_tatkal_fare": 2100
  }
}
```

---

### 4.9 Trains By Station

**`GET /api/train/trains-by-station`**

Returns all trains that pass through a given station, along with their scheduled arrival and departure times.

**Query Parameters**

| Parameter   | Type   | Required | Description               |
|-------------|--------|----------|---------------------------|
| stationCode | string | ✅        | Station code (e.g. `NDLS`) |

**Example Request**

```
GET /api/train/trains-by-station?stationCode=NDLS
Authorization: Bearer <accessToken>
```

**Responses**

| Status | Meaning                     |
|--------|-----------------------------|
| 200    | Train list returned         |
| 400    | `stationCode` is missing    |
| 401    | Unauthorized                |
| 429    | Rate limit exceeded         |
| 502    | Could not reach RapidAPI    |

**200 Response**

```json
{
  "status": true,
  "message": "Success",
  "data": [
    {
      "train_no": "12951",
      "train_name": "MUMBAI RAJDHANI",
      "arrival": "08:15",
      "departure": "08:25",
      "halt": "10 min",
      "days": ["Mon", "Wed", "Fri"]
    }
  ]
}
```

---

### 4.10 Search Full (Aggregated)

**`GET /api/train/search-full`**

The power endpoint. Returns a complete IRCTC-style train listing for a route — every train with its departure, arrival, duration, days of operation, and full class-wise seat availability + fare, all in a single response.

Internally fans out to three RapidAPI endpoints per train and assembles the results server-side so the frontend never has to make more than one call.

**Internal call sequence**

```
1. GET /api/v3/trainBetweenStations              → list of trains on the route
2. GET /api/v1/checkSeatAvailability × N×C   ┐  run in a single
3. GET /api/v1/getFare            × N×C      ┘  Promise.allSettled
```

Where N = number of trains and C = number of classes each train advertises in its `class_type` field (e.g. `["CC","3E","3A"]`). Only the classes the train actually offers are queried — wasted API calls are avoided.

**Query Parameters**

| Parameter       | Type   | Required | Default | Description                              |
|-----------------|--------|----------|---------|------------------------------------------|
| fromStationCode | string | ✅        | —       | Origin station code (e.g. `NDLS`)        |
| toStationCode   | string | ✅        | —       | Destination station code (e.g. `BCT`)    |
| date            | string | ✅        | —       | Date of journey in `DD-MM-YYYY` format. Must be today or a future date. |
| quota           | string | no       | `GN`    | Quota code — `GN`, `TQ`, `LD`, `PT`     |

**Example Request**

```
GET /api/train/search-full?fromStationCode=NDLS&toStationCode=BCT&date=25-12-2025&quota=GN
Authorization: Bearer <accessToken>
```

**Caching behaviour**

Redis key: `train:search:{fromStationCode}:{toStationCode}:{date}:{quota}`
TTL: **300 seconds**

If the key exists the response is returned immediately with `"cached": true` and no RapidAPI calls are made.

**Responses**

| Status | Meaning                                                      |
|--------|--------------------------------------------------------------|
| 200    | Aggregated train data returned (live or cached)              |
| 400    | Missing parameter, invalid date format, or past date         |
| 401    | Unauthorized                                                 |
| 429    | Rate limit exceeded                                          |
| 502    | `trainBetweenStations` upstream call failed                  |

**200 Response — live fetch**

```json
{
  "status": "success",
  "cached": false,
  "data": [
    {
      "trainNo": "12951",
      "trainName": "MUMBAI RAJDHANI",
      "departure": "16:55",
      "arrival": "08:15",
      "duration": "15:20",
      "daysOfRunning": ["M", "T", "W", "Th", "F", "Sa", "Su"],
      "from": "NDLS",
      "to": "BCT",
      "classes": [
        {
          "type": "1A",
          "fare": 4560,
          "status": "AVAILABLE-4",
          "availableSeats": 4,
          "lastUpdated": "2025-12-20T10:00:00"
        },
        {
          "type": "2A",
          "fare": 2710,
          "status": "AVAILABLE-22",
          "availableSeats": 22,
          "lastUpdated": "2025-12-20T10:00:00"
        },
        {
          "type": "3A",
          "fare": 1920,
          "status": "WL#12",
          "availableSeats": 0,
          "lastUpdated": "2025-12-20T10:00:00"
        }
      ]
    }
  ]
}
```

**200 Response — cache hit**

```json
{
  "status": "success",
  "cached": true,
  "data": [ ... ]
}
```

**400 Response — missing parameter**

```json
{
  "status": "error",
  "message": "Missing required query parameter(s): toStationCode, date"
}
```

**400 Response — past date**

```json
{
  "status": "error",
  "message": "'date' must be today or a future date."
}
```

**502 Response**

```json
{
  "status": "error",
  "message": "Failed to fetch train list from provider. Please try again."
}
```

**Notes**

- Classes that return an error or no data from RapidAPI are silently skipped — they do not appear in `classes` and do not fail the response.
- `daysOfRunning` uses abbreviated day names: `M T W Th F Sa Su`.
- `availableSeats` is `null` when the upstream response does not include a seat count (e.g. waitlisted classes).
- `fare` is `null` when the fare call fails for that specific class.

---

## 5. Health Check

**`GET /health`**

Returns server health including MongoDB and Redis connection status. No authentication required — safe for load-balancer probes.

**200 Response (healthy)**

```json
{
  "status": "ok",
  "uptime": 123.45,
  "database": "connected",
  "redis": "connected",
  "timestamp": "2024-08-15T10:00:00.000Z"
}
```

**503 Response (degraded)**

```json
{
  "status": "degraded",
  "uptime": 123.45,
  "database": "disconnected",
  "redis": "connected",
  "timestamp": "2024-08-15T10:00:00.000Z"
}
```

---

## 6. Error Format

All error responses use this consistent shape:

```json
{
  "status": "error",
  "message": "Human-readable description of what went wrong."
}
```

Some responses include extra fields:

```json
{
  "status": "error",
  "message": "Please wait at least 60 seconds before requesting a new OTP.",
  "retryAfter": 45
}
```

```json
{
  "status": "error",
  "message": "Please verify your email before logging in.",
  "userId": "64f1a2b3c4d5e6f7a8b9c0d1"
}
```

---

## 7. Middleware Stack & Security Model

### Request Pipeline

```
Incoming Request
  ├─ helmet()              — security headers (CSP, HSTS, etc.)
  ├─ cors()                — origin whitelist from ALLOWED_ORIGINS
  ├─ express.json()        — body parsing, 10kb limit
  ├─ cookieParser()        — parses refreshToken cookie
  └─ mongoSanitize()       — strips $ and . keys (NoSQL injection)
       │
       ├─ /api/auth/*      — public (no auth required)
       │
       ├─ /api/profile/*
       │    ├─ verifyJWT
       │    └─ emailVerifiedGate
       │
       ├─ /api/train/*
       │    ├─ apiLimiter (100 req/15 min per IP)
       │    └─ verifyJWT
       │
       └─ /api/ticket/*
            ├─ redisRateLimiter
            ├─ fingerprintMiddleware
            ├─ verifyJWT
            ├─ emailVerifiedGate
            ├─ aadhaarVerifiedGate
            ├─ attachAadhaarHash   ← fetches aadhaarHash from DB
            └─ quotaCheck          ← uses req.aadhaarHash
```

### Token Lifecycle

| Token         | Expiry | Transport                         | Server-side storage              |
|---------------|--------|-----------------------------------|----------------------------------|
| Access token  | 15 min | `Authorization: Bearer` header    | None (stateless JWT)             |
| Refresh token | 7 days | `Set-Cookie: refreshToken`        | Redis `refresh:<userId>` (for revocation) |

### Device Fingerprinting

Each request fingerprint is `SHA-256(IP | User-Agent | Accept-Language)`.

- New fingerprint on login → security alert email sent (fire-and-forget)
- Ban a device: `SET banned:device:<hash> 1` in Redis

### Quota Enforcement

| Scope   | Limit              | Compound index used            |
|---------|--------------------|--------------------------------|
| Aadhaar | 4 tickets / event  | `{ aadhaarHash: 1, eventId: 1 }` |
| Account | 6 tickets / event  | `{ userId: 1, eventId: 1 }`    |

Redis lock key: `lock:booking:<userId>:<eventId>` — TTL 30 seconds, SET NX.

---

## 8. Sandbox.co.in Auth Flow

Sandbox.co.in uses a **two-step authentication** flow. Credentials are never passed directly to KYC endpoints.

### Step 1 — Exchange credentials for an access token

```
POST https://api.sandbox.co.in/authenticate

Headers:
  x-api-key:     <SANDBOX_API_KEY>
  x-api-secret:  <SANDBOX_API_SECRET>
  x-api-version: 1.0.0
  Content-Type:  application/json

Response:
{
  "code": 200,
  "data": {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  },
  "timestamp": 1750687659809,
  "transaction_id": "3a31716a-6a4d-4670-83fe-849d8209e35a"
}
```

The `access_token` is valid for **24 hours**. It is cached in Redis under `sandbox:auth:token` with a **23-hour TTL** to automatically refresh 1 hour before expiry.

### Step 2 — Call KYC endpoints with the token

```
POST https://api.sandbox.co.in/kyc/aadhaar/okyc/otp

Headers:
  x-api-key:     <SANDBOX_API_KEY>
  authorization: <access_token>        ← NO "Bearer" prefix
  x-api-version: 1.0.0
  Content-Type:  application/json

Body:
{
  "@entity": "in.co.sandbox.kyc.aadhaar.okyc.otp.request",
  "aadhaar_number": "123456789012",
  "consent": "y",
  "reason": "For KYC verification on Yatrasetu"
}
```

> **Critical:** The `authorization` header takes the raw token value — do **not** prepend `Bearer `.

### Step 3 — Verify OTP

```
POST https://api.sandbox.co.in/kyc/aadhaar/okyc/otp/verify

Headers: (same as Step 2)

Body:
{
  "@entity": "in.co.sandbox.kyc.aadhaar.okyc.request",
  "reference_id": "1234567",
  "otp": "121212"
}
```

### Automatic token refresh on expiry

If a cached token expires between being stored and used (race condition), the server automatically clears the Redis cache and re-authenticates once:

```
sandboxPost() → 401 or 403 from Sandbox
  └─ DEL sandbox:auth:token from Redis
  └─ Re-authenticate (Step 1) → new token cached
  └─ Retry the original KYC call
```

### Correct `@entity` values

| Endpoint          | `@entity` value                                     |
|-------------------|-----------------------------------------------------|
| Generate OTP      | `in.co.sandbox.kyc.aadhaar.okyc.otp.request`        |
| Verify OTP        | `in.co.sandbox.kyc.aadhaar.okyc.request`            |

> **Common mistake:** Old Sandbox docs used underscore-separated entity names like `in.co.sandbox.kyc.aadhaar_okyc.request.OkycOtpGenerationRequest`. These are invalid on the new console and will return 403.

### Sandbox credentials in `.env`

| Variable              | Description                                                      |
|-----------------------|------------------------------------------------------------------|
| `SANDBOX_API_KEY`     | Public API key — sent with every request as `x-api-key`         |
| `SANDBOX_API_SECRET`  | Secret key — used **only** in Step 1 to obtain the access token |

Get both from: [console.sandbox.co.in](https://console.sandbox.co.in) → Settings → API Keys.

> Ensure Aadhaar OKYC is activated for your workspace. A 403 "Insufficient privilege" after successful authentication means the product is not enabled — go to your workspace → KYC → Aadhaar OKYC and activate it.

---

## 9. Environment Variables

| Variable              | Required | Description                                                        |
|-----------------------|----------|--------------------------------------------------------------------|
| `PORT`                | no       | HTTP server port (default: `5000`)                                 |
| `NODE_ENV`            | no       | `development` or `production`                                      |
| `MONGODB_URI`         | ✅        | MongoDB Atlas connection string                                    |
| `ALLOWED_ORIGINS`     | ✅        | Comma-separated CORS origins (e.g. `http://localhost:3000`)        |
| `FRONTEND_URL`        | ✅        | Base URL used in email links (e.g. `http://localhost:3000`)        |
| `REDIS_URL`           | ✅        | Redis URL — use `rediss://` for TLS (Upstash requires this)        |
| `JWT_SECRET`          | ✅        | Secret for signing 15-min access tokens (min 32 chars)             |
| `JWT_REFRESH_SECRET`  | ✅        | Secret for signing 7-day refresh tokens (must differ from above)   |
| `AADHAAR_SALT`        | ✅        | Salt for SHA-256 Aadhaar hashing — **never change after first use**|
| `SMTP_HOST`           | ✅        | SES SMTP hostname (e.g. `email-smtp.ap-south-1.amazonaws.com`)     |
| `SMTP_PORT`           | ✅        | `587` (STARTTLS) or `465` (implicit TLS)                           |
| `SMTP_USER`           | ✅        | SES SMTP username (from SES Console → SMTP settings)               |
| `SMTP_PASS`           | ✅        | SES SMTP password (from SES Console → SMTP settings)               |
| `EMAIL_FROM`          | ✅        | Verified SES sender address (e.g. `noreply@yourdomain.com`)        |
| `EMAIL_FROM_NAME`     | no       | Display name for outgoing emails (default: `Yatrasetu`)            |
| `SANDBOX_API_KEY`     | ✅        | Sandbox.co.in public API key                                       |
| `SANDBOX_API_SECRET`  | ✅        | Sandbox.co.in secret — used only to obtain a short-lived JWT       |
| `RAPIDAPI_KEY`        | ✅        | RapidAPI key for IRCTC irctc1 API — from rapidapi.com dashboard    |
| `RAPIDAPI_HOST`       | ✅        | RapidAPI host — must be `irctc1.p.rapidapi.com`                    |

> **SMTP note:** SES SMTP credentials are separate from IAM access keys. Generate them at:
> AWS Console → SES → SMTP settings → Create SMTP credentials.
>
> **AADHAAR_SALT note:** Changing this after any user has verified their Aadhaar will permanently invalidate all existing Aadhaar hashes and break duplicate-account detection.
>
> **Sandbox note:** `SANDBOX_API_SECRET` is only used once per 24 hours to fetch an access token. It is never sent to KYC endpoints directly.
>
> **RAPIDAPI_KEY note:** Get your key from [rapidapi.com](https://rapidapi.com) → search for `irctc1` → Subscribe to a plan → copy the key from the Code Snippets panel. Never commit this value to version control.
