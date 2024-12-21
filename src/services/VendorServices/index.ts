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

export const getVendorById = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`/vendors/${id}`);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch vendor");
  }
};

export const getFollowStatus = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`/vendors/${id}/follow-status`);
    return data?.data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: any) {
    return { isFollowing: false };
  }
};

export const followVendor = async (id: string) => {
  try {
    const { data } = await axiosInstance.post(`/vendors/${id}/follow`);
    return data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to follow/unfollow vendor"
    );
  }
};
