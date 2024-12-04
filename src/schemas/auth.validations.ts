import { z } from "zod";

const loginValidationSchema = z.object({
  email: z.string().trim().email("Please enter a valid email").toLowerCase(),
  password: z
    .string({ required_error: "Please add a Password" })
    .min(1, "Please add a Password")
    .trim(),
});

export const AuthValidations = { loginValidationSchema };
