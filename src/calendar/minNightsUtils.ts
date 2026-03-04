import { formatDateKey } from "./formatDateKey";
import { startOfDay } from "./dateUtils";
import type { MinNights, BlockedDates } from "./types";

/** Check if any blocked dates exist in the next N days from checkin. */
function hasBlockedDatesInMinNightsRange(
  checkinDate: Date,
  minNights: number,
  blockedDates?: BlockedDates
): boolean {
  if (!blockedDates || blockedDates.length === 0) return false;
  const base = startOfDay(checkinDate).getTime();
  const msDay = 86_400_000;
  for (let i = 1; i <= minNights; i++) {
    if (blockedDates.includes(formatDateKey(new Date(base + i * msDay)))) {
      return true;
    }
  }
  return false;
}

/**
 * Get minimum nights requirement for a check-in date.
 * Returns `null` if no requirement or if blocked dates conflict.
 */
export function getMinNights(
  checkinDate: Date,
  minNights?: MinNights,
  blockedDates?: BlockedDates
): number | null {
  if (!minNights) return null;
  const key = formatDateKey(checkinDate);
  const required = minNights[key];
  if (!required) return null;
  if (hasBlockedDatesInMinNightsRange(checkinDate, required, blockedDates)) {
    return null;
  }
  return required;
}

/** Calculate number of nights between two dates. */
export function calculateNights(checkin: Date, checkout: Date): number {
  const msDay = 86_400_000;
  return Math.round(
    (startOfDay(checkout).getTime() - startOfDay(checkin).getTime()) / msDay
  );
}

/** Check if checkout meets the minimum nights requirement. */
export function meetsMinNights(
  checkin: Date | null,
  checkout: Date | null,
  minNights?: MinNights,
  blockedDates?: BlockedDates
): boolean {
  if (!checkin || !checkout || !minNights) return true;
  const required = getMinNights(checkin, minNights, blockedDates);
  if (required === null) return true;
  return calculateNights(checkin, checkout) >= required;
}

/**
 * Get date keys that should be struck through because they fall within
 * the min-nights window of a check-in date.
 */
export function getStrikethroughDates(
  checkin: Date | null,
  minNights?: MinNights,
  blockedDates?: BlockedDates
): string[] {
  if (!checkin || !minNights) return [];
  const required = getMinNights(checkin, minNights, blockedDates);
  if (required === null) return [];
  const out: string[] = [];
  const base = startOfDay(checkin).getTime();
  const msDay = 86_400_000;
  for (let i = 1; i < required; i++) {
    out.push(formatDateKey(new Date(base + i * msDay)));
  }
  return out;
}
