"use server";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "CPF";

    if (!file) {
      return { success: false as const, error: "No file provided" };
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        success: false as const,
        error: "Invalid file type. Please upload a JPEG, PNG, or WebP image.",
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false as const,
        error: "Image must be under 4MB.",
      };
    }

    // Convert File to base64 data URI for Cloudinary upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: "image",
    });

    return { success: true as const, url: result.secure_url };
  } catch (error) {
    console.error("Error uploading image:", error);
    return {
      success: false as const,
      error: "Upload failed. Please try again.",
    };
  }
}
