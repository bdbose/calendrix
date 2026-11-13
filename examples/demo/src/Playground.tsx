import * as React from "react";
import type {
  CalendarEventDisplay,
  CalendarMonthsLayout,
  CalendarNavIcon,
  CalendarSuggestionsStyle,
  CalendarTheme,
  DesktopCalendarCardFooter,
} from "calendrix";

/* ── Options the playground can toggle ── */

export type ThemePreset = "default" | "saffron" | "compact";

export type DemoOptions = {
  variant: "desktop" | "mobile";
  selectionMode: "range" | "single";
  allowPastDates: boolean;
  dayContent: "custom" | "builtin";
  numberOfMonths: 1 | 2 | 3;
  monthsLayout: CalendarMonthsLayout;
  fixedWeeks: boolean;
  eventDisplay: CalendarEventDisplay;
  showEventTooltip: boolean;
  navIcon: CalendarNavIcon;
  showSuggestions: boolean;
  suggestionsPlacement: "sidebar" | "footer";
  suggestionsStyle: CalendarSuggestionsStyle;
  showTopBar: boolean;
  prices: "off" | "badge" | "text";
  hideDayInfoWhenBlocked: boolean;
  blockedClickToast: boolean;
  themePreset: ThemePreset;
  /** Per-preset tweaks layered over the theme preset. */
  themeOverrides?: CalendarTheme;
  /* Desktop card */
  showTitle: boolean;
  showStepHint: boolean;
  stepHintPlacement: "header" | "footer";
  datesPlacement: "footer" | "tab";
  footer: DesktopCalendarCardFooter;
};

export const DEFAULT_OPTIONS: Omit<DemoOptions, "variant"> = {
  selectionMode: "range",
  allowPastDates: false,
  dayContent: "custom",
  numberOfMonths: 1,
  monthsLayout: "row",
  fixedWeeks: false,
  eventDisplay: "highlight",
  showEventTooltip: false,
  navIcon: "glyph",
  showSuggestions: true,
  suggestionsPlacement: "sidebar",
  suggestionsStyle: "default",
  showTopBar: true,
  prices: "badge",
  hideDayInfoWhenBlocked: false,
  blockedClickToast: true,
  themePreset: "default",
  showTitle: true,
  showStepHint: false,
  stepHintPlacement: "header",
  datesPlacement: "footer",
  footer: "summary",
};

/* The SaffronStays frontend's calendars, rebuilt from calendrix props only. */
const SAFFRON_BASE: DemoOptions = {
  ...DEFAULT_OPTIONS,
  variant: "desktop",
  dayContent: "builtin",
  // All SaffronStays calendars mark holidays as red dates.
  eventDisplay: "color",
  showEventTooltip: true,
  navIcon: "chevron",
  themePreset: "saffron",
  prices: "off",
};

export const FRONTEND_PRESETS: { label: string; options: DemoOptions }[] = [
  {
    label: "Search bar",
    options: { ...SAFFRON_BASE, numberOfMonths: 1, showSuggestions: true },
  },
  {
    label: "Landing page",
    options: {
      ...SAFFRON_BASE,
      numberOfMonths: 2,
      monthsLayout: "row",
      showTitle: false,
      // Suggestions in the footer (chips) with Continue on the right.
      showSuggestions: true,
      suggestionsPlacement: "footer",
      suggestionsStyle: "cards",
      // Step hint above Continue; picked dates + Clear in a tab hanging under the card.
      showStepHint: true,
      stepHintPlacement: "footer",
      datesPlacement: "tab",
    },
  },
  {
    label: "Listing",
    options: {
      ...SAFFRON_BASE,
      numberOfMonths: 1,
      showSuggestions: false,
      showStepHint: true,
      footer: "fields",
      prices: "text",
      hideDayInfoWhenBlocked: true,
      // Listing card: regular-weight days, 24px header sides, 8px around the calendar.
      themeOverrides: { dayFontWeight: 400, cardHeaderPadding: "20px 24px 16px", padding: "0 8px" },
    },
  },
  {
    label: "Listing (mobile)",
    options: {
      ...SAFFRON_BASE,
      variant: "mobile",
      showTopBar: false,
      suggestionsStyle: "cards",
      prices: "text",
      hideDayInfoWhenBlocked: true,
      themeOverrides: { dayFontSize: 17, dayFontWeight: 500, dayLetterSpacing: "normal" },
    },
  },
];

