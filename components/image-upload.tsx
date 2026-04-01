"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadImage } from "@/lib/actions/upload-image";
import { Upload, X, RefreshCw, Loader2, Link } from "lucide-react";

type ImageUploadProps = {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
};

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function ImageUpload({
  value,
  onChange,
  folder = "CPF",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Invalid file type. Please upload a JPEG, PNG, or WebP image.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Image must be under 4MB.");
      return;
    }

    setError(null);
    setIsUploading(true);
    setShowUrlInput(false);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const result = await uploadImage(formData);

    setIsUploading(false);

    if (result.success) {
      onChange(result.url);
    } else {
      setError(result.error);
    }

    // Reset file input so the same file can be re-selected
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    onChange("");
    setError(null);
    setShowUrlInput(false);
  };

  const handleReplace = () => {
    fileInputRef.current?.click();
  };

  const handleUrlBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const url = e.target.value.trim();
    if (url) {
      onChange(url);
      setShowUrlInput(false);
      setError(null);
    }
  };

  const hasImage = value && value.trim() !== "";

  // Uploading state
  if (isUploading) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Uploading image...
          </span>
        </div>
        <input ref={fileInputRef} type="file" className="hidden" />
      </div>
    );
  }

  // Uploaded / Pre-populated state
  if (hasImage) {
    return (
      <div className="space-y-2">
        <div className="relative w-full overflow-hidden rounded-lg border border-border">
          <Image
            src={value}
            alt="Event image preview"
            width={600}
            height={300}
            className="h-auto w-full object-cover"
            unoptimized
          />
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReplace}
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            Replace
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemove}
          >
            <X className="mr-1.5 h-3.5 w-3.5" />
            Remove
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    );
  }

  // Empty state
  return (
    <div className="space-y-2">
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      <div
        className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border p-6 transition-colors hover:border-primary/50 hover:bg-muted/50"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-8 w-8 text-muted-foreground" />
        <span className="text-sm font-medium">Upload Image</span>
        <span className="text-xs text-muted-foreground">
          JPEG, PNG, or WebP up to 4MB
        </span>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
      {showUrlInput ? (
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="https://example.com/image.jpg"
            onBlur={handleUrlBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.currentTarget.blur();
              }
            }}
            autoFocus
          />
        </div>
      ) : (
        <button
          type="button"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          onClick={() => setShowUrlInput(true)}
        >
          <Link className="h-3 w-3" />
          Or paste image URL
        </button>
      )}
    </div>
  );
}
