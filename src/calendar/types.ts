import * as React from "react";

export type CalendarRange = { from: Date | null; to: Date | null };
export type CalendarSelectionMode = "single" | "range";
export type CalendarValue = Date | null;
export type CalendarValueByMode<M extends CalendarSelectionMode> = M extends "range"
  ? CalendarRange
  : CalendarValue;

/* ─── Calendrax-ported types ─── */

export type CalendarEvent = {
  start_date: string; // "YYYY-MM-DD"
  end_date: string;   // "YYYY-MM-DD"
  name: string;
  specific_teams?: string;
};

export type BlockedDates = string[]; // "YYYY-MM-DD" strings
export type BlockedDateLookup = BlockedDates | Set<string>;

export type DayInfo = {
  date: string;            // "YYYY-MM-DD"
  text: string;            // text to display below date
  textColor?: string;
  backgroundColor?: string;
};

export type SmartSuggestion = {
  label: string;
  sub: string;
  from: Date;
  to: Date;
};

export type MinNights = {
  [date: string]: number;  // key: "YYYY-MM-DD", value: minimum nights
};

export type CalendarType = "hotel" | null;

/* ─── Slot maps ─── */

export type CalendarLabels = {
  monthNames?: string[];
  weekdayNamesShort?: string[]; // starting Monday by default
  prevMonthLabel?: string;
  nextMonthLabel?: string;
  clearLabel?: string;
};

export type CalendarClassNames = Partial<
  Record<
    | "root"
    | "shell"
    | "sidebar"
    | "months"
    | "month"
    | "header"
    | "title"
    | "nav"
    | "weekdays"
    | "weekday"
    | "grid"
    | "cell"
    | "footer",
    string
  >
>;

export type CalendarStyles = Partial<
  Record<
    | "root"
    | "shell"
    | "sidebar"
    | "months"
    | "month"
    | "header"
    | "title"
    | "nav"
    | "weekdays"
    | "weekday"
    | "grid"
    | "cell"
    | "footer",
    React.CSSProperties
  >
>;

export type CalendarDayState = {
  date: Date;
  inMonth: boolean;
  disabled: boolean;
  selected: boolean;
  inRange: boolean;
  rangeStart: boolean;
  rangeEnd: boolean;
  today: boolean;
  /* ─ new fields ─ */
  blockedByDate: boolean;
  blockedByMinNights: boolean;
  eventLabels: string[];
  dayInfo: DayInfo | null;
  minNightsRequired: number | null;
};

export type CalendarRenderDayArgs = {
  state: CalendarDayState;
};

export type MobileCalendarSheetProps = {
  /** Title shown in the top bar. Default: "Select Dates". */
  title?: string;
  /** Called when the close (X) button is pressed. */
  onClose?: () => void;

  /** Selection mode. Default: "range". */
  mode?: CalendarSelectionMode;
  /** Controlled selected value. */
  value?: CalendarValue | CalendarRange;
  /** Default selected value (uncontrolled). */
  defaultValue?: CalendarValue | CalendarRange;
  /** Called when the selected value changes. */
  onChange?: (next: CalendarValue | CalendarRange) => void;

  /** Label for the check-in column. Default: "Check-in". */
  checkInLabel?: string;
  /** Label for the check-out column. Default: "Check-out". */
  checkOutLabel?: string;
  /** Label for the clear button. Default: "Clear Dates". */
  clearLabel?: string;
  /** Label for the continue button. Default: "Continue". */
  continueLabel?: string;
  /** Placeholder when no date is selected in single mode. Default: "Select a date". */
  singleDatePlaceholder?: string;

  /** Called when the continue button is pressed. Receives the current value. */
  onContinue?: (value: CalendarValue | CalendarRange) => void;
  /** Called when the clear button is pressed (after clearing internally). */
  onClear?: () => void;

  /** Custom date formatter for the check-in/check-out display. Default: "DD Mon YYYY". */
  formatDate?: (d: Date) => string;

  /** If nights >= this threshold and longStayContent is provided, the banner is shown. */
  longStayThreshold?: number;
  /** Content rendered in the long-stay banner below the calendar. */
  longStayContent?: React.ReactNode;

  /** Additional className for the root wrapper. */
  className?: string;
  /** Inline styles for the root wrapper. */
  style?: React.CSSProperties;
  /** Additional className passed to the inner Calendar component. */
  calendarClassName?: string;
  /** Override the entire footer. Pass `null` to hide it. */
  footer?: React.ReactNode;

  /* ─── Calendar passthrough props ─── */

  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  numberOfMonths?: number;
  events?: CalendarEvent[];
  showEvents?: boolean;
  blockedDates?: BlockedDates;
  dayInfo?: DayInfo[];
  minNights?: MinNights;
  allowPastDates?: boolean;
  allowSameDay?: boolean;
  calendarType?: CalendarType;
  cellWidth?: number;
  cellHeight?: number;
  isDateDisabled?: (date: Date) => boolean;
  minDate?: Date;
  maxDate?: Date;
  labels?: CalendarLabels;
  renderDay?: (args: CalendarRenderDayArgs) => React.ReactNode;
  renderMonthTitle?: (month: Date, title: string) => React.ReactNode;
  smartSuggestions?: SmartSuggestion[];
  showSmartSuggestions?: boolean;
  smartSuggestionsTitle?: string;
  filterPastSuggestions?: boolean;
  onSuggestionSelect?: (suggestion: SmartSuggestion) => void;
  initialMonthsToRender?: number;
  pastMonthsCount?: number;
};

