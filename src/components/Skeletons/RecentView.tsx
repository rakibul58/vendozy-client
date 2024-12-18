import { Skeleton } from "../ui/skeleton";
import { ProductSkeleton } from "./ProductCard";

export default function RecentViewsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 ">
      <Skeleton className="h-10 w-64 mb-8 bg-gray-200 dark:bg-gray-700" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[...Array(5)].map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
