/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, ChevronRight, ChevronLeft, Loader2, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import Loading from "@/components/modules/Shared/LoadingBlur";
import { useAddReviews, useCustomerOrderList } from "@/hooks/order.hook";

// Updated interfaces to match the API response
interface Product {
  id: string;
  name: string;
  images: string[];
  averageRating: number;
  Review: any[];
}

interface OrderItem {
  id: string;
  quantity: number;
  price: string;
  order: {
    id: string;
    status: "PAID" | "PENDING";
    createdAt: string;
    vendor: {
      id: string;
      name: string;
      logo?: string;
    };
  };
  product: Product;
}

interface ReviewFormInputs {
  rating: number;
  comment: string;
  productId: string;
}

const StarRating: React.FC<{ rating: number; onRatingChange: (rating: number) => void }> = ({ 
  rating, 
  onRatingChange 
}) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-6 h-6 cursor-pointer ${
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
          onClick={() => onRatingChange(star)}
        />
      ))}
    </div>
  );
};

const EmptyState: React.FC = () => {
  const router = useRouter();
  
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h3>
      <p className="text-gray-500 text-center mb-6 max-w-sm">
        Looks like you haven&apos;t made any orders yet. Start shopping to see your orders here!
      </p>
      <Button onClick={() => router.push("/products")}>
        Start Shopping
      </Button>
    </div>
  );
};

const LoadingTableRows: React.FC = () => (
  <>
    {[1, 2, 3].map((index) => (
      <TableRow key={index}>
        {Array(6).fill(0).map((_, cellIndex) => (
          <TableCell key={cellIndex}>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
);

const OrderListPage: React.FC = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [rating, setRating] = useState(0);

  const { data: ordersData, isLoading: isFetchLoading, error } = useCustomerOrderList({
    page,
  });

  const createReviewMutation = useAddReviews();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ReviewFormInputs>();

  // Group orders by order ID
  const groupedOrders = useMemo(() => {
    if (!ordersData?.data) return new Map();
    
    const orderMap = new Map();
    ordersData.data.forEach((item: OrderItem) => {
      const orderId = item.order.id;
      if (!orderMap.has(orderId)) {
        orderMap.set(orderId, {
          ...item.order,
          items: []
        });
      }
      orderMap.get(orderId).items.push(item);
    });
    return orderMap;
  }, [ordersData?.data]);

  const openReviewDialog = (product: Product) => {
    setSelectedProduct(product);
    setRating(0);
    setIsReviewDialogOpen(true);
  };

  const navigateToProduct = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  const navigateToShop = (vendorId: string) => {
    router.push(`/shop/${vendorId}`);
  };

  const onSubmit: SubmitHandler<ReviewFormInputs> = (formData) => {
    if (!selectedProduct) return;

    const reviewData = {
      ...formData,
      rating,
      productId: selectedProduct.id,
    };

    createReviewMutation.mutate(reviewData, {
      onSuccess: () => {
        setIsReviewDialogOpen(false);
        reset();
        setRating(0);
      },
    });
  };

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        <div className="text-center py-8 text-red-500">
          Error loading orders. Please try again later.
        </div>
      </div>
    );
  }

  if (isFetchLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <LoadingTableRows />
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!ordersData?.data || ordersData.data.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="p-6">
      {createReviewMutation.isPending && <Loading />}
      
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from(groupedOrders.values()).map((order) => (
            <React.Fragment key={order.id}>
              {order.items.map((item: OrderItem, index: number) => (
                <TableRow key={item.id}>
                  {index === 0 && (
                    <>
                      <TableCell rowSpan={order.items.length}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell rowSpan={order.items.length}>
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          order.status === "PAID" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell rowSpan={order.items.length}>
                        <button
                          onClick={() => navigateToShop(order.vendor.id)}
                          className="text-blue-600 hover:underline"
                        >
                          {order.vendor.name}
                        </button>
                      </TableCell>
                    </>
                  )}
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {item.product.images?.[0] && (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          width={40}
                          height={40}
                          className="rounded-md"
                        />
                      )}
                      <button
                        onClick={() => navigateToProduct(item.product.id)}
                        className="text-blue-600 hover:underline"
                      >
                        {item.product.name}
                      </button>
                    </div>
                  </TableCell>
                  <TableCell>${(Number(item.price) * item.quantity).toFixed(2)}</TableCell>
                  <TableCell>
                    {order.status === "PAID" && (!item.product.Review || item.product.Review.length === 0) && (
                      <Button
                        onClick={() => openReviewDialog(item.product)}
                        variant="outline"
                        disabled={createReviewMutation.isPending}
                      >
                        Write Review
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500">
          Page {page} of {Math.ceil((ordersData?.meta?.total || 0) / 10)}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage(p => p + 1)}
            disabled={!ordersData?.meta?.total || page * 10 >= ordersData.meta.total}
          >
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating
              </label>
              <StarRating rating={rating} onRatingChange={setRating} />
              {rating === 0 && (
                <p className="text-sm text-red-500 mt-1">Please select a rating</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Review
              </label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={4}
                {...register("comment", { 
                  required: "Please write a review",
                  minLength: {
                    value: 10,
                    message: "Review must be at least 10 characters long"
                  }
                })}
                placeholder="Write your review here..."
              />
              {errors.comment && (
                <p className="text-sm text-red-500 mt-1">{errors.comment.message}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={createReviewMutation.isPending || rating === 0}
              className="w-full"
            >
              {createReviewMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderListPage;