/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
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
        email: data.email,
        phone: data.phone,
        address: data.address,
        profileImg: uploadedImageUrl || user?.customer?.profileImg,
      };

      // Add your API call here to update the profile
      updateCustomer(updateData);
      setUserLoading(true);

      toast.success("Profile updated successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        {(isUpdating || isPending || userLoading) && <Loading />}

        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold">Update Profile</h3>
              <p className="text-muted-foreground mt-2">
                Update your personal information
              </p>
            </div>

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
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mb-6 flex flex-col items-center"
              >
                <div className="relative w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
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
                        className="absolute top-0 right-0 bg-destructive text-white rounded-full p-1 hover:bg-destructive/90"
                        onClick={resetImage}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center">
                      <Camera className="w-10 h-10 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground mt-2">
                        Update Photo
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>
                {isUploading && (
                  <div className="text-sm text-accent mt-2">Uploading...</div>
                )}
                {uploadError && (
                  <div className="text-sm text-destructive mt-2">
                    Upload failed: {uploadError.message}
                  </div>
                )}
              </motion.div>

              <div className="space-y-4">
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

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isUpdating || isUploading}
                  >
                    Update Profile
                  </Button>
                </div>
              </div>
            </VForm>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
