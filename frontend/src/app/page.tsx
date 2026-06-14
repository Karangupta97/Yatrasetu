/**
 * YatraSetu — Home Page ( / ) v3
 * Modern · Professional · Minimal Animation · Fully Responsive
 */

import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Train,
  Ticket,
  ShieldCheck,
  Activity,
  Users,
  Lock,
  Headphones,
  Smartphone,
  QrCode,
  BadgeCheck,
  Search,
  CreditCard,
  ArrowRight,
  Zap,
} from "lucide-react";
import "./home.css";
import BookingsNavbar from "@/app/my-bookings/components/BookingsNavbar";
import HomeHeroCta from "@/components/shared/HomeHeroCta";
import HomeAnimations from "@/components/shared/HomeAnimations";

export const metadata: Metadata = {
  title: "YatraSetu — Your Bridge to Every Journey",
  description:
    "Book Indian railway tickets seamlessly, securely, and instantly. Aadhaar-verified accounts, real-time PNR updates, and digital tickets — all in one place.",
};

/* ── Ashoka Emblem ── */
function AshokaEmblem() {
  return (
    <svg
      width="24" height="24"
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

/* ══════════════════════════════════════════
   HERO
══════════════════════════════════════════ */
function Hero() {
  return (
    <section className="home-hero" aria-label="Hero section">
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
        <div className="home-hero__gradient-anim" aria-hidden="true" />
      </div>

      <div className="home-hero__content">
        {/* Live badge */}
        <div className="home-hero__badge" aria-label="IRCTC Authorized — Live">
          <div className="home-hero__badge-dot" aria-hidden="true" />
          <span className="home-hero__badge-text">IRCTC Authorized · Live</span>
        </div>

        <h1 className="home-hero__headline">
          Your Bridge to<br />
          <em>Every Journey</em>
        </h1>

        <p className="home-hero__subline">
          Book train tickets instantly. Track PNR in real time.
        </p>

        <HomeHeroCta />
      </div>

      {/* ── Stats bar — pinned to bottom of hero ── */}
      <div className="home-hero__statsbar" role="list" aria-label="Platform statistics">
        <div className="home-hero__statsbar-inner">
          {[
            { icon: <Users size={16} />, num: "50M+", lbl: "Registered Users" },
            { icon: <Ticket size={16} />, num: "2M+", lbl: "Daily Bookings" },
            { icon: <Train size={16} />, num: "13,000+", lbl: "Train Routes" },
            { icon: <ShieldCheck size={16} />, num: "100%", lbl: "Secure & Verified" },
          ].map(({ icon, num, lbl }, i) => (
            <Fragment key={lbl}>
              <div className="home-hero__statsbar-item" role="listitem">
                <span className="home-hero__statsbar-icon" aria-hidden="true">{icon}</span>
                <span className="home-hero__statsbar-num">{num}</span>
                <span className="home-hero__statsbar-lbl">{lbl}</span>
              </div>
              {i < 3 && <div className="home-hero__statsbar-divider" aria-hidden="true" />}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   FEATURES
══════════════════════════════════════════ */
const FEATURES = [
  {
    icon: <ShieldCheck size={22} strokeWidth={1.75} />,
    iconBg: "rgba(99,102,241,0.1)",
    iconColor: "#4f46e5",
    title: "Aadhaar-Verified Accounts",
    desc: "Every account is KYC-verified with Aadhaar for genuine identity and maximum security for all passengers.",
  },
  {
    icon: <QrCode size={22} strokeWidth={1.75} />,
    iconBg: "rgba(16,185,129,0.1)",
    iconColor: "#059669",
    title: "Instant Digital Tickets",
    desc: "Get your QR-code digital ticket the moment you book. No printing needed — show on any device at the station.",
  },
  {
    icon: <Activity size={22} strokeWidth={1.75} />,
    iconBg: "rgba(59,130,246,0.1)",
    iconColor: "#2563eb",
    title: "Real-Time PNR Tracking",
    desc: "Live updates on train status, platform changes, and seat availability straight from the IRCTC database.",
  },
  {
    icon: <Lock size={22} strokeWidth={1.75} />,
    iconBg: "rgba(239,68,68,0.08)",
    iconColor: "#dc2626",
    title: "Bank-Grade Security",
    desc: "End-to-end encrypted transactions with fraud detection and multi-factor authentication on every booking.",
  },
  {
    icon: <Smartphone size={22} strokeWidth={1.75} />,
    iconBg: "rgba(99,102,241,0.1)",
    iconColor: "#4f46e5",
    title: "Works Offline (PWA)",
    desc: "Install YatraSetu as a progressive web app. View tickets and PNR status even without internet connectivity.",
  },
  {
    icon: <Headphones size={22} strokeWidth={1.75} />,
    iconBg: "rgba(245,158,11,0.1)",
    iconColor: "#d97706",
    title: "24/7 Customer Support",
    desc: "Dedicated support via chat, call, or email round the clock to resolve any booking issue instantly.",
  },
];

function Features() {
  return (
    <section id="features" className="home-features" aria-labelledby="features-title">
      <div className="home-section">
        <div className="home-section__eyebrow" aria-hidden="true">
          <BadgeCheck size={13} />
          Everything You Need
        </div>
        <h2 id="features-title" className="home-section__title">
          Built for India&apos;s Railways
        </h2>
        <p className="home-section__subtitle">
          YatraSetu combines government-grade security with a modern, intuitive interface
          so you can focus on the journey — not the paperwork.
        </p>

        <div className="home-features__grid" role="list">
          {FEATURES.map((f) => (
            <article
              key={f.title}
              className="home-feature-card reveal"
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

/* ══════════════════════════════════════════
   HOW IT WORKS
══════════════════════════════════════════ */
const STEPS = [
  {
    num: "1",
    icon: <ShieldCheck size={18} />,
    title: "Create Account",
    desc: "Register with your email, mobile, and Aadhaar for a fully KYC-verified profile in minutes.",
  },
  {
    num: "2",
    icon: <Search size={18} />,
    title: "Search Trains",
    desc: "Find trains by source, destination, and date. Filter by class, quota, and live availability.",
  },
  {
    num: "3",
    icon: <CreditCard size={18} />,
    title: "Secure Payment",
    desc: "Pay via UPI, net banking, or cards. Your transaction is protected end-to-end.",
  },
  {
    num: "4",
    icon: <QrCode size={18} />,
    title: "Get Digital Ticket",
    desc: "Receive your QR-based digital ticket instantly. Show at the gate — no printout required.",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="home-hiw" aria-labelledby="hiw-title">
      <div className="home-section">
        <div className="home-section__eyebrow" aria-hidden="true">
          <Activity size={13} />
          Simple Process
        </div>
        <h2 id="hiw-title" className="home-section__title">
          Book in 4 Easy Steps
        </h2>
        <p className="home-section__subtitle">
          From registration to boarding, YatraSetu makes every step intuitive and fast.
        </p>

        <div className="home-hiw__steps-wrapper">
          {/* Animated connector line — desktop only */}
          <div className="home-hiw__connector" aria-hidden="true">
            <span className="home-hiw__connector-fill" />
          </div>

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
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   POPULAR ROUTES
══════════════════════════════════════════ */
const ROUTES = [
  { from: "NDLS", fromCity: "New Delhi",  to: "CSMT", toCity: "Mumbai",    train: "Rajdhani Express",     price: "₹1,840" },
  { from: "MAS",  fromCity: "Chennai",    to: "SBC",  toCity: "Bengaluru", train: "Brindavan Express",    price: "₹280"   },
  { from: "HWH",  fromCity: "Kolkata",    to: "NDLS", toCity: "New Delhi", train: "Duronto Express",      price: "₹1,450" },
  { from: "PUNE", fromCity: "Pune",       to: "CSMT", toCity: "Mumbai",    train: "Deccan Queen",         price: "₹165"   },
  { from: "BPL",  fromCity: "Bhopal",     to: "NGP",  toCity: "Nagpur",    train: "Vande Bharat Express", price: "₹895"   },
  { from: "ADI",  fromCity: "Ahmedabad",  to: "NDLS", toCity: "New Delhi", train: "August Kranti Raj",    price: "₹1,200" },
  { from: "NDLS", fromCity: "New Delhi",  to: "BCT",  toCity: "Mumbai",    train: "Rajdhani (BCT)",       price: "₹1,760" },
  { from: "SBC",  fromCity: "Bengaluru",  to: "MAS",  toCity: "Chennai",   train: "Brindavan Express",    price: "₹280"   },
];

function PopularRoutes() {
  return (
    <section id="routes" className="home-routes" aria-labelledby="routes-title">
      <div className="home-section">
        <div className="home-section__eyebrow" aria-hidden="true">
          <Train size={13} />
          Explore Routes
        </div>
        <h2 id="routes-title" className="home-section__title">
          Popular Train Routes
        </h2>
        <p className="home-section__subtitle">
          Quick access to India&apos;s most-travelled corridors. Click any route to check
          live availability instantly.
        </p>

        <div className="home-routes__scroll-wrapper">
          <nav className="home-routes__grid" aria-label="Popular train routes">
            {ROUTES.map((r) => (
              <Link
                key={`${r.from}-${r.to}`}
                href={`/browse-tickets?from=${r.from}&to=${r.to}`}
                className="home-route-card reveal"
                aria-label={`${r.fromCity} to ${r.toCity} via ${r.train}`}
              >
                {/* Stations row */}
                <div className="home-route-card__stations">
                  <div className="home-route-card__station">
                    <span className="home-route-card__code">{r.from}</span>
                    <span className="home-route-card__city">{r.fromCity}</span>
                  </div>
                  <div className="home-route-card__arrow" aria-hidden="true">→</div>
                  <div className="home-route-card__station" style={{ textAlign: "right" }}>
                    <span className="home-route-card__code">{r.to}</span>
                    <span className="home-route-card__city">{r.toCity}</span>
                  </div>
                </div>
                <div className="home-route-card__train">{r.train}</div>
                <div className="home-route-card__price">from {r.price}</div>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}



/* ══════════════════════════════════════════
   CTA BANNER
══════════════════════════════════════════ */
function CtaBanner() {
  return (
    <section className="home-cta-banner" aria-labelledby="cta-title">
      <div className="home-cta-banner__inner">
        <div
          className="home-section__eyebrow"
          style={{ justifyContent: "center" }}
          aria-hidden="true"
        >
          <Zap size={13} />
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
            <Ticket size={17} aria-hidden="true" />
            Create Free Account
          </Link>
          <Link
            href="/login"
            className="home-cta-banner__btn-outline"
            aria-label="Sign in to your existing account"
          >
            Already have an account?
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   FOOTER
══════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="home-footer" aria-label="Site footer">
      <div className="home-footer__inner">
        <div className="home-footer__top">
          {/* Brand */}
          <div className="home-footer__brand">
            <div className="home-footer__logo">
              <div className="home-footer__logo-box" aria-hidden="true">
                <Train size={16} color="white" strokeWidth={2.2} />
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
              <li><Link href="/browse-tickets">Book Ticket</Link></li>
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

          {/* Legal — hidden on mobile, shown on desktop */}
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
          <span className="home-footer__bottom-right">
            <span className="home-footer__live-dot" aria-hidden="true" />
            IRCTC Authorized Partner · Aadhaar-Enabled
          </span>
        </div>
      </div>
    </footer>
  );
}

/* ── Page root ── */
export default function HomePage() {
  return (
    <div className="home-page">
      <HomeAnimations />
      <BookingsNavbar />
      <Hero />
      <Features />
      <HowItWorks />
      <PopularRoutes />

      <CtaBanner />
      <Footer />
    </div>
  );
}
