import { getAllProducts, getProductById } from "@/services/ProductServices";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const useProductList = (options: {
  limit?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  category?: string;
  maxPrice?: number;
  minPrice?: number;
  isFlashSale?: string;
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

export const useProductDetail = (id: string) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
};
