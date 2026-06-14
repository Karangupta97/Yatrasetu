/**
 * YatraSetu — Landing / Home Page ( / )
 *
 * Full-page marketing landing that uses the same train.webp hero image
 * and design language as the login / register pages.
 */

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Train,
  Ticket,
  ShieldCheck,
  Activity,
  Users,
  Lock,
  Award,
  Headphones,
  ArrowRight,
  Smartphone,
  QrCode,
  BadgeCheck,
  Search,
  CreditCard,
} from "lucide-react";
import "./home.css";
import BookingsNavbar from "@/app/my-bookings/components/BookingsNavbar";
import HomeHeroCta from "@/components/shared/HomeHeroCta";



export const metadata: Metadata = {
  title: "YatraSetu — Your Bridge to Every Journey",
  description:
    "Book Indian railway tickets seamlessly, securely, and instantly. Aadhaar-verified accounts, real-time PNR updates, and digital tickets — all in one place.",
};

/* ── Ashoka Emblem (reused from Navbar) ── */
function AshokaEmblem() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <circle cx="16" cy="16" r="15" fill="#1E3A5F" />
      <circle cx="16" cy="16" r="11" stroke="#C9A227" strokeWidth="1.2" fill="none" />
      <circle cx="16" cy="16" r="2.5" fill="#C9A227" />
      <line x1="19" y1="16" x2="26" y2="16" stroke="#C9A227" strokeWidth="0.8" />
      <line x1="18.9" y1="16.8" x2="25.7" y2="18.6" stroke="#C9A227" strokeWidth="0.8" />
      <line x1="18.6" y1="17.6" x2="25.2" y2="21.2" stroke="#C9A227" strokeWidth="0.8" />
      <line x1="18.1" y1="18.3" x2="24.4" y2="23.6" stroke="#C9A227" strokeWidth="0.8" />
      <line x1="13.1" y1="13.1" x2="16.3" y2="18.5" stroke="#C9A227" strokeWidth="0.8" />
      <line x1="13.7" y1="12.6" x2="17.6" y2="17.8" stroke="#C9A227" strokeWidth="0.8" />
      <line x1="14.4" y1="12.3" x2="19.1" y2="17.3" stroke="#C9A227" strokeWidth="0.8" />
      <line x1="15.2" y1="12.1" x2="20.6" y2="17" stroke="#C9A227" strokeWidth="0.8" />
      <line x1="16" y1="12" x2="22.1" y2="16.9" stroke="#C9A227" strokeWidth="0.8" />
      <line x1="12" y1="16" x2="13.4" y2="23.4" stroke="#C9A227" strokeWidth="0.8" />
    </svg>
  );
}



