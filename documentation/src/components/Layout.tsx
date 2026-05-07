import * as React from "react";
import type { PageId } from "../App";

type NavItem = { id: PageId; label: string };
type NavSection = { title: string; items: NavItem[] };

const NAV: NavSection[] = [
  {
    title: "Introduction",
    items: [
      { id: "home", label: "Overview" },
      { id: "getting-started", label: "Getting Started" },
    ],
  },
  {
    title: "Components",
    items: [
      { id: "calendar", label: "Calendar" },
      { id: "mobile-sheet", label: "MobileCalendarSheet" },
    ],
  },
  {
    title: "Reference",
    items: [
      { id: "types", label: "Types" },
      { id: "examples", label: "Examples" },
      { id: "playground", label: "Playground" },
    ],
  },
];

export function Layout({
  page,
  onNavigate,
  children,
}: {
  page: PageId;
  onNavigate: (id: PageId) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="doc-app">
      <header className="doc-header">
        <a
          className="doc-brand"
          href="#/home"
          onClick={(e) => {
            e.preventDefault();
            onNavigate("home");
          }}
        >
          <span className="doc-brand-mark">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="5" width="18" height="16" rx="2" fill="white" />
              <rect x="3" y="5" width="18" height="4" fill="rgba(0,0,0,0.25)" />
              <circle cx="8" cy="14" r="1.5" fill="#2d66a1" />
              <circle cx="12" cy="14" r="1.5" fill="#2d66a1" />
              <circle cx="16" cy="14" r="1.5" fill="#2d66a1" />
            </svg>
          </span>
          Calendrix
          <span className="doc-brand-version">v2.2.2</span>
        </a>
        <nav className="doc-header-links">
          <a
            className={
              "doc-header-link" + (page === "playground" ? " active" : "")
            }
            href="#/playground"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("playground");
            }}
          >
            Playground
          </a>
          <a
            className="doc-header-link"
            href="https://github.com/bdbose/calendrix"
            target="_blank"
            rel="noreferrer"
          >
            GitHub →
          </a>
          <a
            className="doc-header-link"
            href="https://www.npmjs.com/package/next-calendrix"
            target="_blank"
            rel="noreferrer"
          >
            npm →
          </a>
        </nav>
      </header>

      <div className="doc-body">
        <aside className="doc-sidebar">
          {NAV.map((section) => (
            <div key={section.title} className="doc-sidebar-section">
              <div className="doc-sidebar-title">{section.title}</div>
              {section.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={
                    "doc-sidebar-link" + (page === item.id ? " active" : "")
                  }
                  onClick={() => onNavigate(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </aside>

        <main className="doc-main">{children}</main>
      </div>
    </div>
  );
}
