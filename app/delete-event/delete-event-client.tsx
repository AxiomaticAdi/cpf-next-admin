"use client";

import { useState } from "react";
import { Event } from "@/types";
import { Button } from "../../components/ui/button";
import { deleteEvent } from "@/lib/actions/delete-event";
import { toast } from "sonner";
import { useEventSelector } from "@/lib/hooks/use-event-selector";
import { EventSelector } from "@/components/event-selector";

type DeleteEventClientProps = {
  events: Event[];
};

export function DeleteEventClient({ events }: DeleteEventClientProps) {
  const { selectedId, selectedEvent, handleEventSelect } =
    useEventSelector(events);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Wrap the hook's handleEventSelect to reset confirmation when changing events
  const handleEventSelectWithReset = (eventId: string) => {
    handleEventSelect(eventId);
    setShowConfirmation(false);
  };

  const handleInitialDelete = () => {
    setShowConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedId || isDeleting) return;

    setIsDeleting(true);
    try {
      const result = await deleteEvent(selectedId);

      if (result.success) {
        toast.success("Event deleted successfully");
        setShowConfirmation(false);
        window.location.reload();
      } else {
        toast.error(`Failed to delete event: ${result.error}`);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error(
        `An unexpected error occurred while deleting the event: ${error}`,
      );
    } finally {
      setIsDeleting(false);
    }
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

      <EventSelector
        events={events}
        selectedId={selectedId}
        onEventSelect={handleEventSelectWithReset}
        label={
          <>
            Select an event to delete.
            <ul className="list-disc list-outside ml-4 space-y-1 mt-2">
              <li>
                Note that only future events can be deleted. Please contact Adi
                to delete past events.
              </li>
              <li>
                Event deletion cannot be reversed, and the data is lost forever.
              </li>
            </ul>
          </>
        }
      />

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
            <Button
              variant="destructive"
              onClick={handleInitialDelete}
              disabled={isDeleting}
            >
              Delete Event
            </Button>

            {showConfirmation && (
              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium text-destructive">
                  Are you absolutely sure? Event deletion cannot be reversed,
                  and the data is lost forever.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    onClick={handleConfirmDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Yes, Delete Permanently"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirmation(false)}
                    disabled={isDeleting}
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
