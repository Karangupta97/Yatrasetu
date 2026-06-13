import Navbar from "@/components/login/Navbar";
import HeroSection from "@/components/login/HeroSection";
import TrustBar from "@/components/login/TrustBar";

interface AuthShellProps {
  title: string;
  subtitle: string;
  wide?: boolean;
  children: React.ReactNode;
}

export default function AuthShell({ title, subtitle, wide, children }: AuthShellProps) {
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
            <div className={`login-card reg-card auth-card${wide ? " reg-card--wide" : ""}`}>
              <div className="reg-card__header">
                <h1 className="reg-card__title">{title}</h1>
                <p className="login-card__subtitle">{subtitle}</p>
              </div>
              <div className="reg-card__body auth-card__body">{children}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
