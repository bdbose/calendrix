import * as React from "react";
import type { SmartSuggestion } from "./types";
import { startOfDay } from "./dateUtils";
import { formatDateKey } from "./formatDateKey";

export type SmartSuggestionsProps = {
  suggestions: SmartSuggestion[];
  filterPast?: boolean;
  variant?: "mobile" | "desktop";
  title?: string;
  blockedDates?: Set<string>;
  onSelect: (suggestion: SmartSuggestion) => void;
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
  onSelect
}: Omit<SmartSuggestionsProps, "variant">) {
  const [open, setOpen] = React.useState(false);

  const filtered = applyFilters(suggestions, filterPast, blockedDates);

  if (filtered.length === 0) return null;

  const groups = groupByMonth(filtered);

  return (
    <div className="rcss-suggestions-mobile">
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
              <div className="rcss-suggestions-month-chip">{group.label}</div>
              {group.items.map((s) => (
                <button
                  key={`${s.label}-${s.sub}`}
                  className="rcss-suggestion-card"
                  type="button"
                  onClick={() => {
                    onSelect(s);
                    setOpen(false);
                  }}
                >
                  <div className="rcss-suggestion-card-left">
                    <div className="rcss-suggestion-label">{s.label}</div>
                    <div className="rcss-suggestion-sub">{s.sub}</div>
                  </div>
                  <span className="rcss-suggestion-select">Select</span>
                </button>
              ))}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
