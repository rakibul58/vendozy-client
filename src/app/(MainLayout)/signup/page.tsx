"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { FieldValues, SubmitHandler } from "react-hook-form";
import VForm from "@/components/form/VForm";
import { Button } from "@/components/ui/button";
import VInput from "@/components/form/VInput";
import { Camera, Store, User, X } from "lucide-react";
import { AuthValidations } from "@/schemas/auth.validations";
import { zodResolver } from "@hookform/resolvers/zod";
import VTextArea from "@/components/form/VTextArea";
import { useImageUpload } from "@/hooks/imageUpload.hook";
import Image from "next/image";
import {
  useCustomerRegistration,
  useVendorRegistration,
} from "@/hooks/auth.hook";
import Loading from "@/components/modules/Shared/LoadingBlur";
import { useUser } from "@/context/user.provider";

export default function Signup() {
  const [selectedRole, setSelectedRole] = useState<
    "customer" | "vendor" | null
  >(null);
  const router = useRouter();
  const {
    mutate: handleCustomerRegistration,
    isPending,
    isSuccess,
  } = useCustomerRegistration();
  const {
    mutate: handleVendorRegistration,
    isPending: vendorIsPending,
    isSuccess: vendorIsSuccess,
  } = useVendorRegistration();
  const { user, setIsLoading: userLoading } = useUser();
  const {
    previewUrl,
    isUploading,
    uploadedImageUrl,
    handleImageChange,
    resetImage,
    uploadError,
  } = useImageUpload();

  const handleCreateVendor: SubmitHandler<FieldValues> = (data) => {
    const registrationData = {
      password: data.password,
      vendor: {
        email: data.email,
        phone: data.phone,
      },
    };
    handleVendorRegistration(registrationData);
    userLoading(true);
  };

  const handleCreateCustomer: SubmitHandler<FieldValues> = (data) => {
    const registrationData = {
      password: data.password,
      customer: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        profileImg: uploadedImageUrl,
      },
    };

    handleCustomerRegistration(registrationData);
    userLoading(true);
  };

  useEffect(() => {
    // console.log("object 1");
    if (!isPending && isSuccess) {
      if (user?.role === "CUSTOMER") {
        router.push("/customer");
      } else {
        router.push("/vendor");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending, isSuccess, userLoading, user]);

  useEffect(() => {
    // console.log("object 2");
    if (!vendorIsPending && vendorIsSuccess) {
      if (user?.role === "CUSTOMER") {
        router.push("/customer");
      } else {
        router.push("/vendor");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorIsPending, vendorIsSuccess, userLoading, user]);

  return (
    <div className="flex items-center justify-center px-4 min-h-[70vh] mb-10">
      {(isPending || vendorIsPending) && <Loading />}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.4,
          ease: "easeInOut",
        }}
        className="w-full max-w-md space-y-6 rounded-xl border border-gray-200 p-8 shadow-lg dark:border-gray-700 my-auto"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            Create Account
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Choose Your Account Type
          </p>
        </motion.div>

        {/* Role Selection */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center space-x-4 mb-6 "
        >
          <button
            type="button"
            onClick={() => setSelectedRole("customer")}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-md 
              transition-all duration-300
              ${
                selectedRole === "customer"
                  ? "bg-blue-400 hover:bg-blue-300 text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 dark:text-gray-400"
              }
            `}
          >
            <User className="w-5 h-5" />
            <span>Customer</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole("vendor")}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-md 
              transition-all duration-300
              
              ${
                selectedRole === "vendor"
                  ? "bg-blue-400 hover:bg-blue-300 text-white "
                  : "border border-gray-300 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 dark:text-gray-400"
              }
            `}
          >
            <Store className="w-5 h-5" />
            <span>Vendor</span>
          </button>
        </motion.div>

        {selectedRole &&
          (selectedRole === "customer" ? (
            <VForm
              resolver={zodResolver(
                AuthValidations.createCustomerValidationSchema
              )}
              onSubmit={handleCreateCustomer}
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6 flex flex-col items-center"
              >
                <div className="relative w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                  {previewUrl ? (
                    <>
                      <div className="relative w-full h-full">
                        <Image
                          src={previewUrl}
                          alt="Profile Preview"
                          fill
                          className="rounded-full object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      {/* Remove button */}
                      <button
                        type="button"
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                        onClick={resetImage}
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center">
                      <Camera className="w-10 h-10 text-gray-400" />
                      <span className="text-sm text-gray-500 mt-2">
                        Upload Photo
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
                  <div className="text-sm text-blue-500 mt-2">Uploading...</div>
                )}
                {uploadError && (
                  <div className="text-sm text-red-500 mt-2">
                    Upload failed: {uploadError.message}
                  </div>
                )}
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-4"
              >
                <VInput
                  label="Full Name"
                  name="name"
                  type="text"
                  placeholder="Enter Full Name"
                />
              </motion.div>

              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-4"
              >
                <VInput
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Enter your Email"
                />
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-4"
              >
                <VInput
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Enter Password"
                />
              </motion.div>

              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-4"
              >
                <VInput
                  label="Phone"
                  name="phone"
                  type="text"
                  placeholder="Enter your phone"
                />
              </motion.div>

              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-4"
              >
                <VTextArea
                  label="Address"
                  name="address"
                  type="text"
                  placeholder="Enter your Address"
                />
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col space-y-4"
              >
                <Button
                  className="w-full rounded-md font-semibold group"
                  size="lg"
                  type="submit"
                >
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-block"
                  >
                    Create Account
                  </motion.span>
                </Button>
              </motion.div>
            </VForm>
          ) : (
            <VForm
              resolver={zodResolver(
                AuthValidations.createVendorValidationSchema
              )}
              onSubmit={handleCreateVendor}
            >
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-4"
              >
                <VInput
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-4"
              >
                <VInput
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                />
              </motion.div>

              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-4"
              >
                <VInput
                  label="Phone"
                  name="phone"
                  type="text"
                  placeholder="Enter your phone"
                />
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col space-y-4"
              >
                <Button
                  className="w-full rounded-md font-semibold group"
                  size="lg"
                  type="submit"
                >
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-block"
                  >
                    Create Account
                  </motion.span>
                </Button>
              </motion.div>
            </VForm>
          ))}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center mt-6"
        >
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-400 hover:text-blue-300 font-semibold"
            >
              Login
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
