"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FieldValues } from "react-hook-form";
import {
  addToCart,
  getCart,
  clearCart,
  removeFromCart,
  updateCart,
} from "@/services/CartServices";

// Hook for fetching cart
export const useCart = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });
};

// Hook for adding to cart
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cartData: FieldValues) => addToCart(cartData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Item added to cart successfully");
      return data;
    },
    onError: (error: Error) => {
      // console.log({error});
      toast.error(error.message || "Failed to add item to cart");
    },
  });
};

// Hook for clearing cart
export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Cart cleared successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to clear cart");
    },
  });
};

// Hook for removing item from cart
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cartItemId: string) => removeFromCart(cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Item removed from cart");
    },
    onError: (error: Error) => {
      console.log({error});
      toast.error(error.message || "Failed to remove item from cart");
    },
  });
};

// Hook for updating cart item
export const useUpdateCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cartItemId, cartData }: { cartItemId: string; cartData: FieldValues }) =>
      updateCart(cartItemId, cartData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Cart updated successfully");
      return data;
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update cart");
    },
  });
};