"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import "@/app/auth/auth.css";
import { IDLE_LOCAL_TC_DATA } from "@/lib/idleLocalTcData";
import {
  findStationIndex,
  lookupLocalRoute,
} from "@/lib/localRouteCatalog";
import {
  createLocalVerificationFromTicket,
  formatDutyStartTime,
} from "@/lib/localDutyUtils";
import { startNfcScan } from "@/services/nfcService";
import {
  getSimulatedLocalTicket,
  parseLocalTicketPayload,
} from "@/lib/localTicketParse";
import type {
  LocalDutySession,
  LocalTicketData,
  LocalTcDashboardData,
  LocalVerification,
  LocalAlert,
  RouteState,
  ToastMessage,
  LocalTicketType,
} from "@/types/localTc";
import { DashboardSkeleton } from "@/components/ticket-checker/common/LoadingSkeleton";
import TcToast from "@/components/ticket-checker/common/TcToast";
import SummaryCards from "@/components/ticket-checker/express/SummaryCards";
import EndDutyModal from "@/components/ticket-checker/common/EndDutyModal";
import QrScannerModal from "@/components/ticket-checker/common/QrScannerModal";
import type { QrScannerModalResult } from "@/components/ticket-checker/common/QrScannerModal";
import LocalDashboardHeader from "@/components/ticket-checker/local/LocalDashboardHeader";
import RouteInfo from "@/components/ticket-checker/local/RouteInfo";
import LocalVerificationCards from "@/components/ticket-checker/local/LocalVerificationCards";
import LocalRecentVerifications from "@/components/ticket-checker/local/LocalRecentVerifications";
import PassSummary from "@/components/ticket-checker/local/PassSummary";
import LocalRevenueRecovery from "@/components/ticket-checker/local/LocalRevenueRecovery";
import LocalAlertsPanel from "@/components/ticket-checker/local/LocalAlertsPanel";
import LocalStartDutyModal from "@/components/ticket-checker/local/LocalStartDutyModal";
import LocalVerificationDetailsModal from "@/components/ticket-checker/local/LocalVerificationDetailsModal";
import LocalRevenueDetailsModal from "@/components/ticket-checker/local/LocalRevenueDetailsModal";
import LocalAlertDetailsModal from "@/components/ticket-checker/local/LocalAlertDetailsModal";
import LocalRecentVerificationsModal from "@/components/ticket-checker/local/LocalRecentVerificationsModal";
import LocalAlertsListModal from "@/components/ticket-checker/local/LocalAlertsListModal";
import "../express/express-dashboard.css";
import "./local-dashboard.css";

const STATION_INTERVAL_MS = 60_000;
const LOADING_MS = 400;

const PASS_KEY_MAP: Partial<Record<LocalTicketType, keyof LocalTcDashboardData["passSummary"]>> = {
  daily_pass: "dailyPass",
  monthly_pass: "monthlyPass",
  quarterly_pass: "quarterlyPass",
  yearly_pass: "yearlyPass",
  student_pass: "studentPass",
};

function buildRouteFromIndex(
  data: LocalTcDashboardData,
  index: number,
  shift?: string,
  dutyStart?: string,
): RouteState {
  const { stationSequence, stationCodes } = data;
  if (stationSequence.length < 2) {
    return {
      ...data.route,
      shift: shift ?? data.route.shift,
      dutyStart: dutyStart ?? data.route.dutyStart,
    };
  }

  const currentIdx = Math.min(index, stationSequence.length - 2);
  const nextIdx = currentIdx + 1;
  const progress = Math.round(((currentIdx + 1) / (stationSequence.length - 1)) * 100);

  return {
    ...data.route,
    shift: shift ?? data.route.shift,
    dutyStart: dutyStart ?? data.route.dutyStart,
    currentStation: stationSequence[currentIdx],
    currentStationCode: stationCodes[currentIdx],
    nextStation: stationSequence[nextIdx],
    nextStationCode: stationCodes[nextIdx],
    progress,
  };
}

function applyVerificationResult(
  data: LocalTcDashboardData,
  verification: LocalVerification,
): LocalTcDashboardData {
  const isValid = verification.status === "valid";
  const isInvalid = verification.status === "invalid";
  const revenueDelta = isInvalid ? (verification.fare ?? 50) : 0;
  const passKey = PASS_KEY_MAP[verification.ticketType];

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
    },
    passSummary: passKey
      ? {
          ...data.passSummary,
          [passKey]: (data.passSummary[passKey] as number) + 1,
        }
      : data.passSummary,
  };
}

