/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/AxiosInstance";
import { FieldValues } from "react-hook-form";

export const createCategory = async (categoryData: FieldValues) => {
  try {
    const { data } = await axiosInstance.post("/categories", categoryData);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create category");
  }
};

export const getAllCategories = async (options?: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  try {
    const { data } = await axiosInstance.get("/categories", {
      params: {
        page: options?.page || 1,
        limit: options?.limit || 5,
        searchTerm: options?.searchTerm,
        sortBy: options?.sortBy,
        sortOrder: options?.sortOrder
      }
    });
    // console.log(data);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch categories");
  }
};

export const getCategoryById = async (id: string) => {
  try {
    const { data } = await axiosInstance.get(`/categories/${id}`);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch category");
  }
};

export const updateCategory = async (id: string, categoryData: FieldValues) => {
  try {
    const { data } = await axiosInstance.put(`/categories/${id}`, categoryData);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update category");
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const { data } = await axiosInstance.delete(`/categories/${id}`);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete category");
  }
};