import * as React from "react";
import { MobileCalendarSheet } from "next-calendrix";
import type { CalendarRange, SmartSuggestion } from "next-calendrix";
import { CodeBlock } from "../components/CodeBlock";
import { PropsTable } from "../components/PropsTable";
import { mobileSheetProps } from "../data/propsData";

const today = new Date();
const inDays = (n: number) =>
  new Date(today.getFullYear(), today.getMonth(), today.getDate() + n);

const demoSuggestions: SmartSuggestion[] = [
  {
    label: "This weekend",
    sub: "2 nights",
    from: inDays(2),
    to: inDays(4),
  },
  {
    label: "Next week",
    sub: "5-night stay",
    from: inDays(7),
    to: inDays(12),
  },
];

function MobileSheetPreview() {
  const [range, setRange] = React.useState<CalendarRange>({
    from: null,
    to: null,
  });

  return (
    <div className="doc-playground-mobile-frame">
      <MobileCalendarSheet
        mode="range"
        value={range}
        onChange={(v) => setRange(v as CalendarRange)}
        smartSuggestions={demoSuggestions}
        weekStartsOn={0}
        labels={{
          weekdayNamesShort: ["SU", "MO", "TU", "WE", "TH", "FR", "SA"],
        }}
        onContinue={(v) => alert(`Selected: ${JSON.stringify(v)}`)}
      />
    </div>
  );
}

export function MobileSheetPage() {
  return (
    <>
      <h1>MobileCalendarSheet</h1>
      <p className="doc-lead">
        A full-page mobile booking shell — title bar, sticky check-in /
        check-out header, scrollable calendar, and a fixed footer with{" "}
        <em>Clear Dates</em> + <em>Continue</em> buttons.
      </p>

      <h2>Import</h2>
      <CodeBlock>{`import { MobileCalendarSheet } from "next-calendrix";
import type { MobileCalendarSheetProps } from "next-calendrix";
import "next-calendrix/styles.css";`}</CodeBlock>

      <h2>Live preview</h2>
      <p>
        The sheet expects to fill the viewport. The preview below puts it
        inside a phone-sized frame.
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "16px 0 28px",
        }}
      >
        <MobileSheetPreview />
      </div>

      <h2>Basic usage</h2>
      <CodeBlock>{`import { MobileCalendarSheet } from "next-calendrix";
import "next-calendrix/styles.css";

export function MobileBooking() {
  return (
    <MobileCalendarSheet
      mode="range"
      defaultValue={{ from: null, to: null }}
      onContinue={(value) => {
        console.log("Selected:", value);
        // navigate to next step…
      }}
      onClose={() => history.back()}
    />
  );
}`}</CodeBlock>

      <h2>With smart suggestions, prices, and blocked dates</h2>
      <CodeBlock>{`<MobileCalendarSheet
  mode="range"
  value={range}
  onChange={setRange}
  blockedDates={["2026-05-10", "2026-05-11"]}
  calendarType="hotel"
  dayInfo={[
    { date: "2026-05-01", text: "₹4.5K" },
    { date: "2026-05-02", text: "₹4.8K" },
    // …
  ]}
  smartSuggestions={[
    {
      label: "Republic Day",
      sub: "3-night long weekend",
      from: new Date(2027, 0, 24),
      to: new Date(2027, 0, 27),
    },
  ]}
  longStayThreshold={7}
  longStayContent={
    <span>✨ You've unlocked Long Stay Benefits!</span>
  }
  onContinue={(value) => bookStay(value)}
/>`}</CodeBlock>

      <h2>Custom labels</h2>
      <CodeBlock>{`<MobileCalendarSheet
  title="Choose travel dates"
  checkInLabel="Arrival"
  checkOutLabel="Departure"
  clearLabel="Reset"
  continueLabel="Confirm"
  singleDatePlaceholder="Pick a day"
/>`}</CodeBlock>

      <h2>Custom footer</h2>
      <p>
        Pass any node as <code>footer</code> to fully replace the default
        footer; pass <code>null</code> to hide it entirely.
      </p>
      <CodeBlock>{`<MobileCalendarSheet
  footer={
    <div className="my-footer">
      <button onClick={…}>Skip</button>
      <button onClick={…}>Apply</button>
    </div>
  }
/>`}</CodeBlock>

      <h2>Props</h2>
      <PropsTable rows={mobileSheetProps} />

      <div className="doc-callout doc-callout-info">
        <code>MobileCalendarSheet</code> internally renders a{" "}
        <code>{"<Calendar variant=\"mobile\" />"}</code>. All Calendar props
        (events, blockedDates, dayInfo, minNights, smartSuggestions, etc.) are
        accepted at the sheet level and forwarded.
      </div>
    </>
  );
}
