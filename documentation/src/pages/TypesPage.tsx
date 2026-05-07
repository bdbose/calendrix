import { CodeBlock } from "../components/CodeBlock";
import { typeDefinitions } from "../data/propsData";

export function TypesPage() {
  return (
    <>
      <h1>Types</h1>
      <p className="doc-lead">
        All public TypeScript types exported from{" "}
        <code>next-calendrix</code>.
      </p>

      <h2>Core types</h2>
      <CodeBlock>{typeDefinitions}</CodeBlock>

      <h2>Importing</h2>
      <CodeBlock>{`import type {
  // Selection
  CalendarSelectionMode,
  CalendarValue,
  CalendarRange,
  CalendarValueByMode,

  // Day-cell render state
  CalendarDayState,

  // Feature data shapes
  CalendarEvent,
  BlockedDates,
  BlockedDateLookup,
  DayInfo,
  MinNights,
  SmartSuggestion,

  // Misc
  CalendarType,

  // Component prop types
  CalendarProps,
  MobileCalendarSheetProps,
} from "next-calendrix";`}</CodeBlock>

      <h2>Notes</h2>
      <ul>
        <li>
          All date keys (in <code>blockedDates</code>, <code>dayInfo</code>,{" "}
          <code>minNights</code>, <code>events</code>) use the{" "}
          <code>YYYY-MM-DD</code> string format.
        </li>
        <li>
          <code>CalendarRange</code> can have <code>null</code> for either side
          while the user is mid-selection.
        </li>
        <li>
          <code>CalendarType</code> is currently either <code>"hotel"</code>{" "}
          (enables checkout-on-blocked-date) or <code>null</code>.
        </li>
      </ul>
    </>
  );
}
