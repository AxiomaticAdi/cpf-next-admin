"use client";

import { useState } from "react";
import { Event } from "@/types";
import { updateEvent } from "@/lib/actions/update-event";
import { toast } from "sonner";
import {
  formatDateTimeLocalCA,
  parseDateTimeLocalAsCA,
} from "@/lib/utils";
import { useEventSelector } from "@/lib/hooks/use-event-selector";
import { EventSelector } from "@/components/event-selector";

type ModifyEventClientProps = {
  events: Event[];
};

export function ModifyEventClient({ events }: ModifyEventClientProps) {
  const { selectedId, selectedEvent, handleEventSelect, setSelectedEvent } =
    useEventSelector(events);
  const [isSaving, setIsSaving] = useState(false);

  // Use selectedEvent as editedEvent (renaming for clarity in this context)
  const editedEvent = selectedEvent;
  const setEditedEvent = setSelectedEvent;

  const handleDiscard = () => {
    const originalEvent = events.find((e) => e.id === selectedId);
    if (originalEvent) {
      setEditedEvent(originalEvent);
    }
  };

  const handleSave = async () => {
    if (!editedEvent) return;

    setIsSaving(true);

    const result = await updateEvent(selectedId, editedEvent);

    setIsSaving(false);

    if (result.success) {
      toast.success("Changes saved successfully!");
    } else {
      toast.error(
        `Failed to save changes${result.error ? `: ${result.error}` : ""}`,
      );
    }
  };

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

      <EventSelector
        events={events}
        selectedId={selectedId}
        onEventSelect={handleEventSelect}
        label={
          <>
            Select an event to view or edit details.
            <br /> Note that only future events can be modified. Please contact
            Adi to modify past events.
          </>
        }
      />

      {editedEvent ? (
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">{editedEvent.name}</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <dt className="font-medium text-muted-foreground">Starts</dt>
              <dd>
                <input
                  type="datetime-local"
                  value={formatDateTimeLocalCA(editedEvent.startTime)}
                  onChange={(e) =>
                    setEditedEvent({
                      ...editedEvent,
                      startTime: parseDateTimeLocalAsCA(e.target.value),
                    })
                  }
                  className="rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </dd>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <dt className="font-medium text-muted-foreground">Ends</dt>
              <dd>
                <input
                  type="datetime-local"
                  value={formatDateTimeLocalCA(editedEvent.endTime)}
                  onChange={(e) =>
                    setEditedEvent({
                      ...editedEvent,
                      endTime: parseDateTimeLocalAsCA(e.target.value),
                    })
                  }
                  className="rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </dd>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <dt className="font-medium text-muted-foreground">Sold</dt>
              <dd>
                <input
                  type="number"
                  value={editedEvent.sold}
                  onChange={(e) =>
                    setEditedEvent({
                      ...editedEvent,
                      sold: Number(e.target.value),
                    })
                  }
                  min={0}
                  className="w-32 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </dd>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <dt className="font-medium text-muted-foreground">Capacity</dt>
              <dd>
                <input
                  type="number"
                  value={editedEvent.capacity}
                  onChange={(e) =>
                    setEditedEvent({
                      ...editedEvent,
                      capacity: Number(e.target.value),
                    })
                  }
                  min={0}
                  className="w-32 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </dd>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <dt className="font-medium text-muted-foreground">
                Price, including sales tax
              </dt>
              <dd>
                <input
                  type="number"
                  value={editedEvent.price}
                  onChange={(e) =>
                    setEditedEvent({
                      ...editedEvent,
                      price: Number(e.target.value),
                    })
                  }
                  min={0}
                  step={0.01}
                  className="w-32 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </dd>
            </div>
          </dl>

          <div className="mt-6 space-y-2">
            <label
              htmlFor="description"
              className="text-sm font-medium text-muted-foreground"
            >
              Description (HTML)
            </label>
            <textarea
              id="description"
              value={editedEvent.description}
              onChange={(e) =>
                setEditedEvent({ ...editedEvent, description: e.target.value })
              }
              rows={8}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring font-mono"
            />
          </div>

          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>

            <button
              onClick={handleDiscard}
              disabled={isSaving}
              className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Discard Changes
            </button>
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
