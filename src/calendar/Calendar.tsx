import * as React from "react";
import {
  addMonths,
  clampDate,
  defaultWeekdayNamesShort,
  endOfMonth,
  formatMonthTitle,
  getMonthGrid,
  isToday,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
} from "./dateUtils";
import { formatDateKey } from "./formatDateKey";
import {
  isDateBlocked,
  hasBlockedDateInRange,
  isBeforeToday,
  findFirstBlockedDateAfter,
} from "./blockedDatesUtils";
import { buildEventMap, getEventLabels } from "./eventsUtils";
import { buildDayInfoMap, getDayInfo } from "./dayInfoUtils";
import {
  getMinNights,
  meetsMinNights,
  getStrikethroughDates,
} from "./minNightsUtils";
import {
  SmartSuggestionsDesktop,
  SmartSuggestionsMobile,
} from "./SmartSuggestions";
import type {
  CalendarProps,
  CalendarRange,
  CalendarSelectionMode,
  CalendarType,
  CalendarValue,
  DayInfo,
  SmartSuggestion,
} from "./types";

function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: {
  value: T | undefined;
  defaultValue: T;
  onChange?: (v: T) => void;
}) {
  const [uncontrolled, setUncontrolled] = React.useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? (value as T) : uncontrolled;

  const set = React.useCallback(
    (next: T) => {
      if (!isControlled) setUncontrolled(next);
      onChange?.(next);
    },
    [isControlled, onChange]
  );

  return [current, set] as const;
}

function inRangeInclusive(d: Date, min?: Date, max?: Date) {
  const t = startOfDay(d).getTime();
  if (min && t < startOfDay(min).getTime()) return false;
  if (max && t > startOfDay(max).getTime()) return false;
  return true;
}

