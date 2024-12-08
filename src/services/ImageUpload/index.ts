/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import envConfig from "@/config/envConfig";
import axios from "axios";
import { toast } from "sonner";

const CLOUDINARY_UPLOAD_PRESET = envConfig.cloudinaryPreset;
const CLOUDINARY_URI = envConfig.cloudinaryURI;

export const handleImageUpload = async (file: File): Promise<string | null> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", `${CLOUDINARY_UPLOAD_PRESET}`);
  try {
    const response = await axios.post(
      `${CLOUDINARY_URI}`,
      formData
    );
    return response.data.secure_url;
  } catch (error: any) {
    toast.error("Failed Upload Image....", {
      duration: 3000,
    });
    throw new Error("Image upload failed");
  }
};
