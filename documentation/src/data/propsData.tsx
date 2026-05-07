import type { PropDef } from "../components/PropsTable";

export const calendarProps: PropDef[] = [
  // ── Core selection ──
  {
    name: "mode",
    type: '"single" | "range"',
    default: '"single"',
    description: <>Selection mode: single date or date range.</>,
  },
  {
    name: "value",
    type: "Date | CalendarRange | null",
    description: (
      <>
        Controlled selected value. For <code>range</code> mode this is{" "}
        <code>{"{ from, to }"}</code>; for <code>single</code> a <code>Date</code> or
        <code>null</code>.
      </>
    ),
  },
  {
    name: "defaultValue",
    type: "Date | CalendarRange | null",
    description: <>Default selected value (uncontrolled).</>,
  },
  {
    name: "onChange",
    type: "(next) => void",
    description: <>Called when the selection changes.</>,
  },

  // ── Visible month ──
  {
    name: "month",
    type: "Date",
    description: <>Controlled visible month. Pass any date within the month.</>,
  },
  {
    name: "defaultMonth",
    type: "Date",
    description: <>Initial visible month (uncontrolled).</>,
  },
  {
    name: "onMonthChange",
    type: "(month: Date) => void",
    description: <>Called when the visible month changes.</>,
  },
  {
    name: "numberOfMonths",
    type: "number",
    default: "1",
    description: (
      <>Number of months rendered. Mobile designs typically use 2 or more.</>
    ),
  },

  // ── Constraints ──
  {
    name: "isDateDisabled",
    type: "(date: Date) => boolean",
    description: <>Custom predicate to disable specific dates.</>,
  },
  {
    name: "minDate",
    type: "Date",
    description: <>Earliest selectable date (inclusive).</>,
  },
  {
    name: "maxDate",
    type: "Date",
    description: <>Latest selectable date (inclusive).</>,
  },
  {
    name: "weekStartsOn",
    type: "0 | 1 | 2 | 3 | 4 | 5 | 6",
    default: "1",
    description: (
      <>
        First day of the week. <code>0</code> = Sunday, <code>1</code> = Monday.
      </>
    ),
  },

  // ── Styling slots ──
  {
    name: "className",
    type: "string",
    description: <>Class name for the root element.</>,
  },
  {
    name: "style",
    type: "React.CSSProperties",
    description: <>Inline style for the root element.</>,
  },
  {
    name: "classNames",
    type: "CalendarClassNames",
    description: (
      <>
        Per-slot class names: <code>root</code>, <code>shell</code>,{" "}
        <code>sidebar</code>, <code>months</code>, <code>month</code>,{" "}
        <code>header</code>, <code>title</code>, <code>nav</code>,{" "}
        <code>weekdays</code>, <code>weekday</code>, <code>grid</code>,{" "}
        <code>cell</code>, <code>footer</code>.
      </>
    ),
  },
  {
    name: "styles",
    type: "CalendarStyles",
    description: <>Per-slot inline styles (same slot keys as classNames).</>,
  },
  {
    name: "labels",
    type: "CalendarLabels",
    description: (
      <>
        Localised labels: <code>monthNames</code>, <code>weekdayNamesShort</code>,
        <code>prevMonthLabel</code>, <code>nextMonthLabel</code>,{" "}
        <code>clearLabel</code>.
      </>
    ),
  },

  // ── Render slots ──
  {
    name: "sidebar",
    type: "ReactNode",
    description: <>Optional sidebar (desktop). Use for custom panels.</>,
  },
  {
    name: "footer",
    type: "ReactNode",
    description: <>Optional bottom footer.</>,
  },
  {
    name: "renderDay",
    type: "({ state }) => ReactNode",
    description: (
      <>
        Custom day cell content. Receives a rich state object including{" "}
        <code>date</code>, <code>selected</code>, <code>inRange</code>,{" "}
        <code>eventLabels</code>, <code>dayInfo</code>, etc.
      </>
    ),
  },
  {
    name: "renderMonthTitle",
    type: "(month: Date, title: string) => ReactNode",
    description: (
      <>Custom month-header renderer (for badges, decorations, etc.).</>
    ),
  },

  // ── Variants ──
  {
    name: "variant",
    type: '"mobile" | "desktop"',
    description: (
      <>
        Layout variant. Adds <code>rcss-variant-{"{variant}"}</code> class to
        the root.
      </>
    ),
  },
  {
    name: "showNavigation",
    type: "boolean",
    default: "true",
    description: <>Show prev / next month arrows.</>,
  },
  {
    name: "aria-label",
    type: "string",
    default: '"Calendar"',
    description: <>Accessibility label for the calendar region.</>,
  },

  // ── Calendrax features ──
  {
    name: "events",
    type: "CalendarEvent[]",
    description: (
      <>Calendar events shown as small badges on day cells.</>
    ),
  },
  {
    name: "showEvents",
    type: "boolean",
    default: "true",
    description: <>Show / hide event labels.</>,
  },
  {
    name: "blockedDates",
    type: 'string[] (YYYY-MM-DD)',
    description: (
      <>
        Dates that cannot be selected. In hotel mode, the first blocked date
        after a check-in is still allowed as a check-out.
      </>
    ),
  },
  {
    name: "dayInfo",
    type: "DayInfo[]",
    description: (
      <>
        Custom info badges below day numbers (e.g. prices). Each item:{" "}
        <code>{"{ date, text, textColor?, backgroundColor? }"}</code>.
      </>
    ),
  },
  {
    name: "minNights",
    type: "MinNights",
    description: (
      <>
        Minimum-nights requirements per check-in date. Map of YYYY-MM-DD →
        number. Renders strikethrough on dates within the disallowed window.
      </>
    ),
  },
  {
    name: "allowPastDates",
    type: "boolean",
    default: "false",
    description: <>Allow selection of past dates.</>,
  },
  {
    name: "allowSameDay",
    type: "boolean",
    default: "false",
    description: <>Allow same-day check-in and check-out.</>,
  },
  {
    name: "calendarType",
    type: '"hotel" | null',
    description: (
      <>
        Set to <code>"hotel"</code> to permit checkout on the first blocked date
        following the check-in.
      </>
    ),
  },
  {
    name: "cellWidth",
    type: "number",
    description: <>Override day cell width in pixels.</>,
  },
  {
    name: "cellHeight",
    type: "number",
    description: <>Override day cell height in pixels.</>,
  },

  // ── Smart Suggestions ──
  {
    name: "smartSuggestions",
    type: "SmartSuggestion[]",
    description: (
      <>
        Suggestion items that appear in a sidebar (desktop) or collapsible
        panel (mobile).
      </>
    ),
  },
  {
    name: "showSmartSuggestions",
    type: "boolean",
    default: "true",
    description: <>Toggle the suggestions panel.</>,
  },
  {
    name: "smartSuggestionsTitle",
    type: "string",
    description: (
      <>
        Title above the panel. Defaults: desktop “SMART SUGGESTIONS”, mobile
        “OUR SUGGESTIONS”.
      </>
    ),
  },
  {
    name: "filterPastSuggestions",
    type: "boolean",
    default: "true",
    description: <>Hide suggestions whose end date is in the past.</>,
  },
  {
    name: "onSuggestionSelect",
    type: "(s: SmartSuggestion) => void",
    description: <>Called when a suggestion is picked.</>,
  },

  // ── Lazy loading ──
  {
    name: "initialMonthsToRender",
    type: "number",
    description: (
      <>
        Number of months rendered initially. Remaining months load on scroll
        (mobile / multi-month).
      </>
    ),
  },
  {
    name: "pastMonthsCount",
    type: "number",
    description: (
      <>Number of past months available for upward infinite scroll.</>
    ),
  },
];

