import { CreateEventClient } from "@/app/create-event/create-event-client";
import { fetchEvents } from "@/lib/actions/fetch-events";

export default async function CreateEventPage() {
  const events = await fetchEvents();

  return (
    <div className="mx-auto flex w-full max-w-xl justify-center px-4">
      <CreateEventClient events={events} />
    </div>
  );
}
