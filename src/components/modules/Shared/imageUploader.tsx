/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { motion } from "motion/react";
import { Plus, Trash2, ImageIcon, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { useImageUpload } from "@/hooks/imageUpload.hook";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const ImageUploader = ({
  onImageUpload,
  onImageRemove,
  maxImages = 5,
  existingImages = [],
  type = 'default', // New prop to differentiate between logo and product images
}: {
  onImageUpload: (url: string) => void;
  onImageRemove?: (url: string) => void;
  maxImages?: number;
  existingImages?: string[];
  type?: 'logo' | 'product' | 'default';
}) => {
  const {
    previewUrl,
    isUploading,
    uploadedImageUrl,
    handleImageChange,
    resetImage,
  } = useImageUpload();

  React.useEffect(() => {
    if (uploadedImageUrl) {
      onImageUpload(uploadedImageUrl);
      resetImage(); // Reset preview and uploadedImageUrl after upload
    }
  }, [uploadedImageUrl, onImageUpload, resetImage]);

  const canUpload = existingImages.length < maxImages;

  return (
    <div className="flex flex-col items-center space-y-4">
      {canUpload && (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id={`image-upload-${type}`}
            disabled={!canUpload}
          />
          <label
            htmlFor={`image-upload-${type}`}
            className={`
              flex flex-col items-center justify-center 
              w-full h-40 border-2 border-dashed rounded-lg 
              cursor-pointer
              ${!canUpload ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Preview"
                width={150}
                height={150}
                className="max-h-36 object-contain"
              />
            ) : (
              <div className="flex flex-col items-center justify-center">
                <ImageIcon className="w-10 h-10 " />
                <p className="text-sm ">
                  {isUploading ? "Uploading..." : "Click to upload image"}
                </p>
              </div>
            )}
          </label>
        </>
      )}

      {/* Display existing images */}
      <div className="flex flex-wrap gap-2 w-full">
        {existingImages.map((imageUrl, index) => (
          <div key={index} className="relative group">
            <Image
              src={imageUrl}
              alt={`Uploaded image ${index + 1}`}
              className="w-auto h-24 object-cover rounded-lg"
              height={150}
              width={150}
            />
            {onImageRemove && (
              <button
                type="button"
                onClick={() => onImageRemove(imageUrl)}
                className="absolute top-1 left-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;