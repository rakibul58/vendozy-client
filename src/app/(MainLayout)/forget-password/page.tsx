"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, SubmitHandler } from "react-hook-form";
import VForm from "@/components/form/VForm";
import { Button } from "@/components/ui/button";
import VInput from "@/components/form/VInput";
import { AuthValidations } from "@/schemas/auth.validations";
import { useUserForgetPassword } from "@/hooks/auth.hook";
import Loading from "@/components/modules/Shared/LoadingBlur";

export default function ForgetPassword() {
  const { mutate: handleForgetPassword, isPending } = useUserForgetPassword();

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    handleForgetPassword(data);
  };

  return (
    <div className="flex items-center justify-center px-4 min-h-[70vh]">
      {isPending && <Loading />}
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
            Forget Password
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Enter your email to reset your password
          </p>
        </motion.div>

        <VForm
          resolver={zodResolver(AuthValidations.forgetPasswordValidationSchema)}
          onSubmit={onSubmit}
        >
          <motion.div
            initial={{ x: 0, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-4"
          >
            <VInput
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your registered email"
            />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col space-y-4"
          >
            <Button
              className="w-full rounded-md font-semibold group"
              size="lg"
              type="submit"
              disabled={isPending}
            >
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                {isPending ? "Sending Reset Link..." : "Reset Password"}
              </motion.span>
            </Button>
          </motion.div>
        </VForm>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-6"
        >
          <p className="">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-accent hover:text-accent/60 font-semibold"
            >
              Back to Login
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
