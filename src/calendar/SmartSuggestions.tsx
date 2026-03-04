import * as React from "react";
import type { SmartSuggestion } from "./types";
import { startOfDay } from "./dateUtils";

export type SmartSuggestionsProps = {
  suggestions: SmartSuggestion[];
  filterPast?: boolean;
  variant?: "mobile" | "desktop";
  onSelect: (suggestion: SmartSuggestion) => void;
};

function isPastSuggestion(s: SmartSuggestion): boolean {
  return startOfDay(s.to).getTime() < startOfDay(new Date()).getTime();
}

export function SmartSuggestionsDesktop({
  suggestions,
  filterPast = true,
  onSelect
}: Omit<SmartSuggestionsProps, "variant">) {
  const filtered = filterPast
    ? suggestions.filter((s) => !isPastSuggestion(s))
    : suggestions;

  if (filtered.length === 0) return null;

  return (
    <div className="rcss-suggestions-sidebar">
      <div className="rcss-suggestions-title">SMART SUGGESTIONS</div>
      {filtered.map((s, i) => (
        <button
          key={i}
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
  );
}

export function SmartSuggestionsMobile({
  suggestions,
  filterPast = true,
  onSelect
}: Omit<SmartSuggestionsProps, "variant">) {
  const [open, setOpen] = React.useState(false);

  const filtered = filterPast
    ? suggestions.filter((s) => !isPastSuggestion(s))
    : suggestions;

  if (filtered.length === 0) return null;

  return (
    <div className="rcss-suggestions-mobile">
      <button
        type="button"
        className="rcss-suggestions-toggle"
        onClick={() => setOpen((p) => !p)}
      >
        <span className="rcss-suggestions-toggle-text">OUR SUGGESTIONS</span>
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
          {filtered.map((s, i) => (
            <button
              key={i}
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
        </div>
      )}
    </div>
  );
}
