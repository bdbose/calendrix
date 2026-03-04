import * as React from "react";
import { Calendar } from "calendrix";
import type { CalendarRange, CalendarEvent, DayInfo, MinNights, SmartSuggestion } from "calendrix";
import "calendrix/styles.css";
import "./demo.css";

/* ── Holiday metadata ── */
const holidaysByMonth: Record<string, { count: number; dates: Record<number, string> }> = {
  "2026-0": {
    count: 3,
    dates: {
      26: "🇮🇳" // Republic Day
    }
  },
  "2026-1": {
    count: 1,
    dates: {
      14: "❤️" // Valentine's Day
    }
  }
};

function getHolidayKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}`;
}

/* ── Suggestions (now as SmartSuggestion[] data for the library prop) ── */
const suggestions: SmartSuggestion[] = [
  { label: "January 24-27", sub: "Republic Day Weekend", from: new Date(2026, 0, 24), to: new Date(2026, 0, 27) },
  { label: "January 30 - February 2", sub: "Republic Day Weekend", from: new Date(2026, 0, 30), to: new Date(2026, 1, 2) },
  { label: "February 14-16", sub: "Valentine Weekend", from: new Date(2026, 1, 14), to: new Date(2026, 1, 16) }
];

/* ── Calendrax feature data ── */
const events: CalendarEvent[] = [
  { start_date: "2026-01-24", end_date: "2026-01-26", name: "Republic Day", specific_teams: "All" },
  { start_date: "2026-02-14", end_date: "2026-02-14", name: "Valentine's", specific_teams: "All" }
];

const blockedDates = [
  "2026-01-10", "2026-01-11", "2026-02-20", "2026-02-21",
  "2026-03-11", "2026-03-12",
  "2026-03-15"  // Hotel mode test: March 14 has minNights=2, but 15th is blocked → minNights waived
];

const dayInfoData: DayInfo[] = [
  { date: "2026-01-16", text: "₹8K", textColor: "#0066cc", backgroundColor: "#e6f2ff" },
  { date: "2026-01-17", text: "₹9K", textColor: "#0066cc", backgroundColor: "#e6f2ff" },
  { date: "2026-01-18", text: "₹12K", textColor: "#cc0000", backgroundColor: "#ffe6e6" },
  { date: "2026-01-24", text: "₹15K", textColor: "#cc0000", backgroundColor: "#ffe6e6" },
  { date: "2026-01-25", text: "₹15K", textColor: "#cc0000", backgroundColor: "#ffe6e6" },
  { date: "2026-01-26", text: "₹18K", textColor: "#cc0000", backgroundColor: "#ffe6e6" }
];

const minNightsData: MinNights = {
  "2026-01-24": 3,   // Republic Day weekend requires 3-night min
  "2026-03-14": 2    // Valentine's weekend requires 2-night min
};

/* ── Helpers ── */
function formatDateLong(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function formatDateShort(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function nightsBetween(a: Date, b: Date) {
  return Math.round(Math.abs(b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

/* ── getVariantFromURL ── */
function getInitialVariant(): "mobile" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  const params = new URLSearchParams(window.location.search);
  const v = params.get("variant");
  if (v === "mobile" || v === "desktop") return v;
  return "desktop";
}

/* ── Calendar icon SVG ── */
function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="2.5" width="13" height="12" rx="1.5" stroke="#999" strokeWidth="1"/>
      <line x1="4.5" y1="1" x2="4.5" y2="4" stroke="#999" strokeWidth="1" strokeLinecap="round"/>
      <line x1="11.5" y1="1" x2="11.5" y2="4" stroke="#999" strokeWidth="1" strokeLinecap="round"/>
      <line x1="1.5" y1="6.5" x2="14.5" y2="6.5" stroke="#999" strokeWidth="1"/>
    </svg>
  );
}

/* ── Shared renderDay (enhanced with calendrax state) ── */
function renderDay({ state }: { state: { date: Date; eventLabels?: string[]; dayInfo?: DayInfo | null; minNightsRequired?: number | null; blockedByMinNights?: boolean; [key: string]: any } }) {
  const key = getHolidayKey(state.date);
  const info = holidaysByMonth[key];
  const icon = info?.dates[state.date.getDate()];
  return (
    <div className="calDay">
      {/* {(state.eventLabels?.length ?? 0) > 0 && (
        <div className="calEventLabels">
          {state.eventLabels!.map((lbl: string) => (
            <span key={lbl} className="calEventLabel">{lbl}</span>
          ))}
        </div>
      )} */}
      <span className="calDayNum">{state.date.getDate()}</span>
      {icon && <span className="calDayIcon">{icon}</span>}
      {state.dayInfo && (
        <span
          className="calDayInfo"
          style={{ color: state.dayInfo.textColor, backgroundColor: state.dayInfo.backgroundColor }}
        >
          {state.dayInfo.text}
        </span>
      )}
    </div>
  );
}

/* ── Shared renderMonthTitle ── */
function renderMonthTitle(month: Date, title: string) {
  const key = getHolidayKey(month);
  const info = holidaysByMonth[key];
  return (
    <div className="calMonthHeader">
      <span className="calMonthTitle">{title}</span>
      {info && (
        <span className="holidayBadge">
          {info.count} {info.count === 1 ? "Holiday" : "Holidays"}
        </span>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════
   DESKTOP VIEW
   ════════════════════════════════════════════════════ */
function DesktopCalendar({
  valueRange,
  setValueRange,
  nights,
  clearDates,
  selectionMode,
  allowPastDates,
  singleDate,
  setSingleDate
}: {
  valueRange: CalendarRange;
  setValueRange: (v: CalendarRange) => void;
  nights: number;
  clearDates: () => void;
  selectionMode: "single" | "range";
  allowPastDates: boolean;
  singleDate: Date | null;
  setSingleDate: (d: Date | null) => void;
}) {
  return (
    <div className="desktopOverlay">
      <div className="desktopCard">
        {/* ── Right main ── */}
        <div className="desktopMain">
          {/* Title */}
          <div className="desktopTitle">Select your travel dates</div>

          {/* Check-in / Check-out pills */}
          {selectionMode === "range" ? (
            <div className="desktopDatePills">
              <div className="desktopPill">
                <CalendarIcon />
                <span className={valueRange.from ? "desktopPillText" : "desktopPillPlaceholder"}>
                  {valueRange.from ? formatDateShort(valueRange.from) : "Check-in Date"}
                </span>
              </div>
              <div className="desktopPill">
                <CalendarIcon />
                <span className={valueRange.to ? "desktopPillText" : "desktopPillPlaceholder"}>
                  {valueRange.to ? formatDateShort(valueRange.to) : "Check-out Date"}
                </span>
              </div>
            </div>
          ) : (
            <div className="desktopDatePills">
              <div className="desktopPill">
                <CalendarIcon />
                <span className={singleDate ? "desktopPillText" : "desktopPillPlaceholder"}>
                  {singleDate ? formatDateShort(singleDate) : "Select a Date"}
                </span>
              </div>
            </div>
          )}

          {/* Calendar */}
          <Calendar
            mode={selectionMode}
            value={selectionMode === "range" ? valueRange : singleDate}
            onChange={(v) => {
              if (selectionMode === "range") {
                setValueRange(v as CalendarRange);
              } else {
                setSingleDate(v as Date | null);
              }
            }}
            numberOfMonths={2}
            weekStartsOn={0}
            labels={{ weekdayNamesShort: ["SU", "MO", "TU", "WE", "TH", "FR", "SA"] }}
            className="desktopCalendar"
            variant="desktop"
            showNavigation={true}
            renderMonthTitle={renderMonthTitle}
            renderDay={renderDay}
            events={events}
            blockedDates={blockedDates}
            dayInfo={dayInfoData}
            minNights={minNightsData}
            allowPastDates={allowPastDates}
            allowSameDay={false}
            calendarType={"hotel"}
            smartSuggestions={selectionMode === "range" ? suggestions : undefined}
            showSmartSuggestions={true}
            filterPastSuggestions={true}
          />

          {/* Footer */}
          <div className="desktopFooter">
            <button type="button" className="desktopClearBtn" onClick={clearDates}>
              Clear dates
            </button>
            <button type="button" className="desktopContinueBtn">
              Continue{nights > 0 ? ` (${nights} Nights)` : ""}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   MOBILE VIEW
   ════════════════════════════════════════════════════ */
function MobileCalendar({
  valueRange,
  setValueRange,
  nights,
  clearDates,
  selectionMode,
  allowPastDates,
  singleDate,
  setSingleDate
}: {
  valueRange: CalendarRange;
  setValueRange: (v: CalendarRange) => void;
  nights: number;
  clearDates: () => void;
  selectionMode: "single" | "range";
  allowPastDates: boolean;
  singleDate: Date | null;
  setSingleDate: (d: Date | null) => void;
}) {
  const hasLongStay = nights >= 7;

  return (
    <div className="mobilePage">
      {/* ── Date range display ── */}
      <div className="dateRangeHeader">
        {selectionMode === "range" ? (
          valueRange.from && valueRange.to ? (
            <>
              <span className="dateRangeDate">{formatDateLong(valueRange.from)}</span>
              <span className="dateRangeArrow">→</span>
              <span className="dateRangeDate">{formatDateLong(valueRange.to)}</span>
            </>
          ) : (
            <span className="dateRangePlaceholder">Select your travel dates</span>
          )
        ) : (
          singleDate ? (
            <span className="dateRangeDate">{formatDateLong(singleDate)}</span>
          ) : (
            <span className="dateRangePlaceholder">Select a date</span>
          )
        )}
      </div>

      {/* ── Calendar ── */}
      <div className="calendarScroll">
        <Calendar
          mode={selectionMode}
          value={selectionMode === "range" ? valueRange : singleDate}
          onChange={(v) => {
            if (selectionMode === "range") {
              setValueRange(v as CalendarRange);
            } else {
              setSingleDate(v as Date | null);
            }
          }}
          numberOfMonths={12}
          weekStartsOn={0}
          labels={{ weekdayNamesShort: ["SU", "MO", "TU", "WE", "TH", "FR", "SA"] }}
          className="mobileCalendar"
          variant="mobile"
          showNavigation={false}
          renderMonthTitle={renderMonthTitle}
          renderDay={renderDay}
          events={events}
          blockedDates={blockedDates}
          dayInfo={dayInfoData}
          minNights={minNightsData}
          allowPastDates={allowPastDates}
          allowSameDay={false}
          calendarType={"hotel"}
          smartSuggestions={selectionMode === "range" ? suggestions : undefined}
          showSmartSuggestions={true}
          filterPastSuggestions={true}
          initialMonthsToRender={3}
        />

        {/* ── Long stay benefit ── */}
        {hasLongStay && (
          <div className="longStayBanner">
            <span className="longStayEmoji">✨</span>
            <span className="longStayText">Yay! You've unlocked Long Stay Benefits!</span>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="mobileFooter">
        <button type="button" className="clearDatesBtn" onClick={clearDates}>
          Clear dates
        </button>
        <button type="button" className="continueBtn">
          Continue{nights > 0 ? ` (${nights} Nights)` : ""}
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   APP (responsive)
   ════════════════════════════════════════════════════ */
export function App() {
  const [variant, setVariant] = React.useState<"mobile" | "desktop">(getInitialVariant);
  const [selectionMode, setSelectionMode] = React.useState<"single" | "range">("range");
  const [allowPastDates, setAllowPastDates] = React.useState(false);

  const [valueRange, setValueRange] = React.useState<CalendarRange>({
    from: new Date(2026, 0, 16),
    to: new Date(2026, 0, 26)
  });

  const [singleDate, setSingleDate] = React.useState<Date | null>(null);

  const nights =
    valueRange.from && valueRange.to ? nightsBetween(valueRange.from, valueRange.to) : 0;

  const clearDates = () => {
    setValueRange({ from: null, to: null });
    setSingleDate(null);
  };

  const toggleVariant = () => {
    const next = variant === "desktop" ? "mobile" : "desktop";
    setVariant(next);
    const url = new URL(window.location.href);
    url.searchParams.set("variant", next);
    window.history.replaceState({}, "", url.toString());
  };

  return (
    <>
      {/* Control toggles */}
      <div
        style={{
          position: "fixed", top: 12, right: 12, zIndex: 9999,
          display: "flex", gap: 8, flexDirection: "column", alignItems: "flex-end"
        }}
      >
        <button
          type="button"
          onClick={toggleVariant}
          style={{
            padding: "6px 14px", borderRadius: 999, border: "1px solid #ccc",
            background: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,.1)"
          }}
        >
          {variant === "desktop" ? "Switch to Mobile" : "Switch to Desktop"}
        </button>
        <button
          type="button"
          onClick={() => setSelectionMode((m) => m === "range" ? "single" : "range")}
          style={{
            padding: "6px 14px", borderRadius: 999, border: "1px solid #ccc",
            background: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,.1)"
          }}
        >
          Mode: {selectionMode === "range" ? "Range" : "Single"}
        </button>
        <button
          type="button"
          onClick={() => setAllowPastDates((p) => !p)}
          style={{
            padding: "6px 14px", borderRadius: 999, border: "1px solid #ccc",
            background: allowPastDates ? "#e6ffe6" : "#fff",
            fontSize: 12, fontWeight: 600, cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,.1)"
          }}
        >
          Past Dates: {allowPastDates ? "ON" : "OFF"}
        </button>
      </div>

      {variant === "mobile" ? (
        <MobileCalendar
          valueRange={valueRange}
          setValueRange={setValueRange}
          nights={nights}
          clearDates={clearDates}
          selectionMode={selectionMode}
          allowPastDates={allowPastDates}
          singleDate={singleDate}
          setSingleDate={setSingleDate}
        />
      ) : (
        <DesktopCalendar
          valueRange={valueRange}
          setValueRange={setValueRange}
          nights={nights}
          clearDates={clearDates}
          selectionMode={selectionMode}
          allowPastDates={allowPastDates}
          singleDate={singleDate}
          setSingleDate={setSingleDate}
        />
      )}
    </>
  );
}
