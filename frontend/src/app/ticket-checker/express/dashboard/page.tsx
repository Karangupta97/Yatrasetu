import type { Metadata } from "next";
import ExpressDashboard from "@/components/ticket-checker/express/ExpressDashboard";

export const metadata: Metadata = {
  title: "Express TC Dashboard — YatraSetu",
  description: "Train ticket checker dashboard for YatraSetu Express services.",
};

export default function ExpressTcDashboardPage() {
  return <ExpressDashboard />;
}
