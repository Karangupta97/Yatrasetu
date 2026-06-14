"use client";

import { useState } from "react";
import BookingsNavbar from "../my-bookings/components/BookingsNavbar";
import SearchHero from "./components/SearchHero";
import SupportCards from "./components/SupportCards";
import IssueCategories from "./components/IssueCategories";
import FaqSection from "./components/FaqSection";
import ContactInfo from "./components/ContactInfo";
import SocialLinks from "./components/SocialLinks";
import ComplaintForm from "./components/ComplaintForm";

export default function ContactPage() {
  const [query, setQuery] = useState("");

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      {/* Shared navbar — identical to every other page */}
      <BookingsNavbar />

      {/* Hero search banner */}
      <SearchHero query={query} setQuery={setQuery} />

      {/* Main content — pulled up over the hero gradient bottom */}
      <main
        className="mx-auto"
        style={{ maxWidth: "1100px", padding: "0 16px 64px", marginTop: "-32px", position: "relative", zIndex: 1 }}
      >
        {/* Call / Chat / Email quick-action cards */}
        <SupportCards />

        {/* Two-column layout: left = content, right = complaint form */}
        <div className="flex gap-6 items-start flex-col lg:flex-row">

          {/* Left column */}
          <div className="flex-1 min-w-0">
            <IssueCategories />
            <FaqSection query={query} />
            <ContactInfo />
            <SocialLinks />
          </div>

          {/* Right column — sticky */}
          <div style={{ width: "100%", maxWidth: "360px", flexShrink: 0 }}>
            <ComplaintForm />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ background: "#fff", borderTop: "1px solid #e8ebed", padding: "18px 24px" }}>
        <div
          className="mx-auto flex items-center justify-between flex-wrap gap-3"
          style={{ maxWidth: "1100px" }}
        >
          <span style={{ fontSize: "13px", color: "#9ca3af" }}>
            © 2024 YatraSetu Technologies Pvt. Ltd. All rights reserved.
          </span>
          <div className="flex items-center gap-5">
            {["Privacy Policy", "Terms of Service", "Grievance Redressal"].map((l) => (
              <a key={l} href="#"
                style={{ fontSize: "13px", color: "#6b7280", textDecoration: "none" }}
                className="hover:text-blue-500 transition-colors"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
