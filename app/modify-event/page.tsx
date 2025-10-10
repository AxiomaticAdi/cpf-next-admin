import { ModifyEventClient } from "./modify-event-client";
import { fetchEvents } from "@/lib/actions/fetch-events";

export default async function ModifyEventPage() {
  const events = await fetchEvents();
  const futureEvents = events.filter((event) => event.endTime > new Date());

  return (
    <div className="mx-auto flex w-full max-w-4xl justify-center px-4">
      <ModifyEventClient events={futureEvents} />
    </div>
  );
}
