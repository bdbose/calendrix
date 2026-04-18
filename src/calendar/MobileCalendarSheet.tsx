import * as React from "react";
import { Calendar } from "./Calendar";
import { SmartSuggestionsMobile } from "./SmartSuggestions";
import type {
  CalendarRange,
  CalendarValue,
  MobileCalendarSheetProps,
  SmartSuggestion,
} from "./types";

function defaultFormatDate(d: Date): string {
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function nightsBetween(a: Date, b: Date): number {
  return Math.round(
    Math.abs(b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24),
  );
}

export function MobileCalendarSheet(props: MobileCalendarSheetProps) {
  const {
    title = "Select Dates",
    onClose,
    mode = "range",
    value,
    defaultValue,
    onChange,
    checkInLabel = "Check-in",
    checkOutLabel = "Check-out",
    clearLabel = "Clear Dates",
    continueLabel = "Continue",
    singleDatePlaceholder = "Select a date",
    onContinue,
    onClear,
    formatDate = defaultFormatDate,
    longStayThreshold,
    longStayContent,
    className,
    style,
    calendarClassName,
    footer,
    // Calendar passthrough
    weekStartsOn = 0,
    numberOfMonths = 15,
    events,
    blockedDates,
    dayInfo,
    minNights,
    allowPastDates = false,
    allowSameDay = false,
    calendarType,
    smartSuggestions,
    showSmartSuggestions = true,
    smartSuggestionsTitle,
    filterPastSuggestions = true,
    onSuggestionSelect,
    initialMonthsToRender = 4,
    pastMonthsCount,
    renderDay,
    renderMonthTitle,
    labels,
    isDateDisabled,
    minDate,
    maxDate,
    showEvents,
    cellWidth,
    cellHeight,
  } = props;

  // Internal uncontrolled state fallback
  const isControlled = value !== undefined;
  const defaultVal =
    defaultValue ??
    (mode === "range" ? { from: null, to: null } : null);
  const [uncontrolled, setUncontrolled] = React.useState<
    CalendarValue | CalendarRange
  >(defaultVal);

  const current = isControlled ? value! : uncontrolled;

  const handleChange = React.useCallback(
    (next: CalendarValue | CalendarRange) => {
      if (!isControlled) setUncontrolled(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  // Derived state
  const rangeValue =
    mode === "range" ? (current as CalendarRange) : { from: null, to: null };
  const singleValue = mode === "single" ? (current as CalendarValue) : null;

  const nights =
    rangeValue.from && rangeValue.to
      ? nightsBetween(rangeValue.from, rangeValue.to)
      : 0;

  const hasSelection =
    mode === "range"
      ? !!(rangeValue.from && rangeValue.to)
      : !!singleValue;

  const showLongStay =
    longStayThreshold != null &&
    longStayContent != null &&
    nights >= longStayThreshold;

  // Ref to Calendar's internal suggestion handler (for scroll-to-month + lazy expand)
  const suggestionHandlerRef = React.useRef<
    ((s: SmartSuggestion) => void) | null
  >(null);

  // Handlers
  const handleClear = React.useCallback(() => {
    const empty =
      mode === "range" ? { from: null, to: null } : null;
    handleChange(empty as CalendarValue | CalendarRange);
    onClear?.();
  }, [mode, handleChange, onClear]);

  const handleContinue = React.useCallback(() => {
    onContinue?.(current);
  }, [onContinue, current]);

  return (
    <div
      className={["rcss-mobile-sheet", className].filter(Boolean).join(" ")}
      style={style}
    >
      {/* ── Top title bar ── */}
      <div className="rcss-mobile-topbar">
        <button
          type="button"
          className="rcss-mobile-close"
          aria-label="Close"
          onClick={onClose}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M15 5L5 15M5 5l10 10"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <span className="rcss-mobile-title">{title}</span>
        <span className="rcss-mobile-topbar-spacer" />
      </div>

      {/* ── Check-in / Check-out header ── */}
      <div className="rcss-mobile-dateheader">
        {mode === "range" ? (
          <>
            <div className="rcss-mobile-dateheader-col">
              <span
                className={
                  "rcss-mobile-dateheader-label" +
                  (rangeValue.from ? " rcss-active" : "")
                }
              >
                {checkInLabel}
              </span>
              {rangeValue.from && (
                <span className="rcss-mobile-dateheader-value">
                  {formatDate(rangeValue.from)}
                </span>
              )}
            </div>
            <span className="rcss-mobile-dateheader-arrow">&rarr;</span>
            <div className="rcss-mobile-dateheader-col">
              <span
                className={
                  "rcss-mobile-dateheader-label" +
                  (rangeValue.to ? " rcss-active" : "")
                }
              >
                {checkOutLabel}
              </span>
              {rangeValue.to && (
                <span className="rcss-mobile-dateheader-value">
                  {formatDate(rangeValue.to)}
                </span>
              )}
            </div>
          </>
        ) : singleValue ? (
          <span className="rcss-mobile-dateheader-value">
            {formatDate(singleValue)}
          </span>
        ) : (
          <span className="rcss-mobile-dateheader-label">
            {singleDatePlaceholder}
          </span>
        )}
      </div>

      {/* ── Calendar scroll area ── */}
      <div className="rcss-mobile-scroll">
        {/* Suggestions rendered here as direct child of scroll container for sticky */}
        {smartSuggestions &&
        smartSuggestions.length > 0 &&
        showSmartSuggestions ? (
          <SmartSuggestionsMobile
            suggestions={smartSuggestions}
            filterPast={filterPastSuggestions}
            title={smartSuggestionsTitle}
            onSelect={(s) => {
              // Delegate to Calendar's internal handler for scroll-to-month + lazy expand
              suggestionHandlerRef.current?.(s);
              onSuggestionSelect?.(s);
            }}
          />
        ) : null}

        <Calendar
          mode={mode}
          value={current}
          onChange={handleChange}
          numberOfMonths={numberOfMonths}
          weekStartsOn={weekStartsOn}
          labels={labels}
          className={calendarClassName}
          variant="mobile"
          showNavigation={false}
          renderMonthTitle={renderMonthTitle}
          renderDay={renderDay}
          events={events}
          showEvents={showEvents}
          blockedDates={blockedDates}
          dayInfo={dayInfo}
          minNights={minNights}
          allowPastDates={allowPastDates}
          allowSameDay={allowSameDay}
          calendarType={calendarType}
          smartSuggestions={smartSuggestions}
          showSmartSuggestions={false}
          filterPastSuggestions={filterPastSuggestions}
          onSuggestionSelect={onSuggestionSelect}
          initialMonthsToRender={initialMonthsToRender}
          pastMonthsCount={pastMonthsCount}
          isDateDisabled={isDateDisabled}
          minDate={minDate}
          maxDate={maxDate}
          cellWidth={cellWidth}
          cellHeight={cellHeight}
          _suggestionHandlerRef={suggestionHandlerRef}
        />

        {showLongStay && (
          <div className="rcss-mobile-longstay">{longStayContent}</div>
        )}
      </div>

      {/* ── Footer ── */}
      {footer !== undefined ? (
        footer
      ) : (
        <div className="rcss-mobile-footer">
          <button
            type="button"
            className="rcss-mobile-clear"
            onClick={handleClear}
          >
            {clearLabel}
          </button>
          <button
            type="button"
            className={
              "rcss-mobile-continue" +
              (!hasSelection ? " rcss-disabled" : "")
            }
            onClick={hasSelection ? handleContinue : undefined}
            disabled={!hasSelection}
          >
            {continueLabel}
          </button>
        </div>
      )}
    </div>
  );
}