export function Calendar(props: CalendarProps) {
  const {
    mode = "single",
    value,
    defaultValue = mode === "range" ? { from: null, to: null } : null,
    onChange,
    month,
    defaultMonth,
    onMonthChange,
    numberOfMonths = 1,
    isDateDisabled,
    minDate,
    maxDate,
    weekStartsOn = 1,
    className,
    style,
    classNames,
    styles,
    labels,
    sidebar,
    footer,
    renderDay,
    renderMonthTitle,
    variant,
    showNavigation = true,
    "aria-label": ariaLabel = "Calendar",
    // Calendrax features
    events,
    showEvents = true,
    blockedDates,
    dayInfo: dayInfoArray,
    minNights,
    allowPastDates = false,
    allowSameDay = false,
    calendarType,
    cellWidth,
    cellHeight,
    // Smart Suggestions
    smartSuggestions,
    showSmartSuggestions = true,
    filterPastSuggestions = true,
    onSuggestionSelect,
    // Lazy loading
    initialMonthsToRender,
  } = props;

  const isHotelMode = calendarType === "hotel";

  const [selectedAny, setSelectedAny] = useControllableState<
    CalendarValue | CalendarRange
  >({
    value,
    defaultValue,
    onChange,
  });

  const selectedSingle =
    mode === "single" ? (selectedAny as CalendarValue) : null;
  const selectedRange =
    mode === "range" ? (selectedAny as CalendarRange) : null;

  const initialMonth = React.useMemo(() => {
    const base =
      month ??
      defaultMonth ??
      (mode === "single" ? selectedSingle : selectedRange?.from) ??
      new Date();
    let result = startOfMonth(clampDate(startOfDay(base), minDate, maxDate));
    // When past dates are not allowed, never open to a month before today
    if (!allowPastDates) {
      const currentMonth = startOfMonth(new Date());
      if (result.getTime() < currentMonth.getTime()) {
        result = currentMonth;
      }
    }
    return result;
  }, [
    allowPastDates,
    defaultMonth,
    maxDate,
    minDate,
    mode,
    month,
    selectedRange?.from,
    selectedSingle,
  ]);

  const [visibleMonth, setVisibleMonth] = useControllableState<Date>({
    value: month ? startOfMonth(month) : undefined,
    defaultValue: initialMonth,
    onChange: onMonthChange,
  });

  const weekdayNames =
    labels?.weekdayNamesShort ?? defaultWeekdayNamesShort(weekStartsOn);

  const monthTitle = formatMonthTitle(visibleMonth, labels?.monthNames);

  const months = React.useMemo(() => {
    const out: Date[] = [];
    for (let i = 0; i < Math.max(1, numberOfMonths); i++) {
      out.push(startOfMonth(addMonths(visibleMonth, i)));
    }
    return out;
  }, [numberOfMonths, visibleMonth]);

  const canGoPrev = React.useMemo(() => {
    if (!minDate) return true;
    const prevMonth = startOfMonth(addMonths(visibleMonth, -1));
    const prevMonthEnd = endOfMonth(prevMonth);
    return prevMonthEnd.getTime() >= startOfDay(minDate).getTime();
  }, [minDate, visibleMonth]);

  const canGoNext = React.useMemo(() => {
    if (!maxDate) return true;
    const nextMonth = startOfMonth(addMonths(visibleMonth, 1));
    return nextMonth.getTime() <= startOfDay(maxDate).getTime();
  }, [maxDate, visibleMonth]);

  const goPrev = React.useCallback(() => {
    setVisibleMonth(startOfMonth(addMonths(visibleMonth, -1)));
  }, [setVisibleMonth, visibleMonth]);

  const goNext = React.useCallback(() => {
    setVisibleMonth(startOfMonth(addMonths(visibleMonth, 1)));
  }, [setVisibleMonth, visibleMonth]);

  /* ─── Build derived maps (memoized) ─── */

  const eventMap = React.useMemo(
    () => (events && showEvents ? buildEventMap(events) : undefined),
    [events, showEvents]
  );

  const dayInfoMap = React.useMemo(
    () => buildDayInfoMap(dayInfoArray),
    [dayInfoArray]
  );

  const strikethroughDates = React.useMemo(
    () =>
      mode === "range" && selectedRange?.from && !selectedRange?.to
        ? getStrikethroughDates(selectedRange.from, minNights, blockedDates)
        : [],
    [mode, selectedRange?.from, selectedRange?.to, minNights, blockedDates]
  );

  /* ─── Hotel mode: checkout boundary ─── */

  const hotelCheckoutBoundary = React.useMemo(() => {
    if (
      !isHotelMode ||
      mode !== "range" ||
      !selectedRange?.from ||
      selectedRange?.to
    )
      return null;
    return findFirstBlockedDateAfter(selectedRange.from, blockedDates);
  }, [isHotelMode, mode, selectedRange?.from, selectedRange?.to, blockedDates]);

  /* ─── Lazy month loading (infinite scroll) ─── */

  const totalMonthCount = months.length;
  const effectiveInitial =
    initialMonthsToRender != null && initialMonthsToRender > 0
      ? Math.min(initialMonthsToRender, totalMonthCount)
      : totalMonthCount;

  const [renderedCount, setRenderedCount] = React.useState(effectiveInitial);
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (renderedCount >= totalMonthCount) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    // Feature-detect IntersectionObserver for old browsers
    if (typeof IntersectionObserver === "undefined") {
      setRenderedCount(totalMonthCount);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setRenderedCount((prev) => Math.min(prev + 2, totalMonthCount));
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [renderedCount, totalMonthCount]);

  // Reset rendered count when initialMonthsToRender or total changes
  React.useEffect(() => {
    setRenderedCount(effectiveInitial);
  }, [effectiveInitial]);

  const visibleMonths = months.slice(0, renderedCount);

  /* ─── Smart Suggestions handler ─── */

  const handleSuggestionSelect = React.useCallback(
    (suggestion: SmartSuggestion) => {
      if (mode === "range") {
        setSelectedAny({
          from: startOfDay(suggestion.from),
          to: startOfDay(suggestion.to),
        });
      } else {
        setSelectedAny(startOfDay(suggestion.from));
      }
      onSuggestionSelect?.(suggestion);
    },
    [mode, setSelectedAny, onSuggestionSelect]
  );

  /* ─── isDisabled (enriched) ─── */

  const isDisabled = React.useCallback(
    (d: Date) => {
      if (!inRangeInclusive(d, minDate, maxDate)) return true;
      if (isDateDisabled?.(d)) return true;
      if (!allowPastDates && isBeforeToday(d)) return true;

      const dateBlocked = isDateBlocked(d, blockedDates);

      // Hotel mode: allow the first blocked date after check-in as checkout
      if (dateBlocked && isHotelMode && hotelCheckoutBoundary) {
        if (isSameDay(d, hotelCheckoutBoundary)) return false; // allow this one
      }

      // Hotel mode: block dates beyond the first blocked date when selecting checkout
      if (isHotelMode && hotelCheckoutBoundary && !dateBlocked) {
        if (
          startOfDay(d).getTime() > startOfDay(hotelCheckoutBoundary).getTime()
        )
          return true;
      }

      if (dateBlocked) return true;
      return false;
    },
    [
      isDateDisabled,
      maxDate,
      minDate,
      allowPastDates,
      blockedDates,
      isHotelMode,
      hotelCheckoutBoundary,
    ]
  );

  /* ─── isInSelectedRange ─── */

  const isInSelectedRange = React.useCallback(
    (d: Date) => {
      if (mode !== "range" || !selectedRange?.from || !selectedRange?.to)
        return false;
      const t = startOfDay(d).getTime();
      const a = startOfDay(selectedRange.from).getTime();
      const b = startOfDay(selectedRange.to).getTime();
      const [mn, mx] = a <= b ? [a, b] : [b, a];
      return t >= mn && t <= mx;
    },
    [mode, selectedRange?.from, selectedRange?.to]
  );

  /* ─── pickDate (enriched with blocked-range, min-nights, same-day) ─── */

  const pickDate = React.useCallback(
    (d: Date) => {
      const day = startOfDay(d);

      if (mode === "single") {
        setSelectedAny(day);
        return;
      }

      const current: CalendarRange = (selectedRange ?? {
        from: null,
        to: null,
      }) as CalendarRange;

      // No check-in yet, or both already set → start new selection
      if (!current.from || (current.from && current.to)) {
        setSelectedAny({ from: day, to: null });
        return;
      }

      // Check if strikethrough (can't select)
      if (strikethroughDates.includes(formatDateKey(day))) {
        return;
      }

      // Same-day logic
      if (isSameDay(day, current.from)) {
        if (allowSameDay) {
          if (meetsMinNights(current.from, day, minNights, blockedDates)) {
            setSelectedAny({ from: current.from, to: day });
          }
        }
        return;
      }

      // Before check-in → move check-in
      if (day.getTime() < startOfDay(current.from).getTime()) {
        setSelectedAny({ from: day, to: null });
        return;
      }

      // After check-in → validate range
      if (
        hasBlockedDateInRange(current.from, day, blockedDates, calendarType)
      ) {
        // Blocked dates between check-in and clicked date: start new selection
        setSelectedAny({ from: day, to: null });
        return;
      }

      if (!meetsMinNights(current.from, day, minNights, blockedDates)) {
        return; // doesn't meet min nights
      }

      setSelectedAny({ from: current.from, to: day });
    },
    [
      mode,
      selectedRange,
      setSelectedAny,
      allowSameDay,
      minNights,
      blockedDates,
      strikethroughDates,
      calendarType,
    ]
  );

  /* ─── Slot helpers ─── */

  const cn = React.useCallback(
    (slot: keyof NonNullable<CalendarProps["classNames"]>, fallback: string) =>
      [fallback, classNames?.[slot]].filter(Boolean).join(" "),
    [classNames]
  );

  const st = React.useCallback(
    (slot: keyof NonNullable<CalendarProps["styles"]>) => styles?.[slot],
    [styles]
  );

  /* ─── Cell size CSS variables ─── */

  const rootStyle: React.CSSProperties = {
    ...st("root"),
    ...style,
    ...(cellWidth != null
      ? ({ "--rcss-cell-w": `${cellWidth}px` } as React.CSSProperties)
      : {}),
    ...(cellHeight != null
      ? ({ "--rcss-cell-h": `${cellHeight}px` } as React.CSSProperties)
      : {}),
  };

  /* ─── Render ─── */

  return (
    <div
      className={[
        cn("root", "rcss-calendar"),
        variant ? `rcss-variant-${variant}` : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={rootStyle}
    >
      <div className={cn("shell", "rcss-cal-shell")} style={st("shell")}>
        {/* Desktop Smart Suggestions sidebar */}
        {smartSuggestions &&
        smartSuggestions.length > 0 &&
        showSmartSuggestions &&
        variant === "desktop" ? (
          <aside
            className={cn("sidebar", "rcss-cal-sidebar")}
            style={st("sidebar")}
          >
            <SmartSuggestionsDesktop
              suggestions={smartSuggestions}
              filterPast={filterPastSuggestions}
              onSelect={handleSuggestionSelect}
            />
          </aside>
        ) : sidebar ? (
          <aside
            className={cn("sidebar", "rcss-cal-sidebar")}
            style={st("sidebar")}
          >
            {sidebar}
          </aside>
        ) : null}

        <div className={cn("months", "rcss-cal-months")} style={st("months")}>
          {/* Mobile Smart Suggestions */}
          {smartSuggestions &&
          smartSuggestions.length > 0 &&
          showSmartSuggestions &&
          variant === "mobile" ? (
            <SmartSuggestionsMobile
              suggestions={smartSuggestions}
              filterPast={filterPastSuggestions}
              onSelect={handleSuggestionSelect}
            />
          ) : null}

          {showNavigation && (
            <div
              className={cn("header", "rcss-cal-header")}
              style={st("header")}
            >
              <button
                type="button"
                className={cn("nav", "rcss-cal-nav")}
                style={st("nav")}
                onClick={goPrev}
                disabled={!canGoPrev}
                aria-label={labels?.prevMonthLabel ?? "Previous month"}
              >
                ‹
              </button>
              <div
                className={cn("title", "rcss-cal-title")}
                style={st("title")}
                aria-label={ariaLabel}
              >
                {monthTitle}
              </div>
              <button
                type="button"
                className={cn("nav", "rcss-cal-nav")}
                style={st("nav")}
                onClick={goNext}
                disabled={!canGoNext}
                aria-label={labels?.nextMonthLabel ?? "Next month"}
              >
                ›
              </button>
            </div>
          )}

          {numberOfMonths <= 1 && (
            <div
              className={cn("weekdays", "rcss-cal-weekdays")}
              style={st("weekdays")}
              role="row"
            >
              {weekdayNames.map((wd) => (
                <div
                  key={wd}
                  className={cn("weekday", "rcss-cal-weekday")}
                  style={st("weekday")}
                  role="columnheader"
                >
                  {wd}
                </div>
              ))}
            </div>
          )}

          <div className="rcss-cal-monthsStack">
            {visibleMonths.map((m) => {
              const title = formatMonthTitle(m, labels?.monthNames);
              const { days } = getMonthGrid(m, weekStartsOn);
              return (
                <section
                  key={`${m.getFullYear()}-${m.getMonth()}`}
                  className={cn("month", "rcss-cal-month")}
                  style={st("month")}
                >
                  {numberOfMonths > 1 ? (
                    renderMonthTitle ? (
                      renderMonthTitle(m, title)
                    ) : (
                      <div className="rcss-cal-monthTitle">{title}</div>
                    )
                  ) : null}
                  {numberOfMonths > 1 && (
                    <div
                      className={cn("weekdays", "rcss-cal-weekdays")}
                      style={st("weekdays")}
                      role="row"
                    >
                      {weekdayNames.map((wd) => (
                        <div
                          key={wd}
                          className={cn("weekday", "rcss-cal-weekday")}
                          style={st("weekday")}
                          role="columnheader"
                        >
                          {wd}
                        </div>
                      ))}
                    </div>
                  )}
                  <div
                    className={cn("grid", "rcss-cal-grid")}
                    style={st("grid")}
                    role="grid"
                  >
                    {days.map((d) => {
                      const inMonth = isSameMonth(d, m);
                      const rawBlocked = isDateBlocked(d, blockedDates);
                      // In hotel mode, the checkout boundary date is NOT visually blocked
                      const blocked =
                        rawBlocked &&
                        !(
                          isHotelMode &&
                          hotelCheckoutBoundary &&
                          isSameDay(d, hotelCheckoutBoundary)
                        );
                      const pastBlocked = !allowPastDates && isBeforeToday(d);
                      const disabled = isDisabled(d) || !inMonth;

                      const isStrikethrough =
                        inMonth &&
                        strikethroughDates.includes(formatDateKey(d));

                      const selected =
                        mode === "single"
                          ? !!selectedSingle && isSameDay(d, selectedSingle)
                          : (!!selectedRange?.from &&
                              !selectedRange?.to &&
                              isSameDay(d, selectedRange.from)) ||
                            (!!selectedRange?.from &&
                              !!selectedRange?.to &&
                              (isSameDay(d, selectedRange.from) ||
                                isSameDay(d, selectedRange.to)));

                      const inRange =
                        mode === "range" ? isInSelectedRange(d) : false;
                      const rangeStart =
                        mode === "range" &&
                        !!selectedRange?.from &&
                        isSameDay(d, selectedRange.from);
                      const rangeEnd =
                        mode === "range" &&
                        !!selectedRange?.to &&
                        isSameDay(d, selectedRange.to);
                      const today = isToday(d);

                      const eventLabels = inMonth
                        ? getEventLabels(d, eventMap)
                        : [];
                      const info = inMonth ? getDayInfo(d, dayInfoMap) : null;
                      const minNightsReq = inMonth
                        ? getMinNights(d, minNights, blockedDates)
                        : null;

                      const dayState = {
                        date: d,
                        inMonth,
                        disabled,
                        selected,
                        inRange,
                        rangeStart,
                        rangeEnd,
                        today,
                        blockedByDate: blocked || pastBlocked,
                        blockedByMinNights: isStrikethrough,
                        eventLabels,
                        dayInfo: info,
                        minNightsRequired: minNightsReq,
                      };

                      const content = renderDay?.({ state: dayState }) ?? (
                        <DefaultDayContent state={dayState} />
                      );

                      return (
                        <button
                          key={d.toISOString()}
                          type="button"
                          className={[
                            cn("cell", "rcss-cal-cell"),
                            inMonth ? "is-in-month" : "is-out-month",
                            disabled ? "is-disabled" : "",
                            selected ? "is-selected" : "",
                            inRange ? "is-in-range" : "",
                            rangeStart ? "is-range-start" : "",
                            rangeEnd ? "is-range-end" : "",
                            today ? "is-today" : "",
                            blocked || pastBlocked ? "is-blocked" : "",
                            isStrikethrough ? "is-strikethrough" : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                          style={st("cell")}
                          onClick={() => {
                            if (disabled) return;
                            if (isStrikethrough) return;
                            pickDate(d);
                          }}
                          disabled={disabled}
                          aria-selected={selected}
                        >
                          {content}
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>

          {/* Infinite scroll sentinel */}
          {renderedCount < totalMonthCount && (
            <div
              ref={sentinelRef}
              className="rcss-cal-sentinel"
              style={{ height: 1 }}
            />
          )}
        </div>
      </div>

      {footer ? (
        <div className={cn("footer", "rcss-cal-footer")} style={st("footer")}>
          {footer}
        </div>
      ) : null}
    </div>
  );
}

/* ─── Default day content (replaces the plain <span>) ─── */

function DefaultDayContent({
  state,
}: {
  state: {
    date: Date;
    eventLabels: string[];
    dayInfo: DayInfo | null;
    minNightsRequired: number | null;
    blockedByMinNights: boolean;
    [key: string]: any;
  };
}) {
  return (
    <div className="rcss-cal-dayContent">
      {/* {state.eventLabels.length > 0 && (
        <div className="rcss-cal-eventLabels">
          {state.eventLabels.map((lbl) => (
            <span key={lbl} className="rcss-cal-eventLabel">{lbl}</span>
          ))}
        </div>
      )} */}
      <span className="rcss-cal-dayNum">{state.date.getDate()}</span>
      {state.dayInfo && (
        <span
          className="rcss-cal-dayInfo"
          style={{
            color: state.dayInfo.textColor,
            backgroundColor: state.dayInfo.backgroundColor,
          }}
        >
          {state.dayInfo.text}
        </span>
      )}
    </div>
  );
}
