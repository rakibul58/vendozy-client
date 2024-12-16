/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion } from "motion/react";
import Image from "next/image";
import { useCategoryList } from "@/hooks/category.hook";

const CategoryList: React.FC = () => {
  const router = useRouter();
  const { data, error, isLoading, isFetching } = useCategoryList({ limit: 100 });

  // Handle category selection
  const handleCategorySelect = (categoryName: string) => {
    // Navigate to products page with category filter
    router.push(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  // Render loading state
  if (isLoading || isFetching) {
    return (
      <Card className="border-0 py-10 px-4 shadow-none">
        <CardHeader>
          <CardTitle>Loading Categories...</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="grid gap-4 animate-pulse"
          >
            {[1].map((_, index) => (
              <div key={index} className="bg-foreground rounded-lg h-36 w-48" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render error state
  if (error) {
    return (
      <Card className="border-0 py-10 px-4 shadow-none">
        <CardHeader>
          <CardTitle>Error Loading Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Failed to fetch categories</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 py-10 px-4 shadow-none">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Browse Categories
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Carousel
          opts={{
            align: "start",
            slidesToScroll: 2,
          }}
          className="w-full"
        >
          <CarouselContent>
            {data?.data?.map((category: any) => (
              <CarouselItem
                key={category.id}
                className="md:basis-1/4 lg:basis-1/5 my-5"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Button
                    variant="outline"
                    className="w-full h-full flex flex-col items-center justify-center p-4 space-y-2"
                    onClick={() => handleCategorySelect(category.name)}
                  >
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        height={100}
                        width={100}
                        className="w-16 h-16 object-cover rounded-full mb-2"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-full mb-2" />
                    )}
                    <span className="text-sm font-medium">{category.name}</span>
                  </Button>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </CardContent>
    </Card>
  );
};

export default CategoryList;
