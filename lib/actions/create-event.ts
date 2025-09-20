"use server";

import { Timestamp } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";
import db from "@/firebase.config";
import { FirebaseEventsDocument } from "@/types";
import { SALES_TAX } from "@/lib/constants";

export type CreateEventFormData = {
  name: string;
  description: string;
  imageUrl: string;
  startDateTime: string;
  endDateTime: string;
  capacity: string;
  price: string;
  addSalesTax: boolean;
};

export async function createEvent(formData: CreateEventFormData) {
  try {
    // Validate required fields
    if (
      !formData.name ||
      !formData.description ||
      !formData.imageUrl ||
      !formData.startDateTime ||
      !formData.endDateTime ||
      !formData.capacity ||
      !formData.price
    ) {
      throw new Error("All required fields must be provided");
    }

    // Convert and validate form data
    const basePrice = parseFloat(formData.price);
    const capacity = parseInt(formData.capacity);
    const sold = 0;

    if (isNaN(basePrice) || basePrice < 0) {
      throw new Error("Price must be a valid positive number");
    }

    if (isNaN(capacity) || capacity < 1) {
      throw new Error("Capacity must be a valid positive number");
    }

    if (sold < 0 || sold > capacity) {
      throw new Error("Sold tickets must be between 0 and capacity");
    }

    // Calculate final price with sales tax if applicable
    const finalPrice = formData.addSalesTax
      ? basePrice * (1 + SALES_TAX)
      : basePrice;

    // Convert datetime strings to Firebase Timestamps
    const startDateTime = Timestamp.fromDate(new Date(formData.startDateTime));
    const endDateTime = Timestamp.fromDate(new Date(formData.endDateTime));

    // Validate that end time is after start time
    if (endDateTime.toDate() <= startDateTime.toDate()) {
      throw new Error("End date and time must be after start date and time");
    }

    // Create the event document (without EventId as it will be auto-generated)
    const eventData: Omit<FirebaseEventsDocument, "EventId"> = {
      Name: formData.name.trim(),
      Description: formData.description.trim(),
      ImageUrl: formData.imageUrl.trim(),
      StartDateTime: startDateTime,
      EndDateTime: endDateTime,
      Capacity: capacity,
      Sold: sold,
      Price: Math.round(finalPrice * 100) / 100, // Round to 2 decimal places
    };

    // Add document to Firestore Events collection
    const docRef = await db.collection("Events").add(eventData);

    // Update the document with its auto-generated ID as EventId
    await docRef.update({ EventId: docRef.id });

    // Revalidate any cached pages that might display events
    revalidatePath("/");
    revalidatePath("/events");

    return { success: true, eventId: docRef.id };
  } catch (error) {
    console.error("Error creating event:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create event",
    };
  }
}
