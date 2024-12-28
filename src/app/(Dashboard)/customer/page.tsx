/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { FieldValues, SubmitHandler } from "react-hook-form";
import VForm from "@/components/form/VForm";
import { Button } from "@/components/ui/button";
import VInput from "@/components/form/VInput";
import { Camera, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import VTextArea from "@/components/form/VTextArea";
import { useImageUpload } from "@/hooks/imageUpload.hook";
import Image from "next/image";
import Loading from "@/components/modules/Shared/LoadingBlur";
import { useUser } from "@/context/user.provider";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { z } from "zod";
import { useUpdateCustomer } from "@/hooks/auth.hook";

const updateCustomerValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
});

export default function UpdateProfile() {
  const router = useRouter();
  const {
    user,
    setIsLoading: setUserLoading,
    isLoading: userLoading,
  } = useUser();
  const [isUpdating, setIsUpdating] = useState(false);

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
    if (user?.user?.profileImg) {
      setPreviewUrl(user.user.profileImg);
    }
  }, [user, setPreviewUrl]);

  const { mutate: updateCustomer, isPending } = useUpdateCustomer();

  const handleUpdateProfile: SubmitHandler<FieldValues> = (data) => {
    setIsUpdating(true);
    try {
      const updateData = {
        name: data.name,
        phone: data.phone,
        address: data.address,
        profileImg: uploadedImageUrl || user?.customer?.profileImg,
      };

      // console.log({updateData});

      updateCustomer(updateData);
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
        {(isUpdating || isPending || userLoading) && <Loading />}

        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Profile Settings</h1>
            <p className="text-muted-foreground mt-2">
              Manage your account settings and profile information
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Image Card */}
            <Card className="lg:col-span-1">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Profile Picture</h3>
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative w-48 h-48 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center mb-4"
                  >
                    {previewUrl ? (
                      <>
                        <div className="relative w-full h-full">
                          <Image
                            src={previewUrl || user?.user?.profileImg}
                            alt="Profile Preview"
                            fill
                            className="rounded-full object-cover"
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
                        <span className="text-sm text-muted-foreground mt-4">
                          Click to upload new photo
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

            {/* Profile Form Card */}
            <Card className="lg:col-span-2">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-6">Personal Information</h3>
                <VForm
                  resolver={zodResolver(updateCustomerValidationSchema)}
                  onSubmit={handleUpdateProfile}
                  defaultValues={{
                    name: user?.user?.name || "",
                    email: user?.user?.email || "",
                    phone: user?.user?.phone || "",
                    address: user?.user?.address || "",
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <VInput
                      label="Full Name"
                      name="name"
                      type="text"
                      placeholder="Enter Full Name"
                    />

                    <VInput
                      label="Email"
                      name="email"
                      type="email"
                      disabled={true}
                      placeholder="Enter your Email"
                    />

                    <VInput
                      label="Phone"
                      name="phone"
                      type="text"
                      placeholder="Enter your phone"
                    />

                    <VTextArea
                      label="Address"
                      name="address"
                      placeholder="Enter your Address"
                    />

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