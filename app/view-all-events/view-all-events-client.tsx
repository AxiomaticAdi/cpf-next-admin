"use client";

import { useState } from "react";
import Image from "next/image";
import { Event } from "@/types";
import { formatDateTimeLocal, formatDateOnly } from "@/lib/utils";

type ViewAllEventsClientProps = {
  events: Event[];
};

export function ViewAllEventsClient({ events }: ViewAllEventsClientProps) {
  const [selectedId, setSelectedId] = useState(() => events[0]?.id ?? "");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(
    () => events[0] ?? null,
  );

  // Update selectedEvent when selectedId changes
  const handleEventSelect = (eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    if (event) {
      setSelectedId(eventId);
      setSelectedEvent(event);
    }
  };

  if (!events.length) {
    return (
      <div className="flex flex-col items-center justify-center pt-10">
        <div className="text-2xl font-bold">View All Events</div>
        <p className="mt-6 text-muted-foreground">
          No events found. Create an event to see it here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pt-10">
      <div className="text-2xl font-bold">View All Events</div>

      <div className="max-w-xl space-y-4">
        <label htmlFor="event-select" className="block text-sm font-medium">
          Select an event to view details.
        </label>
        <select
          id="event-select"
          value={selectedId}
          onChange={(e) => handleEventSelect(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.name} ({formatDateOnly(event.startTime)})
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
              <dd>{formatDateTimeLocal(selectedEvent.startTime)}</dd>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <dt className="font-medium text-muted-foreground">Ends</dt>
              <dd>{formatDateTimeLocal(selectedEvent.endTime)}</dd>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <dt className="font-medium text-muted-foreground">Sold</dt>
              <dd>{selectedEvent.sold}</dd>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <dt className="font-medium text-muted-foreground">Capacity</dt>
              <dd>{selectedEvent.capacity}</dd>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <dt className="font-medium text-muted-foreground">Available</dt>
              <dd>{selectedEvent.capacity - selectedEvent.sold}</dd>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <dt className="font-medium text-muted-foreground">
                Price, including sales tax
              </dt>
              <dd>${selectedEvent.price.toFixed(2)}</dd>
            </div>
          </dl>

          <div className="mt-6 space-y-2">
            <div className="text-sm font-medium text-muted-foreground">
              Description (raw)
            </div>
            <div className="rounded-md border border-input bg-background px-3 py-2 text-sm font-mono whitespace-pre-wrap break-all">
              {selectedEvent.description}
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <div className="text-sm font-medium text-muted-foreground">
              Description (formatted)
            </div>
            <div
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              dangerouslySetInnerHTML={{ __html: selectedEvent.description }}
            />
          </div>

          {selectedEvent.imageUrl && (
            <div className="mt-6 space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Event Image
              </div>
              <div className="w-full flex justify-center">
                <Image
                  src={selectedEvent.imageUrl}
                  alt={selectedEvent.name}
                  width={400}
                  height={400}
                  className="rounded-md border border-input"
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Select an event to view its details.
        </p>
      )}
    </div>
  );
}
