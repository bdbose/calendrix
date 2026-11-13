import * as React from "react";
import { Calendar } from "./Calendar";
import { SmartSuggestionsStrip } from "./SmartSuggestions";
import { startOfDay } from "./dateUtils";
import { themeClasses, themeToStyle } from "./themeUtils";
import { resolveMonthsLayout } from "./layoutUtils";
import type {
  CalendarRange,
  CalendarValue,
  DesktopCalendarCardProps,
  SmartSuggestion,
} from "./types";

function nightsBetween(a: Date, b: Date): number {
  return Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / 86_400_000);
}

const formatLong = (d: Date) =>
  d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

const formatShort = (d: Date) =>
  d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });

const toCssLength = (v: number | string) => (typeof v === "number" ? `${v}px` : v);

/**
 * Desktop date-picker card: header, calendar and a footer with the picked
 * dates and a Continue button — the desktop counterpart of MobileCalendarSheet.
 * Accepts every Calendar prop (variant is always "desktop").
 */
export function DesktopCalendarCard(props: DesktopCalendarCardProps) {
  const {
    title = "Select your travel dates",
    showStepHint = false,
    stepHintPlacement = "header",
    datesPlacement = "footer",
    checkInHint = "Tap your check-in date to begin",
    checkOutHint = "Now tap your check-out date",
    note,
    footer = "summary",
    continueLabel = "Continue",
    onContinue,
    clearLabel = "Clear dates",
    onClear,
    emptyLabel = "Select Dates",
    checkInLabel = "Check-in",
    checkOutLabel = "Check-out",
    addDateLabel = "Add date",
    formatDate,
    width,
    className,
    style,
    calendarClassName,
    mode = "range",
    value,
    defaultValue,
    onChange,
    theme,
    numberOfMonths = 1,
    showSmartSuggestions = true,
    smartSuggestions,
    suggestionsPlacement = "sidebar",
    smartSuggestionsTitle,
    filterPastSuggestions = true,
    onSuggestionSelect,
    suggestionsStyle,
    ...calendarProps
  } = props;

  // Footer suggestions reuse the calendar's own handler (sets the range + shows its month).
  const suggestionHandlerRef = React.useRef<((s: SmartSuggestion) => void) | null>(null);

  const isControlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = React.useState<CalendarValue | CalendarRange>(
    defaultValue ?? (mode === "range" ? { from: null, to: null } : null),
  );
  const current = isControlled ? value! : uncontrolled;

  const handleChange = React.useCallback(
    (next: CalendarValue | CalendarRange) => {
      if (!isControlled) setUncontrolled(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  const range = mode === "range" ? (current as CalendarRange) : { from: null, to: null };
  const single = mode === "single" ? (current as CalendarValue) : null;
  const nights = range.from && range.to ? nightsBetween(range.from, range.to) : 0;
  // A complete range (including a 0-night one with allowSameDay) can continue.
  const hasSelection = mode === "range" ? !!(range.from && range.to) : !!single;
  const hasAnyDate = mode === "range" ? !!range.from : !!single;

  const handleClear = () => {
    handleChange(mode === "range" ? { from: null, to: null } : null);
    onClear?.();
  };

  const hint =
    showStepHint && mode === "range"
      ? !range.from
        ? checkInHint
        : !range.to
          ? checkOutHint
          : null
      : null;

  const hasSuggestions = !!smartSuggestions?.length && showSmartSuggestions;
  const inFooter = hasSuggestions && suggestionsPlacement === "footer" && footer === "summary";
  const hasSidebar = hasSuggestions && !inFooter;
  const blockedSet = React.useMemo(
    () => (calendarProps.blockedDates ? new Set(calendarProps.blockedDates) : undefined),
    [calendarProps.blockedDates],
  );
  // Same rule as Calendar: desktop shows months side by side unless told to stack
  // or set up for scrolling (pastMonthsCount).
  const isRowLayout =
    resolveMonthsLayout({
      monthsLayout: calendarProps.monthsLayout,
      variant: "desktop",
      numberOfMonths,
      pastMonthsCount: calendarProps.pastMonthsCount,
      initialMonthsToRender: calendarProps.initialMonthsToRender,
    }) === "row";
  const defaultWidth = isRowLayout ? numberOfMonths * 345 + 40 + (hasSidebar ? 230 : 0) : 610;
  const nightsText = nights > 0 ? ` (${nights} Night${nights > 1 ? "s" : ""})` : "";

  // Dates (+ Clear) either sit in the footer or hang below the card in a tab.
  const datesInTab = datesPlacement === "tab" && footer === "summary";
  const showFooterClear = hasAnyDate && !datesInTab;
  const hintInFooter = stepHintPlacement === "footer" && footer === "summary";
  const footerHint = hintInFooter ? hint : null;
  const headerHint = hintInFooter ? null : hint;

  const fmtFull = formatDate ?? formatLong;
  const datesText =
    mode === "range"
      ? range.from
        ? `${fmtFull(range.from)}  →  ${range.to ? fmtFull(range.to) : checkOutLabel}`
        : emptyLabel
      : single
        ? fmtFull(single)
        : emptyLabel;

  // The live region stays mounted so screen readers announce each new step;
  // only the inner text is keyed, to replay the fade-in.
  const footerHintRegion = hintInFooter ? (
    <span className="rcss-desktop-card-actions-hint-region" role="status" aria-live="polite">
      {footerHint && (
        <span key={String(!!range.from)} className="rcss-desktop-card-actions-hint">
          {footerHint}
        </span>
      )}
    </span>
  ) : null;

  const continueButton = (
    <button
      type="button"
      className="rcss-desktop-card-continue"
      disabled={!hasSelection}
      onClick={() => onContinue?.(current)}
    >
      {continueLabel}
      {mode === "range" ? nightsText : ""}
    </button>
  );

  // Suggestions on the left; dates + Clear above Continue on the right.
  const suggestionsFooter = (
    <div className="rcss-desktop-card-footer rcss-desktop-card-footer--suggestions">
      <SmartSuggestionsStrip
        suggestions={smartSuggestions ?? []}
        filterPast={filterPastSuggestions}
        title={smartSuggestionsTitle}
        blockedDates={blockedSet}
        value={mode === "range" ? range : null}
        styleVariant={suggestionsStyle}
        onSelect={(s) => {
          suggestionHandlerRef.current?.(s);
          onSuggestionSelect?.(s);
        }}
      />
      <div className="rcss-desktop-card-actions">
        {footerHintRegion}
        {/* Only once a date is picked — no placeholder text before that. */}
        {hasAnyDate && !datesInTab && (
          <div className="rcss-desktop-card-actions-dates">
            <span className="rcss-desktop-card-dates rcss-desktop-card-dates--compact">{datesText}</span>
            {showFooterClear && (
              <button type="button" className="rcss-desktop-card-clear" onClick={handleClear}>
                {clearLabel}
              </button>
            )}
          </div>
        )}
        {continueButton}
      </div>
    </div>
  );

  const summaryFooter = (
    <div className="rcss-desktop-card-footer">
      <div className="rcss-desktop-card-summary">
        {!datesInTab && <span className="rcss-desktop-card-dates">{datesText}</span>}
        {showFooterClear && (
          <button type="button" className="rcss-desktop-card-clear" onClick={handleClear}>
            {clearLabel}
          </button>
        )}
      </div>
      <div className="rcss-desktop-card-actions">
        {footerHintRegion}
        {continueButton}
      </div>
    </div>
  );

  const field = (label: string, date: Date | null, active: boolean) => (
    <div className={"rcss-desktop-card-field" + (active ? " rcss-active" : "")}>
      <span className="rcss-desktop-card-field-label">{label}</span>
      <span className={"rcss-desktop-card-field-value" + (date ? "" : " rcss-empty")}>
        {date ? (formatDate ?? formatShort)(date) : addDateLabel}
      </span>
    </div>
  );

  const fieldsFooter = (
    <div className="rcss-desktop-card-footer rcss-desktop-card-footer--fields">
      {mode === "range" ? (
        <>
          {field(checkInLabel, range.from, !range.from)}
          <span className="rcss-desktop-card-arrow" aria-hidden="true">
            →
          </span>
          {field(checkOutLabel, range.to, !!range.from && !range.to)}
          {nights > 0 && (
            <span className="rcss-desktop-card-nights">
              {nights} night{nights > 1 ? "s" : ""}
            </span>
          )}
        </>
      ) : (
        field(checkInLabel, single, !single)
      )}
    </div>
  );

  const card = (
    <div
      className={["rcss-desktop-card", ...themeClasses(theme), className].filter(Boolean).join(" ")}
      style={{
        ...themeToStyle(theme),
        // With the hanging tab, the shell carries the width (so % widths work).
        width: datesInTab ? "100%" : toCssLength(width ?? defaultWidth),
        ...style,
      }}
    >
      {title !== null && (
        <div className="rcss-desktop-card-header">
          <div className="rcss-desktop-card-title">{title}</div>
          {headerHint && <div className="rcss-desktop-card-hint">{headerHint}</div>}
        </div>
      )}

      <Calendar
        {...calendarProps}
        mode={mode}
        value={current}
        onChange={handleChange}
        theme={theme}
        numberOfMonths={numberOfMonths}
        smartSuggestions={smartSuggestions}
        showSmartSuggestions={hasSidebar}
        smartSuggestionsTitle={smartSuggestionsTitle}
        filterPastSuggestions={filterPastSuggestions}
        onSuggestionSelect={inFooter ? undefined : onSuggestionSelect}
        suggestionsStyle={suggestionsStyle}
        _suggestionHandlerRef={suggestionHandlerRef}
        variant="desktop"
        className={calendarClassName}
      />

      {note && <div className="rcss-desktop-card-note">{note}</div>}

      {footer === "summary"
        ? inFooter
          ? suggestionsFooter
          : summaryFooter
        : footer === "fields"
          ? fieldsFooter
          : null}
    </div>
  );

  if (!datesInTab) return card;

  // The card clips its overflow, so the tab sits in a wrapper right under it.
  return (
    <div className="rcss-desktop-card-shell" style={{ width: toCssLength(width ?? defaultWidth) }}>
      {card}
      {/* Only once a date is picked — no "Select Dates" placeholder. */}
      {hasAnyDate && (
        <div className="rcss-desktop-card-tab">
          <span className="rcss-desktop-card-tab-dates">{datesText}</span>
          <span className="rcss-desktop-card-tab-sep" aria-hidden="true">
            ·
          </span>
          <button type="button" className="rcss-desktop-card-clear" onClick={handleClear}>
            {clearLabel}
          </button>
        </div>
      )}
    </div>
  );
}
