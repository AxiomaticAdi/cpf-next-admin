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

export async function listImages(folder: string = "CPF") {
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: folder + "/",
      max_results: 100,
      resource_type: "image",
    });

    const images: CloudinaryImage[] = result.resources
      .sort(
        (a: { created_at: string }, b: { created_at: string }) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .map(
        (resource: {
          secure_url: string;
          public_id: string;
          created_at: string;
        }) => ({
          url: resource.secure_url,
          thumbnailUrl: buildThumbnailUrl(resource.secure_url),
          publicId: resource.public_id,
          createdAt: resource.created_at,
        }),
      );

    return { success: true as const, images };
  } catch (error) {
    console.error("Error listing images:", error);
    return {
      success: false as const,
      error: "Failed to load images. Please try again.",
    };
  }
}
