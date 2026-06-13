export type Stop = {
  city: string;
  date: string;
  time?: string;
};

export type ClassAvailability = {
  code: string;       // "SL" | "3A" | "2A" | "1A"
  label: string;      // display name
  price: number;
  status: string;     // "AVL 6" | "WL 12 → -40% confirm" | "RAC 2" | "AVAILABLE"
  available: boolean; // whether bookable
};

export type Train = {
  id: string;
  name: string;
  trainNumber: string;
  runsOn: string;           // "Mon Wed Fri Sun"
  operator: string;
  initials: string;
  logoColor: string;
  badge?: { label: string; type: "cheapest" | "recommended" | "popular" };
  seatsLeft?: number;
  tags?: string[];           // ["Eco coach", "Pantry car available", etc.]
  departure: { time: string; city: string; date: string; platform?: string };
  arrival:   { time: string; city: string; date: string; platform?: string };
  stops: Stop[];
  distance: string;          // "1386 km"
  duration: string;
  features: string[];        // ["Pantry car available", "Divyang coach: B2", "No Wi-Fi"]
  rating: string;            // "4.1 · 3.2k ratings"
  classes: ClassAvailability[];
  tatkalTime?: string;       // "9 AM"
  price: number;             // lowest class price (for sorting/filtering)
  returnLeg?: {
    departure: { time: string; city: string; date: string };
    arrival:   { time: string; city: string; date: string };
    stops: Stop[];
    duration: string;
    price: number;
  };
};

