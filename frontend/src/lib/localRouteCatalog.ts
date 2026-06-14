import type { LocalTcDashboardData } from "@/types/localTc";

export type LocalRouteEntry = Omit<
  LocalTcDashboardData,
  "profile" | "notificationCount"
>;

export const RAILWAY_ZONES = [
  "Central Railway",
  "Western Railway",
  "Southern Railway",
  "Northern Railway",
  "Eastern Railway",
  "South Central Railway",
  "South Eastern Railway",
  "North Western Railway",
  "East Central Railway",
  "West Central Railway",
] as const;

export const SHIFTS = ["Morning", "Evening", "Night", "Full Day"] as const;

const WR_CHURCHGATE_VIRAR: LocalRouteEntry = {
  route: {
    zone: "Western Railway",
    route: "Churchgate – Virar",
    routeLabel: "Churchgate ⇌ Virar",
    currentStation: "Bandra",
    currentStationCode: "BA",
    nextStation: "Santacruz",
    nextStationCode: "STC",
    direction: "Up (Churchgate → Virar)",
    progress: 45,
    shift: "Morning",
    dutyStart: "06:00 AM",
    dutyEnd: "02:00 PM",
  },
  summary: {
    ticketsChecked: 256,
    validTickets: 198,
    invalidTickets: 58,
    revenueRecovered: 5680,
    trends: {
      ticketsChecked: 18,
      validTickets: 16,
      invalidTickets: -10,
      revenueRecovered: 22,
    },
  },
  passSummary: {
    dailyPass: 86,
    monthlyPass: 124,
    quarterlyPass: 42,
    yearlyPass: 18,
    studentPass: 36,
    trends: {
      dailyPass: 15,
      monthlyPass: 12,
      quarterlyPass: 8,
      yearlyPass: 10,
      studentPass: 18,
    },
  },
  recentVerifications: [
    {
      id: "lv-1",
      time: "10:45 AM",
      ticketType: "single_journey",
      ticketNumber: "UTS-4829173",
      source: "Bandra",
      destination: "Andheri",
      fare: 20,
      status: "valid",
      isPass: false,
    },
    {
      id: "lv-2",
      time: "10:42 AM",
      ticketType: "daily_pass",
      ticketNumber: "DP-7392041",
      source: "Virar",
      destination: "Churchgate",
      fare: 120,
      status: "valid",
      isPass: false,
    },
    {
      id: "lv-3",
      time: "10:38 AM",
      ticketType: "monthly_pass",
      passengerName: "Priya Patel",
      source: "Borivali",
      destination: "Churchgate",
      validity: "01 Jun – 30 Jun 2026",
      status: "valid",
      isPass: true,
    },
    {
      id: "lv-4",
      time: "10:35 AM",
      ticketType: "return",
      ticketNumber: "UTS-6284017",
      source: "Andheri",
      destination: "Bandra",
      fare: 40,
      status: "invalid",
      isPass: false,
    },
    {
      id: "lv-5",
      time: "10:30 AM",
      ticketType: "platform",
      ticketNumber: "PT-3947182",
      source: "Dadar",
      destination: "Dadar",
      fare: 10,
      status: "valid",
      isPass: false,
    },
  ],
  revenue: {
    today: 5680,
    thisWeek: 28450,
    thisMonth: 124780,
  },
  alerts: [
    {
      id: "la-1",
      type: "invalid",
      title: "Invalid ticket detected",
      message: "Invalid ticket detected at Bandra — UTS-6284017",
      time: "10:35 AM",
      read: false,
    },
    {
      id: "la-2",
      type: "expired_pass",
      title: "Expired pass detected",
      message: "Monthly pass expired for passenger at Santacruz",
      time: "10:28 AM",
      read: false,
    },
    {
      id: "la-3",
      type: "duplicate",
      title: "Duplicate ticket attempted",
      message: "Duplicate UTS mobile ticket scan at Andheri",
      time: "10:22 AM",
      read: false,
    },
    {
      id: "la-4",
      type: "system",
      title: "System update scheduled",
      message: "UTS sync maintenance tonight 11:00 PM – 12:00 AM",
      time: "09:00 AM",
      read: true,
    },
  ],
  stationSequence: [
    "Churchgate",
    "Marine Lines",
    "Charni Road",
    "Grant Road",
    "Mumbai Central",
    "Dadar",
    "Bandra",
    "Santacruz",
    "Vile Parle",
    "Andheri",
    "Borivali",
    "Virar",
  ],
  stationCodes: ["CCG", "MEL", "CYR", "GTR", "BCL", "DDR", "BA", "STC", "VLP", "ADH", "BVI", "VR"],
};

const CR_CSMT_KALYAN: LocalRouteEntry = {
  route: {
    zone: "Central Railway",
    route: "CSMT – Kalyan",
    routeLabel: "CSMT ⇌ Kalyan",
    currentStation: "Dadar",
    currentStationCode: "DR",
    nextStation: "Kurla",
    nextStationCode: "CLA",
    direction: "Up (CSMT → Kalyan)",
    progress: 35,
    shift: "Morning",
    dutyStart: "06:00 AM",
    dutyEnd: "02:00 PM",
  },
  summary: {
    ticketsChecked: 0,
    validTickets: 0,
    invalidTickets: 0,
    revenueRecovered: 0,
    trends: { ticketsChecked: 0, validTickets: 0, invalidTickets: 0, revenueRecovered: 0 },
  },
  passSummary: {
    dailyPass: 0,
    monthlyPass: 0,
    quarterlyPass: 0,
    yearlyPass: 0,
    studentPass: 0,
    trends: { dailyPass: 0, monthlyPass: 0, quarterlyPass: 0, yearlyPass: 0, studentPass: 0 },
  },
  recentVerifications: [],
  revenue: { today: 0, thisWeek: 18200, thisMonth: 86400 },
  alerts: [],
  stationSequence: ["CSMT", "Masjid", "Sandhurst Road", "Byculla", "Dadar", "Kurla", "Ghatkopar", "Thane", "Kalyan"],
  stationCodes: ["CSMT", "MSD", "SNRD", "BY", "DR", "CLA", "GC", "TNA", "KYN"],
};

export const LOCAL_ROUTE_CATALOG: Record<string, LocalRouteEntry> = {
  "Western Railway|Churchgate – Virar": WR_CHURCHGATE_VIRAR,
  "Central Railway|CSMT – Kalyan": CR_CSMT_KALYAN,
};

export function getRoutesForZone(zone: string): string[] {
  return Object.keys(LOCAL_ROUTE_CATALOG)
    .filter((key) => key.startsWith(`${zone}|`))
    .map((key) => key.split("|")[1]!);
}

export function lookupLocalRoute(zone: string, route: string): LocalRouteEntry | null {
  return LOCAL_ROUTE_CATALOG[`${zone}|${route}`] ?? null;
}

export function findStationIndex(data: LocalTcDashboardData): number {
  const idx = data.stationSequence.indexOf(data.route.currentStation);
  return idx >= 0 ? idx : 0;
}
