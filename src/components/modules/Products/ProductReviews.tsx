/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, MessageSquare } from "lucide-react";

export interface ReviewReplyType {
  id: string;
  comment: string;
  createdAt: string;
  vendor: {
    name: string;
    logo: string;
  };
}

export interface ReviewType {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  customer: {
    name: string;
    profileImg: string;
  };
  replies: ReviewReplyType[];
}

interface ProductReviewsProps {
  reviews: ReviewType[];
}

const ProductReviews = ({ reviews = [] }: ProductReviewsProps) => {
  const recentReviews = reviews.slice(0, 5);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">Recent Reviews</h3>
      {recentReviews.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground text-center">No reviews yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {recentReviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6 space-y-4">
                {/* Review Content */}
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={review.customer.profileImg}
                      alt={review.customer.name}
                    />
                    <AvatarFallback>
                      {review.customer.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">
                          {review.customer.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "fill-current"
                                    : "stroke-current"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>

                    <p className="mt-2 text-muted-foreground">
                      {review.comment}
                    </p>
                  </div>
                </div>

                {/* Vendor Reply */}
                {review.replies.length > 0 && (
                  <div className="ml-12 pl-4 border-l-2 border-muted">
                    {review.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className="flex items-start gap-4 mt-3"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={reply.vendor.logo}
                            alt={reply.vendor.name}
                          />
                          <AvatarFallback>
                            <MessageSquare className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h5 className="text-sm font-medium">
                              {reply.vendor.name}{" "}
                              <span className="text-muted-foreground">
                                (Vendor)
                              </span>
                            </h5>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(reply.createdAt)}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {reply.comment}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
