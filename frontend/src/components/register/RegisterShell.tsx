import Navbar from "@/components/login/Navbar";
import HeroSection from "@/components/login/HeroSection";
import TrustBar from "@/components/login/TrustBar";
import Stepper from "./Stepper";
import SecurityBadges from "./SecurityBadges";

interface RegisterShellProps {
  step: 1 | 2 | 3 | 4;
  title: string;
  subtitle: string;
  wide?: boolean;
  children: React.ReactNode;
}

export default function RegisterShell({
  step,
  title,
  subtitle,
  wide = false,
  children,
}: RegisterShellProps) {
  return (
    <div className="login-page reg-page">
      <Navbar />

      <main className="login-main reg-main">
        <div className="login-grid reg-grid">
          <div className="login-hero-col reg-hero-col">
            <HeroSection />
            <TrustBar />
          </div>

          <div className="login-form-col reg-form-col">
            <div className={`login-card reg-card reg-card--premium${wide ? " reg-card--wide" : ""}`}>
              <div className="reg-card__top">
                <Stepper current={step} />

                <div className="reg-card__header">
                  <h1 className="reg-card__title">{title}</h1>
                  <p className="reg-card__subtitle">{subtitle}</p>
                </div>
              </div>

              <div className="reg-card__body reg-enter">
                {children}
                <SecurityBadges />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
