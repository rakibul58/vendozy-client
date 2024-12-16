"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, SubmitHandler } from "react-hook-form";
import VForm from "@/components/form/VForm";
import { Button } from "@/components/ui/button";
import VInput from "@/components/form/VInput";
import { AuthValidations } from "@/schemas/auth.validations";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserLogin } from "@/hooks/auth.hook";
import { useUser } from "@/context/user.provider";
import Loading from "@/components/modules/Shared/LoadingBlur";

export default function Login() {
  const { mutate: handleUserLogin, isPending, isSuccess } = useUserLogin();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, setIsLoading: userLoading } = useUser();

  const redirect = searchParams.get("redirect");

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    handleUserLogin(data);
    userLoading(true);
  };

  useEffect(() => {
    if (!isPending && isSuccess) {
      if (redirect) {
        router.push(redirect);
      } else {
        if (user?.role === "CUSTOMER") {
          router.push("/customer");
        } else if (user?.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/vendor");
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending, isSuccess, userLoading, user]);

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
            Login to Vendozy
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Welcome Back! Let&lsquo;s Get Started
          </p>
        </motion.div>

        <VForm
          resolver={zodResolver(AuthValidations.loginValidationSchema)}
          onSubmit={onSubmit}
        >
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-4"
          >
            <VInput
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email"
            />
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
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
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
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
                {isPending ? "Logging in...." : "Login"}
              </motion.span>
            </Button>

            <div className="flex justify-end">
              <Link
                href="/forget-password"
                className="text-sm text-accent hover:text-accent/60"
              >
                Forgot Password?
              </Link>
            </div>
          </motion.div>
        </VForm>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-6"
        >
          <p className="text-gray-600">
            Don&lsquo;t have an account?{" "}
            <Link
              href="/signup"
              className="text-accent hover:text-accent/60 font-semibold"
            >
              Sign Up
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
