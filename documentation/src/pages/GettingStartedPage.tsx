import { CodeBlock } from "../components/CodeBlock";

export function GettingStartedPage() {
  return (
    <>
      <h1>Getting Started</h1>
      <p className="doc-lead">
        Install the package, import the styles, and drop a{" "}
        <code>{"<Calendar />"}</code> into your app.
      </p>

      <h2>Installation</h2>
      <CodeBlock language="bash">{`# npm
npm install next-calendrix

# yarn
yarn add next-calendrix

# pnpm
pnpm add next-calendrix`}</CodeBlock>

      <div className="doc-callout doc-callout-info">
        Calendrix has zero runtime dependencies. React 16.8+ is the only peer
        dependency.
      </div>

      <h2>Import the styles</h2>
      <p>
        Import the stylesheet once, anywhere in your app (typically your root
        entry file).
      </p>
      <CodeBlock>{`import "next-calendrix/styles.css";`}</CodeBlock>

      <h2>Your first calendar</h2>
      <CodeBlock>{`import * as React from "react";
import { Calendar } from "next-calendrix";
import "next-calendrix/styles.css";

export function App() {
  const [date, setDate] = React.useState<Date | null>(null);

  return (
    <Calendar
      mode="single"
      value={date}
      onChange={(d) => setDate(d as Date | null)}
    />
  );
}`}</CodeBlock>

      <h2>Range selection</h2>
      <CodeBlock>{`import { Calendar } from "next-calendrix";
import type { CalendarRange } from "next-calendrix";

export function Booking() {
  const [range, setRange] = React.useState<CalendarRange>({
    from: null,
    to: null,
  });

  return (
    <Calendar
      mode="range"
      value={range}
      onChange={(v) => setRange(v as CalendarRange)}
      numberOfMonths={2}
    />
  );
}`}</CodeBlock>

      <h2>Use the mobile sheet</h2>
      <p>
        For mobile bookings, drop in the full-page{" "}
        <code>{"<MobileCalendarSheet />"}</code> shell with title bar,
        check-in / check-out header, and footer CTAs.
      </p>
      <CodeBlock>{`import { MobileCalendarSheet } from "next-calendrix";
import "next-calendrix/styles.css";

export function MobileBooking() {
  return (
    <MobileCalendarSheet
      mode="range"
      defaultValue={{ from: null, to: null }}
      onContinue={(value) => console.log("Selected:", value)}
      onClose={() => console.log("Close pressed")}
    />
  );
}`}</CodeBlock>

      <h2>Theming</h2>
      <p>
        Calendrix uses CSS variables for theming. Override them on{" "}
        <code>.rcss-calendar</code> or any wrapper.
      </p>
      <CodeBlock language="css">{`.rcss-calendar {
  --rcss-accent: #2d66a1;       /* selected / range end */
  --rcss-accent-fg: #ffffff;
  --rcss-range-bg: #d6e6ff;     /* range body */
  --rcss-fg: #111827;
  --rcss-muted: #6b7280;
  --rcss-border: #e5e7eb;
  --rcss-bg: #ffffff;
  --rcss-bg-subtle: #f9fafb;
  --rcss-radius: 12px;
  --rcss-cell: 40px;
  --rcss-gap: 4px;
}`}</CodeBlock>

      <div className="doc-callout doc-callout-success">
        That's it! Browse the <strong>Calendar</strong> reference for every
        prop, or open the <strong>Playground</strong> to tinker live.
      </div>
    </>
  );
}
