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
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, MessageSquare } from "lucide-react";
import Image from "next/image";
import { useAdminReviewList } from "@/hooks/order.hook";
import { Skeleton } from "@/components/ui/skeleton";

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

const StarDisplay: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex space-x-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        className={`w-4 h-4 ${
          star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ))}
  </div>
);

const LoadingTableRows: React.FC = () => (
  <>
    {[1, 2, 3].map((index) => (
      <TableRow key={index}>
        {Array(7)
          .fill(0)
          .map((_, cellIndex) => (
            <TableCell key={cellIndex}>
              <Skeleton className="h-4 w-full rounded" />
            </TableCell>
          ))}
      </TableRow>
    ))}
  </>
);

const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <MessageSquare className="w-16 h-16 mb-4 text-gray-400" />
    <h3 className="text-xl font-semibold mb-2">No Reviews Yet</h3>
    <p className="text-center mb-6 max-w-sm text-gray-600">
      You haven&apos;t received any reviews yet. Reviews will appear here when
      customers rate your products.
    </p>
  </div>
);

const MobileReviewCard: React.FC<{ review: Review }> = ({ review }) => {
  const hasReply = review.replies.length > 0;
  const latestReply = hasReply ? review.replies[0] : null;

  return (
    <div className="border rounded-lg p-4 mb-4 shadow-sm bg-white">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <div className="relative w-8 h-8">
            <Image
              src={review.customer.profileImg}
              alt={review.customer.name}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <span className="font-medium">{review.customer.name}</span>
        </div>
        <span className="text-sm text-gray-600">
          {new Date(review.createdAt).toLocaleDateString()}
        </span>
      </div>
      <div className="flex items-center space-x-2 mb-3">
        <div className="relative w-10 h-10">
          <Image
            src={review.product.images[0]}
            alt={review.product.name}
            fill
            className="rounded-md object-cover"
          />
        </div>
        <div>
          <div className="font-medium mb-1">{review.product.name}</div>
          <StarDisplay rating={review.rating} />
        </div>
      </div>
      <p className="mb-3 text-sm">{review.comment}</p>
      {hasReply ? (
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-gray-600 mb-1">
            Replied on{" "}
            {latestReply
              ? new Date(latestReply.createdAt).toLocaleDateString()
              : ""}
          </p>
          <p className="text-sm">{latestReply ? latestReply.comment : ""}</p>
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">Yet to Reply</p>
      )}
    </div>
  );
};

const ITEMS_PER_PAGE = 10;

const AdminReviewsPage: React.FC = () => {
  const [page, setPage] = useState(1);

  const {
    data: reviewsData,
    isLoading,
    isFetching,
    error,
  } = useAdminReviewList({ page });

  const totalPages = Math.ceil(
    (reviewsData?.meta?.total || 0) /
      (reviewsData?.meta?.pageSize || ITEMS_PER_PAGE)
  );

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

  const isLoadingState = isLoading || isFetching;

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-6">Customer Reviews</h1>

      {isLoadingState ? (
        <>
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-32">Date</TableHead>
                  <TableHead className="w-48">Customer</TableHead>
                  <TableHead className="w-64">Product</TableHead>
                  <TableHead className="w-32">Rating</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead>Reply</TableHead>
                  <TableHead className="w-32">Replied At</TableHead>
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
                <Skeleton className="h-16 w-full rounded mb-3" />
                <Skeleton className="h-12 w-full rounded mb-3" />
                <Skeleton className="h-8 w-full rounded" />
              </div>
            ))}
          </div>
        </>
      ) : !reviewsData?.data || reviewsData.data.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-32">Date</TableHead>
                  <TableHead className="w-48">Customer</TableHead>
                  <TableHead className="w-64">Product</TableHead>
                  <TableHead className="w-32">Rating</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead>Reply</TableHead>
                  <TableHead className="w-32">Replied At</TableHead>
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
                        <div className="relative w-8 h-8">
                          <Image
                            src={review.customer.profileImg}
                            alt={review.customer.name}
                            fill
                            className="rounded-full object-cover"
                          />
                        </div>
                        <span>{review.customer.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="relative w-10 h-10">
                          <Image
                            src={review.product.images[0]}
                            alt={review.product.name}
                            fill
                            className="rounded-md object-cover"
                          />
                        </div>
                        <span className="line-clamp-2">
                          {review.product.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StarDisplay rating={review.rating} />
                    </TableCell>
                    <TableCell>
                      <p className="max-w-xs line-clamp-2">{review.comment}</p>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="line-clamp-2">
                        {review.replies[0]?.comment || "No reply yet"}
                      </p>
                    </TableCell>
                    <TableCell>
                      {review.replies[0]?.createdAt
                        ? new Date(
                            review.replies[0].createdAt
                          ).toLocaleDateString()
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="md:hidden space-y-4">
            {reviewsData.data.map((review: Review) => (
              <MobileReviewCard key={review.id} review={review} />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
            <div className="text-sm text-gray-600 order-2 sm:order-1">
              Page {page} of {totalPages}
            </div>
            <div className="flex space-x-2 w-full sm:w-auto order-1 sm:order-2">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isLoadingState}
                className="flex-1 sm:flex-none"
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages || isLoadingState}
                className="flex-1 sm:flex-none"
              >
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminReviewsPage;
