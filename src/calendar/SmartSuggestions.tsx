import * as React from "react";
import type { CalendarRange, SmartSuggestion } from "./types";
import { isSameDay, startOfDay } from "./dateUtils";
import { formatDateKey } from "./formatDateKey";

export type SmartSuggestionsProps = {
  suggestions: SmartSuggestion[];
  filterPast?: boolean;
  variant?: "mobile" | "desktop";
  title?: string;
  blockedDates?: Set<string>;
  onSelect: (suggestion: SmartSuggestion) => void;
  value?: CalendarRange | null;
  /** Mobile card look. "cards" is the polished style. */
  styleVariant?: "default" | "cards";
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function isPastSuggestion(s: SmartSuggestion): boolean {
  return startOfDay(s.to).getTime() < startOfDay(new Date()).getTime();
}

function suggestionOverlapsBlocked(
  s: SmartSuggestion,
  blocked: Set<string> | undefined,
): boolean {
  if (!blocked || blocked.size === 0) return false;
  const start = startOfDay(s.from).getTime();
  const end = startOfDay(s.to).getTime();
  if (Number.isNaN(start) || Number.isNaN(end)) return false;
  for (let t = start; t <= end; t += 24 * 60 * 60 * 1000) {
    const d = new Date(t);
    if (blocked.has(formatDateKey(d))) return true;
  }
  return false;
}

function applyFilters(
  suggestions: SmartSuggestion[],
  filterPast: boolean,
  blocked: Set<string> | undefined,
): SmartSuggestion[] {
  return suggestions.filter((s) => {
    if (filterPast && isPastSuggestion(s)) return false;
    if (suggestionOverlapsBlocked(s, blocked)) return false;
    return true;
  });
}

type MonthGroup = { key: string; label: string; items: SmartSuggestion[] };

function groupByMonth(suggestions: SmartSuggestion[]): MonthGroup[] {
  const map = new Map<string, MonthGroup>();

  for (const s of suggestions) {
    const m = s.from.getMonth();
    const y = s.from.getFullYear();
    const key = `${y}-${m}`;
    if (!map.has(key)) {
      map.set(key, { key, label: `${MONTH_NAMES[m]} ${y}`, items: [] });
    }
    map.get(key)!.items.push(s);
  }

  return Array.from(map.values());
}

export function SmartSuggestionsDesktop({
  suggestions,
  filterPast = true,
  title = "SMART SUGGESTIONS",
  blockedDates,
  onSelect
}: Omit<SmartSuggestionsProps, "variant">) {
  const filtered = applyFilters(suggestions, filterPast, blockedDates);

  if (filtered.length === 0) return null;

  const groups = groupByMonth(filtered);

  return (
    <div className="rcss-suggestions-sidebar">
      <div className="rcss-suggestions-title">{title}</div>
      {groups.map((group) => (
        <div key={group.key} className="rcss-suggestions-group">
          <div className="rcss-suggestions-month-label">{group.label}</div>
          {group.items.map((s) => (
            <button
              key={`${s.label}-${s.sub}`}
              className="rcss-suggestion-btn"
              type="button"
              onClick={() => onSelect(s)}
            >
              <span className="rcss-suggestion-label">{s.label}</span>
              <span className="rcss-suggestion-dot">•</span>
              <span className="rcss-suggestion-sub">{s.sub}</span>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

export function SmartSuggestionsMobile({
  suggestions,
  filterPast = true,
  title = "OUR SUGGESTIONS",
  blockedDates,
  onSelect,
  value,
  styleVariant = "default",
}: Omit<SmartSuggestionsProps, "variant">) {
  const [open, setOpen] = React.useState(false);
  const [activeKey, setActiveKey] = React.useState<string | null>(null);
  const activeSuggestion = React.useRef<SmartSuggestion | null>(null);

  React.useEffect(() => {
    if (!activeSuggestion.current || !activeKey) return;
    const { from, to } = activeSuggestion.current;
    const matches =
      value?.from && value?.to &&
      isSameDay(value.from, from) &&
      isSameDay(value.to, to);
    if (!matches) {
      setActiveKey(null);
      activeSuggestion.current = null;
    }
  }, [value, activeKey]);

  const filtered = applyFilters(suggestions, filterPast, blockedDates);

  if (filtered.length === 0) return null;

  const groups = groupByMonth(filtered);

  return (
    <div
      className={
        "rcss-suggestions-mobile" +
        (styleVariant === "cards" ? " rcss-suggestions--cards" : "")
      }
    >
      <button
        type="button"
        className="rcss-suggestions-toggle"
        onClick={() => setOpen((p) => !p)}
      >
        <span className="rcss-suggestions-toggle-text">{title}</span>
        <span className={"rcss-suggestions-chevron" + (open ? " rcss-open" : "")}>
          <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
            <path
              d="M1 1L7 7L13 1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      {open && (
        <div className="rcss-suggestions-panel">
          {groups.map((group) => (
            <React.Fragment key={group.key}>
              {group.items.map((s) => {
                const key = `${s.label}-${s.sub}`;
                const isActive = activeKey === key;
                return (
                  <button
                    key={key}
                    className={"rcss-suggestion-card" + (isActive ? " rcss-active" : "")}
                    type="button"
                    onClick={() => {
                      setActiveKey(key);
                      activeSuggestion.current = s;
                      onSelect(s);
                      setOpen(false);
                    }}
                  >
                    <div className="rcss-suggestion-card-header">
                      <span className="rcss-suggestion-label">{s.label}</span>
                      <span className="rcss-suggestion-select">
                        {isActive ? "Selected" : "Select"}
                      </span>
                    </div>
                    <div className="rcss-suggestion-sub">{s.sub}</div>
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}

/** Horizontal, scrollable row of suggestion cards (DesktopCalendarCard footer). */
export function SmartSuggestionsStrip({
  suggestions,
  filterPast = true,
  title = "SMART SUGGESTIONS",
  blockedDates,
  onSelect,
  value,
  styleVariant = "default",
}: Omit<SmartSuggestionsProps, "variant">) {
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const [edges, setEdges] = React.useState({ canBack: false, canForward: false });

  const filtered = React.useMemo(
    () => applyFilters(suggestions, filterPast, blockedDates),
    [suggestions, filterPast, blockedDates],
  );
  const hasItems = filtered.length > 0;
  // Stable signature, so a new-but-equal suggestions array doesn't re-attach listeners.
  const itemsKey = filtered.map((s) => `${s.from.getTime()}-${s.to.getTime()}`).join("|");

  // Whether there's more to scroll either way (drives the arrows and edge fades).
  // Only sets state when a value actually changes, so scrolling doesn't re-render.
  const updateEdges = React.useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const canBack = el.scrollLeft > 1;
    const canForward = el.scrollLeft < max - 1;
    setEdges((prev) =>
      prev.canBack === canBack && prev.canForward === canForward ? prev : { canBack, canForward },
    );
  }, []);

  // Re-measure when the list mounts, its items change, or it resizes.
  React.useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    updateEdges();
    el.addEventListener("scroll", updateEdges, { passive: true });
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateEdges) : null;
    ro?.observe(el);
    return () => {
      el.removeEventListener("scroll", updateEdges);
      ro?.disconnect();
    };
  }, [updateEdges, itemsKey]);

  // A plain mouse wheel scrolls the row sideways (trackpads already can) — but
  // only while the row can move that way, so the page still scrolls at the ends.
  React.useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      const atStart = el.scrollLeft <= 0 && e.deltaY < 0;
      const atEnd = el.scrollLeft >= max - 1 && e.deltaY > 0;
      if (atStart || atEnd) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [hasItems]);

  const scrollByPage = (dir: 1 | -1) => {
    const el = listRef.current;
    if (!el) return;
    const reduceMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({
      left: dir * Math.max(120, el.clientWidth * 0.8),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  if (!hasItems) return null;

  const isActive = (s: SmartSuggestion) =>
    !!value?.from && !!value?.to && isSameDay(value.from, s.from) && isSameDay(value.to, s.to);

  return (
    // Same cards as the mobile suggestions panel, laid out in one scrollable row.
    <div
      className={
        "rcss-suggestions-strip" + (styleVariant === "cards" ? " rcss-suggestions--cards" : "")
      }
    >
      <div className="rcss-suggestions-strip-title">{title}</div>
      <div className="rcss-suggestions-strip-row">
        {/* Floating arrows over the row's ends, only when there's more that way. */}
        {edges.canBack && (
          <button
            type="button"
            className="rcss-suggestions-strip-arrow rcss-prev"
            aria-label="Previous suggestions"
            onClick={() => scrollByPage(-1)}
          >
            <StripChevron direction="prev" />
          </button>
        )}
        {edges.canForward && (
          <button
            type="button"
            className="rcss-suggestions-strip-arrow rcss-next"
            aria-label="More suggestions"
            onClick={() => scrollByPage(1)}
          >
            <StripChevron direction="next" />
          </button>
        )}
        <div
          className={
            "rcss-suggestions-strip-list" +
            (edges.canBack ? " rcss-can-back" : "") +
            (edges.canForward ? " rcss-can-forward" : "")
          }
          ref={listRef}
        >
          {filtered.map((s) => {
            const active = isActive(s);
            return (
              <button
                // Dates + label: unique even if two suggestions share a label.
                key={`${s.from.getTime()}-${s.to.getTime()}-${s.label}`}
                type="button"
                className={"rcss-suggestion-card" + (active ? " rcss-active" : "")}
                aria-pressed={active}
                onClick={() => onSelect(s)}
              >
                <div className="rcss-suggestion-card-header">
                  <span className="rcss-suggestion-label">{s.label}</span>
                  <span className="rcss-suggestion-select">{active ? "Selected" : "Select"}</span>
                </div>
                <div className="rcss-suggestion-sub">{s.sub}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StripChevron({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={direction === "prev" ? "M15 18l-6-6 6-6" : "M9 6l6 6-6 6"} />
    </svg>
  );
}
