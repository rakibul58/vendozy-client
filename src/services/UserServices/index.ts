/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import axiosInstance from "@/lib/AxiosInstance";

export const getCustomerDashboard = async () => {
  try {
    const { data } = await axiosInstance.get(`/users/customer/dashboard`);
    // console.log(data?.data);
    return data?.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch dashboard"
    );
  }
};

export const getVendorDashboard = async () => {
  try {
    const { data } = await axiosInstance.get(`/users/vendor/dashboard`);
    // console.log(data?.data);
    return data?.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch dashboard"
    );
  }
};

export const getAdminDashboard = async () => {
  try {
    const { data } = await axiosInstance.get(`/users/admin/dashboard`);
    // console.log(data?.data);
    return data?.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch dashboard"
    );
  }
};

export const getNewsletters = async (options?: {
  page?: number;
  limit?: number;
}) => {
  try {
    console.log('Called');
    const { data } = await axiosInstance.get("/users/newsletters", {
      params: {
        page: options?.page || 1,
        limit: options?.limit || 5,
      },
    });
    // console.log(data);
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch newsletters"
    );
  }
};
