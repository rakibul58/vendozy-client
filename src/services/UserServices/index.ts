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
    console.log("Called");
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

export const getAllVendors = async (options?: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  name?: string;
  description?: string;
}) => {
  try {
    const { data } = await axiosInstance.get("/users/vendors", {
      params: {
        page: options?.page || 1,
        limit: options?.limit || 5,
        searchTerm: options?.searchTerm,
        sortBy: options?.sortBy,
        sortOrder: options?.sortOrder,
        name: options?.name,
        description: options?.description,
      },
    });
    // console.log(data);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch vendor");
  }
};

export const getAllCustomers = async (options?: {
  page?: number;
  limit?: number;
}) => {
  try {
    const { data } = await axiosInstance.get("/users/customers", {
      params: {
        page: options?.page || 1,
        limit: options?.limit || 5,
      },
    });
    // console.log(data);
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch customers"
    );
  }
};

export const updateVendorStatus = async (id: string) => {
  try {
    const { data } = await axiosInstance.put(
      `/users/toggle-vendor-status/${id}`
    );
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update vendor");
  }
};

export const updateCustomerStatus = async (id: string) => {
  try {
    const { data } = await axiosInstance.put(
      `/users/toggle-customer-status/${id}`
    );
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to update customer"
    );
  }
};
