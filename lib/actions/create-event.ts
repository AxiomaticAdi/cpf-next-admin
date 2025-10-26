"use server";

import { Timestamp } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";
import db from "@/firebase.config";
import { FirebaseEventsDocument, Event } from "@/types";
import { SALES_TAX } from "@/lib/constants";
import { validateEvent } from "./validate-event";

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

    // Convert form data
    const basePrice = parseFloat(formData.price);
    const capacity = parseInt(formData.capacity);
    const sold = 0;

    // Calculate final price with sales tax if applicable
    const finalPrice = formData.addSalesTax
      ? basePrice * (1 + SALES_TAX)
      : basePrice;

    // Create Event object for validation
    const eventToValidate: Event = {
      id: "temp-id", // Temporary ID for validation
      name: formData.name.trim(),
      description: formData.description.trim(),
      imageUrl: formData.imageUrl.trim(),
      startTime: new Date(formData.startDateTime),
      endTime: new Date(formData.endDateTime),
      capacity: capacity,
      sold: sold,
      price: Math.round(finalPrice * 100) / 100,
    };

    // Validate the event data
    const validationResult = await validateEvent(eventToValidate);
    if (!validationResult.isValid) {
      throw new Error(
        validationResult.errors?.join(", ") || "Invalid event data",
      );
    }

    // Convert datetime strings to Firebase Timestamps
    const startDateTime = Timestamp.fromDate(eventToValidate.startTime);
    const endDateTime = Timestamp.fromDate(eventToValidate.endTime);

    // Create the event document (without EventId as it will be auto-generated)
    const eventData: Omit<FirebaseEventsDocument, "EventId"> = {
      Name: eventToValidate.name,
      Description: eventToValidate.description,
      ImageUrl: eventToValidate.imageUrl,
      StartDateTime: startDateTime,
      EndDateTime: endDateTime,
      Capacity: eventToValidate.capacity,
      Sold: eventToValidate.sold,
      Price: eventToValidate.price,
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
