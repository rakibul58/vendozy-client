"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { FieldValues, SubmitHandler } from "react-hook-form";
import VForm from "@/components/form/VForm";
import { Button } from "@/components/ui/button";
import VInput from "@/components/form/VInput";
import { Store, User } from "lucide-react";
import { AuthValidations } from "@/schemas/auth.validations";
import { zodResolver } from "@hookform/resolvers/zod";
import VTextArea from "@/components/form/VTextArea";
import {
  useCustomerRegistration,
  useVendorRegistration,
} from "@/hooks/auth.hook";
import Loading from "@/components/modules/Shared/LoadingBlur";
import { useUser } from "@/context/user.provider";
import Image from "next/image";
import loginImg from "../../../../public/login.svg";

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
      },
    };
    handleCustomerRegistration(registrationData);
    userLoading(true);
  };

  useEffect(() => {
    // console.log("object 1");
    if (!isPending && isSuccess) {
      if (user?.role === "CUSTOMER") {
        router.push("/customer/dashboard");
      } else {
        router.push("/vendor/dashboard");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending, isSuccess, userLoading, user]);

  useEffect(() => {
    // console.log("object 2");
    if (!vendorIsPending && vendorIsSuccess) {
      if (user?.role === "CUSTOMER") {
        router.push("/customer/dashboard");
      } else {
        router.push("/vendor/dashboard");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorIsPending, vendorIsSuccess, userLoading, user]);

  const renderForm = () => {
    if (!selectedRole) return null;

    if (selectedRole === "customer") {
      return (
        <VForm
          resolver={zodResolver(AuthValidations.createCustomerValidationSchema)}
          onSubmit={handleCreateCustomer}
        >
          <div className="space-y-4">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
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
            >
              <Button
                className="w-full py-6 text-lg font-semibold"
                size="lg"
                type="submit"
              >
                Create Account
              </Button>
            </motion.div>
          </div>
        </VForm>
      );
    }

    return (
      <VForm
        resolver={zodResolver(AuthValidations.createVendorValidationSchema)}
        onSubmit={handleCreateVendor}
      >
        <div className="space-y-4">
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
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
          >
            <Button
              className="w-full py-6 text-lg font-semibold"
              size="lg"
              type="submit"
            >
              Create Account
            </Button>
          </motion.div>
        </div>
      </VForm>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 py-8 my-10">
      {(isPending || vendorIsPending) && <Loading />}

      {/* Left side - Branding/Image */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="lg:w-1/2 flex items-center justify-center p-6 bg-accent/5 rounded-2xl"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6 text-accent">
            Join Vendozy Marketplace
          </h1>
          <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
            Start your journey with us today
          </p>
          <div className="relative aspect-video w-full max-w-xl mx-auto rounded-xl overflow-hidden shadow-xl">
            <Image
              src={loginImg}
              alt="Marketplace illustration"
              className="object-cover w-full h-full"
              height={100}
              width={100}
            />
          </div>
          <div className="mt-8 grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <h3 className="font-bold text-accent">12k+</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Vendors
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <h3 className="font-bold text-accent">5k+</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Products
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <h3 className="font-bold text-accent">50k+</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Customers
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right side - Registration Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              Create Account
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Choose Your Account Type
            </p>
          </div>

          <div className="flex justify-center space-x-4 mb-8">
            <button
              type="button"
              onClick={() => setSelectedRole("customer")}
              className={`
                flex items-center space-x-2 px-6 py-3 rounded-md 
                transition-all duration-300
                ${
                  selectedRole === "customer"
                    ? "bg-accent hover:bg-accent/60 text-white"
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
                flex items-center space-x-2 px-6 py-3 rounded-md 
                transition-all duration-300
                ${
                  selectedRole === "vendor"
                    ? "bg-accent hover:bg-accent/60 text-white"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 dark:text-gray-400"
                }
              `}
            >
              <Store className="w-5 h-5" />
              <span>Vendor</span>
            </button>
          </div>

          {renderForm()}

          <div className="text-center pt-6 border-t">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-accent hover:text-accent/80 font-semibold"
              >
                Login
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
