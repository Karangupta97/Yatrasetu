"use client";

// Re-export the shared navbar so the passenger page uses
// the same component as every other page in the app.
// This keeps all nav links, active states, icons, and
// spacing identical across Browse Tickets, My Bookings,
// Contact Us, etc.
export { default } from "../../my-bookings/components/BookingsNavbar";
