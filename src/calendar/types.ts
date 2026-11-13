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

/** Why a clicked day could not be selected. */
export type BlockedDateReason = "past" | "blocked" | "minNights";

/** How multiple months are laid out. "row" places them side by side. */
export type CalendarMonthsLayout = "stack" | "row";

/** How event dates (holidays etc.) are marked. */
export type CalendarEventDisplay = "highlight" | "dot" | "color" | "none";

/** Month arrow icon. "chevron" is an SVG that sits centred in its hover circle. */
export type CalendarNavIcon = "glyph" | "chevron";

/** How `dayInfo` (e.g. prices) is shown under the day number. */
export type CalendarDayInfoDisplay = "badge" | "text";

/** Look of the mobile smart-suggestion cards. */
export type CalendarSuggestionsStyle = "default" | "cards";

/** CSS length: a number is treated as px. */
export type CalendarLength = number | string;

/**
 * Look-and-feel values, applied as CSS variables on the calendar root. Every
 * field is optional; anything left out keeps the built-in default. This is the
 * supported way to restyle the calendar — no need to target internal classes.
 */
export type CalendarTheme = {
  /* Colours */
  fg?: string;
  muted?: string;
  border?: string;
  bg?: string;
  bgSubtle?: string;
  accent?: string;
  accentFg?: string;
  rangeBg?: string;
  /** Holiday dot colour (eventDisplay="dot"). */
  eventColor?: string;
  /** Holiday date colour (eventDisplay="color"). Default: red. */
  eventTextColor?: string;

  /* "X Holidays" month badge */
  eventBadgeBg?: string;
  eventBadgeFg?: string;
  eventBadgeRadius?: CalendarLength;
  eventBadgeFontFamily?: string;
  eventBadgeFontWeight?: number | string;

  /* Typography */
  /** Font for the whole calendar, including day buttons. */
  fontFamily?: string;
  dayFontSize?: CalendarLength;
  dayFontWeight?: number | string;
  dayInfoFontSize?: CalendarLength;
  /** Month title size (shared header and per-month titles). */
  titleFontSize?: CalendarLength;
  weekdayFontSize?: CalendarLength;
  dayLetterSpacing?: CalendarLength;
  titleLetterSpacing?: CalendarLength;

  /* Sizing & spacing */
  /** Day cell size (width; also height unless cellHeight is set). */
  cellSize?: CalendarLength;
  cellGap?: CalendarLength;
  radius?: CalendarLength;
  /** Padding around the calendar. */
  padding?: CalendarLength;
  /** Padding of the header row (title + arrows). */
  headerPadding?: CalendarLength;
  /** Month arrow button size. */
  navSize?: CalendarLength;
  /** Month arrow glyph size. */
  navFontSize?: CalendarLength;
  /** Gap between side-by-side months (monthsLayout="row"). */
  monthsGap?: CalendarLength;
  /** Fixed width of the desktop suggestions sidebar; the months take the rest. */
  sidebarWidth?: CalendarLength;
  sidebarPadding?: CalendarLength;
  /** Header padding of DesktopCalendarCard. */
  cardHeaderPadding?: CalendarLength;

  /* Smart suggestions */
  /** "Select" link colour on mobile suggestion cards. */
  suggestionAccent?: string;
  suggestionActiveBg?: string;
  suggestionActiveBorder?: string;
  /** "Select" link colour on the active card. */
  suggestionActiveAccent?: string;
};

/* ─── Slot maps ─── */

