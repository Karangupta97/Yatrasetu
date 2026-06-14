import { ILocalTicket } from "../models/LocalTicket.js";
import { IExpressTicket } from "../models/ExpressTicket.js";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ValidityResult {
  isValid: boolean;
  reason: string;
  expiresAt: Date;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Shift a UTC Date into IST by adding the +5:30 (330-minute) offset.
 * The returned Date's numeric value represents the IST wall-clock time
 * expressed as if it were UTC — useful only for reading .getHours() etc.
 */
export function toIST(date: Date): Date {
  return new Date(date.getTime() + 330 * 60 * 1000);
}

/**
 * Return the UTC instant that corresponds to IST midnight of the day
 * that is `days` calendar days after `date`.
 */
export function istMidnightOffsetDays(date: Date, days: number): Date {
  const futureDate = new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
  return istMidnight(futureDate);
}

/** Return the UTC instant corresponding to IST midnight of the same IST day as `date`. */
function istMidnight(date: Date): Date {
  const ist = toIST(date);
  ist.setHours(0, 0, 0, 0); // zero out in IST wall-clock
  return new Date(ist.getTime() - 330 * 60 * 1000); // back to UTC
}

// ── Validity checkers ─────────────────────────────────────────────────────────

/**
 * Determine whether a local (suburban / UTS) ticket is currently valid.
 *
 * Rules (Requirements 7.1 – 7.6):
 *  - Ticket must be ACTIVE.
 *  - ONE_WAY: valid for 1 hour from purchasedAt.
 *  - RETURN:  valid until midnight IST of the next calendar day, extended to
 *             Monday midnight when purchased on Friday (3 days) or Saturday (2 days).
 */
export function isLocalTicketValid(ticket: ILocalTicket): ValidityResult {
  if (ticket.status !== "ACTIVE") {
    return {
      isValid: false,
      reason: `Ticket is ${ticket.status}`,
      expiresAt: ticket.purchasedAt,
    };
  }

  const now = new Date();
  const purchased = ticket.purchasedAt;

  if (ticket.ticketType === "ONE_WAY") {
    const expiresAt = new Date(purchased.getTime() + 60 * 60 * 1000); // +1 hour
    if (now > expiresAt) {
      return { isValid: false, reason: "Ticket has expired (1-hour window)", expiresAt };
    }
    return { isValid: true, reason: "Valid", expiresAt };
  }

  // RETURN ticket — expiry depends on the day-of-week in IST
  const purchasedIST = toIST(purchased);
  const dayOfWeek = purchasedIST.getDay(); // 0=Sun … 5=Fri, 6=Sat

  let returnExpiry: Date;
  if (dayOfWeek === 5) {
    // Friday → extend to Monday midnight IST (3 days ahead)
    returnExpiry = istMidnightOffsetDays(purchased, 3);
  } else if (dayOfWeek === 6) {
    // Saturday → extend to Monday midnight IST (2 days ahead)
    returnExpiry = istMidnightOffsetDays(purchased, 2);
  } else {
    // Any other day → next day midnight IST
    returnExpiry = istMidnightOffsetDays(purchased, 1);
  }

  if (now > returnExpiry) {
    return { isValid: false, reason: "Return ticket has expired", expiresAt: returnExpiry };
  }
  return { isValid: true, reason: "Valid", expiresAt: returnExpiry };
}

/**
 * Determine whether an express (inter-city / reserved) ticket is currently valid.
 *
 * Rules (Requirements 8.1 – 8.5):
 *  - Ticket must be ACTIVE.
 *  - RESERVED_ONE_WAY / RESERVED_RETURN: valid only on journeyDate (IST day match).
 *  - UNRESERVED_ONE_WAY with distanceKm < 200: valid for 3 hours from purchasedAt.
 *  - UNRESERVED_ONE_WAY with distanceKm ≥ 200: valid only on the IST purchase date.
 */
export function isExpressTicketValid(ticket: IExpressTicket): ValidityResult {
  if (ticket.ticketStatus !== "ACTIVE") {
    return {
      isValid: false,
      reason: `Ticket is ${ticket.ticketStatus}`,
      expiresAt: ticket.purchasedAt,
    };
  }

  const now = new Date();

  if (
    ticket.ticketSubType === "RESERVED_ONE_WAY" ||
    ticket.ticketSubType === "RESERVED_RETURN"
  ) {
    const todayIST = toIST(now);
    const journeyIST = toIST(ticket.journeyDate);
    const sameDay =
      todayIST.getFullYear() === journeyIST.getFullYear() &&
      todayIST.getMonth() === journeyIST.getMonth() &&
      todayIST.getDate() === journeyIST.getDate();

    if (!sameDay) {
      return {
        isValid: false,
        reason: "Journey date does not match today",
        expiresAt: ticket.journeyDate,
      };
    }
    return { isValid: true, reason: "Valid", expiresAt: ticket.journeyDate };
  }

  if (ticket.ticketSubType === "UNRESERVED_ONE_WAY") {
    if (ticket.distanceKm < 200) {
      const expiresAt = new Date(ticket.purchasedAt.getTime() + 3 * 60 * 60 * 1000); // +3 hours
      if (now > expiresAt) {
        return {
          isValid: false,
          reason: "Ticket expired (3-hour window for <200km)",
          expiresAt,
        };
      }
      return { isValid: true, reason: "Valid", expiresAt };
    } else {
      // distanceKm ≥ 200: valid only on the IST calendar day of purchase
      const todayIST = toIST(now);
      const purchasedIST = toIST(ticket.purchasedAt);
      const sameDay =
        todayIST.getFullYear() === purchasedIST.getFullYear() &&
        todayIST.getMonth() === purchasedIST.getMonth() &&
        todayIST.getDate() === purchasedIST.getDate();
      const expiresAt = istMidnightOffsetDays(ticket.purchasedAt, 1);

      if (!sameDay) {
        return {
          isValid: false,
          reason: "Ticket expired (valid only on purchase date for ≥200km)",
          expiresAt,
        };
      }
      return { isValid: true, reason: "Valid", expiresAt };
    }
  }

  return { isValid: false, reason: "Unknown ticket sub-type", expiresAt: ticket.purchasedAt };
}
