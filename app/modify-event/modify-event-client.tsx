"use client";

import { useMemo, useState } from "react";
import { Event } from "@/types";

type ModifyEventClientProps = {
  events: Event[];
};

function formatDate(value: Date | string) {
  // Ensure consistent formatting whether we receive a Date or ISO string.
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function ModifyEventClient({ events }: ModifyEventClientProps) {
  const [selectedId, setSelectedId] = useState(() => events[0]?.id ?? "");

  const selectedEvent = useMemo(
    () => events.find((event) => event.id === selectedId),
    [events, selectedId],
  );

  if (!events.length) {
    return (
      <div className="flex flex-col items-center justify-center pt-10">
        <div className="text-2xl font-bold">Modify Event</div>
        <p className="mt-6 text-muted-foreground">
          No events found. Create an event before attempting to modify one.
          <br /> Note that only future events can be modified. Please contact
          Adi to modify past events.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pt-10">
      <div className="text-2xl font-bold">Modify Event</div>

      <div className="max-w-xl space-y-4">
        <label htmlFor="event-select" className="block text-sm font-medium">
          Select an event to view or edit details.
          <br /> Note that only future events can be modified. Please contact
          Adi to modify past events.
        </label>
        <select
          id="event-select"
          value={selectedId}
          onChange={(event) => setSelectedId(event.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.name}
            </option>
          ))}
        </select>
      </div>

      {selectedEvent ? (
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">{selectedEvent.name}</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <dt className="font-medium text-muted-foreground">Starts</dt>
              <dd>{formatDate(selectedEvent.startTime)}</dd>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <dt className="font-medium text-muted-foreground">Ends</dt>
              <dd>{formatDate(selectedEvent.endTime)}</dd>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <dt className="font-medium text-muted-foreground">Sold</dt>
              <dd>{selectedEvent.sold}</dd>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <dt className="font-medium text-muted-foreground">Capacity</dt>
              <dd> {selectedEvent.capacity}</dd>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <dt className="font-medium text-muted-foreground">Price</dt>
              <dd>{formatCurrency(selectedEvent.price)}</dd>
            </div>
          </dl>

          <div className="mt-6 space-y-2">
            <span className="text-sm font-medium text-muted-foreground">
              Description
            </span>
            <div
              className="rounded-md border border-border bg-background/50 px-4 py-3 text-sm prose text-left"
              dangerouslySetInnerHTML={{ __html: selectedEvent.description }}
            />
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Select an event to view its details.
        </p>
      )}
    </div>
  );
}
