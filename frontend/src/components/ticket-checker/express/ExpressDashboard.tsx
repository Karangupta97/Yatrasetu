"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import "@/app/auth/auth.css";
import { IDLE_EXPRESS_TC_DATA } from "@/lib/idleExpressTcData";
import { lookupTrainData } from "@/lib/trainCatalog";
import { createVerificationFromTicket, formatDutyStartTime } from "@/lib/dutyUtils";
import { startNfcScan } from "@/services/nfcService";
import type {
  DutySession,
  ExpressTcDashboardData,
  JourneyState,
  RecentVerification,
  TcAlert,
  ToastMessage,
} from "@/types/expressTc";
import DashboardHeader from "@/components/ticket-checker/common/DashboardHeader";
import { DashboardSkeleton } from "@/components/ticket-checker/common/LoadingSkeleton";
import TcToast from "@/components/ticket-checker/common/TcToast";
import JourneyInfo from "@/components/ticket-checker/express/JourneyInfo";
import VerificationCards from "@/components/ticket-checker/express/VerificationCards";
import SummaryCards from "@/components/ticket-checker/express/SummaryCards";
import RecentVerifications from "@/components/ticket-checker/express/RecentVerifications";
import RevenueRecovery from "@/components/ticket-checker/express/RevenueRecovery";
import CoachSummary from "@/components/ticket-checker/express/CoachSummary";
import AlertsPanel from "@/components/ticket-checker/express/AlertsPanel";
import StartDutyModal from "@/components/ticket-checker/common/StartDutyModal";
import EndDutyModal from "@/components/ticket-checker/common/EndDutyModal";
import QrScannerModal from "@/components/ticket-checker/common/QrScannerModal";
import type { QrScannerModalResult } from "@/components/ticket-checker/common/QrScannerModal";
import { getSimulatedTicket, parseTicketPayload } from "@/lib/ticketParse";
import PassengerDetailsModal from "@/components/ticket-checker/express/PassengerDetailsModal";
import RevenueDetailsModal from "@/components/ticket-checker/express/RevenueDetailsModal";
import AlertDetailsModal from "@/components/ticket-checker/express/AlertDetailsModal";
import RecentVerificationsModal from "@/components/ticket-checker/express/RecentVerificationsModal";
import AlertsListModal from "@/components/ticket-checker/express/AlertsListModal";
import type { TicketPassengerData } from "@/types/expressTc";
import "./express-dashboard.css";

const STATION_INTERVAL_MS = 60_000;
const LOADING_MS = 400;

function findStationIndex(data: ExpressTcDashboardData): number {
  const idx = data.stationSequence.indexOf(data.journey.currentStation);
  return idx >= 0 ? idx : 0;
}

function buildJourneyFromIndex(
  data: ExpressTcDashboardData,
  index: number,
  dutyStart?: string,
): JourneyState {
  const { stationSequence, stationCodes, stationEtas } = data;
  if (stationSequence.length < 2) {
    return {
      ...data.journey,
      dutyStart: dutyStart ?? data.journey.dutyStart,
    };
  }

  const currentIdx = Math.min(index, stationSequence.length - 2);
  const nextIdx = currentIdx + 1;
  const progress = Math.round(((currentIdx + 1) / (stationSequence.length - 1)) * 100);

  return {
    ...data.journey,
    dutyStart: dutyStart ?? data.journey.dutyStart,
    currentStation: stationSequence[currentIdx],
    currentStationCode: stationCodes[currentIdx],
    nextStation: stationSequence[nextIdx],
    nextStationCode: stationCodes[nextIdx],
    eta: stationEtas[nextIdx],
    progress,
  };
}

function applyVerificationResult(
  data: ExpressTcDashboardData,
  verification: RecentVerification,
): ExpressTcDashboardData {
  const isValid = verification.status === "valid";
  const isInvalid = verification.status === "invalid";
  const revenueDelta = isInvalid ? 850 : 0;

  return {
    ...data,
    recentVerifications: [verification, ...data.recentVerifications],
    summary: {
      ...data.summary,
      ticketsChecked: data.summary.ticketsChecked + 1,
      validTickets: data.summary.validTickets + (isValid ? 1 : 0),
      invalidTickets: data.summary.invalidTickets + (isInvalid ? 1 : 0),
      revenueRecovered: data.summary.revenueRecovered + revenueDelta,
    },
    revenue: {
      ...data.revenue,
      today: data.revenue.today + revenueDelta,
      totalChallans: data.revenue.totalChallans + (isInvalid ? 1 : 0),
    },
  };
}

