export function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isSameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function isToday(d: Date) {
  const now = new Date();
  return isSameDay(d, now);
}

export function clampDate(date: Date, min?: Date, max?: Date) {
  const t = date.getTime();
  if (min && t < startOfDay(min).getTime()) return startOfDay(min);
  if (max && t > startOfDay(max).getTime()) return startOfDay(max);
  return date;
}

export function addMonths(date: Date, months: number) {
  const d = new Date(date);
  const dayOfMonth = d.getDate();
  d.setMonth(d.getMonth() + months);
  if (d.getDate() !== dayOfMonth) {
    d.setDate(0);
  }
  return d;
}

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function getMonthGrid(
  month: Date,
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6
) {
  const first = startOfMonth(month);
  const last = endOfMonth(month);

  const firstDayOfWeek = first.getDay(); // 0..6 (Sun..Sat)
  const offset = (firstDayOfWeek - weekStartsOn + 7) % 7;

  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - offset);

  const days: Date[] = [];
  // 6 rows * 7 columns
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    days.push(d);
  }

  return { first, last, days };
}

export function formatMonthTitle(date: Date, monthNames?: string[]) {
  const y = date.getFullYear();
  const m = date.getMonth();
  const name =
    monthNames && monthNames[m]
      ? monthNames[m]
      : date.toLocaleString(undefined, { month: "long" });
  return `${name} ${y}`;
}

export function defaultWeekdayNamesShort(weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6) {
  // Base: Monday-first abbreviations
  const base = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  if (weekStartsOn === 1) return base;
  // Convert base (Mon..Sun) to a Sunday-based array then rotate
  const sundayBased = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const rotated: string[] = [];
  for (let i = 0; i < 7; i++) {
    rotated.push(sundayBased[(weekStartsOn + i) % 7]);
  }
  return rotated;
}