export default function LocalDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<LocalTcDashboardData>(IDLE_LOCAL_TC_DATA);
  const [dutySession, setDutySession] = useState<LocalDutySession | null>(null);
  const [stationIndex, setStationIndex] = useState(0);
  const [nfcLoading, setNfcLoading] = useState(false);
  const [qrLoading, setQrLoading] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const [startDutyOpen, setStartDutyOpen] = useState(false);
  const [endDutyOpen, setEndDutyOpen] = useState(false);
  const [qrScannerOpen, setQrScannerOpen] = useState(false);
  const [selectedVerification, setSelectedVerification] = useState<LocalVerification | null>(null);
  const [revenueModalOpen, setRevenueModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<LocalAlert | null>(null);
  const [recentAllOpen, setRecentAllOpen] = useState(false);
  const [alertsAllOpen, setAlertsAllOpen] = useState(false);

  const verificationEnabled = dutySession?.active ?? false;

  const route = useMemo(
    () => buildRouteFromIndex(
      data,
      stationIndex,
      dutySession?.shift,
      dutySession?.startedAt,
    ),
    [data, stationIndex, dutySession?.shift, dutySession?.startedAt],
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
    (zone: string, routeName: string, shift: string) => {
      const routeData = lookupLocalRoute(zone, routeName);
      if (!routeData) {
        showToast("error", `Route not found for ${zone}. Try Western Railway — Churchgate – Virar.`);
        return;
      }

      const startedAt = formatDutyStartTime();
      const fullData: LocalTcDashboardData = {
        ...routeData,
        profile: data.profile,
        notificationCount: routeData.alerts.filter((a) => !a.read).length,
        route: { ...routeData.route, shift, dutyStart: startedAt },
      };

      setDutySession({ active: true, zone, route: routeName, shift, startedAt });
      setData(fullData);
      setStationIndex(findStationIndex(fullData));
      setStartDutyOpen(false);
      setScanMessage(null);
      showToast("success", `Duty started — ${zone}, ${routeName}.`);
    },
    [data.profile, showToast],
  );

  const handleEndDuty = useCallback(() => {
    setDutySession(null);
    setData(IDLE_LOCAL_TC_DATA);
    setStationIndex(0);
    setScanMessage(null);
    setNfcLoading(false);
    setQrLoading(false);
    setQrScannerOpen(false);
    setEndDutyOpen(false);
    setSelectedVerification(null);
    setSelectedAlert(null);
    setRecentAllOpen(false);
    setAlertsAllOpen(false);
    setRevenueModalOpen(false);
    showToast("success", "Duty ended. Verification disabled.");
  }, [showToast]);

  const recordScan = useCallback(
    (success: boolean, message: string, ticket?: Parameters<typeof createLocalVerificationFromTicket>[0], timestamp?: string) => {
      if (success && ticket) {
        const verification = createLocalVerificationFromTicket(ticket, timestamp);
        setData((prev) => applyVerificationResult(prev, verification));
        setSelectedVerification(verification);
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
      const result = await startNfcScan({
        parsePayload: parseLocalTicketPayload,
        getSimulatedData: getSimulatedLocalTicket,
        formatSuccessMessage: (ticket) => `NFC verified — ${ticket.ticketNumber}`,
        invalidMessage: "Invalid NFC ticket data.",
      });
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
    (result: QrScannerModalResult<LocalTicketData>) => {
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
    <div className="tc-dashboard tc-dashboard--local">
      <LocalDashboardHeader
        route={route}
        profile={data.profile}
        notificationCount={data.notificationCount}
        dutySession={dutySession}
        onStartDuty={() => setStartDutyOpen(true)}
        onEndDuty={() => setEndDutyOpen(true)}
      />
      <RouteInfo route={route} />

      <div className="tc-dashboard__body">
        <div className="tc-dashboard__columns">
          <div className="tc-dashboard__left">
            <LocalVerificationCards
              nfcLoading={nfcLoading}
              qrLoading={qrLoading}
              scanMessage={scanMessage}
              verificationEnabled={verificationEnabled}
              onNfcScan={handleNfcScan}
              onQrScan={handleQrScan}
            />
            <LocalRecentVerifications
              verifications={data.recentVerifications}
              onViewAll={() => setRecentAllOpen(true)}
              onViewDetails={setSelectedVerification}
            />
            <PassSummary passSummary={data.passSummary} />
          </div>

          <aside className="tc-dashboard__right">
            <SummaryCards summary={data.summary} />
            <LocalRevenueRecovery
              revenue={data.revenue}
              onViewDetails={() => setRevenueModalOpen(true)}
            />
            <LocalAlertsPanel
              alerts={data.alerts}
              onViewAll={() => setAlertsAllOpen(true)}
              onViewDetails={setSelectedAlert}
            />
          </aside>
        </div>
      </div>

      <LocalStartDutyModal
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
        parsePayload={parseLocalTicketPayload}
        getSimulatedPayload={getSimulatedLocalTicket}
        formatSuccessMessage={(ticket) => `QR verified — ${ticket.ticketNumber}`}
        invalidMessage="Invalid QR code. Not a valid local ticket or pass."
        subtitle="Point your camera at the ticket or pass QR code."
      />
      <LocalVerificationDetailsModal
        open={selectedVerification !== null}
        verification={selectedVerification}
        onClose={() => setSelectedVerification(null)}
      />
      <LocalRevenueDetailsModal
        open={revenueModalOpen}
        revenue={data.revenue}
        onClose={() => setRevenueModalOpen(false)}
      />
      <LocalAlertDetailsModal
        open={selectedAlert !== null}
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
      />
      <LocalRecentVerificationsModal
        open={recentAllOpen}
        verifications={data.recentVerifications}
        onClose={() => setRecentAllOpen(false)}
        onSelect={(v) => {
          setRecentAllOpen(false);
          setSelectedVerification(v);
        }}
      />
      <LocalAlertsListModal
        open={alertsAllOpen}
        alerts={data.alerts}
        onClose={() => setAlertsAllOpen(false)}
        onSelect={(a) => {
          setAlertsAllOpen(false);
          setSelectedAlert(a);
        }}
      />
      <TcToast toast={toast} onDismiss={dismissToast} />
    </div>
  );
}
