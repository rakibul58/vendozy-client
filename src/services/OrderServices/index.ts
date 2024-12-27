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

export const addReview = async (reviewData: FieldValues) => {
  try {
    const { data } = await axiosInstance.post("/orders/add-review", reviewData);
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to add review"
    );
  }
};
