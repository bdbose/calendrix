# Calendrix — Integration Guide

## Installation

```bash
npm install calendrix
# or
yarn add calendrix
# or
pnpm add calendrix
```

**Peer dependencies:** `react >= 16.8.0`, `react-dom >= 16.8.0`

## Quick Start

```tsx
import { Calendar } from "calendrix";
import "calendrix/styles.css";

function App() {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <Calendar
      mode="single"
      value={date}
      onChange={(d) => setDate(d as Date | null)}
    />
  );
}
```

---

## Props Reference

### Selection

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `"single" \| "range"` | `"single"` | Selection mode |
| `value` | `Date \| null \| CalendarRange` | — | Controlled selected value |
| `defaultValue` | `Date \| null \| CalendarRange` | `null` / `{ from: null, to: null }` | Default value (uncontrolled) |
| `onChange` | `(next) => void` | — | Called when selection changes |

### Month Navigation

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `month` | `Date` | — | Controlled visible month |
| `defaultMonth` | `Date` | — | Initial month (uncontrolled) |
| `onMonthChange` | `(month: Date) => void` | — | Called when visible month changes |
| `numberOfMonths` | `number` | `1` | Number of months to render (mobile uses 12+) |
| `showNavigation` | `boolean` | `true` | Show prev/next month arrows |

### Date Constraints

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isDateDisabled` | `(date: Date) => boolean` | — | Custom disable callback |
| `minDate` | `Date` | — | Min selectable date (inclusive) |
| `maxDate` | `Date` | — | Max selectable date (inclusive) |
| `weekStartsOn` | `0–6` | `1` | First day of week (0 = Sunday) |
| `allowPastDates` | `boolean` | `false` | Allow selecting past dates |
| `allowSameDay` | `boolean` | `false` | Allow same-day check-in/checkout |

### Hotel / Booking Features

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `calendarType` | `"hotel" \| null` | `null` | Hotel mode allows checkout on blocked dates |
| `blockedDates` | `string[]` | — | Dates that cannot be selected (`"YYYY-MM-DD"`) |
| `minNights` | `MinNights` | — | Per-date minimum nights (`{ "YYYY-MM-DD": number }`) |
| `events` | `CalendarEvent[]` | — | Events displayed as labels on cells |
| `showEvents` | `boolean` | `true` | Show/hide event labels |
| `dayInfo` | `DayInfo[]` | — | Custom info below dates (e.g. prices) |

### Smart Suggestions

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `smartSuggestions` | `SmartSuggestion[]` | — | Suggestion items to display |
| `showSmartSuggestions` | `boolean` | `true` | Show/hide the suggestions panel |
| `smartSuggestionsTitle` | `string` | `"SMART SUGGESTIONS"` (desktop) / `"OUR SUGGESTIONS"` (mobile) | Custom title for the panel |
| `filterPastSuggestions` | `boolean` | `true` | Auto-filter past suggestions |
| `onSuggestionSelect` | `(suggestion) => void` | — | Callback when a suggestion is clicked |

### Layout & Styling

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"mobile" \| "desktop"` | — | Layout variant (adds `rcss-variant-{v}` class) |
| `className` | `string` | — | Root element class |
| `style` | `CSSProperties` | — | Root element inline styles |
| `classNames` | `CalendarClassNames` | — | Class map for internal parts |
| `styles` | `CalendarStyles` | — | Style map for internal parts |
| `labels` | `CalendarLabels` | — | Custom text (month names, weekday labels, etc.) |
| `cellWidth` | `number` | — | Cell width in px (desktop) |
| `cellHeight` | `number` | — | Cell height in px (desktop) |

### Content Slots

| Prop | Type | Description |
|------|------|-------------|
| `sidebar` | `ReactNode` | Right-side content (when not using smartSuggestions) |
| `footer` | `ReactNode` | Bottom footer content |
| `renderDay` | `(args: { state: CalendarDayState }) => ReactNode` | Custom day cell content |
| `renderMonthTitle` | `(month: Date, title: string) => ReactNode` | Custom month title |

### Lazy Loading (Mobile)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialMonthsToRender` | `number` | — | Months to render initially (rest load on scroll) |
| `pastMonthsCount` | `number` | — | Past months for upward scroll |

---

## Types

```tsx
import type {
  CalendarRange,
  CalendarValue,
  CalendarSelectionMode,
  CalendarDayState,
  CalendarEvent,
  DayInfo,
  MinNights,
  SmartSuggestion,
  BlockedDates,
  CalendarType,
} from "calendrix";
```

### CalendarRange

```tsx
type CalendarRange = { from: Date | null; to: Date | null };
```

### CalendarEvent

```tsx
type CalendarEvent = {
  start_date: string;      // "YYYY-MM-DD"
  end_date: string;        // "YYYY-MM-DD"
  name: string;
  specific_teams?: string;
};
```

### DayInfo

```tsx
type DayInfo = {
  date: string;              // "YYYY-MM-DD"
  text: string;              // e.g. "₹8K"
  textColor?: string;
  backgroundColor?: string;
};
```

### SmartSuggestion

```tsx
type SmartSuggestion = {
  label: string;   // e.g. "January 24-27"
  sub: string;     // e.g. "Republic Day Weekend"
  from: Date;
  to: Date;
};
```

### CalendarDayState

Passed to `renderDay`. Contains everything about the day:

```tsx
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
```

### Styleable Slots

Both `classNames` and `styles` accept keys for these slots:

`root` · `shell` · `sidebar` · `months` · `month` · `header` · `title` · `nav` · `weekdays` · `weekday` · `grid` · `cell` · `footer`

---

## Usage Examples

### Range Selection (Desktop)

```tsx
import { Calendar } from "calendrix";
import type { CalendarRange } from "calendrix";
import "calendrix/styles.css";

function DesktopBooking() {
  const [range, setRange] = useState<CalendarRange>({ from: null, to: null });

  return (
    <Calendar
      mode="range"
      value={range}
      onChange={(v) => setRange(v as CalendarRange)}
      numberOfMonths={1}
      variant="desktop"
      showNavigation={true}
      weekStartsOn={0}
      labels={{ weekdayNamesShort: ["SU", "MO", "TU", "WE", "TH", "FR", "SA"] }}
    />
  );
}
```

### Mobile with Infinite Scroll

```tsx
function MobileBooking() {
  const [range, setRange] = useState<CalendarRange>({ from: null, to: null });

  return (
    <Calendar
      mode="range"
      value={range}
      onChange={(v) => setRange(v as CalendarRange)}
      numberOfMonths={15}
      variant="mobile"
      showNavigation={false}
      weekStartsOn={0}
      initialMonthsToRender={4}
      pastMonthsCount={6}
    />
  );
}
```

### Hotel Mode with All Features

```tsx
const events: CalendarEvent[] = [
  { start_date: "2026-01-24", end_date: "2026-01-26", name: "Republic Day", specific_teams: "All" },
  { start_date: "2026-04-03", end_date: "2026-04-03", name: "Good Friday", specific_teams: "All" },
];

const blockedDates = ["2026-01-10", "2026-01-11", "2026-02-20"];

const dayInfo: DayInfo[] = [
  { date: "2026-01-16", text: "₹8K", textColor: "#0066cc", backgroundColor: "#e6f2ff" },
  { date: "2026-01-24", text: "₹15K", textColor: "#cc0000", backgroundColor: "#ffe6e6" },
];

const minNights: MinNights = {
  "2026-01-24": 3,   // Republic Day check-in requires 3-night min
  "2026-04-01": 4,
};

const suggestions: SmartSuggestion[] = [
  { label: "January 24-27", sub: "Republic Day Weekend", from: new Date(2026, 0, 24), to: new Date(2026, 0, 27) },
  { label: "April 3-5", sub: "Good Friday Weekend", from: new Date(2026, 3, 3), to: new Date(2026, 3, 5) },
];

<Calendar
  mode="range"
  value={range}
  onChange={(v) => setRange(v as CalendarRange)}
  variant="desktop"
  calendarType="hotel"
  events={events}
  blockedDates={blockedDates}
  dayInfo={dayInfo}
  minNights={minNights}
  smartSuggestions={suggestions}
  smartSuggestionsTitle="WEEKEND GETAWAYS"
  allowSameDay={false}
  allowPastDates={false}
/>
```

### Custom Day Renderer

```tsx
function renderDay({ state }: { state: CalendarDayState }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {state.eventLabels.length > 0 && (
        <div style={{ display: "flex", gap: 2 }}>
          {state.eventLabels.map((lbl) => (
            <span key={lbl} style={{ fontSize: 6, background: "#10b981", color: "#fff", borderRadius: 2, padding: "1px 3px" }}>
              {lbl}
            </span>
          ))}
        </div>
      )}
      <span>{state.date.getDate()}</span>
      {state.dayInfo && (
        <span style={{ fontSize: 8, color: state.dayInfo.textColor, backgroundColor: state.dayInfo.backgroundColor, borderRadius: 3, padding: "1px 4px" }}>
          {state.dayInfo.text}
        </span>
      )}
    </div>
  );
}

<Calendar renderDay={renderDay} />
```

### Custom Month Title

```tsx
function renderMonthTitle(month: Date, title: string) {
  const holidayCount = getHolidayCount(month); // your logic
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontWeight: 700 }}>{title}</span>
      {holidayCount > 0 && (
        <span style={{ fontSize: 10, background: "#fef3c7", color: "#92400e", borderRadius: 12, padding: "2px 8px" }}>
          {holidayCount} Holidays
        </span>
      )}
    </div>
  );
}

<Calendar renderMonthTitle={renderMonthTitle} />
```

---

## CSS Customization

### CSS Variables

Override these on `.rcss-calendar` to theme the calendar:

```css
.rcss-calendar {
  --rcss-fg: #111827;           /* Text color */
  --rcss-muted: #6b7280;       /* Muted text */
  --rcss-border: #e5e7eb;      /* Border color */
  --rcss-bg: #ffffff;           /* Background */
  --rcss-bg-subtle: #f9fafb;   /* Hover background */
  --rcss-accent: #2d66a1;      /* Selected/accent color */
  --rcss-accent-fg: #ffffff;   /* Selected text color */
  --rcss-range-bg: #d6e6ff;    /* In-range background */
  --rcss-radius: 12px;         /* Border radius */
  --rcss-cell: 40px;           /* Cell size */
  --rcss-gap: 4px;             /* Grid gap */
}
```

### Cell State Classes

Every cell gets state classes you can target:

| Class | When applied |
|-------|-------------|
| `.is-in-month` | Date belongs to the displayed month |
| `.is-out-month` | Date from adjacent month |
| `.is-selected` | Currently selected |
| `.is-in-range` | Between range start and end |
| `.is-range-start` | First date in range |
| `.is-range-end` | Last date in range |
| `.is-today` | Today's date |
| `.is-blocked` | Blocked or past date |
| `.is-strikethrough` | Blocked by min-nights |
| `.has-event` | Has calendar events |
| `.is-disabled` | Not selectable |

---

## Behavior Notes

- **Initial month:** Opens at current month by default. If both check-in and check-out are set, opens at the check-in month.
- **Smart suggestion click:** Desktop navigates to that month; mobile scrolls to it (expanding lazy-loaded months if needed).
- **Suggestions grouping:** Suggestions are automatically grouped by month with headers.
- **Hotel mode:** In `calendarType="hotel"`, checkout is allowed on the first blocked date after check-in. Blocked dates within a range reset the selection.
- **Min-nights:** Dates that violate the minimum-night requirement show a strikethrough and cannot be selected as checkout.
- **Infinite scroll:** On mobile, use `initialMonthsToRender` + `pastMonthsCount` for lazy-loaded bidirectional scrolling with automatic scroll-position restoration.
- **Event cells:** Dates with events get an orange gradient background (`has-event` class).
- **SSR safe:** Ships with `"use client"` directive. Compatible with Next.js App Router.