export const mobileSheetProps: PropDef[] = [
  {
    name: "title",
    type: "string",
    default: '"Select Dates"',
    description: <>Title shown in the top bar.</>,
  },
  {
    name: "onClose",
    type: "() => void",
    description: <>Called when the close (X) button is pressed.</>,
  },
  {
    name: "mode",
    type: '"single" | "range"',
    default: '"range"',
    description: <>Selection mode.</>,
  },
  {
    name: "value",
    type: "Date | CalendarRange | null",
    description: <>Controlled value.</>,
  },
  {
    name: "defaultValue",
    type: "Date | CalendarRange | null",
    description: <>Default value (uncontrolled).</>,
  },
  {
    name: "onChange",
    type: "(next) => void",
    description: <>Called when the selection changes.</>,
  },
  {
    name: "checkInLabel",
    type: "string",
    default: '"Check-in"',
    description: <>Label for the check-in column.</>,
  },
  {
    name: "checkOutLabel",
    type: "string",
    default: '"Check-out"',
    description: <>Label for the check-out column.</>,
  },
  {
    name: "clearLabel",
    type: "string",
    default: '"Clear Dates"',
    description: <>Footer clear-button label.</>,
  },
  {
    name: "continueLabel",
    type: "string",
    default: '"Continue"',
    description: <>Footer primary-button label.</>,
  },
  {
    name: "singleDatePlaceholder",
    type: "string",
    default: '"Select a date"',
    description: <>Placeholder when no date is selected in single mode.</>,
  },
  {
    name: "onContinue",
    type: "(value) => void",
    description: <>Called when the Continue button is pressed.</>,
  },
  {
    name: "onClear",
    type: "() => void",
    description: <>Called after the value has been cleared internally.</>,
  },
  {
    name: "formatDate",
    type: "(d: Date) => string",
    default: '"DD Mon YYYY"',
    description: (
      <>Custom formatter for the check-in / check-out display.</>
    ),
  },
  {
    name: "longStayThreshold",
    type: "number",
    description: (
      <>If nights ≥ this number, the long-stay banner is shown.</>
    ),
  },
  {
    name: "longStayContent",
    type: "ReactNode",
    description: <>Content rendered inside the long-stay banner.</>,
  },
  {
    name: "footer",
    type: "ReactNode",
    description: (
      <>Override the entire footer. Pass <code>null</code> to hide it.</>
    ),
  },
  {
    name: "className",
    type: "string",
    description: <>Class name for the root wrapper.</>,
  },
  {
    name: "calendarClassName",
    type: "string",
    description: <>Class name forwarded to the inner Calendar.</>,
  },
  // Passthroughs
  {
    name: "...calendarProps",
    type: "CalendarProps",
    description: (
      <>
        All Calendar props are accepted and forwarded:{" "}
        <code>events</code>, <code>blockedDates</code>, <code>dayInfo</code>,{" "}
        <code>minNights</code>, <code>smartSuggestions</code>,{" "}
        <code>calendarType</code>, <code>allowPastDates</code>,{" "}
        <code>weekStartsOn</code>, <code>numberOfMonths</code>,{" "}
        <code>renderDay</code>, <code>renderMonthTitle</code>, etc.
      </>
    ),
  },
];