export const TRAINS: Train[] = [
  {
    id: "1",
    name: "Rajdhani Express",
    trainNumber: "12951",
    runsOn: "Daily",
    operator: "Indian Railways",
    initials: "RJ",
    logoColor: "#f4632a",
    badge: { label: "Cheapest", type: "cheapest" },
    tags: ["Premium"],
    departure: { time: "16:00", city: "New Delhi",   date: "Tue 12 Sep", platform: "Platform 1" },
    arrival:   { time: "08:15", city: "Mumbai CSMT", date: "Wed 13 Sep", platform: "Platform 2" },
    stops: [
      { city: "Kota Jn",   date: "Tue 12 Sep", time: "20:42" },
      { city: "Vadodara",  date: "Wed 13 Sep", time: "03:35" },
      { city: "Surat",     date: "Wed 13 Sep", time: "05:47" },
    ],
    distance: "1384 km",
    duration: "16h 15m",
    features: ["Pantry car available", "Divyang coach: A1", "Wi-Fi available"],
    rating: "4.3 · 5.1k ratings",
    classes: [
      { code: "SL",  label: "Sleeper",        price: 840,  status: "AVL 42",              available: true  },
      { code: "3A",  label: "AC 3 Tier",       price: 1840, status: "AVL 12",              available: true  },
      { code: "2A",  label: "AC 2 Tier",       price: 2690, status: "AVL 6",               available: true  },
      { code: "1A",  label: "AC First Class",  price: 4560, status: "RAC 3",               available: true  },
    ],
    tatkalTime: "10 AM",
    price: 840,
    returnLeg: {
      departure: { time: "17:00", city: "Mumbai CSMT", date: "Thu 14 Sep" },
      arrival:   { time: "09:40", city: "New Delhi",   date: "Fri 15 Sep" },
      stops: [
        { city: "Surat",    date: "Thu 14 Sep", time: "19:00" },
        { city: "Vadodara", date: "Thu 14 Sep", time: "21:10" },
        { city: "Kota Jn",  date: "Fri 15 Sep", time: "04:15" },
      ],
      duration: "16h 40m",
      price: 840,
    },
  },
  {
    id: "2",
    name: "Duronto Express",
    trainNumber: "12269",
    runsOn: "Tue Thu Sat",
    operator: "Indian Railways",
    initials: "DU",
    logoColor: "#748efe",
    badge: { label: "Recommended", type: "recommended" },
    departure: { time: "11:30", city: "New Delhi",   date: "Tue 12 Sep", platform: "Platform 5" },
    arrival:   { time: "04:05", city: "Mumbai CSMT", date: "Wed 13 Sep", platform: "Platform 4" },
    stops: [
      { city: "Vadodara", date: "Wed 13 Sep", time: "00:18" },
      { city: "Surat",    date: "Wed 13 Sep", time: "02:05" },
    ],
    distance: "1388 km",
    duration: "16h 35m",
    features: ["Pantry car available", "No Wi-Fi", "Divyang coach: D1"],
    rating: "4.1 · 3.8k ratings",
    classes: [
      { code: "3A",  label: "AC 3 Tier",      price: 2340, status: "AVL 28",              available: true  },
      { code: "2A",  label: "AC 2 Tier",       price: 3350, status: "WL 4 → confirm",     available: true  },
      { code: "1A",  label: "AC First Class",  price: 5680, status: "AVL 2",               available: true  },
    ],
    tatkalTime: "10 AM",
    price: 2340,
    returnLeg: {
      departure: { time: "06:00", city: "Mumbai CSMT", date: "Thu 14 Sep" },
      arrival:   { time: "22:50", city: "New Delhi",   date: "Thu 14 Sep" },
      stops: [
        { city: "Surat",    date: "Thu 14 Sep", time: "07:55" },
        { city: "Vadodara", date: "Thu 14 Sep", time: "09:42" },
      ],
      duration: "16h 50m",
      price: 2340,
    },
  },
  {
    id: "3",
    name: "August Kranti Rajdhani",
    trainNumber: "12953",
    runsOn: "Mon Wed Fri",
    operator: "Indian Railways",
    initials: "AK",
    logoColor: "#22a85a",
    badge: { label: "Popular", type: "popular" },
    seatsLeft: 11,
    tags: ["Eco coach"],
    departure: { time: "17:40", city: "New Delhi",   date: "Tue 12 Sep", platform: "Platform 6" },
    arrival:   { time: "10:55", city: "Mumbai CSMT", date: "Wed 13 Sep", platform: "Platform 1" },
    stops: [
      { city: "Kota Jn",  date: "Tue 12 Sep", time: "22:15" },
      { city: "Vadodara", date: "Wed 13 Sep", time: "05:10" },
      { city: "Surat",    date: "Wed 13 Sep", time: "07:30" },
    ],
    distance: "1386 km",
    duration: "17h 15m",
    features: ["Pantry car available", "Divyang coach: B2", "No Wi-Fi"],
    rating: "4.0 · 2.9k ratings",
    classes: [
      { code: "SL",  label: "Sleeper",        price: 1640, status: "AVL 11",              available: true  },
      { code: "3A",  label: "AC 3 Tier",       price: 2490, status: "WL 8 → -30% confirm", available: true  },
      { code: "2A",  label: "AC 2 Tier",       price: 3580, status: "RAC 4",               available: true  },
      { code: "1A",  label: "AC First Class",  price: 6100, status: "AVL 1",               available: true  },
    ],
    tatkalTime: "9 AM",
    price: 1640,
  },
  {
    id: "4",
    name: "Shatabdi Express",
    trainNumber: "12009",
    runsOn: "Mon Tue Wed Thu Fri Sat",
    operator: "Indian Railways",
    initials: "SH",
    logoColor: "#9333ea",
    departure: { time: "06:00", city: "New Delhi",   date: "Tue 12 Sep", platform: "Platform 3" },
    arrival:   { time: "22:30", city: "Mumbai CSMT", date: "Tue 12 Sep", platform: "Platform 6" },
    stops: [
      { city: "Mathura Jn", date: "Tue 12 Sep", time: "07:40" },
      { city: "Agra Cantt", date: "Tue 12 Sep", time: "08:25" },
      { city: "Gwalior",    date: "Tue 12 Sep", time: "10:05" },
      { city: "Jhansi",     date: "Tue 12 Sep", time: "11:30" },
    ],
    distance: "1390 km",
    duration: "16h 30m",
    features: ["Catering included", "Wi-Fi available", "Divyang coach: C1"],
    rating: "4.4 · 6.2k ratings",
    classes: [
      { code: "CC",  label: "Chair Car",       price: 1755, status: "AVL 60",              available: true  },
      { code: "EC",  label: "Exec. Chair Car", price: 2890, status: "AVL 18",              available: true  },
    ],
    tatkalTime: "10 AM",
    price: 1755,
  },
  {
    id: "5",
    name: "Garib Rath Express",
    trainNumber: "12909",
    runsOn: "Mon Wed Fri Sun",
    operator: "Indian Railways",
    initials: "GR",
    logoColor: "#0891b2",
    badge: { label: "Cheapest", type: "cheapest" },
    seatsLeft: 6,
    tags: ["Eco coach"],
    departure: { time: "15:45", city: "New Delhi",   date: "Tue 12 Sep", platform: "Platform 8" },
    arrival:   { time: "09:00", city: "Mumbai CSMT", date: "Wed 13 Sep", platform: "Platform 3" },
    stops: [
      { city: "Kota Jn",  date: "Tue 12 Sep", time: "20:10" },
      { city: "Nagpur",   date: "Wed 13 Sep", time: "02:55" },
      { city: "Bhusaval", date: "Wed 13 Sep", time: "05:30" },
    ],
    distance: "1386 km",
    duration: "17h 15m",
    features: ["Pantry car available", "Divyang coach: B2", "No Wi-Fi"],
    rating: "4.1 · 3.2k ratings",
    classes: [
      { code: "SL",  label: "Sleeper",        price: 1290, status: "AVL 6",               available: true  },
      { code: "3A",  label: "AC 3 Tier",       price: 2850, status: "WL 12 → -40% confirm", available: true },
      { code: "2A",  label: "AC 2 Tier",       price: 4100, status: "AVL 18",              available: true  },
      { code: "1A",  label: "AC First Class",  price: 7200, status: "RAC 2",               available: true  },
    ],
    tatkalTime: "9 AM",
    price: 1290,
  },
  {
    id: "6",
    name: "Karnataka Express",
    trainNumber: "12627",
    runsOn: "Daily",
    operator: "Indian Railways",
    initials: "KE",
    logoColor: "#dc2626",
    departure: { time: "22:30", city: "New Delhi",   date: "Tue 12 Sep", platform: "Platform 9" },
    arrival:   { time: "16:50", city: "Mumbai CSMT", date: "Wed 13 Sep", platform: "Platform 5" },
    stops: [
      { city: "Agra Cantt", date: "Wed 13 Sep", time: "00:45" },
      { city: "Bhopal Jn",  date: "Wed 13 Sep", time: "07:20" },
      { city: "Nagpur",     date: "Wed 13 Sep", time: "12:05" },
    ],
    distance: "2164 km",
    duration: "18h 20m",
    features: ["Pantry car available", "No Wi-Fi", "Divyang coach: S5"],
    rating: "3.9 · 2.1k ratings",
    classes: [
      { code: "SL",  label: "Sleeper",        price: 1450, status: "AVL 34",              available: true  },
      { code: "3A",  label: "AC 3 Tier",       price: 2200, status: "AVL 22",              available: true  },
      { code: "2A",  label: "AC 2 Tier",       price: 3100, status: "WL 3 → confirm",     available: true  },
    ],
    tatkalTime: "9 AM",
    price: 1450,
  },
  {
    id: "7",
    name: "Punjab Mail",
    trainNumber: "12137",
    runsOn: "Daily",
    operator: "Indian Railways",
    initials: "PM",
    logoColor: "#b45309",
    badge: { label: "Popular", type: "popular" },
    departure: { time: "19:00", city: "New Delhi",   date: "Tue 12 Sep", platform: "Platform 12" },
    arrival:   { time: "13:35", city: "Mumbai CSMT", date: "Wed 13 Sep", platform: "Platform 7" },
    stops: [
      { city: "Mathura Jn", date: "Tue 12 Sep", time: "20:30" },
      { city: "Kota Jn",    date: "Wed 13 Sep", time: "01:15" },
      { city: "Vadodara",   date: "Wed 13 Sep", time: "10:05" },
    ],
    distance: "1542 km",
    duration: "18h 35m",
    features: ["Pantry car available", "Divyang coach: S3", "No Wi-Fi"],
    rating: "3.8 · 1.7k ratings",
    classes: [
      { code: "SL",  label: "Sleeper",        price: 1760, status: "AVL 48",              available: true  },
      { code: "3A",  label: "AC 3 Tier",       price: 2620, status: "AVL 14",              available: true  },
      { code: "2A",  label: "AC 2 Tier",       price: 3750, status: "RAC 6",               available: true  },
      { code: "1A",  label: "AC First Class",  price: 6280, status: "AVL 3",               available: true  },
    ],
    tatkalTime: "9 AM",
    price: 1760,
  },
  {
    id: "8",
    name: "Golden Temple Mail",
    trainNumber: "12903",
    runsOn: "Daily",
    operator: "Indian Railways",
    initials: "GT",
    logoColor: "#d97706",
    departure: { time: "09:30", city: "New Delhi",   date: "Tue 12 Sep", platform: "Platform 2" },
    arrival:   { time: "03:10", city: "Mumbai CSMT", date: "Wed 13 Sep", platform: "Platform 8" },
    stops: [
      { city: "Agra Cantt", date: "Tue 12 Sep", time: "11:10" },
      { city: "Jhansi",     date: "Tue 12 Sep", time: "14:20" },
      { city: "Bhopal Jn",  date: "Tue 12 Sep", time: "18:05" },
      { city: "Khandwa",    date: "Tue 12 Sep", time: "22:30" },
    ],
    distance: "1542 km",
    duration: "17h 40m",
    features: ["Pantry car available", "Wi-Fi available", "Divyang coach: B1"],
    rating: "4.2 · 4.4k ratings",
    classes: [
      { code: "SL",  label: "Sleeper",        price: 1980, status: "AVL 52",              available: true  },
      { code: "3A",  label: "AC 3 Tier",       price: 2890, status: "AVL 20",              available: true  },
      { code: "2A",  label: "AC 2 Tier",       price: 4100, status: "WL 2 → confirm",     available: true  },
      { code: "1A",  label: "AC First Class",  price: 6900, status: "AVL 4",               available: true  },
    ],
    tatkalTime: "10 AM",
    price: 1980,
    returnLeg: {
      departure: { time: "10:00", city: "Mumbai CSMT", date: "Thu 14 Sep" },
      arrival:   { time: "04:15", city: "New Delhi",   date: "Fri 15 Sep" },
      stops: [
        { city: "Khandwa",   date: "Thu 14 Sep", time: "15:30" },
        { city: "Bhopal Jn", date: "Thu 14 Sep", time: "19:50" },
        { city: "Jhansi",    date: "Fri 15 Sep", time: "23:05" },
      ],
      duration: "18h 15m",
      price: 1980,
    },
  },
  {
    id: "9",
    name: "Tejas Express",
    trainNumber: "22119",
    runsOn: "Mon Wed Fri Sun",
    operator: "Indian Railways",
    initials: "TE",
    logoColor: "#0284c7",
    badge: { label: "Recommended", type: "recommended" },
    tags: ["Premium"],
    departure: { time: "06:10", city: "New Delhi",   date: "Tue 12 Sep", platform: "Platform 4" },
    arrival:   { time: "22:45", city: "Mumbai CSMT", date: "Tue 12 Sep", platform: "Platform 9" },
    stops: [
      { city: "Kota Jn", date: "Tue 12 Sep", time: "10:55" },
      { city: "Surat",   date: "Tue 12 Sep", time: "19:20" },
    ],
    distance: "1386 km",
    duration: "16h 35m",
    features: ["Catering included", "Wi-Fi available", "Divyang coach: C2"],
    rating: "4.5 · 7.0k ratings",
    classes: [
      { code: "EC",  label: "Exec. Chair Car", price: 2650, status: "AVL 10",              available: true  },
      { code: "CC",  label: "Chair Car",       price: 1650, status: "AVL 38",              available: true  },
    ],
    tatkalTime: "10 AM",
    price: 1650,
  },
  {
    id: "10",
    name: "Humsafar Express",
    trainNumber: "20103",
    runsOn: "Tue Fri",
    operator: "Indian Railways",
    initials: "HU",
    logoColor: "#7c3aed",
    seatsLeft: 3,
    tags: ["Eco coach"],
    departure: { time: "23:55", city: "New Delhi",   date: "Tue 12 Sep", platform: "Platform 7" },
    arrival:   { time: "19:30", city: "Mumbai CSMT", date: "Wed 13 Sep", platform: "Platform 11" },
    stops: [
      { city: "Agra Cantt", date: "Wed 13 Sep", time: "02:15" },
      { city: "Bhopal Jn",  date: "Wed 13 Sep", time: "08:40" },
      { city: "Nagpur",     date: "Wed 13 Sep", time: "13:20" },
      { city: "Bhusaval",   date: "Wed 13 Sep", time: "16:00" },
    ],
    distance: "1542 km",
    duration: "19h 35m",
    features: ["Pantry car available", "No Wi-Fi", "Divyang coach: B4"],
    rating: "4.0 · 1.9k ratings",
    classes: [
      { code: "3A",  label: "AC 3 Tier",       price: 2100, status: "AVL 3",               available: true  },
      { code: "2A",  label: "AC 2 Tier",       price: 3200, status: "WL 6 → -20% confirm", available: true  },
    ],
    tatkalTime: "9 AM",
    price: 2100,
  },
];
