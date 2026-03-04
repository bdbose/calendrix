import { formatDateKey } from "./formatDateKey";
import type { BlockedDates, CalendarType } from "./types";
import { startOfDay } from "./dateUtils";

/** Check if a single date is in the blocked list. */
export function isDateBlocked(date: Date, blockedDates?: BlockedDates): boolean {
  if (!blockedDates || blockedDates.length === 0) return false;
  return blockedDates.includes(formatDateKey(date));
}

/**
 * Check if any blocked date exists in [start, end].
 * In hotel mode, the end date (checkout) is excluded from the check,
 * since a guest can check out on a blocked date.
 */
export function hasBlockedDateInRange(
  start: Date,
  end: Date,
  blockedDates?: BlockedDates,
  calendarType?: CalendarType
): boolean {
  if (!blockedDates || blockedDates.length === 0) return false;
  const cur = new Date(startOfDay(start));
  const endTime = startOfDay(end).getTime();
  const isHotelMode = calendarType === "hotel";

  while (cur.getTime() <= endTime) {
    // In hotel mode, allow the end date to be blocked (checkout day)
    if (isHotelMode && cur.getTime() === endTime) {
      cur.setDate(cur.getDate() + 1);
      continue;
    }
    if (blockedDates.includes(formatDateKey(cur))) return true;
    cur.setDate(cur.getDate() + 1);
  }
  return false;
}

/**
 * Find the first blocked date after a given start date.
 * Used in hotel mode to determine the checkout boundary.
 */
export function findFirstBlockedDateAfter(
  start: Date,
  blockedDates?: BlockedDates
): Date | null {
  if (!blockedDates || blockedDates.length === 0) return null;

  const cur = new Date(startOfDay(start));
  cur.setDate(cur.getDate() + 1); // start checking from day after

  // Check up to 2 years ahead
  const maxDate = new Date(start);
  maxDate.setFullYear(maxDate.getFullYear() + 2);

  while (cur.getTime() <= maxDate.getTime()) {
    if (blockedDates.includes(formatDateKey(cur))) {
      return new Date(cur);
    }
    cur.setDate(cur.getDate() + 1);
  }

  return null;
}

/** Check whether a date is before today (ignores time). */
export function isBeforeToday(date: Date): boolean {
  return startOfDay(date).getTime() < startOfDay(new Date()).getTime();
}