/* ── Hero ── */
function Hero() {
  return (
    <section className="home-hero" aria-label="Hero section">
      {/* Background image */}
      <div className="home-hero__bg">
        <Image
          src="/train.webp"
          alt="Vande Bharat Express on a scenic Indian railway route"
          fill
          priority
          sizes="100vw"
          className="home-hero__img"
        />
        <div className="home-hero__overlay" aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="home-hero__content">
        {/* Live badge */}
        <div className="home-hero__badge" aria-label="System status: Live">
          <div className="home-hero__badge-dot" aria-hidden="true" />
          <span className="home-hero__badge-text">
            Official IRCTC Authorized Platform — Live
          </span>
        </div>

        <h1 className="home-hero__headline">
          Travel Smarter,{" "}
          <em>Book&nbsp;Faster</em>{" "}
          with YatraSetu
        </h1>

        <p className="home-hero__subline">
          India&apos;s most trusted digital railway ticketing platform. Aadhaar-verified
          accounts, instant digital tickets, and real-time PNR tracking — all in one
          seamless experience.
        </p>

        <HomeHeroCta />

        {/* Stats chips */}
        <div className="home-hero__stats" role="list" aria-label="Platform statistics">
          {[
            { icon: <Users size={16} />, num: "50M+", lbl: "Registered Users" },
            { icon: <Ticket size={16} />, num: "2M+", lbl: "Daily Bookings" },
            { icon: <Train size={16} />, num: "13,000+", lbl: "Train Routes" },
          ].map(({ icon, num, lbl }) => (
            <div key={lbl} className="home-hero__stat" role="listitem">
              <div className="home-hero__stat-icon" aria-hidden="true">
                {icon}
              </div>
              <div>
                <div className="home-hero__stat-num">{num}</div>
                <div className="home-hero__stat-lbl">{lbl}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Features ── */
const FEATURES = [
  {
    icon: <ShieldCheck size={24} strokeWidth={1.75} />,
    iconBg: "rgba(37,99,235,0.08)",
    iconColor: "#2563EB",
    title: "Aadhaar-Verified Accounts",
    desc: "Every account is KYC-verified with Aadhaar to ensure genuine identity and maximum security for all passengers.",
  },
  {
    icon: <QrCode size={24} strokeWidth={1.75} />,
    iconBg: "rgba(22,163,74,0.08)",
    iconColor: "#16A34A",
    title: "Instant Digital Tickets",
    desc: "Get your QR-code digital ticket the moment you book. No printing needed — show on any device at the station.",
  },
  {
    icon: <Activity size={24} strokeWidth={1.75} />,
    iconBg: "rgba(37,99,235,0.08)",
    iconColor: "#2563EB",
    title: "Real-Time PNR Tracking",
    desc: "Live updates on your train status, platform changes, and seat availability straight from the IRCTC database.",
  },
  {
    icon: <Lock size={24} strokeWidth={1.75} />,
    iconBg: "rgba(220,38,38,0.07)",
    iconColor: "#DC2626",
    title: "Bank-Grade Security",
    desc: "End-to-end encrypted transactions with fraud detection and multi-factor authentication protecting every booking.",
  },
  {
    icon: <Smartphone size={24} strokeWidth={1.75} />,
    iconBg: "rgba(37,99,235,0.08)",
    iconColor: "#2563EB",
    title: "Works Offline (PWA)",
    desc: "Install YatraSetu as a progressive web app. View your tickets and PNR status even without internet connectivity.",
  },
  {
    icon: <Headphones size={24} strokeWidth={1.75} />,
    iconBg: "rgba(245,158,11,0.08)",
    iconColor: "#D97706",
    title: "24/7 Customer Support",
    desc: "Dedicated support team available round the clock via chat, call, or email to resolve any booking issue fast.",
  },
];

function Features() {
  return (
    <section id="features" className="home-features" aria-labelledby="features-title">
      <div className="home-section">
        <div className="home-section__eyebrow" aria-hidden="true">
          <BadgeCheck size={14} />
          Everything You Need
        </div>
        <h2 id="features-title" className="home-section__title">
          Built for India&apos;s Railways
        </h2>
        <p className="home-section__subtitle">
          YatraSetu combines government-grade security with a modern, intuitive interface so
          you can focus on the journey — not the paperwork.
        </p>

        <div className="home-features__grid" role="list">
          {FEATURES.map((f) => (
            <article
              key={f.title}
              className="home-feature-card"
              role="listitem"
              aria-label={f.title}
            >
              <div
                className="home-feature-card__icon"
                style={{ background: f.iconBg, color: f.iconColor }}
                aria-hidden="true"
              >
                {f.icon}
              </div>
              <h3 className="home-feature-card__title">{f.title}</h3>
              <p className="home-feature-card__desc">{f.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── How It Works ── */
const STEPS = [
  {
    num: "1",
    icon: <ShieldCheck size={20} />,
    title: "Create Account",
    desc: "Register with your email, mobile, and Aadhaar for a fully KYC-verified profile in minutes.",
  },
  {
    num: "2",
    icon: <Search size={20} />,
    title: "Search Trains",
    desc: "Find trains by source, destination, and travel date. Filter by class, quota, and availability.",
  },
  {
    num: "3",
    icon: <CreditCard size={20} />,
    title: "Secure Payment",
    desc: "Pay securely via UPI, net banking, or cards. Your transaction is protected end-to-end.",
  },
  {
    num: "4",
    icon: <QrCode size={20} />,
    title: "Get Digital Ticket",
    desc: "Receive your QR-based digital ticket instantly. Show it at the gate — no printout needed.",
  },
];

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="home-hiw"
      aria-labelledby="hiw-title"
    >
      <div className="home-section">
        <div className="home-section__eyebrow" aria-hidden="true">
          <Activity size={14} />
          Simple Process
        </div>
        <h2 id="hiw-title" className="home-section__title">
          Book in 4 Easy Steps
        </h2>
        <p className="home-section__subtitle">
          From registration to boarding, YatraSetu makes every step intuitive and fast.
        </p>

        <ol className="home-hiw__steps" aria-label="Steps to book a ticket">
          {STEPS.map((step) => (
            <li key={step.num} className="home-hiw__step">
              <div className="home-hiw__step-num" aria-label={`Step ${step.num}`}>
                {step.num}
              </div>
              <h3 className="home-hiw__step-title">{step.title}</h3>
              <p className="home-hiw__step-desc">{step.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── Popular Routes ── */
const ROUTES = [
  { from: "NDLS", to: "CSMT", label: "Rajdhani Express" },
  { from: "MAS", to: "SBC", label: "Shatabdi Express" },
  { from: "HWH", to: "NDLS", label: "Duronto Express" },
  { from: "PUNE", to: "CSMT", label: "Deccan Queen" },
  { from: "BPL", to: "NGP", label: "Vande Bharat" },
  { from: "ADI", to: "NDLS", label: "August Kranti Raj" },
];

function PopularRoutes() {
  return (
    <section
      id="routes"
      className="home-routes"
      aria-labelledby="routes-title"
    >
      <div className="home-section">
        <div className="home-section__eyebrow" aria-hidden="true">
          <Train size={14} />
          Explore Routes
        </div>
        <h2 id="routes-title" className="home-section__title">
          Popular Train Routes
        </h2>
        <p className="home-section__subtitle">
          Quick access to India&apos;s most-travelled corridors. Click a route to search
          availability instantly.
        </p>

        <nav className="home-routes__grid" aria-label="Popular train routes">
          {ROUTES.map((r) => (
            <Link
              key={`${r.from}-${r.to}`}
              href={`/passenger?from=${r.from}&to=${r.to}`}
              className="home-route-chip"
              aria-label={`${r.from} to ${r.to} — ${r.label}`}
            >
              <span className="home-route-chip__from">{r.from}</span>
              <span className="home-route-chip__arrow">↓</span>
              <span className="home-route-chip__to">{r.to}</span>
              <span className="home-route-chip__label">{r.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}

/* ── Trust / Stats band ── */
const TRUST_ITEMS = [
  { icon: <Award size={22} strokeWidth={1.6} />, num: "50M+", label: "Registered Users" },
  { icon: <Ticket size={22} strokeWidth={1.6} />, num: "2M+", label: "Daily Bookings" },
  { icon: <Users size={22} strokeWidth={1.6} />, num: "99.9%", label: "Uptime SLA" },
  { icon: <ShieldCheck size={22} strokeWidth={1.6} />, num: "0", label: "Data Breaches" },
];

function TrustBand() {
  return (
    <section
      className="home-trust"
      aria-labelledby="trust-title"
    >
      <div className="home-trust__inner">
        <div
          style={{ textAlign: "center", marginBottom: "48px" }}
        >
          <div
            className="home-section__eyebrow"
            style={{ justifyContent: "center", color: "#93c5fd" }}
            aria-hidden="true"
          >
            <BadgeCheck size={14} />
            Why Millions Trust Us
          </div>
          <h2
            id="trust-title"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.04em",
              margin: 0,
            }}
          >
            Numbers That Speak for Themselves
          </h2>
        </div>

        <dl className="home-trust__grid">
          {TRUST_ITEMS.map((item) => (
            <div key={item.label} className="home-trust__item">
              <div
                className="home-trust__icon-wrap"
                aria-hidden="true"
              >
                {item.icon}
              </div>
              <dt className="home-trust__num">{item.num}</dt>
              <dd className="home-trust__label">{item.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ── Final CTA ── */
function CtaBanner() {
  return (
    <section
      className="home-cta-banner"
      aria-labelledby="cta-title"
    >
      <div className="home-cta-banner__inner">
        <div
          className="home-section__eyebrow"
          style={{ justifyContent: "center" }}
          aria-hidden="true"
        >
          <Train size={14} />
          Ready to travel?
        </div>
        <h2 id="cta-title" className="home-cta-banner__title">
          Your Next Journey Starts Here
        </h2>
        <p className="home-cta-banner__sub">
          Join millions of travellers who book smarter with YatraSetu. Create your free
          Aadhaar-verified account in under 5 minutes.
        </p>
        <div className="home-cta-banner__btns">
          <Link
            href="/register"
            className="home-hero__btn home-hero__btn--primary"
            aria-label="Create your free YatraSetu account"
          >
            <Ticket size={18} aria-hidden="true" />
            Create Free Account
          </Link>
          <Link
            href="/login"
            className="home-nav__btn home-nav__btn--ghost"
            style={{ height: "52px", borderRadius: "16px", fontSize: "15px", fontWeight: 700, letterSpacing: "0.04em" }}
            aria-label="Sign in to your existing account"
          >
            Already have an account?
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ── */
function Footer() {
  return (
    <footer className="home-footer" aria-label="Site footer">
      <div className="home-footer__inner">
        <div className="home-footer__top">
          {/* Brand column */}
          <div className="home-footer__brand">
            <div className="home-footer__logo">
              <div className="home-footer__logo-box" aria-hidden="true">
                <Train size={17} color="white" strokeWidth={2.2} />
              </div>
              <div className="home-footer__brand-name">
                Yatra<span>Setu</span>
              </div>
            </div>
            <p className="home-footer__tagline">
              India&apos;s official digital railway ticketing platform — your bridge to every
              journey, powered by the Government of India.
            </p>
            <div className="home-footer__gov-note" aria-label="Government of India initiative">
              <AshokaEmblem />
              Government of India — Official Railway Initiative
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="Quick links">
            <h3 className="home-footer__col-title">Quick Links</h3>
            <ul className="home-footer__links">
              <li><Link href="/passenger">Book Ticket</Link></li>
              <li><Link href="/login">Sign In</Link></li>
              <li><Link href="/register">Create Account</Link></li>
              <li><Link href="/my-bookings">My Bookings</Link></li>
            </ul>
          </nav>

          {/* Support */}
          <nav aria-label="Support links">
            <h3 className="home-footer__col-title">Support</h3>
            <ul className="home-footer__links">
              <li><Link href="/help">Help Center</Link></li>
              <li><Link href="/forgot-username">Forgot Username</Link></li>
              <li><Link href="/forgot-password">Forgot Password</Link></li>
              <li><a href="tel:139">Rail Helpline: 139</a></li>
            </ul>
          </nav>

          {/* Legal (desktop-only extra column) */}
          <nav aria-label="Legal links" style={{ display: "none" }} className="home-footer__legal">
            <h3 className="home-footer__col-title">Legal</h3>
            <ul className="home-footer__links">
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
              <li><Link href="/refund">Refund Policy</Link></li>
            </ul>
          </nav>
        </div>

        <div className="home-footer__bottom">
          <span>© {new Date().getFullYear()} YatraSetu — Government of India. All rights reserved.</span>
          <span>IRCTC Authorized Partner · Aadhaar-Enabled</span>
        </div>
      </div>
    </footer>
  );
}

/* ── Page ── */
export default function HomePage() {
  return (
    <div className="home-page">
      <BookingsNavbar />
      <Hero />
      <Features />
      <HowItWorks />
      <PopularRoutes />
      <TrustBand />
      <CtaBanner />
      <Footer />
    </div>
  );
}
