import clsx from "clsx";
import React from "react";

const Skeleton = ({ className }: { className?: string }) => {
  return (
    <div
      className={clsx(
        "animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md",
        className
      )}
    />
  );
};

export const ProductSkeleton = () => {
  return (
  
        <div
          className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
        >
          {/* Image Placeholder */}
          <Skeleton className="w-full h-48 rounded-md" />

          {/* Text placeholders */}
          <div className="mt-4 space-y-2">
            <Skeleton className="w-3/4 h-4" />
            <Skeleton className="w-1/2 h-4" />
          </div>

          {/* Price and Badge Placeholder */}
          <div className="flex justify-between items-center mt-4">
            <Skeleton className="w-1/4 h-4" />
            <Skeleton className="w-1/5 h-6 rounded" />
          </div>
        </div>
   
  );
};