export default function ExpressDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ExpressTcDashboardData>(IDLE_EXPRESS_TC_DATA);
  const [dutySession, setDutySession] = useState<DutySession | null>(null);
  const [stationIndex, setStationIndex] = useState(0);
  const [nfcLoading, setNfcLoading] = useState(false);
  const [qrLoading, setQrLoading] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const [startDutyOpen, setStartDutyOpen] = useState(false);
  const [endDutyOpen, setEndDutyOpen] = useState(false);
  const [qrScannerOpen, setQrScannerOpen] = useState(false);
  const [selectedPassenger, setSelectedPassenger] = useState<RecentVerification | null>(null);
  const [revenueModalOpen, setRevenueModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<TcAlert | null>(null);
  const [recentAllOpen, setRecentAllOpen] = useState(false);
  const [alertsAllOpen, setAlertsAllOpen] = useState(false);

  const verificationEnabled = dutySession?.active ?? false;
  const dutyStartTime = dutySession?.startedAt;

  const journey = useMemo(
    () => buildJourneyFromIndex(data, stationIndex, dutyStartTime),
    [data, stationIndex, dutyStartTime],
  );

  const showToast = useCallback((type: ToastMessage["type"], message: string) => {
    setToast({ id: `toast-${Date.now()}`, type, message });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), LOADING_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!verificationEnabled || data.stationSequence.length < 2) return;

    const interval = window.setInterval(() => {
      setStationIndex((prev) => {
        const max = data.stationSequence.length - 2;
        return prev >= max ? prev : prev + 1;
      });
    }, STATION_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [verificationEnabled, data.stationSequence.length]);

  const handleStartDuty = useCallback(
    (trainNumber: string, coachAssignment?: string) => {
      const trainData = lookupTrainData(trainNumber);
      if (!trainData) {
        showToast("error", `Train ${trainNumber} not found. Try 12295 or 12951.`);
        return;
      }

      const startedAt = formatDutyStartTime();
      const fullData: ExpressTcDashboardData = {
        ...trainData,
        profile: data.profile,
        notificationCount: trainData.alerts.filter((a) => !a.read).length,
      };

      setDutySession({
        active: true,
        trainNumber,
        coachAssignment,
        startedAt,
      });
      setData({
        ...fullData,
        journey: { ...fullData.journey, dutyStart: startedAt },
      });
      setStationIndex(findStationIndex(fullData));
      setStartDutyOpen(false);
      setScanMessage(null);
      showToast("success", `Duty started for train ${trainNumber}.`);
    },
    [data.profile, showToast],
  );

  const handleEndDuty = useCallback(() => {
    setDutySession(null);
    setData(IDLE_EXPRESS_TC_DATA);
    setStationIndex(0);
    setScanMessage(null);
    setNfcLoading(false);
    setQrLoading(false);
    setQrScannerOpen(false);
    setEndDutyOpen(false);
    setSelectedPassenger(null);
    setSelectedAlert(null);
    setRecentAllOpen(false);
    setAlertsAllOpen(false);
    setRevenueModalOpen(false);
    showToast("success", "Duty ended. Verification disabled.");
  }, [showToast]);

  const recordScan = useCallback(
    (success: boolean, message: string, ticket?: Parameters<typeof createVerificationFromTicket>[0], timestamp?: string) => {
      if (success && ticket) {
        const verification = createVerificationFromTicket(ticket, timestamp);
        setData((prev) => applyVerificationResult(prev, verification));
        setSelectedPassenger(verification);
        setScanMessage(message);
        showToast("success", message);
        return;
      }

      setScanMessage(message);
      showToast("error", message);
    },
    [showToast],
  );

  const handleNfcScan = useCallback(async () => {
    if (!verificationEnabled) return;
    setNfcLoading(true);
    setScanMessage(null);
    try {
      const result = await startNfcScan();
      if (result.success && result.data) {
        recordScan(true, result.message, result.data, result.timestamp);
      } else {
        recordScan(false, result.message);
      }
    } finally {
      setNfcLoading(false);
    }
  }, [verificationEnabled, recordScan]);

  const handleQrScan = useCallback(() => {
    if (!verificationEnabled) return;
    setQrLoading(true);
    setScanMessage(null);
    setQrScannerOpen(true);
  }, [verificationEnabled]);

  const handleQrResult = useCallback(
    (result: QrScannerModalResult<TicketPassengerData>) => {
      setQrLoading(false);
      if (result.cancelled) {
        setScanMessage(null);
        return;
      }
      if (result.success && result.data) {
        recordScan(true, result.message, result.data, result.timestamp);
      } else {
        recordScan(false, result.message);
      }
    },
    [recordScan],
  );

  const handleQrClose = useCallback(() => {
    setQrScannerOpen(false);
    setQrLoading(false);
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="tc-dashboard">
      <DashboardHeader
        journey={journey}
        profile={data.profile}
        notificationCount={data.notificationCount}
        dutySession={dutySession}
        onStartDuty={() => setStartDutyOpen(true)}
        onEndDuty={() => setEndDutyOpen(true)}
      />
      <JourneyInfo journey={journey} />

      <div className="tc-dashboard__body">
        <div className="tc-dashboard__columns">
          <div className="tc-dashboard__left">
            <VerificationCards
              nfcLoading={nfcLoading}
              qrLoading={qrLoading}
              scanMessage={scanMessage}
              verificationEnabled={verificationEnabled}
              onNfcScan={handleNfcScan}
              onQrScan={handleQrScan}
            />
            <RecentVerifications
              verifications={data.recentVerifications}
              onViewAll={() => setRecentAllOpen(true)}
              onViewDetails={setSelectedPassenger}
            />
            <CoachSummary coaches={data.coaches} />
          </div>

          <aside className="tc-dashboard__right">
            <SummaryCards summary={data.summary} />
            <RevenueRecovery
              revenue={data.revenue}
              onViewDetails={() => setRevenueModalOpen(true)}
            />
            <AlertsPanel
              alerts={data.alerts}
              onViewAll={() => setAlertsAllOpen(true)}
              onViewDetails={setSelectedAlert}
            />
          </aside>
        </div>
      </div>

      <StartDutyModal
        open={startDutyOpen}
        onClose={() => setStartDutyOpen(false)}
        onSubmit={handleStartDuty}
      />
      <EndDutyModal
        open={endDutyOpen}
        onClose={() => setEndDutyOpen(false)}
        onConfirm={handleEndDuty}
      />
      <QrScannerModal
        open={qrScannerOpen}
        onClose={handleQrClose}
        onResult={handleQrResult}
        parsePayload={parseTicketPayload}
        getSimulatedPayload={getSimulatedTicket}
        formatSuccessMessage={(ticket) => `QR verified — ${ticket.passenger} (${ticket.pnr})`}
        invalidMessage="Invalid QR code. This does not appear to be a valid ticket."
      />
      <PassengerDetailsModal
        open={selectedPassenger !== null}
        verification={selectedPassenger}
        onClose={() => setSelectedPassenger(null)}
      />
      <RevenueDetailsModal
        open={revenueModalOpen}
        revenue={data.revenue}
        onClose={() => setRevenueModalOpen(false)}
      />
      <AlertDetailsModal
        open={selectedAlert !== null}
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
      />
      <RecentVerificationsModal
        open={recentAllOpen}
        verifications={data.recentVerifications}
        onClose={() => setRecentAllOpen(false)}
        onSelect={(verification) => {
          setRecentAllOpen(false);
          setSelectedPassenger(verification);
        }}
      />
      <AlertsListModal
        open={alertsAllOpen}
        alerts={data.alerts}
        onClose={() => setAlertsAllOpen(false)}
        onSelect={(alert) => {
          setAlertsAllOpen(false);
          setSelectedAlert(alert);
        }}
      />
      <TcToast toast={toast} onDismiss={dismissToast} />
    </div>
  );
}
