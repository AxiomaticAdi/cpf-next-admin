"use server";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type CloudinaryImage = {
  url: string;
  thumbnailUrl: string;
  publicId: string;
  createdAt: string;
};

function buildThumbnailUrl(secureUrl: string): string {
  // Insert transformation after /upload/
  // Before: https://res.cloudinary.com/demo/image/upload/v1234567890/CPF/photo.jpg
  // After:  https://res.cloudinary.com/demo/image/upload/c_fill,w_150,h_150,q_auto,f_auto/v1234567890/CPF/photo.jpg
  return secureUrl.replace(
    "/image/upload/",
    "/image/upload/c_fill,w_150,h_150,q_auto,f_auto/",
  );
}

export async function listImages(
  folder: string = "CPF",
): Promise<
  | { success: true; images: CloudinaryImage[] }
  | { success: false; error: string }
> {
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: folder + "/",
      max_results: 100,
      resource_type: "image",
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resources = result.resources as any[];

    const images: CloudinaryImage[] = resources
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .map((resource) => ({
        url: String(resource.secure_url),
        thumbnailUrl: buildThumbnailUrl(String(resource.secure_url)),
        publicId: String(resource.public_id),
        createdAt: String(resource.created_at),
      }));

    return { success: true, images };
  } catch (error) {
    console.error("Error listing images:", error);
    return {
      success: false,
      error: "Failed to load images. Please try again.",
    };
  }
}
