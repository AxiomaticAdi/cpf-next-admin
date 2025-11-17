import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date for datetime-local input (YYYY-MM-DDTHH:MM)
 */
export function formatDateTimeLocal(date: Date | string): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Formats a date to a readable short format (e.g., "Jan 15, 2025")
 */
export function formatDateOnly(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * California timezone identifier
 */
export const CALIFORNIA_TIMEZONE = "America/Los_Angeles";

/**
 * Formats a Date object to datetime-local input format in California timezone (YYYY-MM-DDTHH:MM)
 */
export function formatDateTimeLocalCA(date: Date | string): string {
  const d = new Date(date);
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: CALIFORNIA_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(d);
  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;
  const hour = parts.find((p) => p.type === "hour")?.value;
  const minute = parts.find((p) => p.type === "minute")?.value;

  return `${year}-${month}-${day}T${hour}:${minute}`;
}

/**
 * Parses a datetime-local input string as California timezone and returns a UTC Date object
 * Input format: "YYYY-MM-DDTHH:MM"
 */
export function parseDateTimeLocalAsCA(dateTimeString: string): Date {
  // Parse the datetime-local string components
  const [datePart, timePart] = dateTimeString.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);

  // Create a date string that explicitly specifies California timezone
  // Format: "YYYY-MM-DDTHH:MM:SS" interpreted in California timezone
  const caDateString = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;

  // Create the date assuming it's in California timezone by using the timezone offset
  const targetDate = new Date(`${caDateString}`);

  // Get California's offset from UTC for this date
  const utcString = targetDate.toLocaleString("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const caString = targetDate.toLocaleString("en-US", {
    timeZone: CALIFORNIA_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  // Parse both strings to compare
  const parseLocaleString = (str: string) => {
    const match = str.match(/(\d+)\/(\d+)\/(\d+),?\s*(\d+):(\d+):(\d+)/);
    if (!match) return new Date();
    return new Date(
      Date.UTC(
        parseInt(match[3]),
        parseInt(match[1]) - 1,
        parseInt(match[2]),
        parseInt(match[4]),
        parseInt(match[5]),
        parseInt(match[6]),
      ),
    );
  };

  const utcParsed = parseLocaleString(utcString);
  const caParsed = parseLocaleString(caString);
  const offsetMs = utcParsed.getTime() - caParsed.getTime();

  // Now create the correct UTC date
  // The user input is in California time, so we need to add the offset to get UTC
  const correctUtcDate = new Date(
    Date.UTC(year, month - 1, day, hours, minutes, 0, 0) + offsetMs,
  );

  return correctUtcDate;
}
