import type { LocalTicketData, LocalTicketType, VerificationStatus } from "@/types/localTc";
import { isPassTicketType } from "@/types/localTc";
import { formatScanTimestamp } from "@/lib/ticketParse";

const SAMPLE_TICKETS: LocalTicketData[] = [
  {
    ticketType: "single_journey",
    ticketNumber: "UTS-4829173",
    source: "Bandra",
    destination: "Andheri",
    fare: 20,
    issueTime: "10:40 AM",
    expiryTime: "11:40 AM",
    status: "valid",
  },
  {
    ticketType: "monthly_pass",
    ticketNumber: "MP-7392041",
    passengerName: "Priya Patel",
    source: "Borivali",
    destination: "Churchgate",
    validity: "01 Jun – 30 Jun 2026",
    status: "valid",
  },
  {
    ticketType: "return",
    ticketNumber: "UTS-1058472",
    source: "Andheri",
    destination: "Bandra",
    fare: 40,
    issueTime: "09:15 AM",
    expiryTime: "09:15 PM",
    status: "invalid",
  },
];

export function parseLocalTicketPayload(raw: string): LocalTicketData | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  try {
    const json = JSON.parse(trimmed) as Partial<LocalTicketData>;
    if (json.ticketType && json.ticketNumber) {
      const ticketType = json.ticketType as LocalTicketType;
      return {
        ticketType,
        ticketNumber: json.ticketNumber,
        passengerName: isPassTicketType(ticketType) ? json.passengerName : undefined,
        source: json.source ?? "—",
        destination: json.destination ?? "—",
        fare: json.fare,
        issueTime: json.issueTime,
        expiryTime: json.expiryTime,
        validity: json.validity,
        status: (json.status as VerificationStatus) ?? "valid",
      };
    }
  } catch {
    // fall through
  }

  const idMatch = trimmed.match(/\b(UTS|DP|MP|QP|YP|SP|PT)-[\dA-Z]+\b/i);
  if (idMatch) {
    const prefix = idMatch[1].toUpperCase();
    const typeMap: Record<string, LocalTicketType> = {
      UTS: "uts_mobile",
      DP: "daily_pass",
      MP: "monthly_pass",
      QP: "quarterly_pass",
      YP: "yearly_pass",
      SP: "student_pass",
      PT: "platform",
    };
    const ticketType = typeMap[prefix] ?? "single_journey";
    const sample = SAMPLE_TICKETS.find((t) => t.ticketNumber.includes(prefix)) ?? SAMPLE_TICKETS[0];
    return {
      ...sample,
      ticketNumber: idMatch[0],
      ticketType,
    };
  }

  return null;
}

export function getSimulatedLocalTicket(): LocalTicketData {
  const index = Math.floor(Date.now() / 1000) % SAMPLE_TICKETS.length;
  return { ...SAMPLE_TICKETS[index] };
}

export { formatScanTimestamp };
