import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Shop Header Skeleton */}
      <div className="flex flex-col md:flex-row items-center mb-12 space-y-4 md:space-y-0 md:space-x-8">
        <Skeleton className="w-[150px] h-[150px] rounded-full bg-gray-300 dark:bg-gray-700" />
        <div className="space-y-4 w-full md:w-2/3">
          <Skeleton className="h-10 w-3/4 bg-gray-300 dark:bg-gray-700" />
          <Skeleton className="h-20 w-full bg-gray-300 dark:bg-gray-700" />
          <div className="flex space-x-4">
            <Skeleton className="h-10 w-32 bg-gray-300 dark:bg-gray-700" />
            <Skeleton className="h-10 w-32 bg-gray-300 dark:bg-gray-700" />
          </div>
        </div>
      </div>

      {/* Products Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <Skeleton className="w-full h-48 mb-4 bg-gray-300 dark:bg-gray-700" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-3/4 bg-gray-300 dark:bg-gray-700" />
                <Skeleton className="h-4 w-1/2 bg-gray-300 dark:bg-gray-700" />
                <Skeleton className="h-8 w-full bg-gray-300 dark:bg-gray-700" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
