"use client";

import React from "react";
import { Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useProductList } from "@/hooks/product.hook";
import { ProductSkeleton } from "@/components/Skeletons/ProductCard";
import { Product } from "../Shared/ProductListing";

const TopRatedProducts = () => {
  const router = useRouter();

  const { data, isLoading } = useProductList({
    limit: 4,
    sortBy: "averageRating",
    sortOrder: "desc",
  });

  const topProducts = data?.pages[0]?.data || [];

  if (isLoading) {
    return (
      <div className="w-full py-8 my-20">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Top Rated Products</h2>
            <p className="text-muted-foreground mt-1">
              Our best-rated products by customers
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <ProductSkeleton key={idx} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Top Rated Products</h2>
          <p className="text-muted-foreground mt-1">
            Our best-rated products by customers
          </p>
        </div>
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() =>
            router.push("/products?sortBy=averageRating&sortOrder=desc")
          }
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {topProducts.map((product: Product) => (
          <Card
            key={product.id}
            className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div className="relative">
              <div className="absolute top-3 left-3 z-10">
                <div className="flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded-full">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">
                    {product.averageRating.toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="h-48 overflow-hidden">
                <Image
                  src={product.images[0] || "/placeholder.jpg"}
                  alt={product.name}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            </div>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-primary">
                    {product.vendor.name}
                  </span>
                  <span className="text-lg font-bold">${product.price}</span>
                </div>
                <h3 className="font-semibold text-lg line-clamp-1">
                  {product.name}
                </h3>
                <Button
                  className="w-full mt-2"
                  onClick={() => router.push(`/products/${product.id}`)}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TopRatedProducts;
