/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/AxiosInstance";

export const getAllProducts = async (options?: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  category?: string;
  maxPrice?: number;
  minPrice?: number;
  isFlashSale?: string;
}) => {
  try {
    // console.log({options});
    const { data } = await axiosInstance.get("/products", {
      params: {
        page: options?.page || 1,
        limit: options?.limit || 8,
        searchTerm: options?.searchTerm,
        sortBy: options?.sortBy,
        sortOrder: options?.sortOrder,
        category: options?.category,
        maxPrice: options?.maxPrice,
        minPrice: options?.minPrice,
        isFlashSale: options?.isFlashSale,
      },
    });
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch products"
    );
  }
};

export const getRecentViewProducts = async () => {
  try {
    const { data } = await axiosInstance.get(`/products/recent-view`);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch product");
  }
};

export const getProductById = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`/products/${id}`);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch product");
  }
};
