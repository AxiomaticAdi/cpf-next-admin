import DOMPurify from "dompurify";
import Image from "next/image";
import BadgePrice from "./badge-price";
import { SALES_TAX } from "@/lib/constants";

interface EventFormData {
  name: string;
  description: string;
  imageUrl: string;
  startDateTime: string;
  endDateTime: string;
  capacity: string;
  price: string;
}

interface EventDetailsSectionProps {
  formData: EventFormData;
  addSalesTax: boolean;
  includeDetails?: boolean;
}

export default function EventDetailsSection({
  formData,
  addSalesTax,
  includeDetails = true,
}: EventDetailsSectionProps) {
  const remainingTickets = parseInt(formData.capacity) || 0;
  const finalPrice = addSalesTax
    ? parseFloat(formData.price) * (1 + SALES_TAX)
    : parseFloat(formData.price);

  // Sanitize the HTML content before rendering
  const sanitizedDescription = DOMPurify.sanitize(formData.description);

  return (
    <div className="flex flex-col items-center">
      <div className="w-80 sm:w-96 h-60 rounded-md relative">
        {formData.imageUrl && (
          <Image src={formData.imageUrl} alt={formData.name} fill className="object-cover rounded-md" />
        )}
        {formData.price && <BadgePrice price={finalPrice} />}
      </div>

      <h1 className="text-xl font-bold my-4">{formData.name || "Event Name"}</h1>

      {/* Optionally include event description as sanitized HTML */}
      {includeDetails && (
        <div
          className="max-w-96 mb-4 prose text-left"
          dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
        ></div>
      )}

      {formData.startDateTime && formData.endDateTime && (
        <div className="mt-2 font-semibold">
          <div>
            {new Date(formData.startDateTime).toLocaleDateString("en-US", {
              timeZone: "America/Los_Angeles",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <div>
            {new Date(formData.startDateTime).toLocaleTimeString("en-US", {
              timeZone: "America/Los_Angeles",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
              hourCycle: "h11",
            })}{" "}
            to{" "}
            {new Date(formData.endDateTime).toLocaleTimeString("en-US", {
              timeZone: "America/Los_Angeles",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
              hourCycle: "h11",
            })}{" "}
            PT
          </div>
        </div>
      )}
      <p>{remainingTickets} tickets available</p>
    </div>
  );
}
