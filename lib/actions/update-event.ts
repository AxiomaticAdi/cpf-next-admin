"use server";

import { revalidatePath } from "next/cache";
import db from "@/firebase.config";
import { Event } from "@/types";

export type UpdateEventSoldResult = {
  success: boolean;
  error?: string;
};

// TODO: Currently only supports updating the sold tickets

export async function updateEvent(
  eventId: string,
  updatedEvent: Event,
): Promise<UpdateEventSoldResult> {
  try {
    if (!eventId) {
      return { success: false, error: "Missing event identifier" };
    }

    const sold = updatedEvent.sold;

    if (!Number.isFinite(sold)) {
      return { success: false, error: "Sold must be a valid number" };
    }

    if (sold < 0) {
      return {
        success: false,
        error: "Sold tickets cannot be negative",
      };
    }

    const eventRef = db.collection("Events").doc(eventId);
    const eventSnapshot = await eventRef.get();

    if (!eventSnapshot.exists) {
      return { success: false, error: "Event not found" };
    }

    const data = eventSnapshot.data();
    const capacity = data?.Capacity;

    if (typeof capacity !== "number") {
      return {
        success: false,
        error: "Event capacity is invalid",
      };
    }

    if (sold > capacity) {
      return {
        success: false,
        error: "Sold tickets cannot exceed capacity",
      };
    }

    await eventRef.update({ Sold: sold });

    revalidatePath("/");
    revalidatePath("/events");
    revalidatePath("/modify-event");

    return { success: true };
  } catch (error) {
    console.error("Error updating sold tickets:", error);
    return {
      success: false,
      error: "Failed to update sold tickets",
    };
  }
}
