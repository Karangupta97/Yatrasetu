import type { TicketPassengerData, VerificationStatus } from "@/types/expressTc";

const SAMPLE_TICKETS: TicketPassengerData[] = [
  {
    passenger: "Rahul Sharma",
    pnr: "4829173645",
    coachBerth: "A1 / S12",
    source: "Mumbai CSMT",
    destination: "New Delhi",
    status: "valid",
  },
  {
    passenger: "Priya Patel",
    pnr: "7392041856",
    coachBerth: "B1 / L34",
    source: "Mumbai CSMT",
    destination: "New Delhi",
    status: "valid",
  },
  {
    passenger: "Amit Kumar",
    pnr: "1058472931",
    coachBerth: "S2 / 48",
    source: "Nagpur",
    destination: "Bhopal",
    status: "invalid",
  },
];

export function formatScanTimestamp(): string {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function parseTicketPayload(raw: string): TicketPassengerData | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  try {
    const json = JSON.parse(trimmed) as Partial<TicketPassengerData>;
    if (json.pnr && json.passenger) {
      return {
        passenger: json.passenger,
        pnr: json.pnr,
        coachBerth: json.coachBerth ?? "—",
        source: json.source ?? "—",
        destination: json.destination ?? "—",
        status: (json.status as VerificationStatus) ?? "valid",
      };
    }
  } catch {
    // fall through to pattern parsing
  }

  const pnrMatch = trimmed.match(/\b(\d{10})\b/);
  if (!pnrMatch) return null;

  const sample = SAMPLE_TICKETS.find((t) => t.pnr === pnrMatch[1]) ?? {
    passenger: "Passenger",
    pnr: pnrMatch[1],
    coachBerth: "—",
    source: "—",
    destination: "—",
    status: "valid" as VerificationStatus,
  };

  return { ...sample };
}

export function getSimulatedTicket(): TicketPassengerData {
  const index = Math.floor(Date.now() / 1000) % SAMPLE_TICKETS.length;
  return { ...SAMPLE_TICKETS[index] };
}
