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

const resetPasswordValidationSchema = z
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

const changePasswordValidationSchema = z
  .object({
    currentPassword: z
      .string({ required_error: "Please add current Password" })
      .min(1, "Please add current Password")
      .trim(),
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

const createVendorValidationSchema = z.object({
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(1, "Please add a password"),
  email: z
    .string({
      required_error: "Email is required!",
    })
    .min(1, "Please add an Email"),
  phone: z
    .string({
      required_error: "Phone numbers is required!",
    })
    .min(1, "Please add phone number"),
});

const createCustomerValidationSchema = z.object({
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(1, "Please add a password"),
  name: z
    .string({
      required_error: "Name is required!",
    })
    .min(1, "Please add your name"),
  email: z
    .string({
      required_error: "Email is required!",
    })
    .min(1, "Please add an email"),
  phone: z
    .string({
      required_error: "Phone numbers is required!",
    })
    .min(1, "Please add a phone number"),
  address: z
    .string({ required_error: "Address is Required!" })
    .min(1, "Please add an address"),
  profileImg: z.string().optional(),
});

export const AuthValidations = {
  loginValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
  createCustomerValidationSchema,
  createVendorValidationSchema,
  changePasswordValidationSchema
};
