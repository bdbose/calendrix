import * as React from "react";
import type { PageId } from "../App";
import { Calendar } from "next-calendrix";

const FEATURES = [
  {
    icon: "🗓️",
    title: "Range & single",
    desc: "Single date or check-in / check-out range — controlled or uncontrolled.",
  },
  {
    icon: "🏨",
    title: "Hotel mode",
    desc: "Blocked dates, min-nights, and a checkout-on-blocked-date pattern.",
  },
  {
    icon: "📱",
    title: "Mobile + desktop",
    desc: "Two carefully-tuned variants and a full MobileCalendarSheet shell.",
  },
  {
    icon: "💸",
    title: "Day-info badges",
    desc: "Show prices, availability, or any custom text under each day cell.",
  },
  {
    icon: "✨",
    title: "Smart suggestions",
    desc: "Built-in suggestions panel with month grouping and past filtering.",
  },
  {
    icon: "♾️",
    title: "Bidirectional scroll",
    desc: "Lazy-load past and future months as the user scrolls.",
  },
];

export function HomePage({ onNavigate }: { onNavigate: (id: PageId) => void }) {
  const [value, setValue] = React.useState<{
    from: Date | null;
    to: Date | null;
  }>({
    from: null,
    to: null,
  });

  return (
    <>
      <section className="doc-hero">
        <h1>Calendrix</h1>
        <p className="doc-hero-sub">
          A lightweight, headless React calendar with range selection, hotel
          mode, blocked dates, min-nights, smart suggestions, and dedicated
          mobile / desktop variants.
        </p>
        <div className="doc-hero-cta">
          <button
            type="button"
            className="doc-btn doc-btn-primary"
            onClick={() => onNavigate("getting-started")}
          >
            Get Started
          </button>
          <button
            type="button"
            className="doc-btn"
            onClick={() => onNavigate("playground")}
          >
            Open Playground
          </button>
        </div>
      </section>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "20px 0 40px",
        }}
      >
        <div
          style={{
            border: "1px solid var(--doc-border)",
            borderRadius: 14,
            padding: 16,
            background: "white",
            boxShadow: "var(--doc-shadow-md)",
          }}
        >
          <Calendar
            mode="range"
            value={value}
            onChange={(v) =>
              setValue(v as { from: Date | null; to: Date | null })
            }
            variant="desktop"
            numberOfMonths={1}
            weekStartsOn={0}
            labels={{
              weekdayNamesShort: ["SU", "MO", "TU", "WE", "TH", "FR", "SA"],
            }}
          />
        </div>
      </div>

      <h2>Features</h2>
      <div className="doc-features">
        {FEATURES.map((f) => (
          <div key={f.title} className="doc-feature">
            <div className="doc-feature-icon">{f.icon}</div>
            <div className="doc-feature-title">{f.title}</div>
            <div className="doc-feature-desc">{f.desc}</div>
          </div>
        ))}
      </div>

      <h2>Why Calendrix?</h2>
      <ul>
        <li>
          <strong>Headless</strong> — bring your own styles via{" "}
          <code>className</code>, <code>classNames</code>, <code>styles</code>,
          and CSS variables.
        </li>
        <li>
          <strong>Zero runtime deps</strong> — only React 16.8+ as a peer
          dependency.
        </li>
        <li>
          <strong>TypeScript-first</strong> — every prop and state object is
          fully typed.
        </li>
        <li>
          <strong>Booking-friendly</strong> — built for hotel / vacation
          rental flows out of the box.
        </li>
      </ul>
    </>
  );
}