export const typeDefinitions = `// ── Selection ──
type CalendarSelectionMode = "single" | "range";
type CalendarValue = Date | null;
type CalendarRange = { from: Date | null; to: Date | null };

// ── Events ──
type CalendarEvent = {
  start_date: string; // "YYYY-MM-DD"
  end_date: string;   // "YYYY-MM-DD"
  name: string;
  specific_teams?: string;
};

// ── Blocked dates ──
type BlockedDates = string[]; // "YYYY-MM-DD"
type BlockedDateLookup = BlockedDates | Set<string>;

// ── Day info (price badges) ──
type DayInfo = {
  date: string;            // "YYYY-MM-DD"
  text: string;            // e.g. "₹8K"
  textColor?: string;
  backgroundColor?: string;
};

// ── Smart suggestions ──
type SmartSuggestion = {
  label: string;
  sub: string;
  from: Date;
  to: Date;
};

// ── Min-nights enforcement ──
type MinNights = {
  [date: string]: number;  // key: "YYYY-MM-DD", value: minimum nights
};

// ── Hotel calendar mode ──
type CalendarType = "hotel" | null;

// ── Render-day state object ──
type CalendarDayState = {
  date: Date;
  inMonth: boolean;
  disabled: boolean;
  selected: boolean;
  inRange: boolean;
  rangeStart: boolean;
  rangeEnd: boolean;
  today: boolean;
  blockedByDate: boolean;
  blockedByMinNights: boolean;
  eventLabels: string[];
  dayInfo: DayInfo | null;
  minNightsRequired: number | null;
};
`;
