export type BookingStatus =
  | "Confirmed"
  | "RAC"
  | "Waitlisted"
  | "Cancelled"
  | "Completed"
  | "Refund Initiated";

export type Passenger = {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  seatClass: string;
  coach: string;
  berth: string;
  status: "CNF" | "RAC" | "WL";
};

export type FareBreakdown = {
  baseFare: number;
  reservationCharges: number;
  superfastCharges: number;
  otherCharges: number;
  irctcServiceFee: number;
  discount: number;
  discountCode?: string;
  total: number;
};

export type BookingInfo = {
  bookingDate: string;
  bookedFrom: string;
  paymentMethod: string;
  transactionId: string;
};

export type Booking = {
  pnr: string;
  status: BookingStatus;
  chartStatus?: string;
  trainName: string;
  trainNumber: string;
  journeyDate: string;
  origin: { name: string; code: string; platform?: string };
  destination: { name: string; code: string; platform?: string };
  departureTime: string;
  arrivalTime: string;
  duration: string;
  distance: string;
  seatClass: string;
  seatClassCode: string;
  stops: { city: string; time: string }[];
  passengers: Passenger[];
  fare: FareBreakdown;
  bookingInfo: BookingInfo;
  refundAmount?: number;
};

export const MOCK_BOOKINGS: Booking[] = [
  {
    pnr: "ABC1234567",
    status: "Confirmed",
    chartStatus: "Chart Prepared",
    trainName: "Garib Rath Express",
    trainNumber: "12215",
    journeyDate: "Tue, 12 Sep 2023",
    origin: { name: "New Delhi", code: "NDLS", platform: "Platform 14" },
    destination: { name: "Mumbai CSMT", code: "CSMT", platform: "Platform 18" },
    departureTime: "15:45",
    arrivalTime: "09:00",
    duration: "17h 15m",
    distance: "1384 km",
    seatClass: "Sleeper",
    seatClassCode: "SL",
    stops: [
      { city: "Kota Jn", time: "20:10" },
      { city: "Nagpur", time: "02:55" },
    ],
    passengers: [
      { id: "p1", name: "Adarsh Kumar", age: 25, gender: "Male", seatClass: "Sleeper", coach: "S3", berth: "S3 - 32 (Lower)", status: "CNF" },
      { id: "p2", name: "Rahul Sharma", age: 28, gender: "Male", seatClass: "Sleeper", coach: "S3", berth: "S3 - 33 (Middle)", status: "CNF" },
    ],
    fare: {
      baseFare: 1120,
      reservationCharges: 50,
      superfastCharges: 45,
      otherCharges: 75,
      irctcServiceFee: 17.70,
      discount: -100,
      discountCode: "YATRA10",
      total: 1207.70,
    },
    bookingInfo: {
      bookingDate: "28 Aug 2023, 10:30 AM",
      bookedFrom: "YatraSetu Web",
      paymentMethod: "UPI",
      transactionId: "TRX1234567890",
    },
    refundAmount: 1054,
  },
  {
    pnr: "DEF2345678",
    status: "RAC",
    trainName: "Karnataka Express",
    trainNumber: "12628",
    journeyDate: "Wed, 13 Sep 2023",
    origin: { name: "New Delhi", code: "NDLS", platform: "Platform 9" },
    destination: { name: "Mumbai CSMT", code: "CSMT", platform: "Platform 5" },
    departureTime: "22:30",
    arrivalTime: "16:50",
    duration: "18h 20m",
    distance: "2164 km",
    seatClass: "AC 3 Tier",
    seatClassCode: "3A",
    stops: [
      { city: "Agra Cantt", time: "00:45" },
      { city: "Bhopal Jn", time: "07:20" },
      { city: "Nagpur", time: "12:05" },
    ],
    passengers: [
      { id: "p3", name: "Priya Mehta", age: 31, gender: "Female", seatClass: "AC 3 Tier", coach: "B2", berth: "B2 - 14 (Side Lower)", status: "RAC" },
    ],
    fare: {
      baseFare: 1850,
      reservationCharges: 60,
      superfastCharges: 45,
      otherCharges: 50,
      irctcServiceFee: 23.60,
      discount: 0,
      total: 2028.60,
    },
    bookingInfo: {
      bookingDate: "30 Aug 2023, 2:15 PM",
      bookedFrom: "YatraSetu Web",
      paymentMethod: "Credit Card",
      transactionId: "TRX2345678901",
    },
    refundAmount: 1826,
  },
  {
    pnr: "GHI3456789",
    status: "Waitlisted",
    trainName: "Chennai Express",
    trainNumber: "12609",
    journeyDate: "Fri, 15 Sep 2023",
    origin: { name: "New Delhi", code: "NDLS", platform: "Platform 3" },
    destination: { name: "Chennai Central", code: "MAS", platform: "Platform 10" },
    departureTime: "23:55",
    arrivalTime: "12:20",
    duration: "36h 25m",
    distance: "2182 km",
    seatClass: "AC 2 Tier",
    seatClassCode: "2A",
    stops: [
      { city: "Agra Cantt", time: "02:20" },
      { city: "Bhopal Jn", time: "09:30" },
      { city: "Nagpur", time: "15:00" },
    ],
    passengers: [
      { id: "p4", name: "Sneha Patel", age: 27, gender: "Female", seatClass: "AC 2 Tier", coach: "A1", berth: "WL-4", status: "WL" },
      { id: "p5", name: "Vivek Patel", age: 29, gender: "Male", seatClass: "AC 2 Tier", coach: "A1", berth: "WL-5", status: "WL" },
      { id: "p6", name: "Meera Patel", age: 58, gender: "Female", seatClass: "AC 2 Tier", coach: "A1", berth: "WL-6", status: "WL" },
    ],
    fare: {
      baseFare: 3240,
      reservationCharges: 60,
      superfastCharges: 75,
      otherCharges: 90,
      irctcServiceFee: 47.25,
      discount: -200,
      discountCode: "NEWUSER",
      total: 3312.25,
    },
    bookingInfo: {
      bookingDate: "01 Sep 2023, 11:00 AM",
      bookedFrom: "YatraSetu App",
      paymentMethod: "Net Banking",
      transactionId: "TRX3456789012",
    },
    refundAmount: 2981,
  },
  {
    pnr: "JKL4567890",
    status: "Cancelled",
    trainName: "Shatabdi Express",
    trainNumber: "12002",
    journeyDate: "Sun, 10 Sep 2023",
    origin: { name: "New Delhi", code: "NDLS", platform: "Platform 3" },
    destination: { name: "Bhopal Jn", code: "BPL", platform: "Platform 2" },
    departureTime: "06:00",
    arrivalTime: "11:55",
    duration: "5h 55m",
    distance: "704 km",
    seatClass: "Chair Car",
    seatClassCode: "CC",
    stops: [
      { city: "Agra Cantt", time: "07:58" },
      { city: "Gwalior", time: "09:10" },
    ],
    passengers: [
      { id: "p7", name: "Arjun Singh", age: 35, gender: "Male", seatClass: "Chair Car", coach: "C1", berth: "C1 - 42", status: "CNF" },
    ],
    fare: {
      baseFare: 1620,
      reservationCharges: 40,
      superfastCharges: 75,
      otherCharges: 30,
      irctcServiceFee: 20.40,
      discount: 0,
      total: 1785.40,
    },
    bookingInfo: {
      bookingDate: "05 Sep 2023, 9:45 AM",
      bookedFrom: "YatraSetu Web",
      paymentMethod: "Debit Card",
      transactionId: "TRX4567890123",
    },
    refundAmount: 0,
  },
  {
    pnr: "MNO5678901",
    status: "Completed",
    trainName: "Duronto Express",
    trainNumber: "12246",
    journeyDate: "Sun, 03 Sep 2023",
    origin: { name: "Mumbai CSMT", code: "CSMT", platform: "Platform 4" },
    destination: { name: "Howrah Jn", code: "HWH", platform: "Platform 7" },
    departureTime: "20:15",
    arrivalTime: "07:40",
    duration: "35h 25m",
    distance: "2020 km",
    seatClass: "AC 3 Tier",
    seatClassCode: "3A",
    stops: [
      { city: "Nagpur", time: "04:30" },
      { city: "Raipur", time: "10:15" },
    ],
    passengers: [
      { id: "p8", name: "Kavya Nair", age: 24, gender: "Female", seatClass: "AC 3 Tier", coach: "B4", berth: "B4 - 22 (Upper)", status: "CNF" },
      { id: "p9", name: "Arun Nair", age: 26, gender: "Male", seatClass: "AC 3 Tier", coach: "B4", berth: "B4 - 23 (Lower)", status: "CNF" },
    ],
    fare: {
      baseFare: 2800,
      reservationCharges: 60,
      superfastCharges: 75,
      otherCharges: 80,
      irctcServiceFee: 37.65,
      discount: -150,
      discountCode: "MONSOON",
      total: 2902.65,
    },
    bookingInfo: {
      bookingDate: "25 Aug 2023, 4:30 PM",
      bookedFrom: "YatraSetu Web",
      paymentMethod: "UPI",
      transactionId: "TRX5678901234",
    },
  },
  {
    pnr: "PQR6789012",
    status: "Waitlisted",
    trainName: "Rajdhani Express",
    trainNumber: "12951",
    journeyDate: "Tue, 19 Sep 2023",
    origin: { name: "New Delhi", code: "NDLS", platform: "Platform 1" },
    destination: { name: "Mumbai CSMT", code: "CSMT", platform: "Platform 2" },
    departureTime: "16:55",
    arrivalTime: "08:35",
    duration: "15h 40m",
    distance: "1386 km",
    seatClass: "AC 2 Tier",
    seatClassCode: "2A",
    stops: [
      { city: "Kota Jn", time: "21:40" },
      { city: "Surat", time: "05:20" },
    ],
    passengers: [
      { id: "p10", name: "Deepak Verma", age: 42, gender: "Male", seatClass: "AC 2 Tier", coach: "A2", berth: "WL-2", status: "WL" },
    ],
    fare: {
      baseFare: 2420,
      reservationCharges: 60,
      superfastCharges: 45,
      otherCharges: 60,
      irctcServiceFee: 31.85,
      discount: 0,
      total: 2616.85,
    },
    bookingInfo: {
      bookingDate: "10 Sep 2023, 8:00 AM",
      bookedFrom: "YatraSetu App",
      paymentMethod: "UPI",
      transactionId: "TRX6789012345",
    },
    refundAmount: 2355,
  },
];
