<p align="center">
  <h1 align="center">📅 Calendrix</h1>
  <p align="center">
    A lightweight, fully-typed React calendar component built for hotel bookings, travel apps, and date pickers.
  </p>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/calendrix"><img src="https://img.shields.io/npm/v/calendrix?color=%234f46e5&label=npm" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/calendrix"><img src="https://img.shields.io/npm/dm/calendrix?color=%2310b981" alt="npm downloads" /></a>
  <a href="https://bundlephobia.com/package/calendrix"><img src="https://img.shields.io/bundlephobia/minzip/calendrix?color=%23f59e0b&label=size" alt="bundle size" /></a>
  <a href="https://github.com/bdbose/calendrix/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/calendrix?color=%236366f1" alt="license" /></a>
  <a href="https://www.npmjs.com/package/calendrix"><img src="https://img.shields.io/npm/types/calendrix?color=%233b82f6" alt="TypeScript" /></a>
</p>

<p align="center">
  <b>Range selection</b> · <b>Single date</b> · <b>Hotel mode</b> · <b>Blocked dates</b> · <b>Min-nights</b> · <b>Smart suggestions</b> · <b>Mobile & desktop</b> · <b>SSR-safe</b>
</p>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎯 **Single & Range Selection** | Pick a single date or a check-in / check-out range |
| 🏨 **Hotel Mode** | Allows checkout on blocked dates, just like real hotel calendars |
| 🚫 **Blocked Dates** | Disable specific dates from selection |
| 🌙 **Min Nights** | Enforce per-date minimum-night requirements |
| 💡 **Smart Suggestions** | Built-in suggestion panel (e.g. "Republic Day Weekend") |
| 📱 **Mobile & Desktop Variants** | Optimized layouts with infinite scroll on mobile |
| 🎨 **Fully Customizable** | Custom `renderDay`, `renderMonthTitle`, classNames, styles |
| 💰 **Day Info Overlays** | Show prices, labels, or badges below each date |
| 📆 **Calendar Events** | Display event labels on date cells |
| ♿ **Accessible** | ARIA labels, keyboard nav, semantic HTML |
| ⚡ **Lazy Loading** | Progressive month rendering for large date ranges |
| 🔒 **SSR / Next.js Safe** | Ships with `"use client"` directive — works out of the box with Next.js App Router |
| 🪶 **Zero Dependencies** | Only `react` and `react-dom` as peer deps |
| 🟦 **TypeScript First** | Full type definitions included |

---

## 📦 Installation

```bash
# npm
npm install calendrix

# yarn
yarn add calendrix

# pnpm
pnpm add calendrix
```

> **Peer dependencies:** `react >= 16.8.0` and `react-dom >= 16.8.0`

---

## 🚀 Quick Start

### Basic Date Picker (Single Date)

```tsx
import { Calendar } from "calendrix";
import "calendrix/styles.css";

function DatePicker() {
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

### Date Range Picker (Check-in / Check-out)

```tsx
import { useState } from "react";
import { Calendar } from "calendrix";
import type { CalendarRange } from "calendrix";
import "calendrix/styles.css";

function BookingCalendar() {
  const [range, setRange] = useState<CalendarRange>({ from: null, to: null });

  return (
    <Calendar
      mode="range"
      value={range}
      onChange={(v) => setRange(v as CalendarRange)}
      numberOfMonths={2}
      variant="desktop"
      showNavigation
    />
  );
}
```

---

## 🏨 Hotel Booking Calendar (Full Example)

A production-ready hotel calendar with blocked dates, minimum nights, prices, and smart suggestions:

```tsx
import { useState } from "react";
import { Calendar } from "calendrix";
import type { CalendarRange, MinNights, DayInfo } from "calendrix";
import "calendrix/styles.css";

function HotelBookingCalendar() {
  const [range, setRange] = useState<CalendarRange>({ from: null, to: null });

  // Block specific dates
  const blockedDates = ["2026-01-10", "2026-01-11", "2026-02-20"];

  // Set minimum nights per check-in date
  const minNights: MinNights = {
    "2026-01-24": 3, // Republic Day weekend: 3-night minimum
    "2026-02-14": 2, // Valentine's Day: 2-night minimum
  };

  // Show prices below dates
  const dayInfo: DayInfo[] = [
    { date: "2026-01-16", text: "₹8K", textColor: "#0066cc" },
    { date: "2026-01-17", text: "₹9K", textColor: "#0066cc" },
    { date: "2026-01-24", text: "₹15K", textColor: "#cc0000" },
  ];

  // Smart suggestion chips
  const suggestions = [
    {
      label: "Jan 24–27",
      sub: "Republic Day Weekend",
      from: new Date(2026, 0, 24),
      to: new Date(2026, 0, 27),
    },
    {
      label: "Feb 14–16",
      sub: "Valentine's Weekend",
      from: new Date(2026, 1, 14),
      to: new Date(2026, 1, 16),
    },
  ];

  return (
    <Calendar
      mode="range"
      value={range}
      onChange={(v) => setRange(v as CalendarRange)}
      numberOfMonths={2}
      variant="desktop"
      calendarType="hotel"
      blockedDates={blockedDates}
      minNights={minNights}
      dayInfo={dayInfo}
      smartSuggestions={suggestions}
      showSmartSuggestions
      filterPastSuggestions
      allowPastDates={false}
      allowSameDay={false}
      weekStartsOn={0}
      labels={{ weekdayNamesShort: ["SU", "MO", "TU", "WE", "TH", "FR", "SA"] }}
    />
  );
}
```

---

## 📱 Mobile Infinite Scroll

Render many months at once with lazy-loaded rendering for smooth mobile scrolling:

```tsx
<Calendar
  mode="range"
  value={range}
  onChange={(v) => setRange(v as CalendarRange)}
  numberOfMonths={12}
  variant="mobile"
  showNavigation={false}
  initialMonthsToRender={3}  // Render 3 first, rest load on scroll
  allowPastDates={false}
  calendarType="hotel"
/>
```

---

## 🎨 Custom Day Rendering

Use `renderDay` to fully control how each date cell looks:

```tsx
<Calendar
  mode="single"
  value={date}
  onChange={(d) => setDate(d as Date | null)}
  renderDay={({ state }) => (
    <div style={{ textAlign: "center" }}>
      <span>{state.date.getDate()}</span>
      {state.today && <span>📍</span>}
      {state.dayInfo && (
        <span style={{ color: state.dayInfo.textColor, fontSize: 10 }}>
          {state.dayInfo.text}
        </span>
      )}
    </div>
  )}
/>
```

The `state` object in `renderDay` gives you:

| Field | Type | Description |
|---|---|---|
| `date` | `Date` | The date for this cell |
| `inMonth` | `boolean` | Whether the date belongs to the displayed month |
| `disabled` | `boolean` | Whether selection is disabled |
| `selected` | `boolean` | Whether this date is selected |
| `inRange` | `boolean` | Whether this date falls within the selected range |
| `rangeStart` | `boolean` | Whether this is the start of a range |
| `rangeEnd` | `boolean` | Whether this is the end of a range |
| `today` | `boolean` | Whether this is today's date |
| `blockedByDate` | `boolean` | Whether blocked via `blockedDates` |
| `blockedByMinNights` | `boolean` | Whether blocked by minimum night rules |
| `eventLabels` | `string[]` | Event names on this date |
| `dayInfo` | `DayInfo \| null` | Custom overlay info (price, label) |
| `minNightsRequired` | `number \| null` | Min-nights requirement if check-in here |

---

## 🎭 Custom Month Title

Add badges, icons, or holiday counts to month headers:

```tsx
<Calendar
  renderMonthTitle={(month, title) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span>{title}</span>
      <span style={{ fontSize: 11, color: "#e67e22" }}>3 Holidays</span>
    </div>
  )}
/>
```

---

## 📋 Full Props Reference

### Core

| Prop | Type | Default | Description |
|---|---|---|---|
| `mode` | `"single" \| "range"` | `"single"` | Selection mode |
| `value` | `Date \| null \| CalendarRange` | — | Controlled selected value |
| `defaultValue` | `Date \| null \| CalendarRange` | — | Uncontrolled default value |
| `onChange` | `(value) => void` | — | Selection change callback |
| `month` | `Date` | — | Controlled visible month |
| `defaultMonth` | `Date` | — | Default visible month |
| `onMonthChange` | `(month: Date) => void` | — | Month navigation callback |

### Layout

| Prop | Type | Default | Description |
|---|---|---|---|
| `numberOfMonths` | `number` | `1` | Number of months to display |
| `monthsLayout` | `"stack" \| "row"` | `"row"` on desktop (up to 3 months, non-scrolling), else `"stack"` | `"row"` shows months side by side: no shared header title, prev arrow at the far left and next at the far right of the month-title row, titles centred, no scroll-to-month (arrows only). Ignores `pastMonthsCount` / `initialMonthsToRender` |
| `variant` | `"mobile" \| "desktop"` | — | Layout variant |
| `showNavigation` | `boolean` | `true` | Show prev/next arrows |
| `weekStartsOn` | `0–6` | `1` (Mon) | First day of the week (0 = Sun) |
| `cellWidth` | `number` | — | Cell width in px (desktop) |
| `cellHeight` | `number` | — | Cell height in px (desktop) |
| `fixedWeeks` | `boolean` | `false` | Always render 6 week rows. By default each month shows only the weeks it spans (4–6) |
| `navIcon` | `"glyph" \| "chevron"` | `"glyph"` | Month arrows: `‹ ›` text, or SVG chevrons centred in their hover circle |

### Date Constraints

| Prop | Type | Default | Description |
|---|---|---|---|
| `minDate` | `Date` | — | Earliest selectable date |
| `maxDate` | `Date` | — | Latest selectable date |
| `isDateDisabled` | `(date: Date) => boolean` | — | Custom disable logic |
| `blockedDates` | `string[]` | — | Blocked dates (`"YYYY-MM-DD"`) |
| `allowPastDates` | `boolean` | `false` | Allow selecting past dates |
| `allowSameDay` | `boolean` | `false` | Allow same check-in & checkout |
| `onBlockedDateClick` | `(date: Date, reason: "past" \| "blocked" \| "minNights") => void` | — | Called when an unselectable day is clicked or activated by keyboard (e.g. show an "already booked" toast). When set, blocked cells receive clicks |

### Hotel / Booking

| Prop | Type | Default | Description |
|---|---|---|---|
| `calendarType` | `"hotel" \| null` | `null` | Hotel mode (checkout on blocked dates) |
| `minNights` | `{ [date: string]: number }` | — | Min-night rules per check-in date |
| `events` | `CalendarEvent[]` | — | Event labels to display on dates |
| `showEvents` | `boolean` | `true` | Show/hide event labels |
| `eventDisplay` | `"highlight" \| "dot" \| "color" \| "none"` | `"highlight"` | How event dates are marked: tinted cell + label chips, a dot under the number, a red date, or nothing |
| `showEventTooltip` | `boolean` | `false` | Event names in a tooltip on hover / keyboard focus |
| `dayInfo` | `DayInfo[]` | — | Price / info overlays per date (see `buildPriceDayInfo`) |
| `dayInfoDisplay` | `"badge" \| "text"` | `"badge"` | `"text"` shows plain coloured text that turns white on the selected start/end |
| `hideDayInfoWhenBlocked` | `boolean` | `false` | Hide `dayInfo` on past and blocked days |

### Smart Suggestions

| Prop | Type | Default | Description |
|---|---|---|---|
| `smartSuggestions` | `SmartSuggestion[]` | — | Suggestion items to display |
| `showSmartSuggestions` | `boolean` | `true` | Show/hide the suggestions panel |
| `filterPastSuggestions` | `boolean` | `true` | Auto-hide expired suggestions |
| `onSuggestionSelect` | `(suggestion) => void` | — | Suggestion click callback |
| `suggestionsStyle` | `"default" \| "cards"` | `"default"` | Mobile suggestion card look; `"cards"` is softer with a ✓ on the active card |

### Customization

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | — | Root element class |
| `style` | `CSSProperties` | — | Root element inline styles |
| `classNames` | `CalendarClassNames` | — | Class map for internal parts |
| `styles` | `CalendarStyles` | — | Style map for internal parts |
| `theme` | `CalendarTheme` | — | Colours, font and sizes as typed values — see [Theming](#-theming) |
| `labels` | `CalendarLabels` | — | Custom month/weekday strings |
| `sidebar` | `ReactNode` | — | Right-side content (desktop) |
| `footer` | `ReactNode` | — | Bottom footer content |
| `renderDay` | `(args) => ReactNode` | — | Custom day cell renderer |
| `renderMonthTitle` | `(month, title) => ReactNode` | — | Custom month header renderer |
| `aria-label` | `string` | — | Accessibility label |

### Performance

| Prop | Type | Default | Description |
|---|---|---|---|
| `initialMonthsToRender` | `number` | — | Months to render initially (rest lazy-load on scroll) |

---

## 🟦 TypeScript

All types are exported for full type safety:

```tsx
import type {
  CalendarProps,
  CalendarValue,
  CalendarRange,
  CalendarSelectionMode,
  CalendarDayState,
  CalendarEvent,
  CalendarType,
  BlockedDates,
  DayInfo,
  MinNights,
  SmartSuggestion,
  BlockedDateReason,
  CalendarMonthsLayout,
  CalendarTheme,
  DesktopCalendarCardProps,
} from "calendrix";
```

---

## 🖥️ Desktop Card

`DesktopCalendarCard` is the desktop counterpart of `MobileCalendarSheet`: a
card with a header, the calendar and a footer. It takes every `Calendar` prop.

```tsx
import { DesktopCalendarCard, buildPriceDayInfo } from "calendrix";

