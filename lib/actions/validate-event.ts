"use server";

import { Event } from "@/types";

export type EventValidationResult = {
  isValid: boolean;
  errors?: string[];
};

/**
 * Validates an event object to ensure all fields meet business requirements
 * @param event - The event object to validate
 * @returns Validation result with isValid boolean and optional error messages
 */
export async function validateEvent(
  event: Event,
): Promise<EventValidationResult> {
  const errors: string[] = [];

  // Required fields validation
  if (!event.id || event.id.trim() === "") {
    errors.push("Event ID is required");
  }

  if (!event.name || event.name.trim() === "") {
    errors.push("Event name is required");
  }

  if (!event.description || event.description.trim() === "") {
    errors.push("Event description is required");
  }

  if (!event.imageUrl || event.imageUrl.trim() === "") {
    errors.push("Event image URL is required");
  }

  // Numeric validations
  if (!Number.isFinite(event.capacity)) {
    errors.push("Capacity must be a valid number");
  } else if (event.capacity <= 0) {
    errors.push("Capacity must be greater than 0");
  }

  if (!Number.isFinite(event.sold)) {
    errors.push("Sold tickets must be a valid number");
  } else if (event.sold < 0) {
    errors.push("Sold tickets cannot be negative");
  } else if (Number.isFinite(event.capacity) && event.sold > event.capacity) {
    errors.push("Sold tickets cannot exceed capacity");
  }

  if (!Number.isFinite(event.price)) {
    errors.push("Price must be a valid number");
  } else if (event.price < 0) {
    errors.push("Price cannot be negative");
  }

  // Date validations
  if (!(event.startTime instanceof Date) || isNaN(event.startTime.getTime())) {
    errors.push("Start time must be a valid date");
  }

  if (!(event.endTime instanceof Date) || isNaN(event.endTime.getTime())) {
    errors.push("End time must be a valid date");
  }

  if (
    event.startTime instanceof Date &&
    event.endTime instanceof Date &&
    !isNaN(event.startTime.getTime()) &&
    !isNaN(event.endTime.getTime())
  ) {
    if (event.endTime <= event.startTime) {
      errors.push("End time must be after start time");
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}
