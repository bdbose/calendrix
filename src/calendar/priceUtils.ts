import type { DayInfo } from "./types";

export type PriceDayInfoOptions = {
  /** Currency symbol for the default formatter. Default: "₹". */
  currency?: string;
  /** Custom price formatter. Default: compact — ₹950, ₹12.5K, ₹1.2L. */
  format?: (price: number) => string;
  /**
   * Prices at or below this fraction of their month's average are "cheaper".
   * Default: 0.8 (20% below average). Set to 0 to turn it off.
   */
  cheaperBelow?: number;
  /** Colour for cheaper prices. Default: "#16a34a" (green). */
  cheaperColor?: string;
  /** Colour for other prices. Default: "#64748b" (slate). */
  color?: string;
};

/** Compact price: 950 → "₹950", 12500 → "₹12.5K", 120000 → "₹1.2L". */
export function formatCompactPrice(price: number, currency = "₹"): string {
  if (price >= 100000) return `${currency}${parseFloat((price / 100000).toFixed(1))}L`;
  if (price >= 1000) return `${currency}${parseFloat((price / 1000).toFixed(1))}K`;
  return `${currency}${price}`;
}

function toPrice(value: unknown): number | null {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/**
 * Turns a `{ "YYYY-MM-DD": price }` map into `dayInfo` entries, colouring
 * prices that are well below their month's average. Pair with
 * `dayInfoDisplay="text"` for plain price text under each day.
 */
export function buildPriceDayInfo(
  prices: Record<string, number | string | null | undefined>,
  options: PriceDayInfoOptions = {},
): DayInfo[] {
  const {
    currency = "₹",
    format = (p: number) => formatCompactPrice(p, currency),
    cheaperBelow = 0.8,
    cheaperColor = "#16a34a",
    color = "#64748b",
  } = options;

  const monthTotals = new Map<string, { sum: number; count: number }>();
  for (const [date, raw] of Object.entries(prices)) {
    const price = toPrice(raw);
    if (price === null) continue;
    const month = date.slice(0, 7);
    const agg = monthTotals.get(month) ?? { sum: 0, count: 0 };
    agg.sum += price;
    agg.count += 1;
    monthTotals.set(month, agg);
  }

  const out: DayInfo[] = [];
  for (const [date, raw] of Object.entries(prices)) {
    const price = toPrice(raw);
    if (price === null) continue;
    const agg = monthTotals.get(date.slice(0, 7));
    const avg = agg && agg.count > 0 ? agg.sum / agg.count : 0;
    const isCheaper = cheaperBelow > 0 && avg > 0 && price <= avg * cheaperBelow;
    out.push({ date, text: format(price), textColor: isCheaper ? cheaperColor : color });
  }
  return out;
}
