// ── Booking flow shared types ──────────────────────────────────

export type TransportType = "train" | "bus";

export type SeatClass = {
  code: string;
  label: string;
  price: number;
  available: number;
};

export type Passenger = {
  id: string;
  name: string;
  age: string;
  gender: "Male" | "Female" | "Other" | "";
  idType: "Aadhaar" | "PAN" | "Passport" | "Voter ID" | "";
  idNumber: string;
  kycVerified: boolean;
};

export type SeatStatus = "available" | "selected" | "occupied" | "ladies" | "senior";

export type Seat = {
  id: string;
  number: string;
  type: "Lower" | "Middle" | "Upper" | "Side Lower" | "Side Upper";
  status: SeatStatus;
  price?: number;
};

export type Coach = {
  id: string;
  name: string;
  type: string;
  seats: Seat[];
};

export type FareBreakdown = {
  baseFare: number;
  reservationFee: number;
  superfastCharge: number;
  gst: number;
  irctcFee: number;
  discount: number;
  couponCode?: string;
  total: number;
};

export type PaymentMethod = "upi" | "card" | "netbanking" | "wallet";

export type BookingState = {
  // Step 1
  from: string;
  to: string;
  departDate: string;
  returnDate: string;
  returnEnabled: boolean;
  passengers: number;
  transportType: TransportType;
  selectedClass: SeatClass | null;
  trainName: string;
  trainNumber: string;

  // Step 2
  passengerDetails: Passenger[];
  contactEmail: string;
  contactPhone: string;

  // Step 3
  selectedSeats: Seat[];
  selectedCoach: string;

  // Step 5
  paymentMethod: PaymentMethod | null;
  upiId: string;

  // Step 6
  pnr: string;
  bookingId: string;
  confirmedAt: string;
  fare: FareBreakdown;
  couponInput: string;
  appliedCoupon: string;
};

export const SEAT_CLASSES: SeatClass[] = [
  { code: "SL",  label: "Sleeper (SL)",        price: 845,  available: 42 },
  { code: "3A",  label: "AC 3 Tier (3A)",       price: 2240, available: 18 },
  { code: "2A",  label: "AC 2 Tier (2A)",       price: 3180, available: 6  },
  { code: "1A",  label: "AC First Class (1A)",  price: 5640, available: 2  },
];

export const POPULAR_ROUTES = [
  { from: "New Delhi", to: "Mumbai CSMT" },
  { from: "New Delhi", to: "Chennai Central" },
  { from: "Mumbai CSMT", to: "Kolkata" },
  { from: "Bengaluru", to: "Hyderabad" },
];

export function makeFare(basePerPax: number, pax: number, coupon?: string): FareBreakdown {
  const base   = basePerPax * pax;
  const res    = 60 * pax;
  const sf     = 45 * pax;
  const gst    = Math.round(base * 0.05);
  const irctc  = Math.round(base * 0.015);
  const discount = coupon === "YATRA10" ? -Math.round(base * 0.10) : coupon === "NEWUSER" ? -200 : 0;
  return {
    baseFare: base,
    reservationFee: res,
    superfastCharge: sf,
    gst,
    irctcFee: irctc,
    discount,
    couponCode: coupon,
    total: base + res + sf + gst + irctc + discount,
  };
}

export function generatePNR(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const nums  = "0123456789";
  return (
    Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join("") +
    Array.from({ length: 7 }, () => nums[Math.floor(Math.random() * nums.length)]).join("")
  );
}