export const THEME_PRESETS: Record<ThemePreset, CalendarTheme | undefined> = {
  default: undefined,
  // The SaffronStays landing-page calendar, built only from theme values.
  // No fontFamily: the frontend's --font-primary is undefined, so it renders the
  // calendar's default system font.
  saffron: {
    eventColor: "#f97316",
    dayFontSize: 15,
    dayFontWeight: 600,
    dayLetterSpacing: -0.2,
    titleFontSize: 16,
    titleLetterSpacing: "normal",
    navSize: 32,
    navFontSize: 20,
    eventBadgeBg: "linear-gradient(180deg, rgba(255, 241, 215, 0.7) 0%, rgba(255, 230, 187, 0.7) 100%)",
    eventBadgeFg: "#373636",
    eventBadgeRadius: 6,
    eventBadgeFontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif',
    eventBadgeFontWeight: 600,
    sidebarWidth: 210,
    sidebarPadding: "16px 18px",
    suggestionAccent: "#bd9a64",
    suggestionActiveBg: "#fffaf0",
    suggestionActiveBorder: "#e3c98c",
    suggestionActiveAccent: "#a9803f",
  },
  compact: {
    cellSize: 34,
    cellGap: 2,
    dayFontSize: 14,
    titleFontSize: 15,
    weekdayFontSize: 11,
    navSize: 28,
    navFontSize: 18,
    monthsGap: 20,
  },
};

/* ── Panel UI ── */

type Choice<T> = { value: T; label: string };

