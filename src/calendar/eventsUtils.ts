import { formatDateKey } from "./formatDateKey";
import { startOfDay } from "./dateUtils";
import type { CalendarEvent } from "./types";

/** Build a map: dateKey → event name list. */
export function buildEventMap(events: CalendarEvent[]): Map<string, string[]> {
  // Use a Set<string> per date to deduplicate event names in O(1)
  const setMap = new Map<string, Set<string>>();
  for (const ev of events) {
    const start = startOfDay(new Date(ev.start_date)).getTime();
    const end = startOfDay(new Date(ev.end_date)).getTime();
    // Timestamp arithmetic avoids mutating-date-in-loop-condition pitfall
    for (let t = start; t <= end; t += 86_400_000) {
      const key = formatDateKey(new Date(t));
      let s = setMap.get(key);
      if (!s) { s = new Set<string>(); setMap.set(key, s); }
      s.add(ev.name);
    }
  }
  const map = new Map<string, string[]>();
  for (const [k, s] of setMap) map.set(k, [...s]);
  return map;
}

/** Get event labels for a specific date. */
export function getEventLabels(
  date: Date,
  map?: Map<string, string[]>
): string[] {
  if (!map) return [];
  return map.get(formatDateKey(date)) ?? [];
}
