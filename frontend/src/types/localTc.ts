export type VerificationStatus = "valid" | "invalid" | "duplicate" | "pending";

export type LocalTicketType =
  | "single_journey"
  | "return"
  | "platform"
  | "uts_mobile"
  | "daily_pass"
  | "monthly_pass"
  | "quarterly_pass"
  | "yearly_pass"
  | "student_pass";

export type LocalAlertType = "invalid" | "expired_pass" | "duplicate" | "system";

export type PassTicketType = "monthly_pass" | "quarterly_pass" | "yearly_pass" | "student_pass";

export interface RouteState {
  zone: string;
  route: string;
  routeLabel: string;
  currentStation: string;
  currentStationCode: string;
  nextStation: string;
  nextStationCode: string;
  direction: string;
  progress: number;
  shift: string;
  dutyStart: string;
  dutyEnd: string;
}

export interface SummaryStats {
  ticketsChecked: number;
  validTickets: number;
  invalidTickets: number;
  revenueRecovered: number;
  trends: {
    ticketsChecked: number;
    validTickets: number;
    invalidTickets: number;
    revenueRecovered: number;
  };
}

export interface PassSummaryStats {
  dailyPass: number;
  monthlyPass: number;
  quarterlyPass: number;
  yearlyPass: number;
  studentPass: number;
  trends: {
    dailyPass: number;
    monthlyPass: number;
    quarterlyPass: number;
    yearlyPass: number;
    studentPass: number;
  };
}

export interface LocalVerification {
  id: string;
  time: string;
  ticketType: LocalTicketType;
  ticketNumber?: string;
  passengerName?: string;
  source: string;
  destination: string;
  fare?: number;
  issueTime?: string;
  expiryTime?: string;
  validity?: string;
  status: VerificationStatus;
  isPass: boolean;
}

export interface RevenueStats {
  today: number;
  thisWeek: number;
  thisMonth: number;
}

export interface LocalAlert {
  id: string;
  type: LocalAlertType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface TcProfile {
  name: string;
  id: string;
  avatarInitials: string;
}

export interface LocalDutySession {
  active: boolean;
  zone: string;
  route: string;
  shift: string;
  startedAt: string;
}

export interface LocalTcDashboardData {
  route: RouteState;
  summary: SummaryStats;
  passSummary: PassSummaryStats;
  recentVerifications: LocalVerification[];
  revenue: RevenueStats;
  alerts: LocalAlert[];
  profile: TcProfile;
  notificationCount: number;
  stationSequence: string[];
  stationCodes: string[];
}

export interface LocalTicketData {
  ticketType: LocalTicketType;
  ticketNumber: string;
  passengerName?: string;
  source: string;
  destination: string;
  fare?: number;
  issueTime?: string;
  expiryTime?: string;
  validity?: string;
  status: VerificationStatus;
}

export interface LocalScanResult {
  success: boolean;
  message: string;
  timestamp: string;
  data?: LocalTicketData;
  cancelled?: boolean;
}

export type ToastType = "success" | "error";

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

export function isPassTicketType(type: LocalTicketType): type is PassTicketType {
  return (
    type === "monthly_pass"
    || type === "quarterly_pass"
    || type === "yearly_pass"
    || type === "student_pass"
  );
}

export function getTicketTypeLabel(type: LocalTicketType): string {
  const labels: Record<LocalTicketType, string> = {
    single_journey: "Single Journey",
    return: "Return Ticket",
    platform: "Platform Ticket",
    uts_mobile: "UTS Mobile",
    daily_pass: "Daily Pass",
    monthly_pass: "Monthly Pass",
    quarterly_pass: "Quarterly Pass",
    yearly_pass: "Yearly Pass",
    student_pass: "Student Pass",
  };
  return labels[type];
}
