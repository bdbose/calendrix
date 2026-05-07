import * as React from "react";
import { Calendar } from "next-calendrix";
import type { CalendarRange } from "next-calendrix";
import { CodeBlock } from "../components/CodeBlock";
import { Example } from "../components/Example";
import { PropsTable } from "../components/PropsTable";
import { calendarProps } from "../data/propsData";

function SingleExample() {
  const [date, setDate] = React.useState<Date | null>(null);
  return (
    <Calendar
      mode="single"
      value={date}
      onChange={(v) => setDate(v as Date | null)}
      variant="desktop"
    />
  );
}

function RangeExample() {
  const [range, setRange] = React.useState<CalendarRange>({
    from: null,
    to: null,
  });
  return (
    <Calendar
      mode="range"
      value={range}
      onChange={(v) => setRange(v as CalendarRange)}
      variant="desktop"
    />
  );
}

function BlockedExample() {
  const [range, setRange] = React.useState<CalendarRange>({
    from: null,
    to: null,
  });
  // Block ~7 days starting today + 5
  const blocked: string[] = [];
  const base = new Date();
  for (let i = 5; i < 12; i++) {
    const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    blocked.push(key);
  }
  return (
    <Calendar
      mode="range"
      value={range}
      onChange={(v) => setRange(v as CalendarRange)}
      blockedDates={blocked}
      calendarType="hotel"
      variant="desktop"
    />
  );
}

export function CalendarPage() {
  return (
    <>
      <h1>Calendar</h1>
      <p className="doc-lead">
        The core component. Use it standalone for single / range pickers, or
        compose it inside your own shell.
      </p>

      <h2>Import</h2>
      <CodeBlock>{`import { Calendar } from "next-calendrix";
import type {
  CalendarProps,
  CalendarValue,
  CalendarRange,
  CalendarSelectionMode,
  CalendarDayState,
} from "next-calendrix";
import "next-calendrix/styles.css";`}</CodeBlock>

      <h2>Single-date</h2>
      <Example
        preview={<SingleExample />}
        code={`const [date, setDate] = React.useState<Date | null>(null);

<Calendar
  mode="single"
  value={date}
  onChange={(v) => setDate(v as Date | null)}
/>`}
      />

      <h2>Range</h2>
      <Example
        preview={<RangeExample />}
        code={`const [range, setRange] = React.useState<CalendarRange>({
  from: null,
  to: null,
});

<Calendar
  mode="range"
  value={range}
  onChange={(v) => setRange(v as CalendarRange)}
/>`}
      />

      <h2>Blocked dates + hotel mode</h2>
      <p>
        In <code>hotel</code> mode, the first blocked date after a check-in is
        still allowed as a check-out — matching how booking flows usually
        work.
      </p>
      <Example
        preview={<BlockedExample />}
        code={`<Calendar
  mode="range"
  blockedDates={["2026-04-23", "2026-04-24", "2026-04-25"]}
  calendarType="hotel"
  value={range}
  onChange={(v) => setRange(v as CalendarRange)}
/>`}
      />

      <h2>Props</h2>
      <p>
        All props are optional unless marked. Required props are flagged with a
        red asterisk.
      </p>
      <PropsTable rows={calendarProps} />

      <h2>renderDay</h2>
      <p>
        Use <code>renderDay</code> to fully customize the inside of each day
        cell. The function receives a rich state object including blocked,
        in-range, event, and day-info flags.
      </p>
      <CodeBlock>{`<Calendar
  renderDay={({ state }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <span>{state.date.getDate()}</span>
      {state.dayInfo && (
        <span style={{ fontSize: 10, color: "#666" }}>{state.dayInfo.text}</span>
      )}
    </div>
  )}
/>`}</CodeBlock>

      <h2>renderMonthTitle</h2>
      <CodeBlock>{`<Calendar
  numberOfMonths={3}
  renderMonthTitle={(month, title) => (
    <div className="my-month-header">
      <strong>{title}</strong>
      {/* badge, decorations, etc. */}
    </div>
  )}
/>`}</CodeBlock>

      <h2>Class & style slots</h2>
      <p>
        Calendar exposes per-slot <code>classNames</code> and <code>styles</code>{" "}
        objects with the following keys:
      </p>
      <ul>
        <li>
          <code>root</code>, <code>shell</code>, <code>sidebar</code>,{" "}
          <code>months</code>, <code>month</code>
        </li>
        <li>
          <code>header</code>, <code>title</code>, <code>nav</code>
        </li>
        <li>
          <code>weekdays</code>, <code>weekday</code>, <code>grid</code>,{" "}
          <code>cell</code>, <code>footer</code>
        </li>
      </ul>

      <CodeBlock>{`<Calendar
  classNames={{
    cell: "my-cell",
    title: "my-title",
  }}
  styles={{
    grid: { gap: 6 },
  }}
/>`}</CodeBlock>
    </>
  );
}
