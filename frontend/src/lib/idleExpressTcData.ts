import type { ExpressTcDashboardData } from "@/types/expressTc";

export const IDLE_EXPRESS_TC_DATA: ExpressTcDashboardData = {
  journey: {
    trainNumber: "—",
    route: "Start duty to load train",
    journeyDate: "—",
    boardingPoint: "—",
    dutyStart: "—",
    dutyEnd: "—",
    currentStation: "—",
    currentStationCode: "—",
    nextStation: "—",
    nextStationCode: "—",
    eta: "—",
    progress: 0,
  },
  summary: {
    ticketsChecked: 0,
    validTickets: 0,
    invalidTickets: 0,
    revenueRecovered: 0,
    trends: {
      ticketsChecked: 0,
      validTickets: 0,
      invalidTickets: 0,
      revenueRecovered: 0,
    },
  },
  recentVerifications: [],
  revenue: {
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    totalChallans: 0,
  },
  coaches: [],
  alerts: [],
  profile: {
    name: "Rahul Kumar",
    id: "TC1024",
    avatarInitials: "RK",
  },
  notificationCount: 0,
  stationSequence: [],
  stationCodes: [],
  stationEtas: [],
};
