import { motion } from 'motion/react';

export default function CartItemSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-center gap-4 p-4 border-b"
    >
      <div className="animate-pulse flex items-center gap-4 w-full">
        {/* Image Skeleton */}
        <div className="w-20 h-20 bg-gray-300 rounded"></div>

        {/* Text Skeleton */}
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>

        {/* Button Skeletons */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div className="w-8 h-8 bg-gray-300 rounded"></div>
          <div className="w-8 h-8 bg-gray-300 rounded"></div>
          <div className="w-8 h-8  rounded-full bg-red-300"></div>
        </div>
  </div>
</motion.div>
  );
}
