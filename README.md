# @react-calendar-ss/calendar

A small **React + TypeScript** calendar component library designed to be **safe in Next.js (SSR)**.

## Install

```bash
npm i @react-calendar-ss/calendar
```

## Usage (Next.js / React)

Import the component and the default styles:

```tsx
import * as React from "react";
import { Calendar } from "@react-calendar-ss/calendar";
import "@react-calendar-ss/calendar/styles.css";

export default function Page() {
  const [value, setValue] = React.useState<Date | null>(new Date());

  return (
    <Calendar
      value={value}
      onChange={setValue}
      minDate={new Date(2020, 0, 1)}
      maxDate={new Date(2030, 11, 31)}
    />
  );
}
```

## Props

- **`value` / `defaultValue`**: selected date (controlled/uncontrolled)
- **`onChange(next)`**: selection callback
- **`month` / `defaultMonth`**: visible month (controlled/uncontrolled)
- **`onMonthChange(month)`**: month navigation callback
- **`minDate` / `maxDate`**: selectable range
- **`isDateDisabled(date)`**: custom disabling logic
- **`weekStartsOn`**: 0..6 where 0 = Sunday (default: 1 = Monday)
- **`labels`**: optional month/day strings

## Build (contributors)

```bash
npm i
npm run build
```

## Example app (view the calendar)

This repo includes a small Vite demo app that uses the library via a local `file:` dependency.

```bash
# in one terminal
cd examples/demo
npm i
npm run dev
```


