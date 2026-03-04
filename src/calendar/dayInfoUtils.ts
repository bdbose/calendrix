import { formatDateKey } from "./formatDateKey";
import type { DayInfo } from "./types";

/** Build a map: dateKey → DayInfo. */
export function buildDayInfoMap(
  dayInfoArray?: DayInfo[]
): Map<string, DayInfo> | undefined {
  if (!dayInfoArray || dayInfoArray.length === 0) return undefined;
  const map = new Map<string, DayInfo>();
  for (const info of dayInfoArray) {
    map.set(info.date, info);
  }
  return map;
}

/** Look up DayInfo for a date. */
export function getDayInfo(
  date: Date,
  dayInfoMap?: Map<string, DayInfo>
): DayInfo | null {
  if (!dayInfoMap) return null;
  return dayInfoMap.get(formatDateKey(date)) ?? null;
}
