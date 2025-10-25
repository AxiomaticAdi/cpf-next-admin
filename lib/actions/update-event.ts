"use server";

import { revalidatePath } from "next/cache";
import { Timestamp } from "firebase-admin/firestore";
import db from "@/firebase.config";
import { Event } from "@/types";

export type UpdateEventResult = {
  success: boolean;
  error?: string;
};

export async function updateEvent(
  eventId: string,
  updatedEvent: Event,
): Promise<UpdateEventResult> {
  try {
    if (!eventId) {
      return { success: false, error: "Missing event identifier" };
    }

    const eventRef = db.collection("Events").doc(eventId);
    const eventSnapshot = await eventRef.get();

    if (!eventSnapshot.exists) {
      return { success: false, error: `Event with ID ${eventId} not found` };
    }

    // Convert Event type to FirebaseEventsDocument format
    const firebaseEvent = {
      EventId: updatedEvent.id,
      Name: updatedEvent.name,
      Description: updatedEvent.description,
      ImageUrl: updatedEvent.imageUrl,
      StartDateTime: Timestamp.fromDate(updatedEvent.startTime),
      EndDateTime: Timestamp.fromDate(updatedEvent.endTime),
      Capacity: updatedEvent.capacity,
      Sold: updatedEvent.sold,
      Price: updatedEvent.price,
    };

    await eventRef.update(firebaseEvent);

    revalidatePath("/");
    revalidatePath("/events");
    revalidatePath("/modify-event");

    return { success: true };
  } catch (error) {
    console.error("Error updating event:", error);
    return {
      success: false,
      error: "Failed to update event",
    };
  }
}
