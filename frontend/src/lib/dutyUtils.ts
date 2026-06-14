"use client";

import type { TicketPassengerData } from "@/types/expressTc";
import { formatScanTimestamp } from "@/lib/ticketParse";

let verificationCounter = 0;

export function createVerificationFromTicket(
  ticket: TicketPassengerData,
  timestamp?: string,
) {
  verificationCounter += 1;
  return {
    id: `rv-scan-${verificationCounter}-${Date.now()}`,
    passenger: ticket.passenger,
    pnr: ticket.pnr,
    coachBerth: ticket.coachBerth,
    source: ticket.source,
    destination: ticket.destination,
    status: ticket.status,
    time: timestamp ?? formatScanTimestamp(),
  };
}

export function formatDutyStartTime(): string {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
