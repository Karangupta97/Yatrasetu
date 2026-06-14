import type { LocalTcDashboardData } from "@/types/localTc";

export const IDLE_LOCAL_TC_DATA: LocalTcDashboardData = {
  route: {
    zone: "—",
    route: "—",
    routeLabel: "Start duty to load route",
    currentStation: "—",
    currentStationCode: "—",
    nextStation: "—",
    nextStationCode: "—",
    direction: "—",
    progress: 0,
    shift: "—",
    dutyStart: "—",
    dutyEnd: "—",
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
  passSummary: {
    dailyPass: 0,
    monthlyPass: 0,
    quarterlyPass: 0,
    yearlyPass: 0,
    studentPass: 0,
    trends: {
      dailyPass: 0,
      monthlyPass: 0,
      quarterlyPass: 0,
      yearlyPass: 0,
      studentPass: 0,
    },
  },
  recentVerifications: [],
  revenue: {
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
  },
  alerts: [],
  profile: {
    name: "Rahul Kumar",
    id: "TC1024",
    avatarInitials: "RK",
  },
  notificationCount: 0,
  stationSequence: [],
  stationCodes: [],
};
