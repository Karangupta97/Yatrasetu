import type { LocalTicketData, LocalVerification } from "@/types/localTc";
import { isPassTicketType } from "@/types/localTc";
import { formatScanTimestamp } from "@/lib/localTicketParse";

let verificationCounter = 0;

export function createLocalVerificationFromTicket(
  ticket: LocalTicketData,
  timestamp?: string,
): LocalVerification {
  verificationCounter += 1;
  const isPass = isPassTicketType(ticket.ticketType);

  return {
    id: `lv-scan-${verificationCounter}-${Date.now()}`,
    time: timestamp ?? formatScanTimestamp(),
    ticketType: ticket.ticketType,
    ticketNumber: ticket.ticketNumber,
    passengerName: isPass ? ticket.passengerName : undefined,
    source: ticket.source,
    destination: ticket.destination,
    fare: ticket.fare,
    issueTime: ticket.issueTime,
    expiryTime: ticket.expiryTime,
    validity: ticket.validity,
    status: ticket.status,
    isPass,
  };
}

export function formatDutyStartTime(): string {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
