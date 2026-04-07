import { Event } from "@/types";
import { formatDateOnly } from "@/lib/utils";
import { ReactNode } from "react";

type EventSelectorProps = {
  events: Event[];
  selectedId: string;
  onEventSelect: (eventId: string) => void;
  label: ReactNode;
  id?: string;
  placeholder?: string;
};

export function EventSelector({
  events,
  selectedId,
  onEventSelect,
  label,
  id = "event-select",
  placeholder,
}: EventSelectorProps) {
  return (
    <div className="max-w-xl space-y-4">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <select
        id={id}
        value={selectedId}
        onChange={(e) => onEventSelect(e.target.value)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {events.map((event) => (
          <option key={event.id} value={event.id}>
            {event.name} ({formatDateOnly(event.startTime)})
          </option>
        ))}
      </select>
    </div>
  );
}
