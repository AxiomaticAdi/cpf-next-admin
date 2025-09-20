"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import EventDetailsSection from "./create-event-preview";

export function CreateEventForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    startDateTime: "",
    endDateTime: "",
    capacity: "",
    price: "",
  });

  const [addSalesTax, setAddSalesTax] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

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
        });
        setAddSalesTax(true);
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
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            type="url"
            value={formData.imageUrl}
            onChange={handleInputChange}
            placeholder="https://example.com/image.jpg"
            required
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
              });
              setAddSalesTax(true);
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
