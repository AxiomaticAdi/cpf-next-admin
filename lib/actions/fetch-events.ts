import db from "@/firebase.config";
import { Event } from "@/types";

export async function fetchEvents(): Promise<Event[]> {
  const eventsCollection = db.collection("Events");

  try {
    const snapshot = await eventsCollection.get();
    const events: Event[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();

      // Convert Firestore timestamp to JavaScript Date
      const startTime = data.StartDateTime.toDate();
      const endTime = data.EndDateTime.toDate();

      const eventItem: Event = {
        id: doc.id,
        name: data.Name,
        description: data.Description,
        imageUrl: data.ImageUrl,
        startTime: startTime,
        endTime: endTime,
        capacity: data.Capacity,
        sold: data.Sold,
        price: data.Price,
      };
      events.push(eventItem);
    });

    // Sort events in reverse order
    events.sort((a, b) => b.endTime.getTime() - a.endTime.getTime());

    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error; // rethrow the error after logging, or handle it as needed
  }
}
