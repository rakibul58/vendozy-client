"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { zodResolver } from "@hookform/resolvers/zod";
import VForm from "@/components/form/VForm";
import { Button } from "@/components/ui/button";
import VInput from "@/components/form/VInput";
import { AuthValidations } from "@/schemas/auth.validations";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserLogin } from "@/hooks/auth.hook";
import { useUser } from "@/context/user.provider";
import Loading from "@/components/modules/Shared/LoadingBlur";
import Image from "next/image";
import loginImg from '../../../../public/login.svg'

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const { mutate: handleUserLogin, isPending, isSuccess } = useUserLogin();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, setIsLoading: userLoading } = useUser();
  const [formKey, setFormKey] = useState(0);
  const [defaultValues, setDefaultValues] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const redirect = searchParams.get("redirect");

  const onSubmit = (data: LoginForm) => {
    handleUserLogin(data);
    userLoading(true);
  };

  const setPresetValues = (values: LoginForm) => {
    setDefaultValues(values);
    setFormKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (!isPending && isSuccess) {
      if (redirect) {
        router.push(redirect);
      } else {
        if (user?.role === "CUSTOMER") {
          router.push("/customer/dashboard");
        } else if (user?.role === "ADMIN") {
          router.push("/admin/dashboard");
        } else {
          router.push("/vendor/dashboard");
        }
      }
    }
  }, [isPending, isSuccess, userLoading, user, redirect, router]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 py-8 my-10">
      {isPending && <Loading />}
      
      {/* Left side - Branding/Image */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="lg:w-1/2 flex items-center justify-center p-6 bg-accent/5 rounded-2xl"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6 text-accent">Vendozy Marketplace</h1>
          <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">Connect with trusted vendors and explore quality products</p>
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
              <p className="text-sm text-gray-600 dark:text-gray-400">Vendors</p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <h3 className="font-bold text-accent">5k+</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Products</p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <h3 className="font-bold text-accent">50k+</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Customers</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right side - Login Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md space-y-8"
        >
       
          <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg mb-8">
            <h1 className="text-lg font-bold mb-4">Quick Access Demos</h1>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPresetValues({
                  email: "customer@gmail.com",
                  password: "12345",
                })}
              >
                Customer
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPresetValues({
                  email: "admin@vendozy.com",
                  password: "12345",
                })}
              >
                Admin
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPresetValues({
                  email: "vendor@gmail.com",
                  password: "12345",
                })}
              >
                Vendor
              </Button>
            </div>
          </div>

          <VForm
            key={formKey}
            resolver={zodResolver(AuthValidations.loginValidationSchema)}
            defaultValues={defaultValues}
            onSubmit={onSubmit}
          >
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <VInput
                label="Email Address"
                name="email"
                type="email"
                placeholder="Enter your email"
              />
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <VInput
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
              />
            </motion.div>

            <div className="flex items-center justify-end">
              <Link
                href="/forget-password"
                className="text-sm text-accent hover:text-accent/80 mb-6"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              className="w-full py-6 text-lg font-semibold"
              size="lg"
              type="submit"
            >
              {isPending ? "Signing in..." : "Sign In"}
            </Button>
          </VForm>

          <div className="text-center pt-6 border-t">
            <p className="text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-accent hover:text-accent/80 font-semibold"
              >
                Create Account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}