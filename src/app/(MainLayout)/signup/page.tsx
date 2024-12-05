"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
// import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, SubmitHandler } from "react-hook-form";
import VForm from "@/components/form/VForm";
import { Button } from "@/components/ui/button";
import VInput from "@/components/form/VInput";
// import { AuthValidations } from "@/schemas/auth.validations";
import { Store, User } from "lucide-react";

export default function Signup() {
  const [selectedRole, setSelectedRole] = useState<"customer" | "vendor" | null>(null);
  const router = useRouter();

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    // Combine selected role with form data
    const registrationData = {
      ...data,
      role: selectedRole
    };

    console.log({ registrationData });

    // Simulated registration logic
    if (selectedRole === "customer") {
      // Redirect to customer dashboard or profile completion
      router.push("/customer/profile");
    } else if (selectedRole === "vendor") {
      // Redirect to vendor shop setup
      router.push("/vendor/setup-shop");
    }
  };

  return (
    <div className="flex items-center justify-center px-4 min-h-[70vh]">
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
              ${selectedRole === "customer" 
                ? "bg-blue-400 hover:bg-blue-300 text-white" 
                : "border border-gray-300 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 dark:text-gray-400"}
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
              
              ${selectedRole === "vendor" 
                ? "bg-blue-400 hover:bg-blue-300 text-white " 
                : "border border-gray-300 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 dark:text-gray-400"}
            `}
          >
            <Store className="w-5 h-5" />
            <span>Vendor</span>
          </button>
        </motion.div>

        {selectedRole && (
          <VForm
        //     resolver={zodResolver(AuthValidations.signupValidationSchema)}
            onSubmit={onSubmit}
          >
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-4"
            >
              <VInput label="Full Name" name="fullName" type="text" />
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-4"
            >
              <VInput label="Email" name="email" type="email" />
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-4"
            >
              <VInput label="Password" name="password" type="password" />
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mb-4"
            >
              <VInput label="Confirm Password" name="confirmPassword" type="password" />
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
        )}

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