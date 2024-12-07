import { z } from "zod";

const loginValidationSchema = z.object({
  email: z.string().trim().email("Please enter a valid email").toLowerCase(),
  password: z
    .string({ required_error: "Please add a Password" })
    .min(1, "Please add a Password")
    .trim(),
});

const forgetPasswordValidationSchema = z.object({
  email: z.string().trim().email("Please enter a valid email").toLowerCase(),
});

export const resetPasswordValidationSchema = z
  .object({
    newPassword: z
      .string({ required_error: "Please add a Password" })
      .min(1, "Please add a Password")
      .trim(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const AuthValidations = {
  loginValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
};
