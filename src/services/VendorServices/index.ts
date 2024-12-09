/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/AxiosInstance";
import { FieldValues } from "react-hook-form";

export const vendorOnboarding = async (vendorData: FieldValues) => {
  try {
    const { data } = await axiosInstance.post(
      "/vendors/onboarding",
      vendorData
    );
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to onboard");
  }
};
