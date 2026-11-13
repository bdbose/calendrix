import type { CalendarMonthsLayout } from "./types";

/**
 * Resolves how multiple months are laid out. An explicit `monthsLayout` wins.
 * Otherwise desktop shows up to 3 months side by side — unless the calendar is
 * set up as a scrolling list (`pastMonthsCount` / `initialMonthsToRender`) or
 * has more months than fit in a row, which keep the stacked layout.
 */
export function resolveMonthsLayout(opts: {
  monthsLayout?: CalendarMonthsLayout;
  variant?: "mobile" | "desktop";
  numberOfMonths: number;
  pastMonthsCount?: number;
  initialMonthsToRender?: number;
}): CalendarMonthsLayout {
  if (opts.numberOfMonths <= 1) return "stack";
  if (opts.monthsLayout) return opts.monthsLayout;
  const scrolling = opts.pastMonthsCount != null || opts.initialMonthsToRender != null;
  return opts.variant === "desktop" && !scrolling && opts.numberOfMonths <= 3 ? "row" : "stack";
}
