/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { Coupon } from "@/components/modules/Products/AvailableCoupons";
import axiosInstance from "@/lib/AxiosInstance";
import { FieldValues } from "react-hook-form";

interface CheckoutPayload {
  couponCode?: string;
}

interface CouponOptions {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  validNow?: boolean;
  isActive?: boolean;
}

interface OrderOptions {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const initiatePayment = async (checkoutData: CheckoutPayload) => {
  try {
    const { data } = await axiosInstance.post(
      "/orders/initiate-payment",
      checkoutData
    );

    // console.log({ data });
    return data?.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    // console.log({ error: error });
    throw new Error("Failed to Checkout");
  }
};

export const getAllCoupons = async (options?: CouponOptions) => {
  try {
    const { data } = await axiosInstance.get<{ data: Coupon[] }>("/coupons", {
      params: {
        page: options?.page ?? 1,
        limit: options?.limit ?? 5,
        searchTerm: options?.searchTerm,
        sortBy: options?.sortBy,
        sortOrder: options?.sortOrder,
        validNow: options?.validNow,
        isActive: options?.isActive,
      },
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch coupons");
  }
};

export const getCouponsById = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`/coupons/${id}`);
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch coupon");
  }
};

export const createCoupon = async (payload: FieldValues) => {
  try {
    const { data } = await axiosInstance.post(`/coupons`, payload);
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to create coupon");
  }
};

export const updateCoupons = async (id: string, payload: FieldValues) => {
  try {
    const { data } = await axiosInstance.put(`/coupons/${id}`, payload);
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to update coupon");
  }
};

export const deleteCoupon = async (id: string) => {
  try {
    const { data } = await axiosInstance.delete(`/coupons/${id}`);
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to delete coupon");
  }
};

export const getAllCustomerOrders = async (options?: OrderOptions) => {
  try {
    const { data } = await axiosInstance.get("/orders/customer-orders", {
      params: {
        page: options?.page || 1,
        limit: options?.limit || 10,
        searchTerm: options?.searchTerm,
      },
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch Orders");
  }
};

export const getAllVendorOrders = async (options?: OrderOptions) => {
  try {
    const { data } = await axiosInstance.get("/orders/vendor-orders", {
      params: {
        page: options?.page || 1,
        limit: options?.limit || 10,
      },
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch Orders");
  }
};

export const getAllVendorReviews = async (options?: OrderOptions) => {
  try {
    const { data } = await axiosInstance.get("/orders/vendor-reviews", {
      params: {
        page: options?.page || 1,
        limit: options?.limit || 10,
      },
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch Reviews");
  }
};

export const addReview = async (reviewData: FieldValues) => {
  try {
    const { data } = await axiosInstance.post("/orders/add-review", reviewData);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to add review");
  }
};

export const addReply = async (reviewData: FieldValues) => {
  try {
    const { data } = await axiosInstance.post("/orders/add-reply", reviewData);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to add reply");
  }
};
