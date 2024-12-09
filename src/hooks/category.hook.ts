"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FieldValues } from "react-hook-form";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "@/services/CategoryServices";

// Hook for fetching categories
export const useCategoryList = (options?: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  return useQuery({
    queryKey: ["categories", options],
    queryFn: () => getAllCategories(options),
  });
};

// Hook for fetching a single category
export const useCategoryDetail = (id: string) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategoryById(id),
    enabled: !!id,
  });
};

// Hook for creating a category
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: (data) => {
      // Invalidate and refetch categories list
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created successfully");
      return data;
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create category");
    },
  });
};

// Hook for updating a category
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FieldValues }) =>
      updateCategory(id, data),
    onSuccess: (data) => {
      // Invalidate specific category and categories list
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category", data.data.id] });
      toast.success("Category updated successfully");
      return data;
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update category");
    },
  });
};

// Hook for deleting a category
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      // Invalidate categories list
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete category");
    },
  });
};
