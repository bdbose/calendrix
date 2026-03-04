import { formatDateKey } from "./formatDateKey";
import { startOfDay } from "./dateUtils";
import type { CalendarEvent } from "./types";

/** Build a map: dateKey → event name list. */
export function buildEventMap(events: CalendarEvent[]): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const ev of events) {
    const start = startOfDay(new Date(ev.start_date));
    const end = startOfDay(new Date(ev.end_date));
    for (let cur = new Date(start); cur <= end; cur.setDate(cur.getDate() + 1)) {
      const key = formatDateKey(cur);
      const list = map.get(key) ?? [];
      if (!list.includes(ev.name)) list.push(ev.name);
      map.set(key, list);
    }
  }
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
