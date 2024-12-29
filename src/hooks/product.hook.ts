import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getRecentViewProducts,
  updateProduct,
} from "@/services/ProductServices";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";

export const useProductList = (options: {
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
  return useInfiniteQuery({
    queryKey: ["products", options],
    queryFn: ({ pageParam = 1 }) =>
      getAllProducts({
        ...options,
        page: pageParam,
        limit: options.limit || 8,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = allPages.length;
      const totalPages = Math.ceil(lastPage.meta.total / (options.limit || 4));
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1, // Define the starting page
  });
};

export const useGetRecentViewProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => getRecentViewProducts(),
  });
};

export const useProductDetail = (id: string) => {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created successfully");
      return data;
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create product");
    },
  });
};

// Hook for updating a category
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FieldValues }) =>
      updateProduct(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products", data.data.id] });
      toast.success("Product updated successfully");
      return data;
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to Product category");
    },
  });
};

// Hook for deleting a category
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete Product");
    },
  });
};
