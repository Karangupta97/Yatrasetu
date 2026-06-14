import type { ExpressTcDashboardData } from "@/types/expressTc";
import { INITIAL_EXPRESS_TC_DATA } from "./mockExpressTcData";

export type TrainCatalogEntry = Omit<
  ExpressTcDashboardData,
  "profile" | "notificationCount"
>;

const TRAIN_12951: TrainCatalogEntry = {
  journey: {
    trainNumber: "12951",
    route: "Mumbai CSMT → New Delhi",
    journeyDate: "14 Jun 2026",
    boardingPoint: "Mumbai CSMT",
    dutyStart: "06:00 AM",
    dutyEnd: "10:35 PM",
    currentStation: "Mumbai CSMT",
    currentStationCode: "CSMT",
    nextStation: "Borivali",
    nextStationCode: "BVI",
    eta: "06:45 AM",
    progress: 0,
  },
  summary: {
    ticketsChecked: 0,
    validTickets: 0,
    invalidTickets: 0,
    revenueRecovered: 0,
    trends: { ticketsChecked: 0, validTickets: 0, invalidTickets: 0, revenueRecovered: 0 },
  },
  recentVerifications: [],
  revenue: { today: 0, thisWeek: 42100, thisMonth: 198400, totalChallans: 28 },
  coaches: [
    { code: "A1", capacity: 54, verified: 0, status: "not_started" },
    { code: "A2", capacity: 54, verified: 0, status: "not_started" },
    { code: "B1", capacity: 72, verified: 0, status: "not_started" },
    { code: "B2", capacity: 72, verified: 0, status: "not_started" },
    { code: "S1", capacity: 80, verified: 0, status: "not_started" },
    { code: "S2", capacity: 80, verified: 0, status: "not_started" },
  ],
  alerts: [],
  stationSequence: [
    "Mumbai CSMT",
    "Borivali",
    "Surat",
    "Vadodara Jn",
    "Ratlam Jn",
    "New Delhi",
  ],
  stationCodes: ["CSMT", "BVI", "ST", "BRC", "RTM", "NDLS"],
  stationEtas: ["06:00 AM", "06:45 AM", "09:30 AM", "11:40 AM", "02:40 PM", "10:35 PM"],
};

const TRAIN_12295: TrainCatalogEntry = {
  journey: INITIAL_EXPRESS_TC_DATA.journey,
  summary: INITIAL_EXPRESS_TC_DATA.summary,
  recentVerifications: INITIAL_EXPRESS_TC_DATA.recentVerifications,
  revenue: INITIAL_EXPRESS_TC_DATA.revenue,
  coaches: INITIAL_EXPRESS_TC_DATA.coaches,
  alerts: INITIAL_EXPRESS_TC_DATA.alerts,
  stationSequence: INITIAL_EXPRESS_TC_DATA.stationSequence,
  stationCodes: INITIAL_EXPRESS_TC_DATA.stationCodes,
  stationEtas: INITIAL_EXPRESS_TC_DATA.stationEtas,
};

export const TRAIN_CATALOG: Record<string, TrainCatalogEntry> = {
  "12295": TRAIN_12295,
  "12951": TRAIN_12951,
};

export function lookupTrainData(trainNumber: string): TrainCatalogEntry | null {
  const key = trainNumber.trim();
  return TRAIN_CATALOG[key] ?? null;
}

export function getSupportedTrainNumbers(): string[] {
  return Object.keys(TRAIN_CATALOG);
}