export type CalendarLabels = {
  monthNames?: string[];
  weekdayNamesShort?: string[]; // starting Monday by default
  prevMonthLabel?: string;
  nextMonthLabel?: string;
  clearLabel?: string;
  eventsLabel?: string; // label for the event-count badge in the desktop header (default "Holidays")
  eventLabel?: string; // singular form, used when the count is 1 (default "Holiday")
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
  fixedWeeks?: boolean;
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
  onBlockedDateClick?: (date: Date, reason: BlockedDateReason) => void;
  theme?: CalendarTheme;
  eventDisplay?: CalendarEventDisplay;
  showEventTooltip?: boolean;
  dayInfoDisplay?: CalendarDayInfoDisplay;
  hideDayInfoWhenBlocked?: boolean;
  suggestionsStyle?: CalendarSuggestionsStyle;
  /** Show the top title bar with the close (X) button. Default: true. */
  showTopBar?: boolean;
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

  /**
   * How months are laid out when `numberOfMonths > 1`. Default: "row" for
   * `variant="desktop"` with up to 3 months (unless `pastMonthsCount` or
   * `initialMonthsToRender` is set), otherwise "stack".
   * "row" places them side by side, hides the shared header title, puts the
   * prev arrow at the far left and next arrow at the far right of the
   * month-title row, centres each month's title, and turns off the
   * scroll-to-month behaviour (navigation is by the arrows only).
   * `pastMonthsCount` and `initialMonthsToRender` are ignored in "row".
   */
  monthsLayout?: CalendarMonthsLayout;

  /**
   * Always render 6 week rows per month. Default: false — each month shows only
   * the weeks it spans (4–6), so there's no empty trailing row. Set true to keep
   * the calendar height constant while navigating.
   */
  fixedWeeks?: boolean;

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
  /**
   * Called when a day that can't be selected is clicked (or activated by
   * keyboard): a past day, a blocked date, or a min-nights strikethrough day.
   * Use it to explain why, e.g. an "already booked" toast. When set, those
   * cells receive clicks (they otherwise have `pointer-events: none`).
   */
  onBlockedDateClick?: (date: Date, reason: BlockedDateReason) => void;

  /* ─── Look & feel ─── */

  /** Colours, fonts and sizes as typed values (applied as CSS variables). */
  theme?: CalendarTheme;
  /**
   * How event dates are marked. Default: "highlight" (tinted cell + label chips).
   * "dot" puts a small dot under the day number; "color" makes the date red;
   * "none" marks nothing.
   */
  eventDisplay?: CalendarEventDisplay;
  /** Show event names in a tooltip when hovering/focusing an event date. Default: false. */
  showEventTooltip?: boolean;
  /**
   * How `dayInfo` is shown. Default: "badge" (small chip using the item's
   * backgroundColor). "text" is plain text in the item's textColor, turning
   * white on the selected start/end days.
   */
  dayInfoDisplay?: CalendarDayInfoDisplay;
  /** Hide `dayInfo` on past and blocked days. Default: false. */
  hideDayInfoWhenBlocked?: boolean;
  /** Month arrow icon. Default: "glyph" (‹ ›). "chevron" is centred in its hover circle. */
  navIcon?: CalendarNavIcon;
  /** Mobile suggestion card look. Default: "default". */
  suggestionsStyle?: CalendarSuggestionsStyle;

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

  /** @internal — When true, suppresses the per-month weekday header row (used by MobileCalendarSheet which renders one shared header). */
  _hidePerMonthWeekdays?: boolean;
};

/** Footer of `DesktopCalendarCard`. */
export type DesktopCalendarCardFooter = "summary" | "fields" | "none";

export type DesktopCalendarCardProps = Omit<CalendarProps, "variant" | "footer"> & {
  /** Header title. Default: "Select your travel dates". Pass `null` to hide the header. */
  title?: React.ReactNode | null;
  /**
   * Show a hint under the title that walks through the range pick:
   * "Tap your check-in date to begin" → "Now tap your check-out date". Default: false.
   */
  showStepHint?: boolean;
  /**
   * Where the step hint goes. Default: "header" (under the title). "footer"
   * shows it above the Continue button — works without a header.
   */
  stepHintPlacement?: "header" | "footer";
  /** Hint before a check-in is picked. */
  checkInHint?: React.ReactNode;
  /** Hint after check-in, before check-out. */
  checkOutHint?: React.ReactNode;
  /** Small note under the calendar, e.g. "Prices shown are per night". */
  note?: React.ReactNode;

  /**
   * Footer style. Default: "summary" — selected dates + "Clear dates" on the left,
   * a Continue button with the night count on the right. "fields" shows
   * Check-in → Check-out boxes and a nights pill. "none" hides it.
   */
  footer?: DesktopCalendarCardFooter;
  /** Continue button label. Default: "Continue". Night count is appended in range mode. */
  continueLabel?: string;
  /** Called when Continue is pressed. */
  onContinue?: (value: CalendarValue | CalendarRange) => void;
  /** "Clear dates" label. Default: "Clear dates". */
  clearLabel?: string;
  /** Called after the selection is cleared from the footer. */
  onClear?: () => void;
  /**
   * Where the picked dates (and "Clear dates") go in the "summary" footer.
   * Default: "footer". "tab" shows them in a small centred tab hanging below the card.
   */
  datesPlacement?: "footer" | "tab";
  /** Footer placeholder before any date is picked. Default: "Select Dates". */
  emptyLabel?: string;
  /** Check-in / check-out labels ("fields" footer). */
  checkInLabel?: string;
  checkOutLabel?: string;
  /** Box placeholder ("fields" footer). Default: "Add date". */
  addDateLabel?: string;
  /** Date format in the footer. Defaults: "13 November 2026" (summary), "Fri, 13 Nov" (fields). */
  formatDate?: (d: Date) => string;

  /**
   * Where smart suggestions go. Default: "sidebar" (right-hand panel).
   * "footer" puts them in a scrollable chip row in the footer, with the dates
   * and Continue on the right — keeps a wide multi-month card compact.
   */
  suggestionsPlacement?: "sidebar" | "footer";

  /** Card width (number = px). Default: 610 for one month, wider for side-by-side months. */
  width?: number | string;
  /** Class for the inner Calendar. */
  calendarClassName?: string;
};
