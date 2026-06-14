import { TRAINS, Train } from "./trains";

const ALIASES: Record<string, string> = {
  "new delhi":"NDLS","delhi":"NDLS","ndls":"NDLS","new delhi (ndls)":"NDLS",
  "mumbai":"MUMBAI","mumbai csmt":"MUMBAI","csmt":"MUMBAI","mumbai central":"MUMBAI",
  "bct":"MUMBAI","cstm":"MUMBAI","mumbai cstm":"MUMBAI","bombay":"MUMBAI",
  "bengaluru":"SBC","bangalore":"SBC","sbc":"SBC","ksr bengaluru":"SBC",
  "bengaluru city":"SBC","bengaluru ksr":"SBC","blr":"SBC",
  "chennai":"MAS","chennai central":"MAS","mas":"MAS",
  "kolkata":"HWH","howrah":"HWH","hwh":"HWH","howrah jn":"HWH","sealdah":"HWH","sdah":"HWH",
  "bhopal":"BPL","bhopal jn":"BPL","bpl":"BPL",
};

export function normalise(input: string): string | null {
  return ALIASES[input.trim().toLowerCase()] ?? null;
}

export function searchTrains(from: string, to: string): {
  trains: Train[]; fromKey: string | null; toKey: string | null; matched: boolean;
} {
  const fromKey = normalise(from);
  const toKey   = normalise(to);
  if (!fromKey || !toKey || fromKey === toKey)
    return { trains: [], fromKey, toKey, matched: false };
  const trains = TRAINS.filter(t => t.originKey === fromKey && t.destinationKey === toKey);
  return { trains, fromKey, toKey, matched: true };
}
