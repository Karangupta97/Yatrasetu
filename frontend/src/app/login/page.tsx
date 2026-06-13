/**
 * YatraSetu — /login
 *
 * Desktop: Navbar + [Hero 65% + Trust | Login 35%], no scroll
 * Mobile:   Login card → Hero → Trust (stacked, scrollable)
 */
import Navbar      from "@/components/login/Navbar";
import HeroSection from "@/components/login/HeroSection";
import LoginCard   from "@/components/login/LoginCard";
import TrustBar    from "@/components/login/TrustBar";
import "./login.css";

export const metadata = {
  title: "Login — YatraSetu",
  description: "Sign in to your YatraSetu account.",
};

export default function LoginPage() {
  return (
    <div className="login-page">
      <Navbar />

      <main className="login-main">
        <div className="login-grid">
          <div className="login-hero-col">
            <HeroSection />
            <TrustBar />
          </div>

          <div className="login-form-col">
            <LoginCard />
          </div>
        </div>
      </main>
    </div>
  );
}
