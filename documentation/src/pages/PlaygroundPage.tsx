import * as React from "react";
import { Calendar, MobileCalendarSheet } from "next-calendrix";
import type {
  CalendarRange,
  CalendarValue,
  CalendarEvent,
  DayInfo,
  MinNights,
  SmartSuggestion,
} from "next-calendrix";
import { CodeBlock } from "../components/CodeBlock";

type Mode = "single" | "range";
type Variant = "desktop" | "mobile";
type Component = "Calendar" | "MobileCalendarSheet";

const today = new Date();
const inDays = (n: number) =>
  new Date(today.getFullYear(), today.getMonth(), today.getDate() + n);
const ymd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;

const SAMPLE_EVENTS: CalendarEvent[] = [
  {
    start_date: ymd(inDays(2)),
    end_date: ymd(inDays(3)),
    name: "Holiday",
  },
];

const SAMPLE_BLOCKED: string[] = [
  ymd(inDays(6)),
  ymd(inDays(7)),
  ymd(inDays(8)),
];

const SAMPLE_DAY_INFO: DayInfo[] = (() => {
  const out: DayInfo[] = [];
  for (let i = 0; i < 30; i++) {
    const price = 4000 + ((i * 137) % 1500);
    out.push({
      date: ymd(inDays(i)),
      text: `₹${(price / 1000).toFixed(1)}K`,
      textColor: "#666",
    });
  }
  return out;
})();

const SAMPLE_MIN_NIGHTS: MinNights = {
  [ymd(inDays(4))]: 3,
  [ymd(inDays(15))]: 2,
};

const SAMPLE_SUGGESTIONS: SmartSuggestion[] = [
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
  {
    label: "Long stay",
    sub: "10+ nights",
    from: inDays(20),
    to: inDays(31),
  },
];

