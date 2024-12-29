/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import VForm from "@/components/form/VForm";
import VInput from "@/components/form/VInput";
import VTextArea from "@/components/form/VTextArea";
import Loading from "@/components/modules/Shared/LoadingBlur";
import { useImageUpload } from "@/hooks/imageUpload.hook";
import { useUser } from "@/context/user.provider";
import { useUpdateVendor } from "@/hooks/auth.hook";

const updateVendorValidationSchema = z.object({
  name: z.string().min(1, "Vendor name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

export default function UpdateVendorProfile() {
  const router = useRouter();
  const {
    user,
    setIsLoading: setUserLoading,
    isLoading: userLoading,
  } = useUser();
  const [isUpdating, setIsUpdating] = useState(false);
  const { mutate: updateVendor, isPending } = useUpdateVendor();

  const {
    previewUrl,
    isUploading,
    uploadedImageUrl,
    handleImageChange,
    resetImage,
    uploadError,
    setPreviewUrl,
  } = useImageUpload();

  useEffect(() => {
    if (user?.user?.logo) {
      setPreviewUrl(user.user.logo);
    }
  }, [user, setPreviewUrl]);

  const handleUpdateProfile: SubmitHandler<FieldValues> = (data) => {
    setIsUpdating(true);
    try {
      const updateData = {
        name: data.name,
        phone: data.phone,
        description: data.description,
        logo: uploadedImageUrl || user?.vendor?.logo,
      };
      updateVendor(updateData);

      setUserLoading(true);
      router.refresh();
    } catch (error: any) {
      toast.error("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="w-full min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        {(isUpdating || userLoading || isPending) && <Loading />}

        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Vendor Profile Settings</h1>
            <p className="text-muted-foreground mt-2">
              Manage your Vendor profile and account information
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Vendor Logo Card */}
            <Card className="lg:col-span-1 flex items-center justify-center">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Shop Logo</h3>
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative w-48 h-48 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center mb-4"
                  >
                    {previewUrl ? (
                      <>
                        <div className="relative w-full h-full">
                          <Image
                            src={previewUrl}
                            alt="Vendor Logo Preview"
                            fill
                            className="rounded-lg object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                        <button
                          type="button"
                          className="absolute top-2 right-2 bg-destructive text-white rounded-full p-2 hover:bg-destructive/90"
                          onClick={resetImage}
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center p-8">
                        <Camera className="w-16 h-16 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground mt-4 text-center">
                          Click to upload Shop logo
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    )}
                  </motion.div>
                  {isUploading && (
                    <div className="text-sm text-accent">Uploading...</div>
                  )}
                  {uploadError && (
                    <div className="text-sm text-destructive">
                      Upload failed: {uploadError.message}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Vendor Information Form Card */}
            <Card className="lg:col-span-2">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-6">
                  Shop Information
                </h3>
                <VForm
                  resolver={zodResolver(updateVendorValidationSchema)}
                  onSubmit={handleUpdateProfile}
                  defaultValues={{
                    name: user?.user?.name || "",
                    email: user?.user?.email || "",
                    phone: user?.user?.phone || "",
                    description: user?.user?.description || "",
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <VInput
                      label="Shop Name"
                      name="name"
                      type="text"
                      placeholder="Enter Shop Name"
                    />

                    <VInput
                      label="Email"
                      name="email"
                      type="email"
                      disabled={true}
                      placeholder="Enter Vendor Email"
                    />

                    <VInput
                      label="Phone"
                      name="phone"
                      type="text"
                      placeholder="Enter Vendor Phone"
                    />

                    <div className="md:col-span-2">
                      <VTextArea
                        label="Shop Description"
                        name="description"
                        placeholder="Enter a description of your Vendor"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Button
                        type="submit"
                        className="w-full md:w-auto"
                        disabled={isUpdating || isUploading}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </VForm>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
