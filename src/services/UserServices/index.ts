/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"
import axiosInstance from "@/lib/AxiosInstance";

export const getCustomerDashboard = async () => {
  try {
    const { data } = await axiosInstance.get(`/users/customer/dashboard`);
    // console.log(data?.data);
    return data?.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch dashboard");
  }
};
