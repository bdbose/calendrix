import type * as React from "react";
import type { CalendarLength, CalendarTheme } from "./types";

const VAR_BY_KEY: Record<keyof CalendarTheme, string> = {
  fg: "--rcss-fg",
  muted: "--rcss-muted",
  border: "--rcss-border",
  bg: "--rcss-bg",
  bgSubtle: "--rcss-bg-subtle",
  accent: "--rcss-accent",
  accentFg: "--rcss-accent-fg",
  rangeBg: "--rcss-range-bg",
  eventColor: "--rcss-event-color",
  eventTextColor: "--rcss-event-text-color",
  eventBadgeBg: "--rcss-event-badge-bg",
  eventBadgeFg: "--rcss-event-badge-fg",
  eventBadgeRadius: "--rcss-event-badge-radius",
  eventBadgeFontFamily: "--rcss-event-badge-font-family",
  eventBadgeFontWeight: "--rcss-event-badge-font-weight",
  fontFamily: "--rcss-font-family",
  dayFontSize: "--rcss-day-font-size",
  dayFontWeight: "--rcss-day-font-weight",
  dayInfoFontSize: "--rcss-day-info-font-size",
  titleFontSize: "--rcss-title-font-size",
  weekdayFontSize: "--rcss-weekday-font-size",
  dayLetterSpacing: "--rcss-day-letter-spacing",
  titleLetterSpacing: "--rcss-title-letter-spacing",
  cellSize: "--rcss-cell",
  cellGap: "--rcss-gap",
  radius: "--rcss-radius",
  padding: "--rcss-padding",
  headerPadding: "--rcss-header-padding",
  navSize: "--rcss-nav-size",
  navFontSize: "--rcss-nav-font-size",
  monthsGap: "--rcss-months-gap",
  sidebarWidth: "--rcss-sidebar-width",
  sidebarPadding: "--rcss-sidebar-padding",
  cardHeaderPadding: "--rcss-card-header-padding",
  suggestionAccent: "--rcss-suggestion-accent",
  suggestionActiveBg: "--rcss-suggestion-active-bg",
  suggestionActiveBorder: "--rcss-suggestion-active-border",
  suggestionActiveAccent: "--rcss-suggestion-active-accent",
};

// Unitless on purpose: a number here is a weight, not a length.
const UNITLESS = new Set<keyof CalendarTheme>(["dayFontWeight", "eventBadgeFontWeight"]);

function toCssValue(key: keyof CalendarTheme, value: CalendarLength): string {
  if (typeof value === "number" && !UNITLESS.has(key)) return `${value}px`;
  return String(value);
}

/** Maps a theme to inline CSS variables. Inline beats the variant defaults. */
export function themeToStyle(theme: CalendarTheme | undefined): React.CSSProperties {
  if (!theme) return {};
  const out: Record<string, string> = {};
  for (const key of Object.keys(theme) as (keyof CalendarTheme)[]) {
    const cssVar = VAR_BY_KEY[key];
    const value = theme[key];
    if (!cssVar || value === undefined || value === null || value === "") continue;
    out[cssVar] = toCssValue(key, value);
  }
  return out as React.CSSProperties;
}

/** Root classes that switch on theme-dependent rules. */
export function themeClasses(theme: CalendarTheme | undefined): string[] {
  if (!theme) return [];
  const out: string[] = [];
  if (theme.sidebarWidth !== undefined) out.push("rcss-sidebar-fixed");
  return out;
}