function Segmented<T extends string | number | boolean>({
  label,
  value,
  choices,
  onChange,
  disabled,
  hint,
}: {
  label: string;
  value: T;
  choices: Choice<T>[];
  onChange: (v: T) => void;
  disabled?: boolean;
  hint?: string;
}) {
  return (
    <div className={"pgRow" + (disabled ? " pgRow--disabled" : "")}>
      <div className="pgLabel">
        {label}
        {hint && <span className="pgHint">{hint}</span>}
      </div>
      <div className="pgSeg" role="radiogroup" aria-label={label}>
        {choices.map((c) => (
          <button
            key={String(c.value)}
            type="button"
            role="radio"
            aria-checked={c.value === value}
            disabled={disabled}
            className={"pgSegBtn" + (c.value === value ? " pgSegBtn--on" : "")}
            onClick={() => onChange(c.value)}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const ON_OFF: Choice<boolean>[] = [
  { value: true, label: "On" },
  { value: false, label: "Off" },
];

export function Playground({
  options,
  setOptions,
  onReset,
}: {
  options: DemoOptions;
  setOptions: React.Dispatch<React.SetStateAction<DemoOptions>>;
  onReset: () => void;
}) {
  const [open, setOpen] = React.useState(true);
  const set = <K extends keyof DemoOptions>(key: K) => (v: DemoOptions[K]) =>
    setOptions((o) => ({ ...o, [key]: v }));

  const isDesktop = options.variant === "desktop";
  const isMobile = !isDesktop;
  const multiMonth = options.numberOfMonths > 1;
  const builtin = options.dayContent === "builtin";

  return (
    <aside className={"pg" + (open ? "" : " pg--closed")} aria-label="Demo options">
      <div className="pgHead">
        <span className="pgTitle">Playground</span>
        <div className="pgHeadBtns">
          {open && (
            <button type="button" className="pgLink" onClick={onReset}>
              Reset
            </button>
          )}
          <button type="button" className="pgLink" onClick={() => setOpen((v) => !v)}>
            {open ? "Hide" : "Show options"}
          </button>
        </div>
      </div>

      {open && (
        <div className="pgBody">
          <div className="pgGroup">SaffronStays calendars</div>
          <div className="pgPresets">
            {FRONTEND_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                className="pgPresetBtn"
                onClick={() => setOptions(preset.options)}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="pgGroup">General</div>
          <Segmented
            label="View"
            value={options.variant}
            onChange={set("variant")}
            choices={[
              { value: "desktop", label: "Desktop" },
              { value: "mobile", label: "Mobile" },
            ]}
          />
          <Segmented
            label="Selection"
            value={options.selectionMode}
            onChange={set("selectionMode")}
            choices={[
              { value: "range", label: "Range" },
              { value: "single", label: "Single" },
            ]}
          />
          <Segmented label="Past dates" value={options.allowPastDates} onChange={set("allowPastDates")} choices={ON_OFF} />
          <Segmented
            label="Theme"
            hint="theme"
            value={options.themePreset}
            onChange={set("themePreset")}
            choices={[
              { value: "default", label: "Default" },
              { value: "saffron", label: "Saffron" },
              { value: "compact", label: "Compact" },
            ]}
          />

          <div className="pgGroup">Layout</div>
          <Segmented
            label="Months"
            hint="numberOfMonths"
            disabled={isMobile}
            value={options.numberOfMonths}
            onChange={set("numberOfMonths")}
            choices={[
              { value: 1, label: "1" },
              { value: 2, label: "2" },
              { value: 3, label: "3" },
            ]}
          />
          <Segmented
            label="Months layout"
            hint="monthsLayout"
            disabled={isMobile || !multiMonth}
            value={options.monthsLayout}
            onChange={set("monthsLayout")}
            choices={[
              { value: "stack", label: "Stack" },
              { value: "row", label: "Row" },
            ]}
          />
          <Segmented
            label="Week rows"
            hint="fixedWeeks"
            value={options.fixedWeeks}
            onChange={set("fixedWeeks")}
            choices={[
              { value: false, label: "Fit month" },
              { value: true, label: "Always 6" },
            ]}
          />
          <Segmented
            label="Arrows"
            hint="navIcon"
            disabled={isMobile}
            value={options.navIcon}
            onChange={set("navIcon")}
            choices={[
              { value: "glyph", label: "‹ ›" },
              { value: "chevron", label: "Chevron" },
            ]}
          />
          <Segmented label="Top bar" hint="showTopBar" disabled={isDesktop} value={options.showTopBar} onChange={set("showTopBar")} choices={ON_OFF} />

          <div className="pgGroup">Days</div>
          <Segmented
            label="Day content"
            hint="renderDay"
            value={options.dayContent}
            onChange={set("dayContent")}
            choices={[
              { value: "custom", label: "Custom" },
              { value: "builtin", label: "Built-in" },
            ]}
          />
          <Segmented
            label="Holidays"
            hint={builtin ? "eventDisplay" : "eventDisplay · needs Built-in"}
            disabled={!builtin}
            value={options.eventDisplay}
            onChange={set("eventDisplay")}
            choices={[
              { value: "highlight", label: "Highlight" },
              { value: "dot", label: "Dot" },
              { value: "color", label: "Red" },
              { value: "none", label: "None" },
            ]}
          />
          <Segmented label="Holiday tooltip" hint="showEventTooltip" value={options.showEventTooltip} onChange={set("showEventTooltip")} choices={ON_OFF} />
          <Segmented
            label="Prices"
            hint={options.prices === "text" ? "dayInfoDisplay · buildPriceDayInfo" : "dayInfoDisplay"}
            value={options.prices}
            onChange={set("prices")}
            choices={[
              { value: "off", label: "Off" },
              { value: "badge", label: "Badge" },
              { value: "text", label: "Text" },
            ]}
          />
          <Segmented
            label="Hide prices on booked"
            hint="hideDayInfoWhenBlocked"
            disabled={options.prices === "off"}
            value={options.hideDayInfoWhenBlocked}
            onChange={set("hideDayInfoWhenBlocked")}
            choices={ON_OFF}
          />
          <Segmented label="Blocked-day toast" hint="onBlockedDateClick" value={options.blockedClickToast} onChange={set("blockedClickToast")} choices={ON_OFF} />

          <div className={"pgGroup" + (isDesktop ? "" : " pgGroup--disabled")}>Desktop card</div>
          <Segmented label="Title" hint="title" disabled={isMobile} value={options.showTitle} onChange={set("showTitle")} choices={ON_OFF} />
          <Segmented label="Step hint" hint="showStepHint" disabled={isMobile} value={options.showStepHint} onChange={set("showStepHint")} choices={ON_OFF} />
          <Segmented
            label="Hint placement"
            hint="stepHintPlacement"
            disabled={isMobile || !options.showStepHint}
            value={options.stepHintPlacement}
            onChange={set("stepHintPlacement")}
            choices={[
              { value: "header", label: "Header" },
              { value: "footer", label: "Footer" },
            ]}
          />
          <Segmented
            label="Dates placement"
            hint="datesPlacement"
            disabled={isMobile || options.footer !== "summary"}
            value={options.datesPlacement}
            onChange={set("datesPlacement")}
            choices={[
              { value: "footer", label: "Footer" },
              { value: "tab", label: "Tab" },
            ]}
          />
          <Segmented
            label="Footer"
            hint="footer"
            disabled={isMobile}
            value={options.footer}
            onChange={set("footer")}
            choices={[
              { value: "summary", label: "Summary" },
              { value: "fields", label: "Fields" },
              { value: "none", label: "None" },
            ]}
          />

          <div className="pgGroup">Suggestions</div>
          <Segmented label="Smart suggestions" value={options.showSuggestions} onChange={set("showSuggestions")} choices={ON_OFF} />
          <Segmented
            label="Placement"
            hint="suggestionsPlacement"
            disabled={isMobile || !options.showSuggestions || options.footer !== "summary"}
            value={options.suggestionsPlacement}
            onChange={set("suggestionsPlacement")}
            choices={[
              { value: "sidebar", label: "Sidebar" },
              { value: "footer", label: "Footer" },
            ]}
          />
          <Segmented
            label="Card style"
            hint="suggestionsStyle"
            disabled={isDesktop && options.suggestionsPlacement !== "footer"}
            value={options.suggestionsStyle}
            onChange={set("suggestionsStyle")}
            choices={[
              { value: "default", label: "Default" },
              { value: "cards", label: "Cards" },
            ]}
          />
        </div>
      )}
    </aside>
  );
}

/* ── Blocked-day toast ── */

export function useToast() {
  const [message, setMessage] = React.useState<string | null>(null);
  const timer = React.useRef<number | undefined>(undefined);
  const show = React.useCallback((text: string) => {
    setMessage(text);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMessage(null), 2200);
  }, []);
  React.useEffect(() => () => window.clearTimeout(timer.current), []);
  const node = message ? (
    <div className="pgToast" role="status">
      {message}
    </div>
  ) : null;
  return { show, node };
}
