export type NotifType = "success" | "warning" | "info" | "error";

export type Notification = {
  id: number;
  category: "booking" | "payment" | "refund" | "alert" | "offer" | "account";
  type: NotifType;
  title: string;
  body: string;
  time: string;
  date: string; // grouping label
  read: boolean;
  pnr?: string;
  amount?: string;
  trainName?: string;
};

export const ALL_NOTIFICATIONS: Notification[] = [
  // ── Today ──────────────────────────────────────────────
  {
    id: 1,
    category: "booking",
    type: "success",
    title: "Booking Confirmed",
    body: "Your ticket for Rajdhani Express on 12 Sep has been confirmed. Seat S3-32 (Lower) in coach S3.",
    time: "2 min ago",
    date: "Today",
    read: false,
    pnr: "ABC1234567",
    trainName: "Rajdhani Express",
  },
  {
    id: 2,
    category: "refund",
    type: "info",
    title: "Refund Processed",
    body: "₹1,054 refund for your cancelled Karnataka Express ticket has been credited to your UPI account.",
    time: "1 hr ago",
    date: "Today",
    read: false,
    amount: "₹1,054",
    trainName: "Karnataka Express",
  },
  {
    id: 3,
    category: "payment",
    type: "success",
    title: "Payment Successful",
    body: "Payment of ₹2,340 for Duronto Express (PNR: DEF2345678) processed successfully via UPI.",
    time: "2 hr ago",
    date: "Today",
    read: false,
    amount: "₹2,340",
    pnr: "DEF2345678",
    trainName: "Duronto Express",
  },
  // ── Yesterday ──────────────────────────────────────────
  {
    id: 4,
    category: "alert",
    type: "warning",
    title: "Train Running Late",
    body: "Duronto Express (12246) is running 45 minutes behind schedule. New expected arrival: 07:25.",
    time: "Yesterday, 6:30 PM",
    date: "Yesterday",
    read: true,
    trainName: "Duronto Express",
  },
  {
    id: 5,
    category: "booking",
    type: "info",
    title: "Tatkal Booking Opens",
    body: "Tatkal quota for New Delhi → Mumbai CSMT opens tomorrow at 10:00 AM. Book fast — limited seats.",
    time: "Yesterday, 9:00 AM",
    date: "Yesterday",
    read: true,
  },
  {
    id: 6,
    category: "booking",
    type: "success",
    title: "Seat Upgraded",
    body: "Great news! Your RAC ticket for August Kranti Rajdhani has been upgraded to CNF berth S3-22 (Lower).",
    time: "Yesterday, 8:15 AM",
    date: "Yesterday",
    read: true,
    pnr: "GHI3456789",
    trainName: "August Kranti Rajdhani",
  },
  // ── This week ──────────────────────────────────────────
  {
    id: 7,
    category: "payment",
    type: "error",
    title: "Payment Failed",
    body: "Your payment of ₹3,312 for Chennai Express failed. Amount will be refunded within 5–7 business days if deducted.",
    time: "2 days ago",
    date: "This week",
    read: true,
    amount: "₹3,312",
    trainName: "Chennai Express",
  },
  {
    id: 8,
    category: "refund",
    type: "info",
    title: "Refund Initiated",
    body: "Cancellation accepted for Shatabdi Express (PNR: JKL4567890). Refund of ₹1,785 will be processed in 5–7 days.",
    time: "3 days ago",
    date: "This week",
    read: true,
    amount: "₹1,785",
    pnr: "JKL4567890",
    trainName: "Shatabdi Express",
  },
  {
    id: 9,
    category: "offer",
    type: "info",
    title: "Special Offer",
    body: "Use coupon YATRA10 to get 10% off on your next booking. Valid till 30 Sep 2024.",
    time: "4 days ago",
    date: "This week",
    read: true,
  },
  {
    id: 10,
    category: "alert",
    type: "warning",
    title: "PNR Chart Prepared",
    body: "Chart for Garib Rath Express (PNR: MNO5678901) has been prepared. Your seat: S3-18 (Middle).",
    time: "5 days ago",
    date: "This week",
    read: true,
    pnr: "MNO5678901",
    trainName: "Garib Rath Express",
  },
  // ── Older ──────────────────────────────────────────────
  {
    id: 11,
    category: "account",
    type: "success",
    title: "Profile Updated",
    body: "Your mobile number and email have been updated successfully. These will be used for all future bookings.",
    time: "10 days ago",
    date: "Older",
    read: true,
  },
  {
    id: 12,
    category: "booking",
    type: "info",
    title: "Journey Reminder",
    body: "Your journey on Rajdhani Express from New Delhi is tomorrow. Check platform & arrival time before you travel.",
    time: "12 days ago",
    date: "Older",
    read: true,
    pnr: "PQR6789012",
    trainName: "Rajdhani Express",
  },
];

export const CATEGORY_LABELS: Record<Notification["category"], string> = {
  booking:  "Booking",
  payment:  "Payment",
  refund:   "Refund",
  alert:    "Alerts",
  offer:    "Offers",
  account:  "Account",
};
