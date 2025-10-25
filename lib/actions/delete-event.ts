"use server";

import { revalidatePath } from "next/cache";
import db from "@/firebase.config";

export type DeleteEventResult = {
  success: boolean;
  error?: string;
};

export async function deleteEvent(
  eventId: string,
): Promise<DeleteEventResult> {
  try {
    if (!eventId) {
      return { success: false, error: "Missing event identifier" };
    }

    const eventRef = db.collection("Events").doc(eventId);
    const eventSnapshot = await eventRef.get();

    if (!eventSnapshot.exists) {
      return { success: false, error: `Event with ID ${eventId} not found` };
    }

    await eventRef.delete();

    revalidatePath("/");
    revalidatePath("/events");
    revalidatePath("/modify-event");
    revalidatePath("/delete-event");

    return { success: true };
  } catch (error) {
    console.error("Error deleting event:", error);
    return {
      success: false,
      error: "Failed to delete event",
    };
  }
}
