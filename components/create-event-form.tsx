"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { createEvent } from "@/lib/actions/create-event";
import { SALES_TAX } from "@/lib/constants";

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
  const [submitMessage, setSubmitMessage] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const result = await createEvent({
        ...formData,
        addSalesTax,
      });

      if (result.success) {
        setSubmitMessage("Event created successfully!");
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
        setSubmitMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setSubmitMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Event</h1>

      {submitMessage && (
        <div
          className={`p-4 rounded-md mb-6 ${
            submitMessage.includes("Error")
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-green-50 text-green-700 border border-green-200"
          }`}
        >
          {submitMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
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
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Event"}
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
    </div>
  );
}
