"use client";

import { useState } from "react";
import { Event } from "@/types";
import { Button } from "../../components/ui/button";

type DeleteEventClientProps = {
  events: Event[];
};

function formatDateOnly(date: Date | string): string {
  // Convert Date to a readable date format like "Jan 15, 2025"
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function DeleteEventClient({ events }: DeleteEventClientProps) {
  const [selectedId, setSelectedId] = useState(() => events[0]?.id ?? "");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(
    () => events[0] ?? null,
  );
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Update selectedEvent when selectedId changes
  const handleEventSelect = (eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    if (event) {
      setSelectedId(eventId);
      setSelectedEvent(event);
      setShowConfirmation(false); // Reset confirmation when changing events
    }
  };

  const handleInitialDelete = () => {
    setShowConfirmation(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedId) return;
    console.log("Delete event with ID:", selectedId);
    setShowConfirmation(false);
  };

  if (!events.length) {
    return (
      <div className="flex flex-col items-center justify-center pt-10">
        <div className="text-2xl font-bold">Delete Event</div>
        <p className="mt-6 text-muted-foreground">
          No events found. Create an event before attempting to delete one.
          <br /> Note that only future events can be deleted. Please contact Adi
          to delete past events.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pt-10">
      <div className="text-2xl font-bold">Delete Event</div>

      <div className="max-w-xl space-y-4">
        <label htmlFor="event-select" className="block text-sm font-medium">
          Select an event to delete.
          <br /> Note that only future events can be deleted. Please contact Adi
          to delete past events.
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
              <dd>{new Date(selectedEvent.startTime).toLocaleString()}</dd>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <dt className="font-medium text-muted-foreground">Ends</dt>
              <dd>{new Date(selectedEvent.endTime).toLocaleString()}</dd>
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
              <dt className="font-medium text-muted-foreground">Price</dt>
              <dd>${selectedEvent.price.toFixed(2)}</dd>
            </div>
          </dl>

          <div className="mt-6 space-y-3">
            <Button variant="destructive" onClick={handleInitialDelete}>
              Delete Event
            </Button>

            {showConfirmation && (
              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium text-destructive">
                  Are you absolutely sure? Event deletion cannot be reversed,
                  and the data is lost forever.
                </p>
                <div className="flex gap-2">
                  <Button variant="destructive" onClick={handleConfirmDelete}>
                    Yes, Delete Permanently
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirmation(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
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
