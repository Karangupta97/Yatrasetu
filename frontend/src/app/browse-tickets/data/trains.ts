export type Stop = { city: string; date: string; time?: string };
export type ClassAvailability = { code: string; label: string; price: number; status: string; available: boolean };
export type Train = {
  id: string; name: string; trainNumber: string; runsOn: string;
  operator: string; initials: string; logoColor: string;
  originKey: string; destinationKey: string;
  badge?: { label: string; type: "cheapest" | "recommended" | "popular" };
  seatsLeft?: number; tags?: string[];
  departure: { time: string; city: string; date: string; platform?: string };
  arrival:   { time: string; city: string; date: string; platform?: string };
  stops: Stop[]; distance: string; duration: string;
  features: string[]; rating: string; classes: ClassAvailability[];
  tatkalTime?: string; price: number;
};

/* ── Raw JSON shape (uses dayOffset instead of formatted dates) ─── */
type RawStop = { city: string; dayOffset: number; time?: string };
type RawTrain = Omit<Train, "departure" | "arrival" | "stops"> & {
  departure: { time: string; city: string; dayOffset: number; platform?: string };
  arrival:   { time: string; city: string; dayOffset: number; platform?: string };
  stops: RawStop[];
};

/* ── Date helpers: convert dayOffset → formatted date string ────── */
function fmtOffset(baseDate: Date, offset: number): string {
  const d = new Date(baseDate);
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

function hydrateTrains(raw: RawTrain[], baseDate: Date): Train[] {
  return raw.map(r => ({
    ...r,
    departure: {
      time: r.departure.time,
      city: r.departure.city,
      date: fmtOffset(baseDate, r.departure.dayOffset),
      platform: r.departure.platform,
    },
    arrival: {
      time: r.arrival.time,
      city: r.arrival.city,
      date: fmtOffset(baseDate, r.arrival.dayOffset),
      platform: r.arrival.platform,
    },
    stops: r.stops.map(s => ({
      city: s.city,
      date: fmtOffset(baseDate, s.dayOffset),
      time: s.time,
    })),
  }));
}

/* ── Singleton lazy loader ──────────────────────────────────────── */
let _cache: Train[] | null = null;
let _cacheDate: string | null = null;

/**
 * Fetch all trains from the static JSON file.
 * Dates are hydrated relative to the given baseDate (user's journey date).
 * Results are cached per session; re-fetches if the date changes.
 */
export async function fetchTrains(baseDate?: Date): Promise<Train[]> {
  const base = baseDate || new Date();
  const dateKey = base.toISOString().split("T")[0];

  if (_cache && _cacheDate === dateKey) return _cache;

  const res = await fetch("/data/trains.json");
  const raw: RawTrain[] = await res.json();
  _cache = hydrateTrains(raw, base);
  _cacheDate = dateKey;
  return _cache;
}

/* ── Alias loader ──────────────────────────────────────────────── */
let _aliasCache: Record<string, string> | null = null;

export async function fetchAliases(): Promise<Record<string, string>> {
  if (_aliasCache) return _aliasCache;
  const res = await fetch("/data/aliases.json");
  _aliasCache = await res.json();
  return _aliasCache!;
}
