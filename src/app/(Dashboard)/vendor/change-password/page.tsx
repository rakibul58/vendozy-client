"use client";

import React from "react";
import { motion } from "motion/react";
import { FieldValues, SubmitHandler } from "react-hook-form";
import VForm from "@/components/form/VForm";
import { Button } from "@/components/ui/button";
import VInput from "@/components/form/VInput";
import { useUserChangePassword } from "@/hooks/auth.hook";
import Loading from "@/components/modules/Shared/LoadingBlur";
import { AuthValidations } from "@/schemas/auth.validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { LockKeyhole } from "lucide-react";

export default function ChangePassword() {
  const { mutate: handleChangePassword, isPending } = useUserChangePassword();

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    handleChangePassword({
      oldPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  return (
    <div className="w-full min-h-screen">
      {isPending && <Loading />}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Security Settings</h1>
            <p className="text-muted-foreground mt-2">
              Manage your account security and password
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Security Info Card */}
            <Card className="lg:col-span-1 flex items-center">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4"
                  >
                    <LockKeyhole className="w-8 h-8 text-primary" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2">
                    Password Security
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Ensure your account stays secure by using a strong password
                    that you don&apos;t use for other websites.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Change Password Form Card */}
            <Card className="lg:col-span-2">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-6">Change Password</h3>
                <VForm
                  resolver={zodResolver(
                    AuthValidations.changePasswordValidationSchema
                  )}
                  onSubmit={onSubmit}
                >
                  <div className="space-y-6">
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <VInput
                        label="Current Password"
                        name="currentPassword"
                        type="password"
                        placeholder="Enter current password"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <VInput
                        label="New Password"
                        name="newPassword"
                        type="password"
                        placeholder="Enter new password"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <VInput
                        label="Confirm New Password"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm new password"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="pt-2"
                    >
                      <Button
                        className="w-full md:w-auto"
                        size="lg"
                        type="submit"
                        disabled={isPending}
                      >
                        {isPending ? "Changing Password..." : "Change Password"}
                      </Button>
                    </motion.div>
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
