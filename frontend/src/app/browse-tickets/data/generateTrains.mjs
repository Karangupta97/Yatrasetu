#!/usr/bin/env node
/**
 * generateTrains.mjs
 * Generates 5000+ realistic Indian Railways train entries as JSON.
 * Run: node generateTrains.mjs
 * Output: ../../public/data/trains.json
 */
import { writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ═══════════════════════════════════════════════════════════════════
//  STATION DATABASE — 80+ major Indian stations
// ═══════════════════════════════════════════════════════════════════
const STATIONS = [
  // ── North India ──
  { key:"NDLS", city:"New Delhi", lat:28.6139, lng:77.2090, tier:1 },
  { key:"JP",   city:"Jaipur Jn", lat:26.9124, lng:75.7873, tier:2 },
  { key:"LKO",  city:"Lucknow", lat:26.8467, lng:80.9462, tier:2 },
  { key:"CNB",  city:"Kanpur Central", lat:26.4499, lng:80.3319, tier:2 },
  { key:"BSB",  city:"Varanasi Jn", lat:25.3176, lng:82.9739, tier:2 },
  { key:"AGC",  city:"Agra Cantt", lat:27.1767, lng:78.0081, tier:3 },
  { key:"ASR",  city:"Amritsar Jn", lat:31.6340, lng:74.8723, tier:2 },
  { key:"CDG",  city:"Chandigarh", lat:30.7333, lng:76.7794, tier:2 },
  { key:"DDN",  city:"Dehradun", lat:30.3165, lng:78.0322, tier:3 },
  { key:"JAT",  city:"Jammu Tawi", lat:32.7266, lng:74.8570, tier:3 },
  { key:"GKP",  city:"Gorakhpur Jn", lat:26.7606, lng:83.3732, tier:3 },
  { key:"PRYJ", city:"Prayagraj Jn", lat:25.4358, lng:81.8463, tier:2 },
  { key:"MTJ",  city:"Mathura Jn", lat:27.4924, lng:77.6737, tier:3 },
  { key:"HW",   city:"Haridwar Jn", lat:29.9457, lng:78.1642, tier:3 },
  { key:"MB",   city:"Moradabad", lat:28.8386, lng:78.7733, tier:3 },
  { key:"LDH",  city:"Ludhiana Jn", lat:30.9010, lng:75.8573, tier:3 },
  { key:"UMB",  city:"Ambala Cantt", lat:30.3782, lng:76.7767, tier:3 },
  { key:"BE",   city:"Bareilly Jn", lat:28.3670, lng:79.4304, tier:3 },

  // ── West India ──
  { key:"MUMBAI", city:"Mumbai CSMT", lat:18.9398, lng:72.8355, tier:1 },
  { key:"ADI",  city:"Ahmedabad Jn", lat:23.0225, lng:72.5714, tier:1 },
  { key:"PUNE", city:"Pune Jn", lat:18.5285, lng:73.8743, tier:1 },
  { key:"ST",   city:"Surat", lat:21.1702, lng:72.8311, tier:2 },
  { key:"BRC",  city:"Vadodara Jn", lat:22.3072, lng:73.1812, tier:2 },
  { key:"JU",   city:"Jodhpur Jn", lat:26.2389, lng:73.0243, tier:3 },
  { key:"UDZ",  city:"Udaipur City", lat:24.5854, lng:73.7125, tier:3 },
  { key:"INDB", city:"Indore Jn", lat:22.7196, lng:75.8577, tier:2 },
  { key:"BPL",  city:"Bhopal Jn", lat:23.2599, lng:77.4126, tier:2 },
  { key:"MAO",  city:"Madgaon (Goa)", lat:15.2993, lng:74.1240, tier:3 },
  { key:"RJT",  city:"Rajkot Jn", lat:22.3039, lng:70.8022, tier:3 },
  { key:"AII",  city:"Ajmer Jn", lat:26.4499, lng:74.6399, tier:3 },
  { key:"KOTA", city:"Kota Jn", lat:25.1800, lng:75.8648, tier:3 },
  { key:"BKN",  city:"Bikaner Jn", lat:28.0229, lng:73.3119, tier:3 },
  { key:"GWL",  city:"Gwalior Jn", lat:26.2183, lng:78.1828, tier:3 },
  { key:"NK",   city:"Nashik Road", lat:19.9975, lng:73.7898, tier:3 },
  { key:"KOP",  city:"Kolhapur", lat:16.7050, lng:74.2433, tier:3 },
  { key:"AWB",  city:"Aurangabad", lat:19.8762, lng:75.3433, tier:3 },

  // ── South India ──
  { key:"MAS",  city:"Chennai Central", lat:13.0827, lng:80.2707, tier:1 },
  { key:"SBC",  city:"Bengaluru KSR", lat:12.9716, lng:77.5946, tier:1 },
  { key:"SC",   city:"Secunderabad Jn", lat:17.4344, lng:78.5013, tier:1 },
  { key:"ERS",  city:"Ernakulam Jn (Kochi)", lat:9.9816, lng:76.2999, tier:2 },
  { key:"TVC",  city:"Thiruvananthapuram", lat:8.4875, lng:76.9525, tier:2 },
  { key:"CBE",  city:"Coimbatore Jn", lat:11.0168, lng:76.9558, tier:2 },
  { key:"VSKP", city:"Visakhapatnam", lat:17.6868, lng:83.2185, tier:2 },
  { key:"BZA",  city:"Vijayawada Jn", lat:16.5062, lng:80.6480, tier:2 },
  { key:"MAQ",  city:"Mangaluru Jn", lat:12.8715, lng:74.8430, tier:3 },
  { key:"MYS",  city:"Mysuru Jn", lat:12.2958, lng:76.6394, tier:3 },
  { key:"TPTY", city:"Tirupati", lat:13.6288, lng:79.4192, tier:3 },
  { key:"MDU",  city:"Madurai Jn", lat:9.9252, lng:78.1198, tier:3 },
  { key:"SA",   city:"Salem Jn", lat:11.6643, lng:78.1460, tier:3 },
  { key:"UBL",  city:"Hubballi Jn", lat:15.3647, lng:75.1240, tier:3 },
  { key:"TEN",  city:"Tirunelveli Jn", lat:8.7284, lng:77.7264, tier:3 },
  { key:"GTL",  city:"Guntakal Jn", lat:15.1710, lng:77.3787, tier:3 },
  { key:"GNT",  city:"Guntur Jn", lat:16.3067, lng:80.4365, tier:3 },

  // ── East India ──
  { key:"HWH",  city:"Howrah Jn", lat:22.5726, lng:88.3639, tier:1 },
  { key:"PNBE", city:"Patna Jn", lat:25.6093, lng:85.1376, tier:2 },
  { key:"RNC",  city:"Ranchi", lat:23.3441, lng:85.3096, tier:3 },
  { key:"BBS",  city:"Bhubaneswar", lat:20.2961, lng:85.8245, tier:2 },
  { key:"GHY",  city:"Guwahati", lat:26.1445, lng:91.7362, tier:2 },
  { key:"PURI", city:"Puri", lat:19.8135, lng:85.8312, tier:3 },
  { key:"DHN",  city:"Dhanbad Jn", lat:23.7957, lng:86.4304, tier:3 },
  { key:"NJP",  city:"New Jalpaiguri", lat:26.6820, lng:88.4350, tier:3 },
  { key:"DBRG", city:"Dibrugarh", lat:27.4728, lng:94.9120, tier:3 },
  { key:"GAYA", city:"Gaya Jn", lat:24.7914, lng:84.9994, tier:3 },
  { key:"MFP",  city:"Muzaffarpur Jn", lat:26.1209, lng:85.3647, tier:3 },

  // ── Central India ──
  { key:"NGP",  city:"Nagpur Jn", lat:21.1458, lng:79.0882, tier:2 },
  { key:"R",    city:"Raipur Jn", lat:21.2514, lng:81.6296, tier:3 },
  { key:"JBP",  city:"Jabalpur", lat:23.1815, lng:79.9864, tier:3 },
  { key:"BSP",  city:"Bilaspur Jn", lat:22.0796, lng:82.1391, tier:3 },
  { key:"UJN",  city:"Ujjain Jn", lat:23.1765, lng:75.7885, tier:3 },
  { key:"JHS",  city:"Jhansi Jn", lat:25.4484, lng:78.5685, tier:3 },

  // ── Additional important stations ──
  { key:"AGTL", city:"Agartala", lat:23.8315, lng:91.2868, tier:3 },
  { key:"DVG",  city:"Davangere", lat:14.4644, lng:75.9218, tier:3 },
  { key:"KGP",  city:"Kharagpur Jn", lat:22.3460, lng:87.3236, tier:3 },
  { key:"SLN",  city:"Sultanpur Jn", lat:26.2648, lng:82.0727, tier:3 },
  { key:"CTC",  city:"Cuttack", lat:20.4625, lng:85.8830, tier:3 },
  { key:"SVDK", city:"Shri Mata Vaishno Devi Katra", lat:32.9915, lng:74.9318, tier:3 },
  { key:"PBR",  city:"Porbandar", lat:21.6417, lng:69.6293, tier:3 },
];

const stationMap = Object.fromEntries(STATIONS.map(s => [s.key, s]));

// ═══════════════════════════════════════════════════════════════════
//  DISTANCE HELPER (Haversine)
// ═══════════════════════════════════════════════════════════════════
function haversine(s1, s2) {
  const R = 6371;
  const dLat = (s2.lat - s1.lat) * Math.PI / 180;
  const dLng = (s2.lng - s1.lng) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(s1.lat * Math.PI / 180) * Math.cos(s2.lat * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function railDistance(s1, s2) {
  return Math.round(haversine(s1, s2) * 1.35); // Rail factor ~1.35x straight-line
}

// ═══════════════════════════════════════════════════════════════════
//  TRAIN TYPE TEMPLATES
// ═══════════════════════════════════════════════════════════════════
const TRAIN_TYPES = [
  {
    name: "Rajdhani Express", initials: "RJ", logoColor: "#f4632a",
    speedFactor: 0.75, tags: ["Premium"], badge: "recommended",
    classes: ["3A","2A","1A"], features: ["Pantry car available","Wi-Fi available"],
    minDist: 400, runsOn: ["Daily"],
    fareMultiplier: { "3A": 2.0, "2A": 2.85, "1A": 4.75 },
  },
  {
    name: "Shatabdi Express", initials: "SH", logoColor: "#2563eb",
    speedFactor: 0.65, tags: ["Premium"], badge: "recommended",
    classes: ["EC","CC"], features: ["Catering included","Wi-Fi available","Reclining seats"],
    minDist: 150, maxDist: 900, runsOn: ["Mon Tue Wed Thu Fri Sat"],
    fareMultiplier: { "EC": 2.6, "CC": 1.5 },
  },
  {
    name: "Vande Bharat Express", initials: "VB", logoColor: "#6366f1",
    speedFactor: 0.55, tags: ["Premium","Semi-high speed"], badge: "recommended",
    classes: ["EC","CC"], features: ["Catering included","Wi-Fi available","180° reclining seats"],
    minDist: 200, maxDist: 1200, runsOn: ["Mon Tue Wed Thu Fri Sat"],
    fareMultiplier: { "EC": 3.2, "CC": 1.8 },
  },
  {
    name: "Duronto Express", initials: "DT", logoColor: "#0891b2",
    speedFactor: 0.72, tags: ["Premium","Non-stop"], badge: "recommended",
    classes: ["SL","3A","2A","1A"], features: ["Pantry car available","Wi-Fi available"],
    minDist: 600, runsOn: ["Mon Wed Fri","Tue Thu Sat","Daily"],
    fareMultiplier: { "SL": 0.95, "3A": 1.9, "2A": 2.7, "1A": 4.5 },
  },
  {
    name: "Garib Rath Express", initials: "GR", logoColor: "#0891b2",
    speedFactor: 0.82, tags: ["Eco coach"], badge: "cheapest",
    classes: ["3A","2A"], features: ["Pantry car available","No Wi-Fi"],
    minDist: 350, runsOn: ["Mon Wed Fri Sun","Tue Thu Sat"],
    fareMultiplier: { "3A": 1.05, "2A": 1.5 },
  },
  {
    name: "Humsafar Express", initials: "HF", logoColor: "#9333ea",
    speedFactor: 0.80, tags: [], badge: null,
    classes: ["3A"], features: ["All AC 3 Tier","Pantry car available","Wi-Fi available"],
    minDist: 400, runsOn: ["Wed Sat","Mon Thu","Tue Fri"],
    fareMultiplier: { "3A": 1.45 },
  },
  {
    name: "Tejas Express", initials: "TE", logoColor: "#0284c7",
    speedFactor: 0.68, tags: ["Premium"], badge: "recommended",
    classes: ["EC","CC"], features: ["Catering included","Wi-Fi available","Divyang coach: C2"],
    minDist: 200, maxDist: 800, runsOn: ["Mon Wed Fri Sun","Daily"],
    fareMultiplier: { "EC": 2.8, "CC": 1.7 },
  },
  {
    name: "Superfast Express", initials: "SF", logoColor: "#059669",
    speedFactor: 0.85, tags: [], badge: "popular",
    classes: ["SL","3A","2A"], features: ["Pantry car available","No Wi-Fi"],
    minDist: 200, runsOn: ["Daily","Mon Wed Fri Sat","Tue Thu Sun"],
    fareMultiplier: { "SL": 0.58, "3A": 1.35, "2A": 1.95 },
  },
  {
    name: "Express", initials: "EX", logoColor: "#78716c",
    speedFactor: 1.0, tags: [], badge: "cheapest",
    classes: ["SL","3A"], features: ["Pantry car available","No Wi-Fi","Divyang coach: S3"],
    minDist: 100, runsOn: ["Daily"],
    fareMultiplier: { "SL": 0.48, "3A": 1.15 },
  },
  {
    name: "Mail Express", initials: "ML", logoColor: "#b45309",
    speedFactor: 0.95, tags: [], badge: null,
    classes: ["SL","3A","2A"], features: ["Pantry car available","No Wi-Fi","Divyang coach: S1"],
    minDist: 300, runsOn: ["Daily"],
    fareMultiplier: { "SL": 0.50, "3A": 1.20, "2A": 1.75 },
  },
  {
    name: "Jan Shatabdi Express", initials: "JS", logoColor: "#0284c7",
    speedFactor: 0.75, tags: [], badge: "cheapest",
    classes: ["2S","CC","SL"], features: ["No pantry","No Wi-Fi"],
    minDist: 100, maxDist: 600, runsOn: ["Daily","Mon Tue Wed Thu Fri Sat"],
    fareMultiplier: { "2S": 0.30, "CC": 0.75, "SL": 0.40 },
  },
  {
    name: "Intercity Express", initials: "IC", logoColor: "#6b7280",
    speedFactor: 0.78, tags: [], badge: null,
    classes: ["SL","CC","2S"], features: ["No pantry","No Wi-Fi"],
    minDist: 100, maxDist: 500, runsOn: ["Daily"],
    fareMultiplier: { "SL": 0.38, "CC": 0.60, "2S": 0.25 },
  },
  {
    name: "Sampark Kranti Express", initials: "SK", logoColor: "#22a85a",
    speedFactor: 0.88, tags: [], badge: null,
    classes: ["SL","3A","2A"], features: ["Pantry car available","Wi-Fi available","Divyang coach: B2"],
    minDist: 300, runsOn: ["Tue Fri","Mon Thu","Wed Sat"],
    fareMultiplier: { "SL": 0.55, "3A": 1.30, "2A": 1.85 },
  },
  {
    name: "Vivek Express", initials: "VE", logoColor: "#c2410c",
    speedFactor: 1.1, tags: [], badge: "cheapest",
    classes: ["SL","3A"], features: ["Pantry car available","No Wi-Fi","Divyang coach: S6"],
    minDist: 500, runsOn: ["Mon","Thu","Sat"],
    fareMultiplier: { "SL": 0.42, "3A": 1.05 },
  },
  {
    name: "Antyodaya Express", initials: "AY", logoColor: "#065f46",
    speedFactor: 1.05, tags: ["Unreserved"], badge: "cheapest",
    classes: ["2S","SL"], features: ["Pantry car available","No Wi-Fi"],
    minDist: 200, maxDist: 800, runsOn: ["Daily","Mon Wed Fri"],
    fareMultiplier: { "2S": 0.20, "SL": 0.38 },
  },
];

const CLASS_LABELS = {
  "SL": "Sleeper", "3A": "AC 3 Tier", "2A": "AC 2 Tier",
  "1A": "AC First Class", "EC": "Exec. Chair Car", "CC": "Chair Car",
  "2S": "Second Sitting",
};

// ═══════════════════════════════════════════════════════════════════
//  REAL TRAIN NUMBER POOLS (loosely based on actual numbering)
// ═══════════════════════════════════════════════════════════════════
let trainNumCounter = 10001;
const usedNums = new Set();
function nextTrainNum() {
  while (usedNums.has(trainNumCounter)) trainNumCounter++;
  usedNums.add(trainNumCounter);
  return String(trainNumCounter++);
}

// ═══════════════════════════════════════════════════════════════════
//  NAMED TRAIN OVERRIDES (popular routes with real train names)
// ═══════════════════════════════════════════════════════════════════
const NAMED_TRAINS = {
  "NDLS-MUMBAI": [
    { name:"Rajdhani Express", num:"12951", type:0 },
    { name:"August Kranti Rajdhani", num:"12953", type:0 },
    { name:"Garib Rath Express", num:"12909", type:4 },
    { name:"Tejas Express", num:"22119", type:6 },
    { name:"Vande Bharat Express", num:"22109", type:2 },
    { name:"Punjab Mail", num:"12137", type:9 },
    { name:"Paschim Express", num:"12925", type:7 },
    { name:"Golden Temple Mail", num:"12903", type:9 },
  ],
  "MUMBAI-NDLS": [
    { name:"Rajdhani Express", num:"12952", type:0 },
    { name:"August Kranti Rajdhani", num:"12954", type:0 },
    { name:"Garib Rath Express", num:"12910", type:4 },
    { name:"Vande Bharat Express", num:"22110", type:2 },
    { name:"Golden Temple Mail", num:"12904", type:9 },
    { name:"Paschim Express", num:"12926", type:7 },
    { name:"Pushpak Express", num:"12533", type:7 },
    { name:"Avadh Express", num:"19040", type:8 },
  ],
  "NDLS-SBC": [
    { name:"Rajdhani Express", num:"22691", type:0 },
    { name:"Karnataka Express", num:"12627", type:7 },
    { name:"Sampark Kranti Express", num:"12649", type:12 },
    { name:"Humsafar Express", num:"20923", type:5 },
    { name:"Marusagar Express", num:"16532", type:8 },
  ],
  "NDLS-MAS": [
    { name:"Tamil Nadu Express", num:"12621", type:7 },
    { name:"Grand Trunk Express", num:"12615", type:9 },
    { name:"Chennai Rajdhani", num:"12433", type:0 },
    { name:"Telangana Express", num:"12723", type:7 },
    { name:"AP Sampark Kranti", num:"12715", type:12 },
  ],
  "NDLS-HWH": [
    { name:"Rajdhani Express", num:"12301", type:0 },
    { name:"Poorva Express", num:"12303", type:7 },
    { name:"Kalka Mail", num:"12311", type:9 },
    { name:"Humsafar Express", num:"12327", type:5 },
    { name:"Lohit Express", num:"15610", type:8 },
  ],
  "NDLS-JP": [
    { name:"Shatabdi Express", num:"12015", type:1 },
    { name:"Vande Bharat Express", num:"20991", type:2 },
    { name:"Pink City Express", num:"12459", type:7 },
    { name:"Intercity Express", num:"12065", type:11 },
  ],
  "NDLS-LKO": [
    { name:"Shatabdi Express", num:"12003", type:1 },
    { name:"Lucknow Mail", num:"12229", type:9 },
    { name:"Avadh Express", num:"19039", type:8 },
  ],
  "NDLS-BPL": [
    { name:"Shatabdi Express", num:"12001", type:1 },
    { name:"Bhopal Express", num:"12155", type:7 },
    { name:"Sampark Kranti Express", num:"12919", type:12 },
  ],
  "MUMBAI-SBC": [
    { name:"Udyan Express", num:"11301", type:7 },
    { name:"Chalukya Express", num:"11005", type:7 },
    { name:"Vande Bharat Express", num:"20651", type:2 },
  ],
  "MUMBAI-PUNE": [
    { name:"Deccan Express", num:"11007", type:11 },
    { name:"Pragati Express", num:"12123", type:11 },
    { name:"Intercity Express", num:"11009", type:11 },
    { name:"Shatabdi Express", num:"12027", type:1 },
    { name:"Vande Bharat Express", num:"22229", type:2 },
    { name:"Deccan Queen", num:"12123", type:7 },
  ],
  "MAS-SBC": [
    { name:"Shatabdi Express", num:"12007", type:1 },
    { name:"Vande Bharat Express", num:"20607", type:2 },
    { name:"Brindavan Express", num:"12639", type:7 },
    { name:"Lalbagh Express", num:"12607", type:7 },
  ],
  "HWH-PNBE": [
    { name:"Rajdhani Express", num:"12309", type:0 },
    { name:"Jan Shatabdi Express", num:"12023", type:10 },
    { name:"Superfast Express", num:"12355", type:7 },
  ],
  "NDLS-ADI": [
    { name:"Rajdhani Express", num:"12957", type:0 },
    { name:"Ashram Express", num:"12915", type:7 },
    { name:"Vande Bharat Express", num:"20901", type:2 },
  ],
  "NDLS-ASR": [
    { name:"Shatabdi Express", num:"12013", type:1 },
    { name:"Vande Bharat Express", num:"22439", type:2 },
    { name:"Swarna Shatabdi", num:"12029", type:1 },
  ],
  "NDLS-CDG": [
    { name:"Shatabdi Express", num:"12011", type:1 },
    { name:"Vande Bharat Express", num:"22461", type:2 },
    { name:"Jan Shatabdi Express", num:"12055", type:10 },
  ],
  "NDLS-DDN": [
    { name:"Shatabdi Express", num:"12017", type:1 },
    { name:"Nanda Devi Express", num:"12205", type:7 },
    { name:"Jan Shatabdi Express", num:"12041", type:10 },
  ],
  "NDLS-BSB": [
    { name:"Vande Bharat Express", num:"22436", type:2 },
    { name:"Shiv Ganga Express", num:"12559", type:7 },
    { name:"Kashi Vishwanath Express", num:"12333", type:7 },
  ],
  "SBC-SC": [
    { name:"Rajdhani Express", num:"22693", type:0 },
    { name:"Vande Bharat Express", num:"20705", type:2 },
    { name:"Superfast Express", num:"12785", type:7 },
  ],
  "MAS-TVC": [
    { name:"Superfast Express", num:"12695", type:7 },
    { name:"Trivandrum Mail", num:"12623", type:9 },
    { name:"Jan Shatabdi Express", num:"12065", type:10 },
  ],
  "MAS-CBE": [
    { name:"Shatabdi Express", num:"12243", type:1 },
    { name:"Cheran Express", num:"12673", type:7 },
    { name:"Vande Bharat Express", num:"20641", type:2 },
  ],
  "NDLS-GHY": [
    { name:"Rajdhani Express", num:"12423", type:0 },
    { name:"North East Express", num:"12505", type:7 },
    { name:"Avadh Assam Express", num:"15609", type:8 },
  ],
  "MUMBAI-ADI": [
    { name:"Shatabdi Express", num:"12009", type:1 },
    { name:"Duronto Express", num:"12267", type:3 },
    { name:"Karnavati Express", num:"12933", type:7 },
    { name:"Vande Bharat Express", num:"20903", type:2 },
  ],
  "HWH-MAS": [
    { name:"Coromandel Express", num:"12841", type:7 },
    { name:"Howrah Mail", num:"12839", type:9 },
  ],
  "MUMBAI-MAO": [
    { name:"Konkan Kanya Express", num:"10111", type:7 },
    { name:"Mandovi Express", num:"10103", type:7 },
    { name:"Jan Shatabdi Express", num:"12051", type:10 },
    { name:"Tejas Express", num:"22119", type:6 },
  ],
  "SBC-MYS": [
    { name:"Shatabdi Express", num:"12007", type:1 },
    { name:"Intercity Express", num:"16557", type:11 },
    { name:"Vande Bharat Express", num:"20609", type:2 },
  ],
};

// Also add reverse for named trains
const reverseNamedRoutes = {};
for (const [route, trains] of Object.entries(NAMED_TRAINS)) {
  const [from, to] = route.split("-");
  const revKey = `${to}-${from}`;
  if (!NAMED_TRAINS[revKey]) {
    reverseNamedRoutes[revKey] = trains.map(t => ({
      ...t,
      num: String(Number(t.num) + 1), // reverse train typically num+1
    }));
  }
}
Object.assign(NAMED_TRAINS, reverseNamedRoutes);

// ═══════════════════════════════════════════════════════════════════
//  CONNECTIVITY GRAPH — which stations have direct trains
// ═══════════════════════════════════════════════════════════════════
// Major hubs connect to many. Smaller stations connect to nearby hubs.
function buildConnections() {
  const connections = new Set();
  const add = (a, b) => {
    if (a === b) return;
    connections.add(`${a}-${b}`);
    connections.add(`${b}-${a}`);
  };

  // Tier 1 hubs connect to ALL other tier 1 and tier 2
  const tier1 = STATIONS.filter(s => s.tier === 1).map(s => s.key);
  const tier2 = STATIONS.filter(s => s.tier === 2).map(s => s.key);
  const tier3 = STATIONS.filter(s => s.tier === 3).map(s => s.key);

  // All tier1 to tier1
  for (let i = 0; i < tier1.length; i++) {
    for (let j = i + 1; j < tier1.length; j++) {
      add(tier1[i], tier1[j]);
    }
  }

  // All tier1 to tier2
  for (const h of tier1) {
    for (const t of tier2) {
      add(h, t);
    }
  }

  // Tier2 to tier2 (if distance < 1500km)
  for (let i = 0; i < tier2.length; i++) {
    for (let j = i + 1; j < tier2.length; j++) {
      const d = railDistance(stationMap[tier2[i]], stationMap[tier2[j]]);
      if (d < 1500) add(tier2[i], tier2[j]);
    }
  }

  // Tier1 to tier3 (if distance < 1800km)
  for (const h of tier1) {
    for (const t of tier3) {
      const d = railDistance(stationMap[h], stationMap[t]);
      if (d < 1800) add(h, t);
    }
  }

  // Tier2 to tier3 (if distance < 800km)
  for (const h of tier2) {
    for (const t of tier3) {
      const d = railDistance(stationMap[h], stationMap[t]);
      if (d < 800) add(h, t);
    }
  }

  // Tier3 to tier3 (if distance < 400km)
  for (let i = 0; i < tier3.length; i++) {
    for (let j = i + 1; j < tier3.length; j++) {
      const d = railDistance(stationMap[tier3[i]], stationMap[tier3[j]]);
      if (d < 400) add(tier3[i], tier3[j]);
    }
  }

  return connections;
}

// ═══════════════════════════════════════════════════════════════════
//  INTERMEDIATE STOPS FINDER
// ═══════════════════════════════════════════════════════════════════
function findIntermediateStops(fromKey, toKey, maxStops) {
  const from = stationMap[fromKey];
  const to = stationMap[toKey];
  const totalDist = railDistance(from, to);

  // Find stations roughly between from and to
  const candidates = STATIONS.filter(s => {
    if (s.key === fromKey || s.key === toKey) return false;
    const dFrom = railDistance(from, s);
    const dTo = railDistance(s, to);
    // Station should be roughly on the path (not too far off)
    return (dFrom + dTo) < totalDist * 1.4 && dFrom > 50 && dTo > 50;
  });

  // Sort by distance from origin
  candidates.sort((a, b) => railDistance(from, a) - railDistance(from, b));

  // Pick evenly spaced stops
  const count = Math.min(maxStops, candidates.length);
  if (count === 0) return [];
  const step = Math.max(1, Math.floor(candidates.length / count));
  const stops = [];
  for (let i = 0; i < count && i * step < candidates.length; i++) {
    stops.push(candidates[i * step]);
  }
  return stops;
}

// ═══════════════════════════════════════════════════════════════════
//  SEEDED RANDOM (deterministic)
// ═══════════════════════════════════════════════════════════════════
let seed = 42;
function rand() {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
}
function randInt(min, max) {
  return min + Math.floor(rand() * (max - min + 1));
}
function pick(arr) {
  return arr[Math.floor(rand() * arr.length)];
}

// ═══════════════════════════════════════════════════════════════════
//  GENERATE A SINGLE TRAIN
// ═══════════════════════════════════════════════════════════════════
function generateTrain(fromKey, toKey, trainType, overrides = {}) {
  const from = stationMap[fromKey];
  const to = stationMap[toKey];
  const dist = railDistance(from, to);
  const tt = TRAIN_TYPES[trainType];

  // Check distance constraints
  if (tt.minDist && dist < tt.minDist) return null;
  if (tt.maxDist && dist > tt.maxDist) return null;

  const trainNum = overrides.num || nextTrainNum();
  usedNums.add(Number(trainNum));
  const trainName = overrides.name || tt.name;

  // Duration based on distance and speed
  const avgSpeed = 55 / tt.speedFactor; // km/h adjusted by speed factor
  const totalHours = dist / avgSpeed;
  const hours = Math.floor(totalHours);
  const mins = Math.round((totalHours - hours) * 60 / 5) * 5;
  const duration = `${hours}h ${String(mins).padStart(2, "0")}m`;

  // Departure time
  const depHour = randInt(0, 23);
  const depMin = pick([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]);
  const depTime = `${String(depHour).padStart(2, "0")}:${String(depMin).padStart(2, "0")}`;

  // Arrival time (depTime + duration)
  const arrTotalMin = depHour * 60 + depMin + hours * 60 + mins;
  const arrHour = Math.floor(arrTotalMin / 60) % 24;
  const arrMin = arrTotalMin % 60;
  const arrTime = `${String(arrHour).padStart(2, "0")}:${String(arrMin).padStart(2, "0")}`;

  // Date offset: 0 = departure day, how many days to arrival
  const dayOffset = Math.floor(arrTotalMin / 1440);

  // Intermediate stops
  const maxStops = dist < 300 ? 2 : dist < 700 ? 3 : dist < 1200 ? 4 : 5;
  const numStops = tt.name.includes("Duronto") ? 0 : randInt(1, maxStops);
  const intermediateStations = findIntermediateStops(fromKey, toKey, numStops);

  // Generate stop times
  const stops = intermediateStations.map((s, idx) => {
    const fracDist = railDistance(from, s) / dist;
    const stopTotalMin = depHour * 60 + depMin + Math.round(fracDist * (hours * 60 + mins));
    const stopDayOff = Math.floor(stopTotalMin / 1440);
    const sH = Math.floor(stopTotalMin / 60) % 24;
    const sM = Math.round((stopTotalMin % 60) / 5) * 5 % 60;
    return {
      city: s.city,
      dayOffset: stopDayOff,
      time: `${String(sH).padStart(2, "0")}:${String(sM).padStart(2, "0")}`,
    };
  });

  // Fare calculation
  const classes = tt.classes.map(code => {
    const baseFare = dist * (tt.fareMultiplier[code] || 1.0);
    const fare = Math.round(baseFare / 5) * 5;
    const seats = randInt(2, 65);
    const statusPool = [
      () => `AVL ${seats}`,
      () => seats < 10 ? `RAC ${randInt(1, 5)}` : `AVL ${seats}`,
      () => seats < 5 ? `WL ${randInt(1, 20)}` : `AVL ${seats}`,
    ];
    const status = pick(statusPool)();
    return {
      code,
      label: CLASS_LABELS[code] || code,
      price: fare,
      status,
      available: !status.startsWith("WL"),
    };
  });

  const runsOn = overrides.runsOn || pick(tt.runsOn);

  // Badge
  let badge = null;
  if (tt.badge === "recommended") {
    badge = { label: "Recommended", type: "recommended" };
  } else if (tt.badge === "cheapest") {
    badge = { label: "Cheapest", type: "cheapest" };
  } else if (tt.badge === "popular") {
    badge = { label: "Popular", type: "popular" };
  }

  // Rating
  const ratingVal = (3.5 + rand() * 1.3).toFixed(1);
  const ratingCount = `${(rand() * 9 + 1).toFixed(1)}k`;

  // Platform
  const platform = `Platform ${randInt(1, 16)}`;

  const seatsLeft = classes.some(c => c.available && c.status.startsWith("AVL")) ?
    Math.min(...classes.filter(c => c.status.startsWith("AVL")).map(c => parseInt(c.status.split(" ")[1]))) :
    undefined;

  return {
    id: `${fromKey.toLowerCase()}-${toKey.toLowerCase()}-${trainNum}`,
    name: trainName,
    trainNumber: trainNum,
    runsOn,
    operator: "Indian Railways",
    initials: overrides.initials || tt.initials,
    logoColor: tt.logoColor,
    originKey: fromKey,
    destinationKey: toKey,
    ...(badge ? { badge } : {}),
    ...(seatsLeft && seatsLeft < 15 ? { seatsLeft } : {}),
    ...(tt.tags.length > 0 ? { tags: tt.tags } : {}),
    departure: {
      time: depTime,
      city: from.city,
      dayOffset: 0,
      platform,
    },
    arrival: {
      time: arrTime,
      city: to.city,
      dayOffset,
      platform: `Platform ${randInt(1, 16)}`,
    },
    stops,
    distance: `${dist} km`,
    duration,
    features: [...tt.features, ...(rand() > 0.6 ? [`Divyang coach: ${pick(["A1","A2","B1","B2","S1","S2","S3","S4","D1","D2"])}`] : [])],
    rating: `${ratingVal} · ${ratingCount} ratings`,
    classes,
    tatkalTime: tt.tags.includes("Premium") ? "10 AM" : "9 AM",
    price: Math.min(...classes.map(c => c.price)),
  };
}

// ═══════════════════════════════════════════════════════════════════
//  MAIN GENERATION
// ═══════════════════════════════════════════════════════════════════
function generate() {
  const connections = buildConnections();
  const trains = [];
  const routeCounts = {};

  console.log(`Total connections: ${connections.size / 2} route pairs`);

  // 1. Generate named trains first (popular routes)
  for (const [route, namedTrains] of Object.entries(NAMED_TRAINS)) {
    const [fromKey, toKey] = route.split("-");
    if (!stationMap[fromKey] || !stationMap[toKey]) continue;

    for (const nt of namedTrains) {
      usedNums.add(Number(nt.num));
      const train = generateTrain(fromKey, toKey, nt.type, {
        name: nt.name,
        num: nt.num,
      });
      if (train) {
        trains.push(train);
        const rk = `${fromKey}-${toKey}`;
        routeCounts[rk] = (routeCounts[rk] || 0) + 1;
      }
    }
  }

  console.log(`Named trains generated: ${trains.length}`);

  // 2. Generate remaining trains for all connections
  for (const conn of connections) {
    const [fromKey, toKey] = conn.split("-");
    if (!stationMap[fromKey] || !stationMap[toKey]) continue;
    
    const existing = routeCounts[conn] || 0;
    const fromTier = stationMap[fromKey].tier;
    const toTier = stationMap[toKey].tier;
    const dist = railDistance(stationMap[fromKey], stationMap[toKey]);

    // Determine how many trains this route should have
    let target;
    if (fromTier === 1 && toTier === 1) target = 8;
    else if (fromTier <= 2 && toTier <= 2) target = 5;
    else if (fromTier === 1 || toTier === 1) target = 4;
    else target = 3;

    const needed = Math.max(0, target - existing);

    // Pick appropriate train types for this route
    const eligible = TRAIN_TYPES.map((tt, idx) => idx).filter(idx => {
      const tt = TRAIN_TYPES[idx];
      if (tt.minDist && dist < tt.minDist) return false;
      if (tt.maxDist && dist > tt.maxDist) return false;
      return true;
    });

    for (let i = 0; i < needed && eligible.length > 0; i++) {
      const typeIdx = eligible[i % eligible.length];
      const train = generateTrain(fromKey, toKey, typeIdx);
      if (train) {
        trains.push(train);
      }
    }
  }

  console.log(`Total trains generated: ${trains.length}`);

  // 3. If we're under 5000, add more trains on popular routes
  if (trains.length < 5000) {
    const deficit = 5000 - trains.length;
    console.log(`Adding ${deficit} more trains to reach 5000...`);

    // Get all unique routes and add more trains
    const allRoutes = [...new Set(trains.map(t => `${t.originKey}-${t.destinationKey}`))];

    let added = 0;
    let routeIdx = 0;
    while (added < deficit) {
      const route = allRoutes[routeIdx % allRoutes.length];
      const [fk, tk] = route.split("-");
      const dist = railDistance(stationMap[fk], stationMap[tk]);

      const eligible = TRAIN_TYPES.map((tt, idx) => idx).filter(idx => {
        const tt = TRAIN_TYPES[idx];
        if (tt.minDist && dist < tt.minDist) return false;
        if (tt.maxDist && dist > tt.maxDist) return false;
        return true;
      });

      if (eligible.length > 0) {
        const typeIdx = pick(eligible);
        const train = generateTrain(fk, tk, typeIdx);
        if (train) {
          trains.push(train);
          added++;
        }
      }
      routeIdx++;
      if (routeIdx > allRoutes.length * 3) break; // safety
    }
    console.log(`Final total: ${trains.length}`);
  }

  return trains;
}

// ═══════════════════════════════════════════════════════════════════
//  WRITE OUTPUT
// ═══════════════════════════════════════════════════════════════════
const allTrains = generate();

// Statistics
const routeSet = new Set(allTrains.map(t => `${t.originKey}-${t.destinationKey}`));
console.log(`\n=== GENERATION COMPLETE ===`);
console.log(`Total trains: ${allTrains.length}`);
console.log(`Total routes: ${routeSet.size}`);
console.log(`Unique stations: ${new Set(allTrains.flatMap(t => [t.originKey, t.destinationKey])).size}`);

// Output to public/data/trains.json
const outDir = resolve(__dirname, "../../public/data");
mkdirSync(outDir, { recursive: true });
const outPath = resolve(outDir, "trains.json");
writeFileSync(outPath, JSON.stringify(allTrains, null, 0));
console.log(`\nWritten to: ${outPath}`);
console.log(`File size: ${(Buffer.byteLength(JSON.stringify(allTrains)) / 1024 / 1024).toFixed(2)} MB`);

// Also write a station alias map for searchTrains
const aliasMap = {};
for (const s of STATIONS) {
  const key = s.key;
  const city = s.city.toLowerCase();
  aliasMap[city] = key;
  // Add code as alias
  aliasMap[key.toLowerCase()] = key;
  // Add city name variants
  const parts = city.split(/[\s()+–-]+/).filter(Boolean);
  if (parts.length > 1) {
    aliasMap[parts[0]] = key; // first word e.g. "mumbai"
  }
  // Remove " jn" suffix for alias
  if (city.endsWith(" jn")) {
    aliasMap[city.replace(" jn", "")] = key;
  }
  // Remove " jn" for code-style entries
  if (city.includes("jn")) {
    aliasMap[city.replace(" jn", "").replace("jn", "")] = key;
  }
}

// Special aliases
const EXTRA_ALIASES = {
  "delhi": "NDLS", "new delhi": "NDLS", "ndls": "NDLS", "new delhi (ndls)": "NDLS",
  "mumbai": "MUMBAI", "mumbai csmt": "MUMBAI", "csmt": "MUMBAI", "mumbai central": "MUMBAI",
  "bct": "MUMBAI", "cstm": "MUMBAI", "bombay": "MUMBAI",
  "bengaluru": "SBC", "bangalore": "SBC", "sbc": "SBC", "ksr bengaluru": "SBC",
  "bengaluru city": "SBC", "blr": "SBC",
  "chennai": "MAS", "chennai central": "MAS", "mas": "MAS", "madras": "MAS",
  "kolkata": "HWH", "howrah": "HWH", "hwh": "HWH", "howrah jn": "HWH",
  "sealdah": "HWH", "calcutta": "HWH",
  "hyderabad": "SC", "secunderabad": "SC", "sc": "SC", "hyderabad deccan": "SC",
  "bhopal": "BPL", "bhopal jn": "BPL", "bpl": "BPL",
  "jaipur": "JP", "jp": "JP", "jaipur jn": "JP",
  "lucknow": "LKO", "lko": "LKO",
  "pune": "PUNE", "pune jn": "PUNE", "poona": "PUNE",
  "ahmedabad": "ADI", "adi": "ADI", "amdavad": "ADI",
  "kanpur": "CNB", "kanpur central": "CNB", "cnb": "CNB",
  "varanasi": "BSB", "banaras": "BSB", "kashi": "BSB", "bsb": "BSB",
  "agra": "AGC", "agra cantt": "AGC", "agc": "AGC",
  "amritsar": "ASR", "asr": "ASR",
  "chandigarh": "CDG", "cdg": "CDG",
  "dehradun": "DDN", "ddn": "DDN",
  "jammu": "JAT", "jammu tawi": "JAT", "jat": "JAT",
  "gorakhpur": "GKP", "gkp": "GKP",
  "prayagraj": "PRYJ", "allahabad": "PRYJ", "pryj": "PRYJ",
  "mathura": "MTJ", "mtj": "MTJ",
  "haridwar": "HW", "hw": "HW",
  "nagpur": "NGP", "ngp": "NGP", "nagpur jn": "NGP",
  "surat": "ST", "st": "ST",
  "vadodara": "BRC", "baroda": "BRC", "brc": "BRC",
  "jodhpur": "JU", "ju": "JU",
  "udaipur": "UDZ", "udz": "UDZ",
  "indore": "INDB", "indb": "INDB",
  "goa": "MAO", "madgaon": "MAO", "margao": "MAO", "mao": "MAO",
  "rajkot": "RJT", "rjt": "RJT",
  "ajmer": "AII", "aii": "AII",
  "kota": "KOTA",
  "bikaner": "BKN", "bkn": "BKN",
  "gwalior": "GWL", "gwl": "GWL",
  "nashik": "NK", "nasik": "NK", "nk": "NK",
  "kolhapur": "KOP", "kop": "KOP",
  "aurangabad": "AWB", "awb": "AWB",
  "kochi": "ERS", "ernakulam": "ERS", "ers": "ERS", "cochin": "ERS",
  "trivandrum": "TVC", "thiruvananthapuram": "TVC", "tvc": "TVC",
  "coimbatore": "CBE", "cbe": "CBE", "kovai": "CBE",
  "vizag": "VSKP", "visakhapatnam": "VSKP", "vskp": "VSKP",
  "vijayawada": "BZA", "bza": "BZA", "bezawada": "BZA",
  "mangalore": "MAQ", "mangaluru": "MAQ", "maq": "MAQ",
  "mysore": "MYS", "mysuru": "MYS", "mys": "MYS",
  "tirupati": "TPTY", "tpty": "TPTY",
  "madurai": "MDU", "mdu": "MDU",
  "salem": "SA", "sa": "SA",
  "hubli": "UBL", "hubballi": "UBL", "ubl": "UBL",
  "tirunelveli": "TEN", "ten": "TEN",
  "guntakal": "GTL", "gtl": "GTL",
  "guntur": "GNT", "gnt": "GNT",
  "patna": "PNBE", "pnbe": "PNBE", "patna jn": "PNBE",
  "ranchi": "RNC", "rnc": "RNC",
  "bhubaneswar": "BBS", "bbs": "BBS",
  "guwahati": "GHY", "ghy": "GHY",
  "puri": "PURI",
  "dhanbad": "DHN", "dhn": "DHN",
  "new jalpaiguri": "NJP", "njp": "NJP", "siliguri": "NJP",
  "dibrugarh": "DBRG", "dbrg": "DBRG",
  "gaya": "GAYA", "gaya jn": "GAYA",
  "muzaffarpur": "MFP", "mfp": "MFP",
  "raipur": "R", "raipur jn": "R",
  "jabalpur": "JBP", "jbp": "JBP",
  "bilaspur": "BSP", "bsp": "BSP",
  "ujjain": "UJN", "ujn": "UJN",
  "jhansi": "JHS", "jhs": "JHS",
  "agartala": "AGTL", "agtl": "AGTL",
  "ludhiana": "LDH", "ldh": "LDH",
  "ambala": "UMB", "umb": "UMB",
  "bareilly": "BE", "be": "BE",
  "moradabad": "MB", "mb": "MB",
  "cuttack": "CTC", "ctc": "CTC",
  "kharagpur": "KGP", "kgp": "KGP",
  "porbandar": "PBR", "pbr": "PBR",
  "katra": "SVDK", "vaishno devi": "SVDK", "svdk": "SVDK",
  "davangere": "DVG", "dvg": "DVG",
};

Object.assign(aliasMap, EXTRA_ALIASES);

const aliasPath = resolve(outDir, "aliases.json");
writeFileSync(aliasPath, JSON.stringify(aliasMap, null, 0));
console.log(`Aliases written to: ${aliasPath}`);
