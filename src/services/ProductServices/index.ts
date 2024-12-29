/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/AxiosInstance";
import { FieldValues } from "react-hook-form";

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
  vendor?: string;
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
        vendor: options?.vendor || "",
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

export const createProduct = async (payload: FieldValues) => {
  try {
    const { data } = await axiosInstance.post(`/products`, payload);
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to create product"
    );
  }
};

export const updateProduct = async (id: string, payload: FieldValues) => {
  try {
    const { data } = await axiosInstance.put(`/products/${id}`, payload);
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to update product"
    );
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const { data } = await axiosInstance.delete(`/products/${id}`);
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to delete product"
    );
  }
};
