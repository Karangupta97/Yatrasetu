"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Ticket, ArrowRight } from "lucide-react";
import { loadSessionUser } from "@/lib/auth-store";

export default function HomeHeroCta() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(loadSessionUser());
  }, []);

  if (user) {
    return (
      <div className="home-hero__cta">
        <Link
          href="/passenger"
          className="home-hero__btn home-hero__btn--primary"
          aria-label="Book a ticket"
        >
          <Ticket size={18} aria-hidden="true" />
          Book Your Ticket Now
        </Link>
        <Link
          href="/my-bookings"
          className="home-hero__btn home-hero__btn--outline"
          aria-label="View your bookings"
        >
          My Bookings
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    );
  }

  return (
    <div className="home-hero__cta">
      <Link
        href="/register"
        className="home-hero__btn home-hero__btn--primary"
        aria-label="Create your free account"
      >
        <Ticket size={18} aria-hidden="true" />
        Book Your First Ticket
      </Link>
      <Link
        href="/login"
        className="home-hero__btn home-hero__btn--outline"
        aria-label="Sign in to your existing account"
      >
        Sign In
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </div>
  );
}
