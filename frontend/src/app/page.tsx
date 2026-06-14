/**
 * YatraSetu — Landing / Home Page ( / ) v2
 *
 * Enhanced with professional animations, scroll-triggered reveals,
 * shimmer buttons, animated route SVG, count-up stats, rich route cards,
 * CTA blobs, and polished hover effects.
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
  Smartphone,
  QrCode,
  BadgeCheck,
  Search,
  CreditCard,
  CheckCircle,
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

/* ══════════════════════════════════════════
   HERO — section
══════════════════════════════════════════ */
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
        {/* Static gradient overlay */}
        <div className="home-hero__overlay" aria-hidden="true" />
        {/* Animated radial gradient */}
        <div
          className="home-hero__gradient-anim"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse at 30% 60%, rgba(30,27,75,0.45) 0%, rgba(17,24,75,0.3) 40%, transparent 70%)",
          }}
        />
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

/* ══════════════════════════════════════════
   FEATURES
══════════════════════════════════════════ */
const FEATURES = [
  {
    icon: <ShieldCheck size={24} strokeWidth={1.75} />,
    iconBg: "rgba(99,102,241,0.1)",
    iconColor: "#6366f1",
    title: "Aadhaar-Verified Accounts",
    desc: "Every account is KYC-verified with Aadhaar to ensure genuine identity and maximum security for all passengers.",
  },
  {
    icon: <QrCode size={24} strokeWidth={1.75} />,
    iconBg: "rgba(22,163,74,0.1)",
    iconColor: "#16A34A",
    title: "Instant Digital Tickets",
    desc: "Get your QR-code digital ticket the moment you book. No printing needed — show on any device at the station.",
  },
  {
    icon: <Activity size={24} strokeWidth={1.75} />,
    iconBg: "rgba(99,102,241,0.1)",
    iconColor: "#6366f1",
    title: "Real-Time PNR Tracking",
    desc: "Live updates on your train status, platform changes, and seat availability straight from the IRCTC database.",
  },
  {
    icon: <Lock size={24} strokeWidth={1.75} />,
    iconBg: "rgba(220,38,38,0.08)",
    iconColor: "#DC2626",
    title: "Bank-Grade Security",
    desc: "End-to-end encrypted transactions with fraud detection and multi-factor authentication protecting every booking.",
  },
  {
    icon: <Smartphone size={24} strokeWidth={1.75} />,
    iconBg: "rgba(99,102,241,0.1)",
    iconColor: "#6366f1",
    title: "Works Offline (PWA)",
    desc: "Install YatraSetu as a progressive web app. View your tickets and PNR status even without internet connectivity.",
  },
  {
    icon: <Headphones size={24} strokeWidth={1.75} />,
    iconBg: "rgba(245,158,11,0.1)",
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

/* ══════════════════════════════════════════
   HOW IT WORKS
══════════════════════════════════════════ */
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
    <section id="how-it-works" className="home-hiw" aria-labelledby="hiw-title">
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

        <div className="home-hiw__steps-wrapper">
          {/* Animated connector line (desktop only) */}
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
   POPULAR ROUTES — Rich cards
══════════════════════════════════════════ */
const ROUTES = [
  { from: "NDLS", fromCity: "New Delhi",  to: "CSMT", toCity: "Mumbai",    train: "Rajdhani Express",        price: "₹1,840" },
  { from: "MAS",  fromCity: "Chennai",    to: "SBC",  toCity: "Bengaluru", train: "Brindavan Express",       price: "₹280" },
  { from: "HWH",  fromCity: "Kolkata",    to: "NDLS", toCity: "New Delhi", train: "Duronto Express",         price: "₹1,450" },
  { from: "PUNE", fromCity: "Pune",       to: "CSMT", toCity: "Mumbai",    train: "Deccan Queen",            price: "₹165" },
  { from: "BPL",  fromCity: "Bhopal",     to: "NGP",  toCity: "Nagpur",    train: "Vande Bharat",            price: "₹895" },
  { from: "ADI",  fromCity: "Ahmedabad",  to: "NDLS", toCity: "New Delhi", train: "August Kranti Raj",       price: "₹1,200" },
  { from: "NDLS", fromCity: "New Delhi",  to: "BCT",  toCity: "Mumbai",    train: "Rajdhani Express (BCT)",  price: "₹1,760" },
  { from: "SBC",  fromCity: "Bengaluru",  to: "MAS",  toCity: "Chennai",   train: "Brindavan Express",       price: "₹280" },
];

function PopularRoutes() {
  return (
    <section id="routes" className="home-routes" aria-labelledby="routes-title">
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

        <div className="home-routes__scroll-wrapper">
          <nav className="home-routes__grid" aria-label="Popular train routes">
            {ROUTES.map((r) => (
              <Link
                key={`${r.from}-${r.to}`}
                href={`/passenger?from=${r.from}&to=${r.to}`}
                className="home-route-card"
                aria-label={`${r.from} to ${r.to} — ${r.train}`}
              >
                {/* Station row */}
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

                {/* Train name */}
                <div className="home-route-card__train">{r.train}</div>

                {/* Price badge */}
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
   TRUST / STATS — count-up on scroll
══════════════════════════════════════════ */
const TRUST_ITEMS = [
  {
    icon: <Award size={22} strokeWidth={1.6} />,
    countTo: "50",
    suffix: "M+",
    label: "Registered Users",
  },
  {
    icon: <Ticket size={22} strokeWidth={1.6} />,
    countTo: "2",
    suffix: "M+",
    label: "Daily Bookings",
  },
  {
    icon: <Users size={22} strokeWidth={1.6} />,
    countTo: "99.9",
    suffix: "%",
    label: "Uptime SLA",
  },
  {
    icon: <ShieldCheck size={22} strokeWidth={1.6} />,
    countTo: "0",
    suffix: "",
    label: "Data Breaches",
  },
  {
    icon: <CheckCircle size={22} strokeWidth={1.6} />,
    countTo: "0",
    suffix: "",
    prefix: "₹",
    label: "Hidden Charges",
  },
];

function TrustBand() {
  return (
    <section className="home-trust" aria-labelledby="trust-title">
      <div className="home-trust__inner">
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
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
              <div className="home-trust__icon-wrap" aria-hidden="true">
                {item.icon}
              </div>
              {/* data-count-to triggers count-up via HomeAnimations */}
              <dt
                className="home-trust__num"
                data-count-to={item.countTo}
                data-suffix={item.suffix}
                data-prefix={item.prefix ?? ""}
                aria-label={`${item.prefix ?? ""}${item.countTo}${item.suffix}`}
              >
                {item.prefix ?? ""}{item.countTo}{item.suffix}
              </dt>
              <dd className="home-trust__label">{item.label}</dd>
            </div>
          ))}
        </dl>
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
            className="home-cta-banner__btn-outline"
            aria-label="Sign in to your existing account"
          >
            Already have an account?
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

          {/* Legal */}
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

/* ── Page ── */
export default function HomePage() {
  return (
    <div className="home-page">
      {/* Client-side animation wiring (IntersectionObserver + count-up) */}
      <HomeAnimations />
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
