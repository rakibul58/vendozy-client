"use client";

import React, { useState } from "react";
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
import {
  ChevronRight,
  ChevronLeft,
  Loader2,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import Loading from "@/components/modules/Shared/LoadingBlur";
import { useAddReply, useVendorReviewList } from "@/hooks/order.hook";
import { Skeleton } from "@/components/ui/skeleton";

interface ReviewReplyInputs {
  comment: string;
  reviewId: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  customer: {
    name: string;
    profileImg: string;
  };
  product: {
    name: string;
    images: string[];
  };
  replies: Array<{
    id: string;
    comment: string;
    createdAt: string;
  }>;
}

const StarDisplay: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? "text-yellow-400 fill-yellow-400" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
};

const LoadingTableRows: React.FC = () => (
  <>
    {[1, 2, 3].map((index) => (
      <TableRow key={index}>
        {Array(6)
          .fill(0)
          .map((_, cellIndex) => (
            <TableCell key={cellIndex}>
              <Skeleton className="h-4 rounded animate-pulse w-24"></Skeleton>
            </TableCell>
          ))}
      </TableRow>
    ))}
  </>
);

const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <MessageSquare className="w-16 h-16 mb-4" />
    <h3 className="text-xl font-semibold mb-2">No Reviews Yet</h3>
    <p className="text-center mb-6 max-w-sm">
      You haven&apos;t received any reviews yet. Reviews will appear here when
      customers rate your products.
    </p>
  </div>
);

const MobileReviewCard: React.FC<{
  review: Review;
  onReplyClick: () => void;
}> = ({ review, onReplyClick }) => (
  <div className="border rounded-lg p-4 mb-4  shadow-sm">
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center space-x-2">
        <Image
          src={review.customer.profileImg}
          alt={review.customer.name}
          width={32}
          height={32}
          className="rounded-full"
        />
        <span className="font-medium">{review.customer.name}</span>
      </div>
      <span className="text-sm">
        {new Date(review.createdAt).toLocaleDateString()}
      </span>
    </div>
    <div className="flex items-center space-x-2 mb-3">
      <Image
        src={review.product.images[0]}
        alt={review.product.name}
        width={40}
        height={40}
        className="rounded-md"
      />
      <div>
        <div className="font-medium mb-1">{review.product.name}</div>
        <StarDisplay rating={review.rating} />
      </div>
    </div>
    <p className="mb-3 text-sm">{review.comment}</p>
    {review.replies.length === 0 ? (
      <Button
        onClick={onReplyClick}
        variant="outline"
        size="sm"
        className="w-full"
      >
        Reply
      </Button>
    ) : (
      <p className="text-sm italic">
        Replied on {new Date(review.replies[0].createdAt).toLocaleDateString()}
      </p>
    )}
  </div>
);

const VendorReviewsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addReply = useAddReply();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewReplyInputs>();

  const {
    data: reviewsData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useVendorReviewList({ page });

  const openReplyDialog = (review: Review) => {
    setSelectedReview(review);
    setIsReplyDialogOpen(true);
  };

  const onSubmitReply: SubmitHandler<ReviewReplyInputs> = (formData) => {
    if (!selectedReview) return;

    setIsSubmitting(true);
    try {
      addReply.mutate({
        reviewId: selectedReview.id,
        comment: formData.comment,
      });
      setIsReplyDialogOpen(false);
      reset();
      refetch();
    } catch (error) {
      console.error("Error submitting reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold mb-6">Customer Reviews</h1>
        <div className="text-center py-8 text-red-500">
          Error loading reviews. Please try again later.
        </div>
      </div>
    );
  }

  if (isLoading || isFetching) {
    return (
      <div className="p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold mb-6">Customer Reviews</h1>
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Review</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <LoadingTableRows />
            </TableBody>
          </Table>
        </div>
        <div className="md:hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4 mb-4">
              <Skeleton className="h-16 rounded mb-3" />
              <Skeleton className="h-12 rounded mb-3" />
              <Skeleton className="h-8 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!reviewsData?.data || reviewsData.data.length === 0) {
    return (
      <div className="p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold mb-6">Customer Reviews</h1>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {isSubmitting && <Loading />}

      <h1 className="text-xl md:text-2xl font-bold mb-6">Customer Reviews</h1>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Review</TableHead>
              <TableHead>Reply</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviewsData.data.map((review: Review) => (
              <TableRow key={review.id}>
                <TableCell>
                  {new Date(review.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Image
                      src={review.customer.profileImg}
                      alt={review.customer.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span>{review.customer.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Image
                      src={review.product.images[0]}
                      alt={review.product.name}
                      width={40}
                      height={40}
                      className="rounded-md"
                    />
                    <span className="line-clamp-2">{review.product.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <StarDisplay rating={review.rating} />
                </TableCell>
                <TableCell>
                  <p className="max-w-xs line-clamp-2">{review.comment}</p>
                </TableCell>
                <TableCell>
                  {review.replies.length === 0 ? (
                    <Button
                      onClick={() => openReplyDialog(review)}
                      variant="outline"
                      size="sm"
                    >
                      Reply
                    </Button>
                  ) : (
                    <p className="text-sm italic">
                      Replied on{" "}
                      {new Date(
                        review.replies[0].createdAt
                      ).toLocaleDateString()}
                    </p>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        {reviewsData.data.map((review: Review) => (
          <MobileReviewCard
            key={review.id}
            review={review}
            onReplyClick={() => openReplyDialog(review)}
          />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
        <div className="text-sm order-2 sm:order-1">
          Page {page} of {Math.ceil((reviewsData?.meta?.total || 0) / 10)}
        </div>
        <div className="flex space-x-2 w-full sm:w-auto order-1 sm:order-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex-1 sm:flex-none"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={
              !reviewsData?.meta?.total || page * 10 >= reviewsData.meta.total
            }
            className="flex-1 sm:flex-none"
          >
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent className="mx-4 md:mx-auto max-w-lg">
          <DialogHeader>
            <DialogTitle>Reply to Review</DialogTitle>
          </DialogHeader>
          <div className="mb-4 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Image
                  src={selectedReview?.customer.profileImg || ""}
                  alt={selectedReview?.customer.name || ""}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span className="font-medium">
                  {selectedReview?.customer.name}
                </span>
              </div>
              <StarDisplay rating={selectedReview?.rating || 0} />
            </div>
            <p>{selectedReview?.comment}</p>
          </div>
          <form onSubmit={handleSubmit(onSubmitReply)} className="space-y-4">
            <div>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={4}
                {...register("comment", {
                  required: "Please write a reply",
                  minLength: {
                    value: 10,
                    message: "Reply must be at least 10 characters long",
                  },
                })}
                placeholder="Write your reply here..."
              />
              {errors.comment && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.comment.message}
                </p>
              )}
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Reply"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorReviewsPage;