// Search-bar style: picked dates + "Clear dates" + "Continue (3 Nights)"
<DesktopCalendarCard
  mode="range"
  value={range}
  onChange={setRange}
  onContinue={close}
  smartSuggestions={suggestions}
/>

// Listing style: step hint, prices, Check-in → Check-out boxes
<DesktopCalendarCard
  value={range}
  onChange={setRange}
  width={400}
  showStepHint
  footer="fields"
  dayInfo={buildPriceDayInfo(pricesByDate)}
  dayInfoDisplay="text"
  hideDayInfoWhenBlocked
  note="Prices shown are per night"
/>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `ReactNode \| null` | `"Select your travel dates"` | Header title; `null` hides the header |
| `showStepHint` | `boolean` | `false` | "Tap your check-in date to begin" → "Now tap your check-out date" under the title |
| `stepHintPlacement` | `"header" \| "footer"` | `"header"` | Where the step hint goes: under the title, or above the Continue button (works without a header) |
| `datesPlacement` | `"footer" \| "tab"` | `"footer"` | `"tab"` shows the picked dates ("Select Dates" → "17 November 2026 → 19 November 2026") and "Clear dates" in a small centred tab hanging below the card |
| `checkInHint` / `checkOutHint` | `ReactNode` | — | Custom hint text |
| `note` | `ReactNode` | — | Small note under the calendar |
| `footer` | `"summary" \| "fields" \| "none"` | `"summary"` | Dates + Clear + Continue, or Check-in/Check-out boxes + nights pill |
| `onContinue` | `(value) => void` | — | Continue button handler (disabled until a full range is picked) |
| `onClear` | `() => void` | — | Called after "Clear dates" |
| `continueLabel` / `clearLabel` / `emptyLabel` | `string` | `"Continue"` / `"Clear dates"` / `"Select Dates"` | Footer text |
| `checkInLabel` / `checkOutLabel` / `addDateLabel` | `string` | `"Check-in"` / `"Check-out"` / `"Add date"` | Field text |
| `formatDate` | `(d: Date) => string` | — | Footer date format |
| `suggestionsPlacement` | `"sidebar" \| "footer"` | `"sidebar"` | `"footer"` shows suggestions as a scrollable chip row in the footer, with the dates, Clear and Continue on the right |
| `width` | `number \| string` | `610` (wider for side-by-side months) | Card width |
| `calendarClassName` | `string` | — | Class for the inner calendar |

### Prices

`buildPriceDayInfo(prices, options?)` turns `{ "YYYY-MM-DD": price }` into
`dayInfo`, formatted compactly (₹950, ₹12.5K, ₹1.2L) and coloured green when a
price is 20%+ below its month's average. Options: `currency`, `format`,
`cheaperBelow` (default `0.8`, `0` to turn off), `cheaperColor`, `color`.
`formatCompactPrice(price, currency?)` is exported too.

