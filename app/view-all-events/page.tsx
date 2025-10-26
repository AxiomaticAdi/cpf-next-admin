import { ViewAllEventsClient } from "./view-all-events-client";
import { fetchEvents } from "@/lib/actions/fetch-events";

export default async function ViewAllEventsPage() {
  const events = await fetchEvents();

  return (
    <div className="mx-auto flex w-full max-w-xl justify-center px-4">
      <ViewAllEventsClient events={events} />
    </div>
  );
}
