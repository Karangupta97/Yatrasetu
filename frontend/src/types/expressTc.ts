export type VerificationStatus = "valid" | "invalid" | "duplicate" | "pending";

export type AlertType = "duplicate" | "invalid" | "journey" | "system";

export type CoachStatus = "verified" | "pending" | "not_started";

export interface JourneyState {
  dutyStart: string;
  dutyEnd: string;
  currentStation: string;
  currentStationCode: string;
  nextStation: string;
  nextStationCode: string;
  eta: string;
  progress: number;
  trainNumber: string;
  route: string;
  journeyDate: string;
  boardingPoint: string;
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

export interface RecentVerification {
  id: string;
  passenger: string;
  pnr: string;
  coachBerth: string;
  source: string;
  destination: string;
  status: VerificationStatus;
  time: string;
}

export interface RevenueStats {
  today: number;
  thisWeek: number;
  thisMonth: number;
  totalChallans: number;
}

export interface CoachStats {
  code: string;
  capacity: number;
  verified: number;
  status: CoachStatus;
}

export interface TcAlert {
  id: string;
  type: AlertType;
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

export interface ExpressTcDashboardData {
  journey: JourneyState;
  summary: SummaryStats;
  recentVerifications: RecentVerification[];
  revenue: RevenueStats;
  coaches: CoachStats[];
  alerts: TcAlert[];
  profile: TcProfile;
  notificationCount: number;
  stationSequence: string[];
  stationCodes: string[];
  stationEtas: string[];
}

export interface DutySession {
  active: boolean;
  trainNumber: string;
  coachAssignment?: string;
  startedAt: string;
}

export interface ActiveTrainData {
  journey: JourneyState;
  stationSequence: string[];
  stationCodes: string[];
  stationEtas: string[];
  coaches: CoachStats[];
  summary: SummaryStats;
  revenue: RevenueStats;
  alerts: TcAlert[];
  recentVerifications: RecentVerification[];
}

export interface TicketPassengerData {
  passenger: string;
  pnr: string;
  coachBerth: string;
  source: string;
  destination: string;
  status: VerificationStatus;
}

export interface ScanResult {
  success: boolean;
  message: string;
  timestamp: string;
}

export interface NfcScanResult extends ScanResult {
  data?: TicketPassengerData;
}

export interface QrScanResult extends ScanResult {
  data?: TicketPassengerData;
  cancelled?: boolean;
}

export type ToastType = "success" | "error";

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}
