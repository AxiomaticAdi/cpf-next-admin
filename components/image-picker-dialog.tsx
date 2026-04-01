"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { listImages } from "@/lib/actions/list-images";
import { Check } from "lucide-react";

type CloudinaryImage = {
  url: string;
  thumbnailUrl: string;
  publicId: string;
  createdAt: string;
};

type ImagePickerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
  currentUrl?: string;
  folder?: string;
};

export function ImagePickerDialog({
  open,
  onOpenChange,
  onSelect,
  currentUrl,
  folder = "CPF",
}: ImagePickerDialogProps) {
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setIsLoading(true);
    setError(null);

    listImages(folder).then((result) => {
      setIsLoading(false);
      if (result.success) {
        setImages(result.images);
      } else {
        setError(result.error);
      }
    });
  }, [open, folder]);

  const handleSelect = (url: string) => {
    onSelect(url);
    onOpenChange(false);
  };

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    listImages(folder).then((result) => {
      setIsLoading(false);
      if (result.success) {
        setImages(result.images);
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose from library</DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 py-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square animate-pulse rounded-lg bg-muted"
              />
            ))}
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center gap-3 py-8">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" size="sm" onClick={handleRetry}>
              Try again
            </Button>
          </div>
        )}

        {!isLoading && !error && images.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-8">
            <p className="text-sm text-muted-foreground">
              No images found in library.
            </p>
            <p className="text-xs text-muted-foreground">
              Upload an image first, then it will appear here.
            </p>
          </div>
        )}

        {!isLoading && !error && images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 py-4">
            {images.map((image) => {
              const isSelected = currentUrl === image.url;
              return (
                <button
                  key={image.publicId}
                  type="button"
                  onClick={() => handleSelect(image.url)}
                  className={`group relative aspect-square overflow-hidden rounded-lg border-2 transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                    isSelected
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-transparent hover:border-primary/50"
                  }`}
                >
                  <Image
                    src={image.thumbnailUrl}
                    alt={image.publicId}
                    fill
                    className="object-cover"
                    sizes="150px"
                    unoptimized
                  />
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                      <div className="rounded-full bg-primary p-1">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
