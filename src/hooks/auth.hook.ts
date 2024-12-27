/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldValues } from "react-hook-form";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  changePassword,
  forgetPassword,
  loginUser,
  registerCustomer,
  registerVendor,
  resetPassword,
  updateCustomer,
} from "@/services/AuthServices";
import { toast } from "sonner";

export const useUserLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, FieldValues>({
    mutationKey: ["USER_LOGIN"],
    mutationFn: async (userData) => await loginUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("User login successful.");
    },
    onError: (error) => {
      toast.error("Login Failed. Please Provide Valid Email and Password.");
    },
  });
};

export const useCustomerRegistration = () => {
  return useMutation<any, Error, FieldValues>({
    mutationKey: ["CUSTOMER_REGISTRATION"],
    mutationFn: async (userData) => await registerCustomer(userData),
    onSuccess: () => {
      toast.success("User Registration successful.");
    },
    onError: (error) => {
      toast.error("Registration Failed. Please Provide Valid Information.");
    },
  });
};

export const useVendorRegistration = () => {
  return useMutation<any, Error, FieldValues>({
    mutationKey: ["VENDOR_REGISTRATION"],
    mutationFn: async (userData) => await registerVendor(userData),
    onSuccess: () => {
      toast.success("User Registration successful.");
    },
    onError: (error) => {
      toast.error("Registration Failed. Please Provide Valid Information.");
    },
  });
};

export const useUserForgetPassword = () => {
  return useMutation<any, Error, FieldValues>({
    mutationKey: ["USER_FORGET_PASSWORD"],
    mutationFn: async (payload) => await forgetPassword(payload),
    onSuccess: () => {
      toast.success("Reset Password Link sent successfully.");
    },
    onError: (error) => {
      toast.error("Something went wrong.");
    },
  });
};

export const useUserResetPassword = () => {
  return useMutation<any, Error, FieldValues>({
    mutationKey: ["USER_RESET_PASSWORD"],
    mutationFn: async (payload) => await resetPassword(payload),
    onSuccess: () => {
      toast.success("Password reset successfully.");
    },
    onError: (error) => {
      toast.error("Something went wrong.");
    },
  });
};

export const useUserChangePassword = () => {
  return useMutation<any, Error, FieldValues>({
    mutationKey: ["USER_CHANGE_PASSWORD"],
    mutationFn: async (payload) => await changePassword(payload),
    onSuccess: () => {
      toast.success("Password changed successfully.");
    },
    onError: (error) => {
      toast.error("Provide correct password.");
    },
  });
};

export const useUpdateCustomer = () => {
  return useMutation<any, Error, FieldValues>({
    mutationKey: ["UPDATE_PASSWORD"],
    mutationFn: async (payload) => await updateCustomer(payload),
    onSuccess: () => {
      toast.success("Customer Updated successfully.");
    },
    onError: (error) => {
      toast.error("Failed to Update Customer.");
    },
  });
};