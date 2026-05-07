import * as React from "react";
import { Calendar } from "next-calendrix";
import type {
  CalendarRange,
  CalendarEvent,
  DayInfo,
  MinNights,
  SmartSuggestion,
} from "next-calendrix";
import { Example } from "../components/Example";
import { CodeBlock } from "../components/CodeBlock";

const today = new Date();
const inDays = (n: number) =>
  new Date(today.getFullYear(), today.getMonth(), today.getDate() + n);
const ymd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;

/* ── 1: Min nights ── */
function MinNightsExample() {
  const [range, setRange] = React.useState<CalendarRange>({
    from: null,
    to: null,
  });
  const minNights: MinNights = {
    [ymd(inDays(3))]: 3,
    [ymd(inDays(10))]: 4,
  };
  return (
    <Calendar
      mode="range"
      value={range}
      onChange={(v) => setRange(v as CalendarRange)}
      minNights={minNights}
      variant="desktop"
    />
  );
}

/* ── 2: Day info (prices) ── */
function DayInfoExample() {
  const [range, setRange] = React.useState<CalendarRange>({
    from: null,
    to: null,
  });

  const dayInfo: DayInfo[] = [];
  for (let i = 0; i < 30; i++) {
    const d = inDays(i);
    const price = 4000 + ((i * 123) % 1500);
    dayInfo.push({
      date: ymd(d),
      text: `₹${(price / 1000).toFixed(1)}K`,
      textColor: "#666",
    });
  }
  return (
    <Calendar
      mode="range"
      value={range}
      onChange={(v) => setRange(v as CalendarRange)}
      dayInfo={dayInfo}
      cellHeight={56}
      variant="desktop"
    />
  );
}

/* ── 3: Events ── */
function EventsExample() {
  const [range, setRange] = React.useState<CalendarRange>({
    from: null,
    to: null,
  });
  const events: CalendarEvent[] = [
    {
      start_date: ymd(inDays(2)),
      end_date: ymd(inDays(2)),
      name: "Holi",
    },
    {
      start_date: ymd(inDays(8)),
      end_date: ymd(inDays(10)),
      name: "Long weekend",
    },
  ];
  return (
    <Calendar
      mode="range"
      value={range}
      onChange={(v) => setRange(v as CalendarRange)}
      events={events}
      variant="desktop"
    />
  );
}

/* ── 4: Smart suggestions ── */
function SuggestionsExample() {
  const [range, setRange] = React.useState<CalendarRange>({
    from: null,
    to: null,
  });
  const suggestions: SmartSuggestion[] = [
    {
      label: "This weekend",
      sub: "2 nights",
      from: inDays(2),
      to: inDays(4),
    },
    {
      label: "Next month",
      sub: "Long stay",
      from: inDays(30),
      to: inDays(37),
    },
  ];
  return (
    <Calendar
      mode="range"
      value={range}
      onChange={(v) => setRange(v as CalendarRange)}
      smartSuggestions={suggestions}
      variant="desktop"
    />
  );
}

/* ── 5: Custom day render ── */
function CustomDayExample() {
  const [date, setDate] = React.useState<Date | null>(null);
  return (
    <Calendar
      mode="single"
      value={date}
      onChange={(v) => setDate(v as Date | null)}
      variant="desktop"
      renderDay={({ state }) => (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <span style={{ fontWeight: state.today ? 700 : 400 }}>
            {state.date.getDate()}
          </span>
          <span
            style={{
              width: 4,
              height: 4,
              borderRadius: 999,
              background:
                state.date.getDay() === 0 || state.date.getDay() === 6
                  ? "#f59e0b"
                  : "transparent",
            }}
          />
        </div>
      )}
    />
  );
}

export function ExamplesPage() {
  return (
    <>
      <h1>Examples</h1>
      <p className="doc-lead">
        Real-world recipes covering the most common booking-flow patterns.
      </p>

      <h2>Minimum-nights enforcement</h2>
      <p>
        Pass a <code>minNights</code> map from check-in date to the required
        number of nights. Dates inside the disallowed window get a
        strikethrough.
      </p>
      <Example
        preview={<MinNightsExample />}
        code={`const minNights: MinNights = {
  "2026-04-21": 3,
  "2026-04-28": 4,
};

<Calendar
  mode="range"
  minNights={minNights}
  value={range}
  onChange={(v) => setRange(v as CalendarRange)}
/>`}
      />

      <h2>Per-day prices (dayInfo)</h2>
      <p>
        Show a small text under every day cell. Useful for prices, occupancy,
        weather — anything per-day.
      </p>
      <Example
        preview={<DayInfoExample />}
        code={`const dayInfo: DayInfo[] = [
  { date: "2026-04-22", text: "₹4.5K", textColor: "#666" },
  { date: "2026-04-23", text: "₹4.9K", textColor: "#666" },
  // …
];

<Calendar
  mode="range"
  dayInfo={dayInfo}
  cellHeight={56}
  value={range}
  onChange={(v) => setRange(v as CalendarRange)}
/>`}
      />

      <h2>Event labels</h2>
      <Example
        preview={<EventsExample />}
        code={`const events: CalendarEvent[] = [
  { start_date: "2026-05-01", end_date: "2026-05-01", name: "May Day" },
  { start_date: "2026-05-08", end_date: "2026-05-10", name: "Long weekend" },
];

<Calendar
  mode="range"
  events={events}
  value={range}
  onChange={(v) => setRange(v as CalendarRange)}
/>`}
      />

      <h2>Smart suggestions</h2>
      <Example
        preview={<SuggestionsExample />}
        code={`const suggestions: SmartSuggestion[] = [
  {
    label: "This weekend",
    sub: "2 nights",
    from: new Date(2026, 3, 25),
    to: new Date(2026, 3, 27),
  },
];

<Calendar
  mode="range"
  smartSuggestions={suggestions}
  value={range}
  onChange={(v) => setRange(v as CalendarRange)}
/>`}
      />

      <h2>Custom day rendering</h2>
      <Example
        preview={<CustomDayExample />}
        code={`<Calendar
  renderDay={({ state }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <span style={{ fontWeight: state.today ? 700 : 400 }}>
        {state.date.getDate()}
      </span>
      {/* weekend dot */}
      {(state.date.getDay() === 0 || state.date.getDay() === 6) && (
        <span style={{ width: 4, height: 4, borderRadius: 999, background: "#f59e0b" }} />
      )}
    </div>
  )}
/>`}
      />

      <h2>Multi-month layout</h2>
      <CodeBlock>{`<Calendar
  mode="range"
  numberOfMonths={3}
  value={range}
  onChange={(v) => setRange(v as CalendarRange)}
/>`}</CodeBlock>

      <h2>Bidirectional infinite scroll</h2>
      <p>
        Combine <code>numberOfMonths</code> and <code>pastMonthsCount</code> to
        load months above and below as the user scrolls. Set{" "}
        <code>initialMonthsToRender</code> to keep the first paint cheap.
      </p>
      <CodeBlock>{`<Calendar
  variant="mobile"
  numberOfMonths={24}
  pastMonthsCount={6}
  initialMonthsToRender={4}
  value={range}
  onChange={(v) => setRange(v as CalendarRange)}
/>`}</CodeBlock>
    </>
  );
}
