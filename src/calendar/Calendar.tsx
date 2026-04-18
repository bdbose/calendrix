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
    [isControlled, onChange],
  );

  return [current, set] as const;
}

function inRangeInclusive(d: Date, min?: Date, max?: Date) {
  const t = startOfDay(d).getTime();
  if (min && t < startOfDay(min).getTime()) return false;
  if (max && t > startOfDay(max).getTime()) return false;
  return true;
}

function getScrollParent(element: HTMLElement | null): HTMLElement | null {
  let el: HTMLElement | null = element?.parentElement ?? null;
  while (el) {
    const { overflow, overflowY } = getComputedStyle(el);
    if (/auto|scroll/.test(overflow + overflowY)) return el;
    el = el.parentElement;
  }
  return document.documentElement;
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
    smartSuggestions,
    showSmartSuggestions = true,
    smartSuggestionsTitle,
    filterPastSuggestions = true,
    onSuggestionSelect,
    initialMonthsToRender,
    pastMonthsCount,
    _suggestionHandlerRef,
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
    // If explicitly controlled, use that
    if (month)
      return startOfMonth(clampDate(startOfDay(month), minDate, maxDate));
    if (defaultMonth)
      return startOfMonth(
        clampDate(startOfDay(defaultMonth), minDate, maxDate),
      );

    // If both check-in and check-out are present, show check-in month
    const hasCompleteRange =
      mode === "range" && selectedRange?.from && selectedRange?.to;
    const hasSelectedSingle = mode === "single" && selectedSingle;

    let base: Date;
    if (hasCompleteRange) {
      base = selectedRange!.from!;
    } else if (hasSelectedSingle) {
      base = selectedSingle!;
    } else {
      // Default: always start with current month
      base = new Date();
    }

    let result = startOfMonth(clampDate(startOfDay(base), minDate, maxDate));
    // Only clamp to current month when there's no explicit selection;
    // if dates are already selected, show the check-in month even if it's in the past.
    if (!allowPastDates && !hasCompleteRange && !hasSelectedSingle) {
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
    selectedRange?.to,
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

  /* ─── Build months array (includes past months if pastMonthsCount is set) ─── */

  const pastCount = pastMonthsCount ?? 0;

  const months = React.useMemo(() => {
    const out: Date[] = [];
    for (let i = -pastCount; i < Math.max(1, numberOfMonths); i++) {
      out.push(startOfMonth(addMonths(visibleMonth, i)));
    }
    return out;
  }, [numberOfMonths, visibleMonth, pastCount]);

  const currentMonthIndex = pastCount;

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

  const blockedDateSet = React.useMemo(
    () => (blockedDates ? new Set(blockedDates) : undefined),
    [blockedDates],
  );

  const eventMap = React.useMemo(
    () => (events && showEvents ? buildEventMap(events) : undefined),
    [events, showEvents],
  );

  const dayInfoMap = React.useMemo(
    () => buildDayInfoMap(dayInfoArray),
    [dayInfoArray],
  );

  const strikethroughDates = React.useMemo(
    () =>
      mode === "range" && selectedRange?.from && !selectedRange?.to
        ? getStrikethroughDates(selectedRange.from, minNights, blockedDateSet)
        : [],
    [mode, selectedRange?.from, selectedRange?.to, minNights, blockedDateSet],
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
    return findFirstBlockedDateAfter(selectedRange.from, blockedDateSet);
  }, [
    isHotelMode,
    mode,
    selectedRange?.from,
    selectedRange?.to,
    blockedDateSet,
  ]);

  /* ─── Bidirectional lazy month loading (infinite scroll) ─── */

  const totalMonthCount = months.length;

  const effectiveInitialEnd =
    initialMonthsToRender != null && initialMonthsToRender > 0
      ? Math.min(currentMonthIndex + initialMonthsToRender, totalMonthCount)
      : totalMonthCount;

  const effectiveInitialStart =
    initialMonthsToRender != null && initialMonthsToRender > 0
      ? currentMonthIndex
      : 0;

  const [renderStart, setRenderStart] = React.useState(effectiveInitialStart);
  const [renderEnd, setRenderEnd] = React.useState(effectiveInitialEnd);

  const topSentinelRef = React.useRef<HTMLDivElement | null>(null);
  const bottomSentinelRef = React.useRef<HTMLDivElement | null>(null);
  const monthsStackRef = React.useRef<HTMLDivElement | null>(null);
  const scrollInfoRef = React.useRef<{
    scrollHeight: number;
    scrollTop: number;
  } | null>(null);
  const prevRenderStartRef = React.useRef(renderStart);

  // Restore scroll position after prepending past months
  React.useLayoutEffect(() => {
    if (
      renderStart < prevRenderStartRef.current &&
      scrollInfoRef.current &&
      monthsStackRef.current
    ) {
      const scrollParent = getScrollParent(monthsStackRef.current);
      if (scrollParent) {
        const delta =
          scrollParent.scrollHeight - scrollInfoRef.current.scrollHeight;
        scrollParent.scrollTop = scrollInfoRef.current.scrollTop + delta;
      }
      scrollInfoRef.current = null;
    }
    prevRenderStartRef.current = renderStart;
  }, [renderStart]);

  // Bottom sentinel: load future months on scroll down
  React.useEffect(() => {
    if (renderEnd >= totalMonthCount) return;
    const sentinel = bottomSentinelRef.current;
    if (!sentinel) return;

    if (typeof IntersectionObserver === "undefined") {
      setRenderEnd(totalMonthCount);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setRenderEnd((prev) => Math.min(prev + 2, totalMonthCount));
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [renderEnd, totalMonthCount]);

  // Top sentinel: load past months on scroll up
  React.useEffect(() => {
    if (renderStart <= 0) return;
    const sentinel = topSentinelRef.current;
    if (!sentinel) return;

    if (typeof IntersectionObserver === "undefined") {
      setRenderStart(0);
      return;
    }

    const stackEl = monthsStackRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          const scrollParent = stackEl ? getScrollParent(stackEl) : null;
          if (scrollParent) {
            scrollInfoRef.current = {
              scrollHeight: scrollParent.scrollHeight,
              scrollTop: scrollParent.scrollTop,
            };
          }
          setRenderStart((prev) => Math.max(prev - 2, 0));
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [renderStart]);

  // Reset rendered range when initialMonthsToRender or total changes
  React.useEffect(() => {
    setRenderStart(effectiveInitialStart);
    setRenderEnd(effectiveInitialEnd);
  }, [effectiveInitialStart, effectiveInitialEnd]);

  const visibleMonths = months.slice(renderStart, renderEnd);

  /* ─── Smart Suggestions handler ─── */

  const [pendingScrollMonth, setPendingScrollMonth] = React.useState<
    string | null
  >(null);

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

      const targetMonth = startOfMonth(suggestion.from);

      // Desktop single-month: navigate to the month
      if (numberOfMonths <= 1) {
        setVisibleMonth(targetMonth);
      }

      // Mobile / multi-month: ensure month is rendered and scroll to it
      if (numberOfMonths > 1 || pastCount > 0) {
        const targetKey = `${targetMonth.getFullYear()}-${targetMonth.getMonth()}`;
        const targetIdx = months.findIndex(
          (m) =>
            m.getFullYear() === targetMonth.getFullYear() &&
            m.getMonth() === targetMonth.getMonth(),
        );
        if (targetIdx >= 0) {
          // Expand render range to include the target month
          if (targetIdx >= renderEnd) {
            setRenderEnd(targetIdx + 1);
          }
          if (targetIdx < renderStart) {
            setRenderStart(targetIdx);
          }
          setPendingScrollMonth(targetKey);
        }
      }

      onSuggestionSelect?.(suggestion);
    },
    [
      mode,
      setSelectedAny,
      onSuggestionSelect,
      numberOfMonths,
      setVisibleMonth,
      months,
      renderEnd,
      renderStart,
      pastCount,
    ],
  );

  // Expose handler to parent (MobileCalendarSheet) via ref
  React.useEffect(() => {
    if (_suggestionHandlerRef) {
      _suggestionHandlerRef.current = handleSuggestionSelect;
    }
  }, [_suggestionHandlerRef, handleSuggestionSelect]);

  // Scroll to month section after it becomes rendered
  React.useEffect(() => {
    if (!pendingScrollMonth || !monthsStackRef.current) return;

    requestAnimationFrame(() => {
      const el = monthsStackRef.current?.querySelector(
        `[data-month="${pendingScrollMonth}"]`,
      );
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setPendingScrollMonth(null);
      }
    });
  }, [pendingScrollMonth, renderEnd, renderStart]);

  // On initial mount for mobile/multi-month: scroll to the target month
  const initialScrollDone = React.useRef(false);
  React.useEffect(() => {
    if (initialScrollDone.current) return;
    if (numberOfMonths <= 1 && pastCount === 0) return;
    if (!monthsStackRef.current) return;

    const targetKey = `${visibleMonth.getFullYear()}-${visibleMonth.getMonth()}`;
    requestAnimationFrame(() => {
      const el = monthsStackRef.current?.querySelector(
        `[data-month="${targetKey}"]`,
      );
      if (el) {
        el.scrollIntoView({ block: "start" });
        initialScrollDone.current = true;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderEnd]);

  /* ─── isDisabled (enriched) ─── */

  const isDisabled = React.useCallback(
    (d: Date) => {
      if (!inRangeInclusive(d, minDate, maxDate)) return true;
      if (isDateDisabled?.(d)) return true;
      if (!allowPastDates && isBeforeToday(d)) return true;

      const dateBlocked = isDateBlocked(d, blockedDateSet);

      if (dateBlocked && isHotelMode && hotelCheckoutBoundary) {
        if (isSameDay(d, hotelCheckoutBoundary)) return false;
      }

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
      blockedDateSet,
      isHotelMode,
      hotelCheckoutBoundary,
    ],
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
    [mode, selectedRange?.from, selectedRange?.to],
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

      if (!current.from || (current.from && current.to)) {
        setSelectedAny({ from: day, to: null });
        return;
      }

      if (strikethroughDates.includes(formatDateKey(day))) {
        return;
      }

      if (isSameDay(day, current.from)) {
        if (allowSameDay) {
          if (meetsMinNights(current.from, day, minNights, blockedDateSet)) {
            setSelectedAny({ from: current.from, to: day });
          }
        }
        return;
      }

      if (day.getTime() < startOfDay(current.from).getTime()) {
        setSelectedAny({ from: day, to: null });
        return;
      }

      if (
        hasBlockedDateInRange(current.from, day, blockedDateSet, calendarType)
      ) {
        setSelectedAny({ from: day, to: null });
        return;
      }

      if (!meetsMinNights(current.from, day, minNights, blockedDateSet)) {
        return;
      }

      setSelectedAny({ from: current.from, to: day });
    },
    [
      mode,
      selectedRange,
      setSelectedAny,
      allowSameDay,
      minNights,
      blockedDateSet,
      strikethroughDates,
      calendarType,
    ],
  );

  /* ─── Slot helpers ─── */

  const cn = React.useCallback(
    (slot: keyof NonNullable<CalendarProps["classNames"]>, fallback: string) =>
      [fallback, classNames?.[slot]].filter(Boolean).join(" "),
    [classNames],
  );

  const st = React.useCallback(
    (slot: keyof NonNullable<CalendarProps["styles"]>) => styles?.[slot],
    [styles],
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
              title={smartSuggestionsTitle}
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
              title={smartSuggestionsTitle}
              onSelect={handleSuggestionSelect}
            />
          ) : null}
          <div className="desktop-cal-wrapper">
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

            <div className="rcss-cal-monthsStack" ref={monthsStackRef}>
              {/* Top sentinel for loading past months */}
              {renderStart > 0 && (
                <div
                  ref={topSentinelRef}
                  className="rcss-cal-sentinel"
                  style={{ height: 1 }}
                />
              )}

              {visibleMonths.map((m) => {
                const title = formatMonthTitle(m, labels?.monthNames);
                const { days } = getMonthGrid(m, weekStartsOn);
                const monthKey = `${m.getFullYear()}-${m.getMonth()}`;
                return (
                  <section
                    key={monthKey}
                    data-month={monthKey}
                    className={cn("month", "rcss-cal-month")}
                    style={st("month")}
                  >
                    {numberOfMonths > 1 || pastCount > 0 ? (
                      renderMonthTitle ? (
                        renderMonthTitle(m, title)
                      ) : (
                        <div className="rcss-cal-monthTitle">{title}</div>
                      )
                    ) : null}
                    {(numberOfMonths > 1 || pastCount > 0) && (
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
                        const rawBlocked = isDateBlocked(d, blockedDateSet);
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
                          ? getMinNights(d, minNights, blockedDateSet)
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
                              eventLabels.length > 0 ? "has-event" : "",
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

              {/* Bottom sentinel for loading future months */}
              {renderEnd < totalMonthCount && (
                <div
                  ref={bottomSentinelRef}
                  className="rcss-cal-sentinel"
                  style={{ height: 1 }}
                />
              )}
            </div>
          </div>
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

/* ─── Default day content ─── */

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
      {state.eventLabels.length > 0 && (
        <div className="rcss-cal-eventLabels">
          {state.eventLabels.map((lbl) => (
            <span key={lbl} className="rcss-cal-eventLabel">
              {lbl}
            </span>
          ))}
        </div>
      )}
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
