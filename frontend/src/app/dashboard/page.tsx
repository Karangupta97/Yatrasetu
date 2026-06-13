import Link from "next/link";
import Navbar from "@/components/login/Navbar";
import "../login/login.css";
import "../auth/auth.css";

export const metadata = {
  title: "Dashboard — YatraSetu",
  description: "Your YatraSetu dashboard.",
};

export default function DashboardPage() {
  return (
    <div className="login-page" style={{ minHeight: "100dvh" }}>
      <Navbar />
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <div className="login-card" style={{ maxWidth: 480, textAlign: "center" }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0B1F3A", marginBottom: 8 }}>Dashboard</h1>
          <p style={{ color: "#64748B", fontSize: 15, marginBottom: 24 }}>
            Welcome to YatraSetu. Your dashboard is coming soon.
          </p>
          <Link href="/login" className="reg-link" style={{ fontSize: 15 }}>
            Back to Login
          </Link>
        </div>
      </main>
    </div>
  );
}
