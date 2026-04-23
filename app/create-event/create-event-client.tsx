"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/image-upload";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { createEvent } from "@/lib/actions/create-event";
import { SALES_TAX } from "@/lib/constants";
import { toast } from "sonner";
import { Event } from "@/types";
import { formatDateOnly } from "@/lib/utils";
import { Copy, Search, X } from "lucide-react";
import Image from "next/image";
import BadgePrice from "@/components/badge-price";
import EventDetailsSection from "./create-event-preview";

type CreateEventClientProps = {
  events?: Event[];
};

export function CreateEventClient({ events }: CreateEventClientProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    startDateTime: "",
    endDateTime: "",
    capacity: "",
    price: "",
    depositPrice: "",
  });

  const [addSalesTax, setAddSalesTax] = useState(true);
  const [depositEnabled, setDepositEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showCopyPicker, setShowCopyPicker] = useState(false);
  const [copyFromId, setCopyFromId] = useState("");
  const [copySearch, setCopySearch] = useState("");

  const handleCopyFrom = (eventId: string) => {
    setCopyFromId(eventId);
    setShowCopyPicker(false);

    if (!eventId) {
      setFormData({
        name: "",
        description: "",
        imageUrl: "",
        startDateTime: "",
        endDateTime: "",
        capacity: "",
        price: "",
        depositPrice: "",
      });
      setAddSalesTax(true);
      setDepositEnabled(false);
      return;
    }

    const event = events?.find((e) => e.id === eventId);
    if (!event) return;

    const basePrice = event.price / (1 + SALES_TAX);
    const basePriceStr = isNaN(basePrice) ? "" : basePrice.toFixed(2);

    const baseDeposit =
      event.depositPrice !== undefined
        ? (event.depositPrice / (1 + SALES_TAX)).toFixed(2)
        : "";

    setFormData({
      name: event.name,
      description: event.description,
      imageUrl: event.imageUrl,
      startDateTime: "",
      endDateTime: "",
      capacity: String(event.capacity),
      price: basePriceStr,
      depositPrice: baseDeposit,
    });
    setAddSalesTax(true);
    setDepositEnabled(event.depositPrice !== undefined);

    toast.info(`Prefilled from "${event.name}". Set your dates to continue.`);
  };

  const copiedEvent = events?.find((e) => e.id === copyFromId);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePreview = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPreview(true);
  };

  const handleCreateEvent = async () => {
    setIsSubmitting(true);

    try {
      const result = await createEvent({
        ...formData,
        addSalesTax,
      });

      if (result.success) {
        toast.success("Event created successfully!");
        setShowPreview(false);
        // Reset form
        setFormData({
          name: "",
          description: "",
          imageUrl: "",
          startDateTime: "",
          endDateTime: "",
          capacity: "",
          price: "",
          depositPrice: "",
        });
        setAddSalesTax(true);
        setDepositEnabled(false);
      } else {
        toast.error(`Error: ${result.error}`);
      }
    } catch (error) {
      toast.error(`An unexpected error occurred: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Event</h1>
      <div className="block text-sm font-medium my-6">
        <ul className="list-disc list-outside ml-4 space-y-1">
          <li>
            Note that only future events can be created. Please contact Adi to
            create past events.
          </li>
          <li>
            Note that events will not display on the website if they have zero
            tickets sold and start within 48 hours.
          </li>
        </ul>
      </div>

      {events && events.length > 0 && (
        <div className="flex justify-center items-center gap-3 mb-6">
          {copiedEvent ? (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 rounded-md border border-input bg-muted px-3 py-2 text-sm">
                <Copy className="h-4 w-4 text-muted-foreground" />
                <span>
                  Copied from{" "}
                  <span className="font-medium">{copiedEvent.name}</span>
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopyFrom("")}
                  className="ml-1 h-5 w-5"
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Event details prefilled — set new dates, modify as needed, and
                review before submitting.
              </p>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCopyPicker(true)}
            >
              <Copy className="h-4 w-4 mr-2" />
              OPTIONAL - duplicate existing event
            </Button>
          )}
        </div>
      )}

      <Dialog
        open={showCopyPicker}
        onOpenChange={(open) => {
          setShowCopyPicker(open);
          if (!open) setCopySearch("");
        }}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Copy from existing event</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={copySearch}
              onChange={(e) => setCopySearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            {(() => {
              const filtered = events?.filter((event) =>
                event.name.toLowerCase().includes(copySearch.toLowerCase()),
              );
              if (copySearch && filtered?.length === 0) {
                return (
                  <p className="col-span-full text-center text-sm text-muted-foreground py-8">
                    No events found matching &ldquo;{copySearch}&rdquo;
                  </p>
                );
              }
              return filtered?.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => handleCopyFrom(event.id)}
                  className="group rounded-lg border border-input bg-card text-left shadow-sm transition-colors hover:border-primary hover:bg-accent overflow-hidden"
                >
                  <div className="relative w-full h-36">
                    {event.imageUrl ? (
                      <Image
                        src={event.imageUrl}
                        alt={event.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
                        No image
                      </div>
                    )}
                    <BadgePrice price={event.price} />
                  </div>
                  <div className="p-3">
                    <div className="font-semibold text-sm truncate">
                      {event.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatDateOnly(event.startTime)} &middot;{" "}
                      {event.capacity} spots
                    </div>
                  </div>
                </button>
              ));
            })()}
          </div>
        </DialogContent>
      </Dialog>

      <form onSubmit={handlePreview} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Event Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter event name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter event description (HTML supported)"
            rows={4}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Event Image</Label>
          <ImageUpload
            value={formData.imageUrl}
            onChange={(url) =>
              setFormData((prev) => ({ ...prev, imageUrl: url }))
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDateTime">Start Date & Time</Label>
            <Input
              id="startDateTime"
              name="startDateTime"
              type="datetime-local"
              value={formData.startDateTime}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDateTime">End Date & Time</Label>
            <Input
              id="endDateTime"
              name="endDateTime"
              type="datetime-local"
              value={formData.endDateTime}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              min="1"
              value={formData.capacity}
              onChange={handleInputChange}
              placeholder="100"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Base Price ($)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="29.99"
              required
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="addSalesTax"
            checked={addSalesTax}
            onCheckedChange={(checked) => setAddSalesTax(checked === true)}
          />
          <Label
            htmlFor="addSalesTax"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Add sales tax ({(SALES_TAX * 100).toFixed(2)}%)?
            {formData.price && (
              <span className="ml-2 text-muted-foreground">
                Final price: $
                {addSalesTax
                  ? (parseFloat(formData.price) * (1 + SALES_TAX)).toFixed(2)
                  : parseFloat(formData.price).toFixed(2)}
              </span>
            )}
          </Label>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="depositEnabled"
              checked={depositEnabled}
              onCheckedChange={(checked) => {
                const enabled = checked === true;
                setDepositEnabled(enabled);
                if (!enabled) {
                  setFormData((prev) => ({ ...prev, depositPrice: "" }));
                }
              }}
            />
            <Label
              htmlFor="depositEnabled"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Enable deposit?
              {depositEnabled && formData.depositPrice && (
                <span className="ml-2 text-muted-foreground">
                  Deposit price: $
                  {addSalesTax
                    ? (
                        parseFloat(formData.depositPrice) *
                        (1 + SALES_TAX)
                      ).toFixed(2)
                    : parseFloat(formData.depositPrice).toFixed(2)}
                </span>
              )}
            </Label>
          </div>
          {depositEnabled && (
            <div className="ml-6 space-y-2">
              <Label htmlFor="depositPrice">Deposit Amount ($)</Label>
              <Input
                id="depositPrice"
                name="depositPrice"
                type="number"
                min="0.01"
                step="0.01"
                value={formData.depositPrice}
                onChange={handleInputChange}
                placeholder="19.99"
                required={depositEnabled}
              />
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" className="flex-1">
            Preview Event
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFormData({
                name: "",
                description: "",
                imageUrl: "",
                startDateTime: "",
                endDateTime: "",
                capacity: "",
                price: "",
                depositPrice: "",
              });
              setAddSalesTax(true);
              setDepositEnabled(false);
            }}
          >
            Clear Form
          </Button>
        </div>
      </form>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Event Preview</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <EventDetailsSection
              formData={formData}
              addSalesTax={addSalesTax}
              includeDetails={true}
            />
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Return to editing
            </Button>
            <Button onClick={handleCreateEvent} disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Launch Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
