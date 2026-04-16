import { formatDateKey } from "./formatDateKey";
import type { BlockedDateLookup, CalendarType } from "./types";
import { startOfDay } from "./dateUtils";

function isEmpty(blockedDates?: BlockedDateLookup): boolean {
  if (!blockedDates) return true;
  return blockedDates instanceof Set
    ? blockedDates.size === 0
    : blockedDates.length === 0;
}

function has(blockedDates: BlockedDateLookup, key: string): boolean {
  return blockedDates instanceof Set
    ? blockedDates.has(key)
    : blockedDates.includes(key);
}

/** Check if a single date is in the blocked list. */
export function isDateBlocked(
  date: Date,
  blockedDates?: BlockedDateLookup
): boolean {
  if (isEmpty(blockedDates)) return false;
  return has(blockedDates!, formatDateKey(date));
}

/**
 * Check if any blocked date exists in [start, end].
 * In hotel mode, the end date (checkout) is excluded from the check,
 * since a guest can check out on a blocked date.
 */
export function hasBlockedDateInRange(
  start: Date,
  end: Date,
  blockedDates?: BlockedDateLookup,
  calendarType?: CalendarType
): boolean {
  if (isEmpty(blockedDates)) return false;
  const cur = new Date(startOfDay(start));
  const endTime = startOfDay(end).getTime();
  const isHotelMode = calendarType === "hotel";

  while (cur.getTime() <= endTime) {
    if (isHotelMode && cur.getTime() === endTime) {
      cur.setDate(cur.getDate() + 1);
      continue;
    }
    if (has(blockedDates!, formatDateKey(cur))) return true;
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
  blockedDates?: BlockedDateLookup
): Date | null {
  if (isEmpty(blockedDates)) return null;

  const cur = new Date(startOfDay(start));
  cur.setDate(cur.getDate() + 1);

  const maxDate = new Date(start);
  maxDate.setFullYear(maxDate.getFullYear() + 2);

  while (cur.getTime() <= maxDate.getTime()) {
    if (has(blockedDates!, formatDateKey(cur))) {
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
