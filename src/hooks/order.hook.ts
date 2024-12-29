import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addReply,
  addReview,
  getAllCoupons,
  getAllCustomerOrders,
  getAllVendorOrders,
  getAllVendorReviews,
  initiatePayment,
} from "@/services/OrderServices";
import { getCart } from "@/services/CartServices";
import { Coupon } from "@/components/modules/Products/AvailableCoupons";
import { toast } from "sonner";

export interface CheckoutTotals {
  subtotal: number;
  discount: number;
  total: number;
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
interface options {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface Product {
  id: string;
  name: string;
  images: string[];
  discount?: number;
  price: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface CheckoutData {
  items: CartItem[];
  isSingleProduct: boolean;
}

export const useAvailableCoupons = (options: CouponOptions) => {
  return useQuery({
    queryKey: ["coupons", options],
    queryFn: () => getAllCoupons(options),
  });
};

export const useCustomerOrderList = (options: options) => {
  return useQuery({
    queryKey: ["orders", options],
    queryFn: () => getAllCustomerOrders(options),
  });
};

export const useVendorOrderList = (options: options) => {
  return useQuery({
    queryKey: ["orders", options],
    queryFn: () => getAllVendorOrders(options),
  });
};

export const useVendorReviewList = (options: options) => {
  return useQuery({
    queryKey: ["reviews", options],
    queryFn: () => getAllVendorReviews(options),
  });
};

export const useAddReviews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addReview,
    onSuccess: (data) => {
      // Invalidate and refetch categories list
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Review added successfully");
      return data;
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add review");
    },
  });
};

export const useAddReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addReply,
    onSuccess: (data) => {
      // Invalidate and refetch categories list
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Reply added successfully");
      return data;
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add reply");
    },
  });
};

export const useCheckoutData = () => {
  return useQuery<CheckoutData>({
    queryKey: ["checkout"],
    queryFn: async () => {
      const cartData = await getCart();
      return {
        ...cartData,
        isSingleProduct: false,
      };
    },
  });
};

export const useCheckoutProcess = () => {
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState("");

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      return initiatePayment({
        couponCode: appliedCoupon?.code as string,
      });
    },
    onSuccess: (data) => {
      window.location.href = data?.payment_url;
    },
  });

  const handleApplyCoupon = (coupon: Coupon, subtotal: number): void => {
    try {
      setCouponError("");
      if (coupon.minPurchase && subtotal < coupon.minPurchase) {
        throw new Error(
          `Minimum purchase amount of $${coupon.minPurchase} required`
        );
      }
      setAppliedCoupon(coupon);
    } catch (error) {
      if (error instanceof Error) {
        setCouponError(error.message);
      } else {
        setCouponError("An error occurred while applying the coupon");
      }
      setAppliedCoupon(null);
    }
  };

  const calculateTotals = (items: CartItem[] = []): CheckoutTotals => {
    const subtotal = items.reduce((sum, item) => {
      const price = Number(item.price);
      const productDiscount = Number(item.product.discount ?? 0);
      const discountedPrice = price - (price * productDiscount) / 100;
      return sum + discountedPrice * item.quantity;
    }, 0);

    let couponDiscount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.discountType === "PERCENTAGE") {
        couponDiscount = (subtotal * appliedCoupon.discountValue) / 100;
      } else {
        couponDiscount = Math.min(appliedCoupon.discountValue, subtotal);
      }
    }

    return {
      subtotal,
      discount: couponDiscount,
      total: Math.max(0, subtotal - couponDiscount),
    };
  };

  return {
    appliedCoupon,
    couponError,
    checkoutMutation,
    handleApplyCoupon,
    calculateTotals,
    setAppliedCoupon,
    setCouponError,
  };
};
