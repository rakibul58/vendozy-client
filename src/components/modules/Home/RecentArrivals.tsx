"use client";

import React from "react";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useProductList } from "@/hooks/product.hook";
import { ProductSkeleton } from "@/components/Skeletons/ProductCard";
import { AddToCartButton } from "@/components/Cart/AddToCartButton";
import { useUser } from "@/context/user.provider";
import { Product } from "../Shared/ProductListing";

const RecentArrivals = () => {
  const router = useRouter();
  const { user } = useUser();

  const { data, isLoading } = useProductList({
    limit: 4,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const recentProducts = data?.pages[0]?.data || [];

  if (isLoading) {
    return (
      <div className="w-full py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Recent Arrivals</h2>
            <p className="text-muted-foreground mt-1">
              Latest additions to our collection
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
        <div className="flex items-center gap-2">
          <div>
            <h2 className="text-2xl font-bold">Recent Arrivals</h2>
            <p className="text-muted-foreground mt-1">
              Latest additions to our collection
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() =>
            router.push("/products?sortBy=createdAt&sortOrder=desc")
          }
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recentProducts.map((product: Product) => (
          <Card
            key={product.id}
            className="relative group border-0 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg z-10" />

            <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
              <Image
                src={product.images[0] || "/placeholder.jpg"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />

              <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                <Badge className="bg-primary/90 hover:bg-primary">
                  New Arrival
                </Badge>
                {product.isFlashSale && (
                  <Badge
                    variant="destructive"
                    className="bg-destructive/90 hover:bg-destructive"
                  >
                    Flash Sale
                  </Badge>
                )}
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-white/80">
                        {product.vendor.name}
                      </p>
                    </div>
                    <span className="text-xl font-bold">${product.price}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      variant="secondary"
                      onClick={() => router.push(`/products/${product.id}`)}
                    >
                      Details
                    </Button>
                    <AddToCartButton
                      product={product}
                      variant="default"
                      size="default"
                      className="flex-1"
                      disabled={user?.role !== "CUSTOMER"}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add
                    </AddToCartButton>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecentArrivals;