## 🎨 Theming

Pass a `theme` object instead of overriding internal classes. Every field is
optional and typed; numbers are pixels. `MobileCalendarSheet` accepts the same
`theme`.

```tsx
<Calendar
  variant="desktop"
  numberOfMonths={2}
  monthsLayout="row"
  navIcon="chevron"
  eventDisplay="dot"
  showEventTooltip
  theme={{
    fontFamily: "Inter, sans-serif",
    accent: "#373636",
    rangeBg: "#f6efe2",
    titleFontSize: 16,
    weekdayFontSize: 11,
    navSize: 32,
    sidebarWidth: 210,
  }}
/>
```

| Group | Fields |
|---|---|
| Colours | `fg`, `muted`, `border`, `bg`, `bgSubtle`, `accent`, `accentFg`, `rangeBg`, `eventColor` (dot), `eventTextColor` (red date) |
| Holiday badge | `eventBadgeBg` (colour or gradient), `eventBadgeFg`, `eventBadgeRadius`, `eventBadgeFontFamily`, `eventBadgeFontWeight` |
| Type | `fontFamily`, `dayFontSize`, `dayFontWeight`, `dayLetterSpacing`, `dayInfoFontSize`, `titleFontSize`, `titleLetterSpacing`, `weekdayFontSize` |
| Size & spacing | `cellSize`, `cellGap`, `radius`, `padding`, `headerPadding`, `navSize`, `navFontSize`, `monthsGap`, `sidebarWidth`, `sidebarPadding`, `cardHeaderPadding` |
| Suggestions | `suggestionAccent`, `suggestionActiveBg`, `suggestionActiveBorder`, `suggestionActiveAccent` |

Each field maps to a `--rcss-*` CSS variable, so you can also set them in CSS.

The month badge reads "1 Holiday" / "N Holidays"; change the words with
`labels={{ eventLabel, eventsLabel }}`.

### Mobile sheet options

| Prop | Type | Default | Description |
|---|---|---|---|
| `showTopBar` | `boolean` | `true` | Show the title bar with the close (X) button. When hidden, the date header pins to the top |
| `style` | `CSSProperties` | — | e.g. `{ height: "100%" }` to fill a container instead of the viewport |

## 🎨 Styling

Import the default styles:

```tsx
import "calendrix/styles.css";
```

Override styles using the `classNames` or `styles` props to target specific parts:

```tsx
<Calendar
  classNames={{
    root: "my-calendar",
    cell: "my-cell",
    header: "my-header",
    weekdays: "my-weekdays",
  }}
  styles={{
    cell: { borderRadius: 8 },
  }}
/>
```

**Targetable parts:** `root`, `shell`, `sidebar`, `months`, `month`, `header`, `title`, `nav`, `weekdays`, `weekday`, `grid`, `cell`, `footer`

---

## 🔧 Next.js / SSR Compatibility

Calendrix ships with `"use client"` baked into the bundle — it works seamlessly with **Next.js App Router** without any extra wrappers.

```tsx
// app/booking/page.tsx — works as-is, no "use client" needed in your file
import { Calendar } from "calendrix";
import "calendrix/styles.css";

export default function BookingPage() {
  return <Calendar mode="range" numberOfMonths={2} />;
}
```

**Supports:** React ≥ 16.8 · Next.js 12+ · Vite · CRA · Remix · Gatsby

---

## 📁 Package Contents

```
calendrix/
├── dist/
│   ├── index.js       # ESM bundle
│   ├── index.cjs      # CommonJS bundle
│   ├── index.css      # Default styles
│   ├── index.d.ts     # TypeScript declarations
│   └── index.d.cts    # CTS declarations
├── README.md
└── LICENSE
```

---

## 🤝 Contributing

```bash
# Clone and install
git clone https://github.com/bdbose/calendrix.git
cd calendrix
npm install

# Build the library
npm run build

# Run the demo app
cd examples/demo
npm install
npm run dev
```

---

## 📄 License

[MIT](./LICENSE) © [bdbose](https://github.com/bdbose)

---

<p align="center">
  <sub>Built with ❤️ for the React community. Star ⭐ the repo if you find it useful!</sub>
</p>
