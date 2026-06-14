import type { Metadata } from "next";
import LocalDashboard from "@/components/ticket-checker/local/LocalDashboard";

export const metadata: Metadata = {
  title: "Local TC Dashboard — YatraSetu",
  description: "Ticket checker dashboard for local and unreserved railway services across India.",
};

export default function LocalTcDashboardPage() {
  return <LocalDashboard />;
}