export function PlaygroundPage() {
  /* ── State ── */
  const [component, setComponent] = React.useState<Component>("Calendar");
  const [mode, setMode] = React.useState<Mode>("range");
  const [variant, setVariant] = React.useState<Variant>("desktop");
  const [numberOfMonths, setNumberOfMonths] = React.useState(1);
  const [weekStartsOn, setWeekStartsOn] = React.useState<0 | 1>(0);

  const [allowPastDates, setAllowPastDates] = React.useState(false);
  const [allowSameDay, setAllowSameDay] = React.useState(false);
  const [hotelMode, setHotelMode] = React.useState(false);
  const [showNavigation, setShowNavigation] = React.useState(true);

  const [withEvents, setWithEvents] = React.useState(false);
  const [withBlocked, setWithBlocked] = React.useState(false);
  const [withDayInfo, setWithDayInfo] = React.useState(false);
  const [withMinNights, setWithMinNights] = React.useState(false);
  const [withSuggestions, setWithSuggestions] = React.useState(false);

  const [singleDate, setSingleDate] = React.useState<Date | null>(null);
  const [range, setRange] = React.useState<CalendarRange>({
    from: null,
    to: null,
  });

  const value: CalendarValue | CalendarRange =
    mode === "range" ? range : singleDate;

  const handleChange = React.useCallback(
    (next: CalendarValue | CalendarRange) => {
      if (mode === "range") {
        setRange(next as CalendarRange);
      } else {
        setSingleDate(next as CalendarValue);
      }
    },
    [mode],
  );

  /* ── Derived props ── */
  const sharedProps = {
    mode,
    value,
    onChange: handleChange,
    weekStartsOn,
    allowPastDates,
    allowSameDay,
    calendarType: hotelMode ? ("hotel" as const) : null,
    events: withEvents ? SAMPLE_EVENTS : undefined,
    blockedDates: withBlocked ? SAMPLE_BLOCKED : undefined,
    dayInfo: withDayInfo ? SAMPLE_DAY_INFO : undefined,
    minNights: withMinNights ? SAMPLE_MIN_NIGHTS : undefined,
    smartSuggestions: withSuggestions ? SAMPLE_SUGGESTIONS : undefined,
    labels: {
      weekdayNamesShort:
        weekStartsOn === 0
          ? ["SU", "MO", "TU", "WE", "TH", "FR", "SA"]
          : ["MO", "TU", "WE", "TH", "FR", "SA", "SU"],
    },
  };

  /* ── Generated code snippet ── */
  const code = React.useMemo(() => {
    const lines: string[] = [];
    lines.push(
      component === "Calendar"
        ? `import { Calendar } from "next-calendrix";`
        : `import { MobileCalendarSheet } from "next-calendrix";`,
    );
    lines.push(`import "next-calendrix/styles.css";`);
    lines.push("");
    lines.push(`<${component}`);
    lines.push(`  mode="${mode}"`);
    if (component === "Calendar") {
      lines.push(`  variant="${variant}"`);
      lines.push(`  numberOfMonths={${numberOfMonths}}`);
      if (!showNavigation) lines.push(`  showNavigation={false}`);
    }
    lines.push(`  weekStartsOn={${weekStartsOn}}`);
    if (allowPastDates) lines.push(`  allowPastDates`);
    if (allowSameDay) lines.push(`  allowSameDay`);
    if (hotelMode) lines.push(`  calendarType="hotel"`);
    if (withEvents) lines.push(`  events={events}`);
    if (withBlocked) lines.push(`  blockedDates={blockedDates}`);
    if (withDayInfo) lines.push(`  dayInfo={dayInfo}`);
    if (withMinNights) lines.push(`  minNights={minNights}`);
    if (withSuggestions) lines.push(`  smartSuggestions={suggestions}`);
    lines.push(`  value={value}`);
    lines.push(`  onChange={setValue}`);
    lines.push(`/>`);
    return lines.join("\n");
  }, [
    component,
    mode,
    variant,
    numberOfMonths,
    weekStartsOn,
    showNavigation,
    allowPastDates,
    allowSameDay,
    hotelMode,
    withEvents,
    withBlocked,
    withDayInfo,
    withMinNights,
    withSuggestions,
  ]);

  /* ── Render ── */
  return (
    <>
      <h1>Playground</h1>
      <p className="doc-lead">
        Toggle props on the right to preview behavior live, then copy the
        generated code.
      </p>

      <div className="doc-playground">
        {/* Preview */}
        <div className="doc-playground-preview">
          {component === "Calendar" ? (
            <div className="doc-playground-calendar-wrap">
              <Calendar
                {...sharedProps}
                variant={variant}
                numberOfMonths={numberOfMonths}
                showNavigation={showNavigation}
              />
            </div>
          ) : (
            <div className="doc-playground-mobile-frame">
              <MobileCalendarSheet
                {...sharedProps}
                onContinue={(v) =>
                  alert(`Selected: ${JSON.stringify(v, null, 2)}`)
                }
                onClose={() => alert("Close pressed")}
              />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="doc-playground-controls">
          <div className="doc-control-section-title">Component</div>
          <div className="doc-control">
            <div className="doc-control-row">
              {(["Calendar", "MobileCalendarSheet"] as Component[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  className={
                    "doc-control-pill" + (component === c ? " active" : "")
                  }
                  onClick={() => setComponent(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="doc-control-section-title">Selection</div>
          <div className="doc-control">
            <label className="doc-control-label">mode</label>
            <div className="doc-control-row">
              {(["single", "range"] as Mode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  className={
                    "doc-control-pill" + (mode === m ? " active" : "")
                  }
                  onClick={() => setMode(m)}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {component === "Calendar" && (
            <>
              <div className="doc-control">
                <label className="doc-control-label">variant</label>
                <div className="doc-control-row">
                  {(["desktop", "mobile"] as Variant[]).map((v) => (
                    <button
                      key={v}
                      type="button"
                      className={
                        "doc-control-pill" + (variant === v ? " active" : "")
                      }
                      onClick={() => setVariant(v)}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div className="doc-control">
                <label className="doc-control-label">numberOfMonths</label>
                <div className="doc-control-row">
                  {[1, 2, 3, 6, 12].map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={
                        "doc-control-pill" +
                        (numberOfMonths === n ? " active" : "")
                      }
                      onClick={() => setNumberOfMonths(n)}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="doc-control">
            <label className="doc-control-label">weekStartsOn</label>
            <div className="doc-control-row">
              {[
                { v: 0 as const, l: "Sun" },
                { v: 1 as const, l: "Mon" },
              ].map((o) => (
                <button
                  key={o.v}
                  type="button"
                  className={
                    "doc-control-pill" +
                    (weekStartsOn === o.v ? " active" : "")
                  }
                  onClick={() => setWeekStartsOn(o.v)}
                >
                  {o.l}
                </button>
              ))}
            </div>
          </div>

          <div className="doc-control-section-title">Behavior</div>
          <Toggle
            label="allowPastDates"
            checked={allowPastDates}
            onChange={setAllowPastDates}
          />
          <Toggle
            label="allowSameDay"
            checked={allowSameDay}
            onChange={setAllowSameDay}
          />
          <Toggle
            label='calendarType: "hotel"'
            checked={hotelMode}
            onChange={setHotelMode}
          />
          {component === "Calendar" && (
            <Toggle
              label="showNavigation"
              checked={showNavigation}
              onChange={setShowNavigation}
            />
          )}

          <div className="doc-control-section-title">Feature data</div>
          <Toggle
            label="events"
            checked={withEvents}
            onChange={setWithEvents}
          />
          <Toggle
            label="blockedDates"
            checked={withBlocked}
            onChange={setWithBlocked}
          />
          <Toggle
            label="dayInfo (prices)"
            checked={withDayInfo}
            onChange={setWithDayInfo}
          />
          <Toggle
            label="minNights"
            checked={withMinNights}
            onChange={setWithMinNights}
          />
          <Toggle
            label="smartSuggestions"
            checked={withSuggestions}
            onChange={setWithSuggestions}
          />

          <div className="doc-control-divider" />
          <button
            type="button"
            className="doc-btn"
            style={{ width: "100%", justifyContent: "center" }}
            onClick={() => {
              setSingleDate(null);
              setRange({ from: null, to: null });
            }}
          >
            Reset selection
          </button>
        </div>
      </div>

      <h2>Generated code</h2>
      <CodeBlock>{code}</CodeBlock>

      <h2>Current value</h2>
      <CodeBlock>
        {JSON.stringify(value, (_k, v) => (v instanceof Date ? v.toISOString() : v), 2)}
      </CodeBlock>
    </>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="doc-control-toggle">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}
