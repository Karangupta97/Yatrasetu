import { Train, fetchTrains, fetchAliases } from "./trains";

export async function normalise(input: string): Promise<string | null> {
  const aliases = await fetchAliases();
  return aliases[input.trim().toLowerCase()] ?? null;
}

export async function searchTrains(
  from: string,
  to: string,
  journeyDate?: Date
): Promise<{
  trains: Train[];
  fromKey: string | null;
  toKey: string | null;
  matched: boolean;
}> {
  const aliases = await fetchAliases();
  const fromKey = aliases[from.trim().toLowerCase()] ?? null;
  const toKey = aliases[to.trim().toLowerCase()] ?? null;

  if (!fromKey || !toKey || fromKey === toKey)
    return { trains: [], fromKey, toKey, matched: false };

  const allTrains = await fetchTrains(journeyDate);
  const trains = allTrains.filter(
    (t) => t.originKey === fromKey && t.destinationKey === toKey
  );

  return { trains, fromKey, toKey, matched: trains.length > 0 };
}
