import { useState, useCallback } from "react";
import { Event } from "@/types";

export function useEventSelector(events: Event[]) {
  const [selectedId, setSelectedId] = useState(() => events[0]?.id ?? "");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(
    () => events[0] ?? null,
  );

  const handleEventSelect = useCallback(
    (eventId: string) => {
      const event = events.find((e) => e.id === eventId);
      if (event) {
        setSelectedId(eventId);
        setSelectedEvent(event);
      }
    },
    [events],
  );

  return {
    selectedId,
    selectedEvent,
    handleEventSelect,
    setSelectedEvent,
  };
}
