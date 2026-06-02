import * as React from "react";
import { Calendar, MobileCalendarSheet } from "calendrix";
import type {
  CalendarRange,
  CalendarEvent,
  CalendarValue,
  DayInfo,
  MinNights,
  SmartSuggestion,
} from "calendrix";
import "calendrix/styles.css";
import "./demo.css";

/* ── Holiday metadata ── */
const holidaysByMonth: Record<
  string,
  { count: number; dates: Record<number, string> }
> = {
  "2026-0": {
    count: 2,
    dates: {
      14: "Makar Sankranti",
      26: "Republic Day",
    },
  },
  "2026-1": {
    count: 2,
    dates: {
      19: "Maha Shivratri",
      26: "Holi Eve",
    },
  },
  "2026-2": {
    count: 3,
    dates: {
      2: "Holi",
      28: "Ram Navami",
      31: "Eid ul-Fitr",
    },
  },
  "2026-3": {
    count: 3,
    dates: {
      3: "Good Friday",
      5: "Easter",
      14: "Ambedkar Jayanti",
    },
  },
  "2026-4": {
    count: 2,
    dates: {
      1: "Labour Day",
      19: "Buddha Purnima",
    },
  },
  "2026-5": {
    count: 1,
    dates: {
      8: "Eid ul-Adha",
    },
  },
  "2026-7": {
    count: 2,
    dates: {
      15: "Independence Day",
      23: "Janmashtami",
    },
  },
  "2026-8": {
    count: 2,
    dates: {
      7: "Ganesh Chaturthi",
      17: "Onam",
    },
  },
  "2026-9": {
    count: 3,
    dates: {
      2: "Gandhi Jayanti",
      15: "Dussehra",
      29: "Maharishi Valmiki Jayanti",
    },
  },
  "2026-10": {
    count: 4,
    dates: {
      1: "Diwali",
      2: "Govardhan Puja",
      3: "Bhai Dooj",
      14: "Children's Day",
    },
  },
  "2026-11": {
    count: 2,
    dates: {
      25: "Christmas",
      31: "New Year's Eve",
    },
  },
};

function getHolidayKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}`;
}

/* ── Suggestions (now as SmartSuggestion[] data for the library prop) ── */
const suggestions: SmartSuggestion[] = [
  // January
  {
    label: "January 24-27",
    sub: "Republic Day Weekend",
    from: new Date(2026, 0, 24),
    to: new Date(2026, 0, 27),
  },
  {
    label: "January 30 - February 2",
    sub: "Republic Day Extended",
    from: new Date(2026, 0, 30),
    to: new Date(2026, 1, 2),
  },
  // February
  {
    label: "February 14-16",
    sub: "Valentine Weekend",
    from: new Date(2026, 1, 14),
    to: new Date(2026, 1, 16),
  },
  // March
  {
    label: "March 13-15",
    sub: "Holi Weekend",
    from: new Date(2026, 2, 13),
    to: new Date(2026, 2, 15),
  },
  {
    label: "March 27-30",
    sub: "Ugadi / Gudi Padwa",
    from: new Date(2026, 2, 27),
    to: new Date(2026, 2, 30),
  },
  // April
  {
    label: "April 3-5",
    sub: "Good Friday Weekend",
    from: new Date(2026, 3, 3),
    to: new Date(2026, 3, 5),
  },
  {
    label: "April 14-16",
    sub: "Ambedkar Jayanti / Baisakhi",
    from: new Date(2026, 3, 14),
    to: new Date(2026, 3, 16),
  },
  // May
  {
    label: "May 1-3",
    sub: "May Day Weekend",
    from: new Date(2026, 4, 1),
    to: new Date(2026, 4, 3),
  },
  {
    label: "May 23-25",
    sub: "Buddha Purnima Weekend",
    from: new Date(2026, 4, 23),
    to: new Date(2026, 4, 25),
  },
  // June
  {
    label: "June 26-28",
    sub: "Eid al-Adha Weekend",
    from: new Date(2026, 5, 26),
    to: new Date(2026, 5, 28),
  },
  // July
  {
    label: "July 17-19",
    sub: "Muharram Weekend",
    from: new Date(2026, 6, 17),
    to: new Date(2026, 6, 19),
  },
  // August
  {
    label: "August 14-17",
    sub: "Independence Day Long Weekend",
    from: new Date(2026, 7, 14),
    to: new Date(2026, 7, 17),
  },
  // September
  {
    label: "September 16-18",
    sub: "Milad-un-Nabi Weekend",
    from: new Date(2026, 8, 16),
    to: new Date(2026, 8, 18),
  },
  // October
  {
    label: "October 2-4",
    sub: "Gandhi Jayanti Weekend",
    from: new Date(2026, 9, 2),
    to: new Date(2026, 9, 4),
  },
  {
    label: "October 20-22",
    sub: "Dussehra",
    from: new Date(2026, 9, 20),
    to: new Date(2026, 9, 22),
  },
  // November
  {
    label: "November 7-9",
    sub: "Diwali Weekend",
    from: new Date(2026, 10, 7),
    to: new Date(2026, 10, 9),
  },
  {
    label: "November 14-16",
    sub: "Children's Day Weekend",
    from: new Date(2026, 10, 14),
    to: new Date(2026, 10, 16),
  },
  // December
  {
    label: "December 25-28",
    sub: "Christmas Weekend",
    from: new Date(2026, 11, 25),
    to: new Date(2026, 11, 28),
  },
  {
    label: "December 31 - January 3",
    sub: "New Year Getaway",
    from: new Date(2026, 11, 31),
    to: new Date(2027, 0, 3),
  },
];

/* ── Calendrax feature data ── */
const events: CalendarEvent[] = [
  {
    start_date: "2026-01-24",
    end_date: "2026-01-26",
    name: "Republic Day",
    specific_teams: "All",
  },
  {
    start_date: "2026-02-14",
    end_date: "2026-02-14",
    name: "Valentine's",
    specific_teams: "All",
  },
  {
    start_date: "2026-04-03",
    end_date: "2026-04-03",
    name: "Good Friday",
    specific_teams: "All",
  },
];

const BASE_BLOCKED_DATES = [
  // January — cluster around 10th (triggers 9th-unlock demo: check-in Jan 2 → day8=Jan9 open, day9=Jan10 blocked)
  "2026-01-10", "2026-01-11", "2026-01-12", "2026-01-13",
  // February
  "2026-02-07", "2026-02-08",
  "2026-02-20", "2026-02-21", "2026-02-22",
  // March
  "2026-03-11", "2026-03-12",
  "2026-03-15", // Hotel mode test: March 14 has minNights=2, but 15th is blocked → minNights waived
  "2026-03-22", "2026-03-23",
  // April
  "2026-04-10", "2026-04-11", "2026-04-12",
  "2026-04-24", "2026-04-25",
  // May
  "2026-05-05", "2026-05-06", "2026-05-07",
  "2026-05-16", "2026-05-17",
  // June
  "2026-06-12", "2026-06-13", "2026-06-14",
  "2026-06-21", "2026-06-22",
  // July
  "2026-07-03", "2026-07-04",
  "2026-07-18", "2026-07-19", "2026-07-20",
  // August
  "2026-08-02", "2026-08-03",
  "2026-08-11", "2026-08-12",
  // September
  "2026-09-05", "2026-09-06", "2026-09-07",
  "2026-09-20", "2026-09-21",
  // October
  "2026-10-09", "2026-10-10", "2026-10-11",
  "2026-10-25", "2026-10-26",
  // November
  "2026-11-06", "2026-11-07",
  "2026-11-21", "2026-11-22", "2026-11-23",
  // December
  "2026-12-06", "2026-12-07", "2026-12-08",
  "2026-12-19", "2026-12-20",
];

// Price tiers: green=deal (≤₹7K), blue=normal (₹8-12K), red=peak (₹13K+)
function p(text: string): Pick<DayInfo, "text" | "textColor" | "backgroundColor"> {
  const n = parseInt(text.replace(/[₹K]/g, ""), 10);
  if (n <= 7)  return { text, textColor: "#16a34a", backgroundColor: "#dcfce7" };
  if (n <= 12) return { text, textColor: "#0066cc", backgroundColor: "#e6f2ff" };
  return           { text, textColor: "#cc0000",  backgroundColor: "#ffe6e6" };
}

const dayInfoData: DayInfo[] = [
  // ── January ──
  { date: "2026-01-01", ...p("₹7K") }, { date: "2026-01-02", ...p("₹7K") },
  { date: "2026-01-03", ...p("₹8K") }, { date: "2026-01-04", ...p("₹10K") },
  { date: "2026-01-05", ...p("₹8K") }, { date: "2026-01-06", ...p("₹8K") },
  { date: "2026-01-07", ...p("₹9K") }, { date: "2026-01-08", ...p("₹9K") },
  { date: "2026-01-09", ...p("₹8K") },
  // 10–13 blocked
  { date: "2026-01-14", ...p("₹14K") }, { date: "2026-01-15", ...p("₹11K") },
  { date: "2026-01-16", ...p("₹8K") },  { date: "2026-01-17", ...p("₹9K") },
  { date: "2026-01-18", ...p("₹12K") }, { date: "2026-01-19", ...p("₹10K") },
  { date: "2026-01-20", ...p("₹9K") },  { date: "2026-01-21", ...p("₹9K") },
  { date: "2026-01-22", ...p("₹10K") }, { date: "2026-01-23", ...p("₹13K") },
  { date: "2026-01-24", ...p("₹15K") }, { date: "2026-01-25", ...p("₹15K") },
  { date: "2026-01-26", ...p("₹18K") }, { date: "2026-01-27", ...p("₹12K") },
  { date: "2026-01-28", ...p("₹10K") }, { date: "2026-01-29", ...p("₹9K") },
  { date: "2026-01-30", ...p("₹9K") },  { date: "2026-01-31", ...p("₹10K") },

  // ── February ──
  { date: "2026-02-01", ...p("₹9K") },  { date: "2026-02-02", ...p("₹9K") },
  { date: "2026-02-03", ...p("₹9K") },  { date: "2026-02-04", ...p("₹10K") },
  { date: "2026-02-05", ...p("₹10K") }, { date: "2026-02-06", ...p("₹9K") },
  // 7–8 blocked
  { date: "2026-02-09", ...p("₹9K") },  { date: "2026-02-10", ...p("₹9K") },
  { date: "2026-02-11", ...p("₹10K") }, { date: "2026-02-12", ...p("₹11K") },
  { date: "2026-02-13", ...p("₹14K") }, { date: "2026-02-14", ...p("₹18K") },
  { date: "2026-02-15", ...p("₹14K") }, { date: "2026-02-16", ...p("₹11K") },
  { date: "2026-02-17", ...p("₹10K") }, { date: "2026-02-18", ...p("₹10K") },
  { date: "2026-02-19", ...p("₹14K") },
  // 20–22 blocked
  { date: "2026-02-23", ...p("₹9K") },  { date: "2026-02-24", ...p("₹9K") },
  { date: "2026-02-25", ...p("₹10K") }, { date: "2026-02-26", ...p("₹12K") },
  { date: "2026-02-27", ...p("₹11K") }, { date: "2026-02-28", ...p("₹10K") },

  // ── March ──
  { date: "2026-03-01", ...p("₹9K") },  { date: "2026-03-02", ...p("₹16K") },
  { date: "2026-03-03", ...p("₹12K") }, { date: "2026-03-04", ...p("₹10K") },
  { date: "2026-03-05", ...p("₹9K") },  { date: "2026-03-06", ...p("₹9K") },
  { date: "2026-03-07", ...p("₹9K") },  { date: "2026-03-08", ...p("₹10K") },
  { date: "2026-03-09", ...p("₹9K") },  { date: "2026-03-10", ...p("₹9K") },
  // 11–12 blocked
  { date: "2026-03-13", ...p("₹13K") }, { date: "2026-03-14", ...p("₹14K") },
  // 15 blocked
  { date: "2026-03-16", ...p("₹10K") }, { date: "2026-03-17", ...p("₹9K") },
  { date: "2026-03-18", ...p("₹9K") },  { date: "2026-03-19", ...p("₹9K") },
  { date: "2026-03-20", ...p("₹10K") }, { date: "2026-03-21", ...p("₹9K") },
  // 22–23 blocked
  { date: "2026-03-24", ...p("₹9K") },  { date: "2026-03-25", ...p("₹10K") },
  { date: "2026-03-26", ...p("₹9K") },  { date: "2026-03-27", ...p("₹9K") },
  { date: "2026-03-28", ...p("₹14K") }, { date: "2026-03-29", ...p("₹12K") },
  { date: "2026-03-30", ...p("₹11K") }, { date: "2026-03-31", ...p("₹15K") },

  // ── April ──
  { date: "2026-04-01", ...p("₹19K") }, { date: "2026-04-02", ...p("₹18K") },
  { date: "2026-04-03", ...p("₹20K") }, { date: "2026-04-04", ...p("₹16K") },
  { date: "2026-04-05", ...p("₹18K") }, { date: "2026-04-06", ...p("₹14K") },
  { date: "2026-04-07", ...p("₹11K") }, { date: "2026-04-08", ...p("₹10K") },
  { date: "2026-04-09", ...p("₹10K") },
  // 10–12 blocked
  { date: "2026-04-13", ...p("₹12K") }, { date: "2026-04-14", ...p("₹15K") },
  { date: "2026-04-15", ...p("₹13K") }, { date: "2026-04-16", ...p("₹11K") },
  { date: "2026-04-17", ...p("₹10K") }, { date: "2026-04-18", ...p("₹10K") },
  { date: "2026-04-19", ...p("₹11K") }, { date: "2026-04-20", ...p("₹10K") },
  { date: "2026-04-21", ...p("₹10K") }, { date: "2026-04-22", ...p("₹10K") },
  { date: "2026-04-23", ...p("₹11K") },
  // 24–25 blocked
  { date: "2026-04-26", ...p("₹9K") },  { date: "2026-04-27", ...p("₹9K") },
  { date: "2026-04-28", ...p("₹9K") },  { date: "2026-04-29", ...p("₹9K") },
  { date: "2026-04-30", ...p("₹10K") },

  // ── May ──
  { date: "2026-05-01", ...p("₹13K") }, { date: "2026-05-02", ...p("₹11K") },
  { date: "2026-05-03", ...p("₹11K") }, { date: "2026-05-04", ...p("₹10K") },
  // 5–7 blocked
  { date: "2026-05-08", ...p("₹9K") },  { date: "2026-05-09", ...p("₹9K") },
  { date: "2026-05-10", ...p("₹10K") }, { date: "2026-05-11", ...p("₹9K") },
  { date: "2026-05-12", ...p("₹9K") },  { date: "2026-05-13", ...p("₹9K") },
  { date: "2026-05-14", ...p("₹10K") }, { date: "2026-05-15", ...p("₹10K") },
  // 16–17 blocked
  { date: "2026-05-18", ...p("₹9K") },  { date: "2026-05-19", ...p("₹13K") },
  { date: "2026-05-20", ...p("₹11K") }, { date: "2026-05-21", ...p("₹10K") },
  { date: "2026-05-22", ...p("₹10K") }, { date: "2026-05-23", ...p("₹12K") },
  { date: "2026-05-24", ...p("₹13K") }, { date: "2026-05-25", ...p("₹11K") },
  { date: "2026-05-26", ...p("₹10K") }, { date: "2026-05-27", ...p("₹9K") },
  { date: "2026-05-28", ...p("₹9K") },  { date: "2026-05-29", ...p("₹9K") },
  { date: "2026-05-30", ...p("₹10K") }, { date: "2026-05-31", ...p("₹10K") },

  // ── June ── (monsoon — lower prices)
  { date: "2026-06-01", ...p("₹7K") },  { date: "2026-06-02", ...p("₹7K") },
  { date: "2026-06-03", ...p("₹8K") },  { date: "2026-06-04", ...p("₹8K") },
  { date: "2026-06-05", ...p("₹7K") },  { date: "2026-06-06", ...p("₹7K") },
  { date: "2026-06-07", ...p("₹7K") },  { date: "2026-06-08", ...p("₹13K") },
  { date: "2026-06-09", ...p("₹11K") }, { date: "2026-06-10", ...p("₹9K") },
  { date: "2026-06-11", ...p("₹8K") },
  // 12–14 blocked
  { date: "2026-06-15", ...p("₹7K") },  { date: "2026-06-16", ...p("₹7K") },
  { date: "2026-06-17", ...p("₹7K") },  { date: "2026-06-18", ...p("₹8K") },
  { date: "2026-06-19", ...p("₹8K") },  { date: "2026-06-20", ...p("₹7K") },
  // 21–22 blocked
  { date: "2026-06-23", ...p("₹7K") },  { date: "2026-06-24", ...p("₹7K") },
  { date: "2026-06-25", ...p("₹8K") },  { date: "2026-06-26", ...p("₹13K") },
  { date: "2026-06-27", ...p("₹13K") }, { date: "2026-06-28", ...p("₹11K") },
  { date: "2026-06-29", ...p("₹8K") },  { date: "2026-06-30", ...p("₹8K") },

  // ── July ── (monsoon)
  { date: "2026-07-01", ...p("₹7K") },  { date: "2026-07-02", ...p("₹7K") },
  // 3–4 blocked
  { date: "2026-07-05", ...p("₹7K") },  { date: "2026-07-06", ...p("₹7K") },
  { date: "2026-07-07", ...p("₹7K") },  { date: "2026-07-08", ...p("₹8K") },
  { date: "2026-07-09", ...p("₹8K") },  { date: "2026-07-10", ...p("₹7K") },
  { date: "2026-07-11", ...p("₹7K") },  { date: "2026-07-12", ...p("₹7K") },
  { date: "2026-07-13", ...p("₹7K") },  { date: "2026-07-14", ...p("₹8K") },
  { date: "2026-07-15", ...p("₹8K") },  { date: "2026-07-16", ...p("₹8K") },
  { date: "2026-07-17", ...p("₹13K") },
  // 18–20 blocked
  { date: "2026-07-21", ...p("₹9K") },  { date: "2026-07-22", ...p("₹8K") },
  { date: "2026-07-23", ...p("₹8K") },  { date: "2026-07-24", ...p("₹7K") },
  { date: "2026-07-25", ...p("₹7K") },  { date: "2026-07-26", ...p("₹7K") },
  { date: "2026-07-27", ...p("₹7K") },  { date: "2026-07-28", ...p("₹8K") },
  { date: "2026-07-29", ...p("₹8K") },  { date: "2026-07-30", ...p("₹7K") },
  { date: "2026-07-31", ...p("₹7K") },

  // ── August ──
  { date: "2026-08-01", ...p("₹8K") },
  // 2–3 blocked
  { date: "2026-08-04", ...p("₹8K") },  { date: "2026-08-05", ...p("₹9K") },
  { date: "2026-08-06", ...p("₹9K") },  { date: "2026-08-07", ...p("₹8K") },
  { date: "2026-08-08", ...p("₹8K") },  { date: "2026-08-09", ...p("₹8K") },
  { date: "2026-08-10", ...p("₹9K") },
  // 11–12 blocked
  { date: "2026-08-13", ...p("₹14K") }, { date: "2026-08-14", ...p("₹16K") },
  { date: "2026-08-15", ...p("₹18K") }, { date: "2026-08-16", ...p("₹14K") },
  { date: "2026-08-17", ...p("₹11K") }, { date: "2026-08-18", ...p("₹10K") },
  { date: "2026-08-19", ...p("₹9K") },  { date: "2026-08-20", ...p("₹9K") },
  { date: "2026-08-21", ...p("₹9K") },  { date: "2026-08-22", ...p("₹9K") },
  { date: "2026-08-23", ...p("₹13K") }, { date: "2026-08-24", ...p("₹11K") },
  { date: "2026-08-25", ...p("₹10K") }, { date: "2026-08-26", ...p("₹9K") },
  { date: "2026-08-27", ...p("₹9K") },  { date: "2026-08-28", ...p("₹9K") },
  { date: "2026-08-29", ...p("₹9K") },  { date: "2026-08-30", ...p("₹10K") },
  { date: "2026-08-31", ...p("₹10K") },

  // ── September ──
  { date: "2026-09-01", ...p("₹9K") },  { date: "2026-09-02", ...p("₹9K") },
  { date: "2026-09-03", ...p("₹10K") }, { date: "2026-09-04", ...p("₹10K") },
  // 5–7 blocked
  { date: "2026-09-08", ...p("₹9K") },  { date: "2026-09-09", ...p("₹9K") },
  { date: "2026-09-10", ...p("₹9K") },  { date: "2026-09-11", ...p("₹9K") },
  { date: "2026-09-12", ...p("₹10K") }, { date: "2026-09-13", ...p("₹10K") },
  { date: "2026-09-14", ...p("₹10K") }, { date: "2026-09-15", ...p("₹10K") },
  { date: "2026-09-16", ...p("₹14K") }, { date: "2026-09-17", ...p("₹13K") },
  { date: "2026-09-18", ...p("₹11K") }, { date: "2026-09-19", ...p("₹10K") },
  // 20–21 blocked
  { date: "2026-09-22", ...p("₹9K") },  { date: "2026-09-23", ...p("₹9K") },
  { date: "2026-09-24", ...p("₹10K") }, { date: "2026-09-25", ...p("₹10K") },
  { date: "2026-09-26", ...p("₹10K") }, { date: "2026-09-27", ...p("₹10K") },
  { date: "2026-09-28", ...p("₹10K") }, { date: "2026-09-29", ...p("₹10K") },
  { date: "2026-09-30", ...p("₹11K") },

  // ── October ──
  { date: "2026-10-01", ...p("₹11K") }, { date: "2026-10-02", ...p("₹15K") },
  { date: "2026-10-03", ...p("₹13K") }, { date: "2026-10-04", ...p("₹12K") },
  { date: "2026-10-05", ...p("₹11K") }, { date: "2026-10-06", ...p("₹11K") },
  { date: "2026-10-07", ...p("₹11K") }, { date: "2026-10-08", ...p("₹12K") },
  // 9–11 blocked
  { date: "2026-10-12", ...p("₹11K") }, { date: "2026-10-13", ...p("₹11K") },
  { date: "2026-10-14", ...p("₹12K") }, { date: "2026-10-15", ...p("₹17K") },
  { date: "2026-10-16", ...p("₹16K") }, { date: "2026-10-17", ...p("₹14K") },
  { date: "2026-10-18", ...p("₹13K") }, { date: "2026-10-19", ...p("₹12K") },
  { date: "2026-10-20", ...p("₹11K") }, { date: "2026-10-21", ...p("₹12K") },
  { date: "2026-10-22", ...p("₹12K") }, { date: "2026-10-23", ...p("₹12K") },
  { date: "2026-10-24", ...p("₹12K") },
  // 25–26 blocked
  { date: "2026-10-27", ...p("₹11K") }, { date: "2026-10-28", ...p("₹11K") },
  { date: "2026-10-29", ...p("₹11K") }, { date: "2026-10-30", ...p("₹11K") },
  { date: "2026-10-31", ...p("₹12K") },

  // ── November ──
  { date: "2026-11-01", ...p("₹18K") }, { date: "2026-11-02", ...p("₹17K") },
  { date: "2026-11-03", ...p("₹16K") }, { date: "2026-11-04", ...p("₹14K") },
  { date: "2026-11-05", ...p("₹13K") },
  // 6–7 blocked
  { date: "2026-11-08", ...p("₹12K") }, { date: "2026-11-09", ...p("₹12K") },
  { date: "2026-11-10", ...p("₹12K") }, { date: "2026-11-11", ...p("₹12K") },
  { date: "2026-11-12", ...p("₹12K") }, { date: "2026-11-13", ...p("₹12K") },
  { date: "2026-11-14", ...p("₹15K") }, { date: "2026-11-15", ...p("₹14K") },
  { date: "2026-11-16", ...p("₹13K") }, { date: "2026-11-17", ...p("₹12K") },
  { date: "2026-11-18", ...p("₹11K") }, { date: "2026-11-19", ...p("₹11K") },
  { date: "2026-11-20", ...p("₹11K") },
  // 21–23 blocked
  { date: "2026-11-24", ...p("₹11K") }, { date: "2026-11-25", ...p("₹11K") },
  { date: "2026-11-26", ...p("₹12K") }, { date: "2026-11-27", ...p("₹12K") },
  { date: "2026-11-28", ...p("₹12K") }, { date: "2026-11-29", ...p("₹13K") },
  { date: "2026-11-30", ...p("₹13K") },

  // ── December ── (peak season)
  { date: "2026-12-01", ...p("₹14K") }, { date: "2026-12-02", ...p("₹14K") },
  { date: "2026-12-03", ...p("₹15K") }, { date: "2026-12-04", ...p("₹15K") },
  { date: "2026-12-05", ...p("₹15K") },
  // 6–8 blocked
  { date: "2026-12-09", ...p("₹14K") }, { date: "2026-12-10", ...p("₹14K") },
  { date: "2026-12-11", ...p("₹14K") }, { date: "2026-12-12", ...p("₹15K") },
  { date: "2026-12-13", ...p("₹15K") }, { date: "2026-12-14", ...p("₹16K") },
  { date: "2026-12-15", ...p("₹16K") }, { date: "2026-12-16", ...p("₹16K") },
  { date: "2026-12-17", ...p("₹17K") }, { date: "2026-12-18", ...p("₹17K") },
  // 19–20 blocked
  { date: "2026-12-21", ...p("₹18K") }, { date: "2026-12-22", ...p("₹19K") },
  { date: "2026-12-23", ...p("₹20K") }, { date: "2026-12-24", ...p("₹22K") },
  { date: "2026-12-25", ...p("₹25K") }, { date: "2026-12-26", ...p("₹22K") },
  { date: "2026-12-27", ...p("₹20K") }, { date: "2026-12-28", ...p("₹19K") },
  { date: "2026-12-29", ...p("₹20K") }, { date: "2026-12-30", ...p("₹22K") },
  { date: "2026-12-31", ...p("₹25K") },
];

const minNightsData: MinNights = {
  "2026-01-24": 3, // Republic Day weekend requires 3-night min
  "2026-03-14": 2,
  "2026-04-01": 4, // Valentine's weekend requires 2-night min
};

/* ── Helpers ── */
function nightsBetween(a: Date, b: Date) {
  return Math.round(
    Math.abs(b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24)
  );
}

function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

/* ── getVariantFromURL ── */
function getInitialVariant(): "mobile" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  const params = new URLSearchParams(window.location.search);
  const v = params.get("variant");
  if (v === "mobile" || v === "desktop") return v;
  return "desktop";
}

/* ── Calendar icon SVG ── */
function CalendarIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="1.5"
        y="2.5"
        width="13"
        height="12"
        rx="1.5"
        stroke="#999"
        strokeWidth="1"
      />
      <line
        x1="4.5"
        y1="1"
        x2="4.5"
        y2="4"
        stroke="#999"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        x1="11.5"
        y1="1"
        x2="11.5"
        y2="4"
        stroke="#999"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        x1="1.5"
        y1="6.5"
        x2="14.5"
        y2="6.5"
        stroke="#999"
        strokeWidth="1"
      />
    </svg>
  );
}

/* ── Shared renderDay (enhanced with calendrax state) ── */
function renderDay({
  state,
}: {
  state: {
    date: Date;
    eventLabels?: string[];
    dayInfo?: DayInfo | null;
    minNightsRequired?: number | null;
    blockedByMinNights?: boolean;
    [key: string]: any;
  };
}) {
  const key = getHolidayKey(state.date);
  const info = holidaysByMonth[key];
  const icon = info?.dates[state.date.getDate()];
  return (
    <div className={`calDay${icon ? " calDay--holiday" : ""}`}>
      {(state.eventLabels?.length ?? 0) > 0 && (
        <div className="calEventLabels">
          {state.eventLabels!.map((lbl: string) => (
            <span key={lbl} className="calEventLabel">
              {lbl}
            </span>
          ))}
        </div>
      )}
      <span className="calDayNum">{state.date.getDate()}</span>
      {state.dayInfo && (
        <span
          className="calDayInfo"
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

/* ── Shared renderMonthTitle ── */
function renderMonthTitle(month: Date, title: string) {
  const key = getHolidayKey(month);
  const info = holidaysByMonth[key];
  return (
    <div className="calMonthHeader">
      <span className="calMonthTitle">{title}</span>
      {info && (
        <span className="holidayBadge">
          {info.count} {info.count === 1 ? "Holiday" : "Holidays"}
        </span>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════
   DESKTOP VIEW
   ════════════════════════════════════════════════════ */
function DesktopCalendar({
  valueRange,
  setValueRange,
  nights,
  selectionMode,
  allowPastDates,
  singleDate,
  setSingleDate,
  blockedDates,
}: {
  valueRange: CalendarRange;
  setValueRange: (v: CalendarRange) => void;
  nights: number;
  selectionMode: "single" | "range";
  allowPastDates: boolean;
  singleDate: Date | null;
  setSingleDate: (d: Date | null) => void;
  blockedDates: string[];
}) {
  return (
    <div className="desktopOverlay">
      <div className="desktopCard">
        {/* ── Main ── */}
        <div className="desktopMain">
          {/* Title */}
          <div className="desktopTitle">Select your travel dates</div>

          {/* Calendar */}
          <Calendar
            mode={selectionMode}
            value={selectionMode === "range" ? valueRange : singleDate}
            onChange={(v: CalendarValue | CalendarRange) => {
              if (selectionMode === "range") {
                setValueRange(v as CalendarRange);
              } else {
                setSingleDate(v as Date | null);
              }
            }}
            numberOfMonths={1}
            weekStartsOn={0}
            labels={{
              weekdayNamesShort: ["SU", "MO", "TU", "WE", "TH", "FR", "SA"],
            }}
            className="desktopCalendar"
            variant="desktop"
            showNavigation={true}
            renderMonthTitle={renderMonthTitle}
            renderDay={renderDay}
            events={events}
            blockedDates={blockedDates}
            dayInfo={dayInfoData}
            minNights={minNightsData}
            allowPastDates={allowPastDates}
            allowSameDay={false}
            calendarType={"hotel"}
            smartSuggestions={
              selectionMode === "range" ? suggestions : undefined
            }
            showSmartSuggestions={true}
            filterPastSuggestions={true}
          />

          {/* Footer */}
          <div className="desktopFooter">
            <span className="desktopFooterLabel">Select Dates</span>
            <button type="button" className="desktopContinueBtn">
              Continue{nights > 0 ? ` (${nights} Nights)` : ""}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   MOBILE VIEW  (uses MobileCalendarSheet from lib)
   ════════════════════════════════════════════════════ */
function MobileCalendar({
  valueRange,
  setValueRange,
  selectionMode,
  allowPastDates,
  singleDate,
  setSingleDate,
  blockedDates,
}: {
  valueRange: CalendarRange;
  setValueRange: (v: CalendarRange) => void;
  selectionMode: "single" | "range";
  allowPastDates: boolean;
  singleDate: Date | null;
  setSingleDate: (d: Date | null) => void;
  blockedDates: string[];
}) {
  return (
    <MobileCalendarSheet
      mode={selectionMode}
      value={selectionMode === "range" ? valueRange : singleDate}
      onChange={(v) => {
        if (selectionMode === "range") {
          setValueRange(v as CalendarRange);
        } else {
          setSingleDate(v as Date | null);
        }
      }}
      onClear={() => {
        setValueRange({ from: null, to: null });
        setSingleDate(null);
      }}
      style={{ maxWidth: 480 }}
      weekStartsOn={0}
      labels={{
        weekdayNamesShort: ["SU", "MO", "TU", "WE", "TH", "FR", "SA"],
      }}
      calendarClassName="mobileCalendar"
      renderMonthTitle={renderMonthTitle}
      renderDay={renderDay}
      events={events}
      blockedDates={blockedDates}
      dayInfo={dayInfoData}
      minNights={minNightsData}
      allowPastDates={allowPastDates}
      allowSameDay={false}
      calendarType={"hotel"}
      smartSuggestions={selectionMode === "range" ? suggestions : undefined}
      showSmartSuggestions={true}
      filterPastSuggestions={true}
      initialMonthsToRender={4}
      pastMonthsCount={6}
      longStayThreshold={7}
      longStayContent={
        <>
          <span className="longStayEmoji">✨</span>
          <span className="longStayText">
            Yay! You've unlocked Long Stay Benefits!
          </span>
        </>
      }
    />
  );
}

/* ════════════════════════════════════════════════════
   APP (responsive)
   ════════════════════════════════════════════════════ */
export function App() {
  const [variant, setVariant] = React.useState<"mobile" | "desktop">(
    getInitialVariant
  );
  const [selectionMode, setSelectionMode] = React.useState<"single" | "range">(
    "range"
  );
  const [allowPastDates, setAllowPastDates] = React.useState(false);

  const [valueRange, setValueRange] = React.useState<CalendarRange>({
    from: new Date(2026, 0, 16),
    to: new Date(2026, 0, 26),
  });

  const [singleDate, setSingleDate] = React.useState<Date | null>(null);

  const nights =
    valueRange.from && valueRange.to
      ? nightsBetween(valueRange.from, valueRange.to)
      : 0;

  const dynamicBlockedDates = React.useMemo(() => {
    if (!valueRange.from || !valueRange.to) return BASE_BLOCKED_DATES;
    const day8 = addDays(valueRange.from, 7);
    const day9 = addDays(valueRange.from, 8);
    const key8 = toDateKey(day8);
    const key9 = toDateKey(day9);
    const ninthBlocked = BASE_BLOCKED_DATES.includes(key9);
    const eighthOpen = !BASE_BLOCKED_DATES.includes(key8);
    const eighthSelected = toDateKey(valueRange.to) === key8;
    if (ninthBlocked && eighthOpen && eighthSelected) {
      return BASE_BLOCKED_DATES.filter((d) => d !== key9);
    }
    return BASE_BLOCKED_DATES;
  }, [valueRange.from, valueRange.to]);

  const toggleVariant = () => {
    const next = variant === "desktop" ? "mobile" : "desktop";
    setVariant(next);
    const url = new URL(window.location.href);
    url.searchParams.set("variant", next);
    window.history.replaceState({}, "", url.toString());
  };

  return (
    <>
      {/* Control toggles */}
      <div
        style={{
          position: "fixed",
          top: 12,
          right: 12,
          zIndex: 9999,
          display: "flex",
          gap: 8,
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        <button
          type="button"
          onClick={toggleVariant}
          style={{
            padding: "6px 14px",
            borderRadius: 999,
            border: "1px solid #ccc",
            background: "#fff",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,.1)",
          }}
        >
          {variant === "desktop" ? "Switch to Mobile" : "Switch to Desktop"}
        </button>
        <button
          type="button"
          onClick={() =>
            setSelectionMode((m) => (m === "range" ? "single" : "range"))
          }
          style={{
            padding: "6px 14px",
            borderRadius: 999,
            border: "1px solid #ccc",
            background: "#fff",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,.1)",
          }}
        >
          Mode: {selectionMode === "range" ? "Range" : "Single"}
        </button>
        <button
          type="button"
          onClick={() => setAllowPastDates((p) => !p)}
          style={{
            padding: "6px 14px",
            borderRadius: 999,
            border: "1px solid #ccc",
            background: allowPastDates ? "#e6ffe6" : "#fff",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,.1)",
          }}
        >
          Past Dates: {allowPastDates ? "ON" : "OFF"}
        </button>
      </div>

      {variant === "mobile" ? (
        <MobileCalendar
          valueRange={valueRange}
          setValueRange={setValueRange}
          selectionMode={selectionMode}
          allowPastDates={allowPastDates}
          singleDate={singleDate}
          setSingleDate={setSingleDate}
          blockedDates={dynamicBlockedDates}
        />
      ) : (
        <DesktopCalendar
          valueRange={valueRange}
          setValueRange={setValueRange}
          nights={nights}
          selectionMode={selectionMode}
          allowPastDates={allowPastDates}
          singleDate={singleDate}
          setSingleDate={setSingleDate}
          blockedDates={dynamicBlockedDates}
        />
      )}
    </>
  );
}
