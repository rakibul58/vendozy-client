import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function ProductDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <div className="relative overflow-hidden rounded-lg shadow-lg mb-4 aspect-square">
            <Skeleton className="w-full h-full bg-gray-300 dark:bg-gray-700" />
          </div>
          <div className="grid grid-cols-4 gap-2 mt-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton
                key={i}
                className="w-full aspect-square rounded-lg bg-gray-300 dark:bg-gray-700"
              />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-8 w-3/4 bg-gray-300 dark:bg-gray-700" />
          <Skeleton className="h-4 w-1/2 bg-gray-300 dark:bg-gray-700" />
          <Skeleton className="h-8 w-1/3 bg-gray-300 dark:bg-gray-700" />
          <Skeleton className="h-20 w-full bg-gray-300 dark:bg-gray-700" />
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Skeleton className="h-12 w-full sm:flex-1 rounded-lg bg-gray-300 dark:bg-gray-700" />
            <Skeleton className="h-12 w-full sm:flex-1 rounded-lg bg-gray-300 dark:bg-gray-700" />
          </div>
          <Separator />
          <div>
            <Skeleton className="h-6 w-1/2 bg-gray-300 dark:bg-gray-700" />
            <Skeleton className="h-6 w-1/3 mt-2 bg-gray-300 dark:bg-gray-700" />
          </div>
        </div>
      </div>
      <section className="mt-12">
        <Skeleton className="h-8 w-1/4 mb-6 bg-gray-300 dark:bg-gray-700" />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-4">
                <Skeleton className="w-full h-48 mb-4 bg-gray-300 dark:bg-gray-700" />
                <Skeleton className="h-6 w-3/4 mb-2 bg-gray-300 dark:bg-gray-700" />
                <Skeleton className="h-4 w-1/2 bg-gray-300 dark:bg-gray-700" />
                <div className="flex justify-between items-center mt-2">
                  <Skeleton className="h-6 w-1/4 bg-gray-300 dark:bg-gray-700" />
                  <Badge className="opacity-50 bg-gray-300 dark:bg-gray-700">
                    <Skeleton className="h-6 w-full bg-gray-300 dark:bg-gray-700" />
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
