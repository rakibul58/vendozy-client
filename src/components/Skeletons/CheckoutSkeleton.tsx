import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { motion } from "motion/react";

const CheckoutSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 w-full"
    >
      <CardHeader>
        <Skeleton className="h-8 w-48 rounded-md border-gray-200 dark:border-gray-700 bg-gray-300 dark:bg-gray-700" />
      </CardHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        {/* Order summary skeleton */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-36 rounded-md border-gray-200 dark:border-gray-700 bg-gray-300 dark:bg-gray-700" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-secondary/10 rounded-lg"
                >
                  <Skeleton className="w-16 h-16 rounded-md border-gray-200 dark:border-gray-700 bg-gray-300 dark:bg-gray-700" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4 rounded-md border-gray-200 dark:border-gray-700 bg-gray-300 dark:bg-gray-700" />
                    <Skeleton className="h-3 w-1/2 rounded-md border-gray-200 dark:border-gray-700 bg-gray-300 dark:bg-gray-700" />
                    <Skeleton className="h-3 w-1/4 rounded-md border-gray-200 dark:border-gray-700 bg-gray-300 dark:bg-gray-700" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Coupons Section skeleton */}
          <Card className="mt-6">
            <CardHeader>
              <Skeleton className="h-6 w-36 rounded-md border-gray-200 dark:border-gray-700 bg-gray-300 dark:bg-gray-700" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full rounded-md border-gray-200 dark:border-gray-700 bg-gray-300 dark:bg-gray-700" />
              <Skeleton className="h-4 w-2/3 rounded-md border-gray-200 dark:border-gray-700 bg-gray-300 dark:bg-gray-700" />
            </CardContent>
          </Card>
        </div>

        {/* Payment summary skeleton */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-36 rounded-md border-gray-200 dark:border-gray-700 bg-gray-300 dark:bg-gray-700" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/4 rounded-md border-gray-200 dark:border-gray-700 bg-gray-300 dark:bg-gray-700" />
                  <Skeleton className="h-4 w-1/4 rounded-md border-gray-200 dark:border-gray-700 bg-gray-300 dark:bg-gray-700" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/4 rounded-md border-gray-200 dark:border-gray-700 bg-gray-300 dark:bg-gray-700" />
                  <Skeleton className="h-4 w-1/4 rounded-md border-gray-200 dark:border-gray-700 bg-gray-300 dark:bg-gray-700" />
                </div>
                <Separator />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/4 rounded-md border-gray-200 dark:border-gray-700 bg-gray-300 dark:bg-gray-700" />
                  <Skeleton className="h-4 w-1/4 rounded-md border-gray-200 dark:border-gray-700 bg-gray-300 dark:bg-gray-700" />
                </div>
              </div>
              <Skeleton className="h-12 w-full rounded-md border-gray-200 dark:border-gray-700 bg-gray-300 dark:bg-gray-700" />
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default CheckoutSkeleton;