export type CalendarProps = {
  /** Selection mode. Default: "single". */
  mode?: CalendarSelectionMode;

  /** Controlled selected date. */
  value?: CalendarValue | CalendarRange;
  /** Default selected date (uncontrolled). */
  defaultValue?: CalendarValue | CalendarRange;
  /** Called when a date is selected. */
  onChange?: (next: CalendarValue | CalendarRange) => void;

  /** Which month to show (controlled). Use any date within the month. */
  month?: Date;
  /** Initial month (uncontrolled). */
  defaultMonth?: Date;
  /** Called when visible month changes. */
  onMonthChange?: (month: Date) => void;

  /** Number of months to render. Default: 1. (Mobile designs often use 2+) */
  numberOfMonths?: number;

  /** Disable selecting specific days (custom callback). */
  isDateDisabled?: (date: Date) => boolean;
  /** Min selectable date (inclusive). */
  minDate?: Date;
  /** Max selectable date (inclusive). */
  maxDate?: Date;

  /** Monday=1 ... Sunday=0 style is not used; this is a number 0..6 where 0=Sunday. Default 1 (Monday). */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  /** Optional className for the root. (Convenience; merges with classNames.root) */
  className?: string;
  /** Optional inline styles for the root. (Convenience; merges with styles.root) */
  style?: React.CSSProperties;
  /** Classnames map for internal parts. */
  classNames?: CalendarClassNames;
  /** Styles map for internal parts. */
  styles?: CalendarStyles;

  /** Customize visible strings. */
  labels?: CalendarLabels;

  /** Optional right-side content (desktop suggestions panel, etc). */
  sidebar?: React.ReactNode;
  /** Optional bottom footer content (mobile CTA row). */
  footer?: React.ReactNode;

  /** Custom day content (numbers + emoji/flag/etc). */
  renderDay?: (args: CalendarRenderDayArgs) => React.ReactNode;

  /** Custom month title renderer (for holiday badges, etc). */
  renderMonthTitle?: (month: Date, title: string) => React.ReactNode;

  /** Layout variant. Adds `rcss-variant-{variant}` class to root. */
  variant?: "mobile" | "desktop";

  /** Show prev/next month navigation arrows. Default: true. */
  showNavigation?: boolean;

  /** Optional accessibility label for the calendar region. */
  "aria-label"?: string;

  /* ─── Calendrax features ─── */

  /** Calendar events to display as labels. */
  events?: CalendarEvent[];
  /** Show/hide event labels. Default: true. */
  showEvents?: boolean;
  /** Dates that cannot be selected (YYYY-MM-DD format). */
  blockedDates?: BlockedDates;
  /** Custom info displayed below dates (e.g. prices). */
  dayInfo?: DayInfo[];
  /** Minimum nights requirement per check-in date. */
  minNights?: MinNights;
  /** Allow selection of past dates. Default: false. */
  allowPastDates?: boolean;
  /** Allow same-day check-in and checkout. Default: false. */
  allowSameDay?: boolean;
  /** Calendar type — "hotel" allows checkout on the first blocked date. Default: null. */
  calendarType?: CalendarType;
  /** Width of date cells in pixels (desktop only). */
  cellWidth?: number;
  /** Height of date cells in pixels (desktop only). */
  cellHeight?: number;

  /* ─── Smart Suggestions ─── */

  /** List of smart suggestion items to display. When provided, shows a suggestions panel. */
  smartSuggestions?: SmartSuggestion[];
  /** Show or hide the smart suggestions panel. Default: true. */
  showSmartSuggestions?: boolean;
  /** Title shown above the suggestions panel. Desktop default: "SMART SUGGESTIONS", Mobile default: "OUR SUGGESTIONS". */
  smartSuggestionsTitle?: string;
  /** Automatically filter out suggestions whose `to` date is in the past. Default: true. */
  filterPastSuggestions?: boolean;
  /** Callback when a suggestion is selected. */
  onSuggestionSelect?: (suggestion: SmartSuggestion) => void;

  /* ─── Lazy loading ─── */

  /** Number of months to render initially (rest load on scroll). Useful for mobile infinite scroll. */
  initialMonthsToRender?: number;

  /** Number of past months available for upward scroll. When set, enables bidirectional infinite scroll. */
  pastMonthsCount?: number;

  /** @internal — Used by MobileCalendarSheet to get the suggestion handler from Calendar. */
  _suggestionHandlerRef?: React.MutableRefObject<
    ((suggestion: SmartSuggestion) => void) | null
  >;
};
