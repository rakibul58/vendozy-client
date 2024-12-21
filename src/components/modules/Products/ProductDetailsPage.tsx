"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  ShoppingCart,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useUser } from "@/context/user.provider";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  vendor: { name: string; id: string };
  category: { name: string };
  averageRating: number;
  isFlashSale?: boolean;
}

export default function ProductDetailsPage({
  data,
}: {
  data: { product: Product; relatedProducts: Product[]; reviewCount: number };
}) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { user } = useUser();

  const handleProductDetails = (product: Product) => {
    router.push(`/products/${product.id}`);
  };

  const handleAddToCart = () => {
    toast.success("Product added to cart!", {
      description: `${data?.product?.name} has been added to your cart.`,
      position: "top-right",
    });
  };

  const handleImageChange = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleImageNavigation = (direction: "prev" | "next") => {
    const images = data?.product?.images || [];
    const totalImages = images.length;

    if (direction === "prev") {
      setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
    } else {
      setCurrentImageIndex((prev) => (prev + 1) % totalImages);
    }
  };

  const placeholderImage =
    "https://res.cloudinary.com/dk4zufod5/image/upload/v1724772905/kd9sy8amvzaky9popnfs.jpg";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-lg shadow-lg mb-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="relative w-full aspect-square"
              >
                <Image
                  src={
                    data?.product?.images[currentImageIndex] || placeholderImage
                  }
                  alt={`${data?.product?.name} - ${currentImageIndex + 1}`}
                  fill
                  priority
                  className="object-cover rounded-lg"
                />
              </motion.div>
            </AnimatePresence>

            {/* Image Navigation Buttons */}
            {(data?.product?.images?.length || 0) > 1 && (
              <>
                <button
                  onClick={() => handleImageNavigation("prev")}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full p-2 shadow-md z-10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => handleImageNavigation("next")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full p-2 shadow-md z-10"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Images */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {data?.product?.images
              .slice(0, 4)
              .map((img: string, index: number) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`cursor-pointer rounded-lg overflow-hidden 
                    ${index === currentImageIndex ? "ring-2 ring-primary" : ""}
                  `}
                  onClick={() => handleImageChange(index)}
                >
                  <Image
                    src={img || placeholderImage}
                    alt={`Thumbnail ${index + 1}`}
                    width={150}
                    height={150}
                    className="object-cover w-full h-full"
                  />
                </motion.div>
              ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{data?.product?.name}</h1>
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(data?.product?.averageRating)
                        ? "fill-current"
                        : "stroke-current"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-muted-foreground">
                {data?.product?.averageRating} ({data?.reviewCount} reviews)
              </span>
            </div>
          </div>

          <p className="text-2xl font-semibold text-primary">
            ${data?.product?.price}
          </p>

          <p className="text-muted-foreground">{data?.product?.description}</p>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              size="lg"
              className="w-full sm:flex-1"
              onClick={handleAddToCart}
              disabled={user?.role !== "CUSTOMER"}
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:flex-1">
              Buy Now
            </Button>
          </div>

          <Separator />

          <div>
            <h3 className="text-xl font-semibold mb-2">Vendor Information</h3>
            <Link
              href={`/shop/${data?.product?.vendor.id}`}
              className="text-primary hover:underline"
            >
              {data?.product?.vendor.name}
            </Link>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data?.relatedProducts.map((relProduct: Product) => (
            <motion.div
              key={relProduct.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.12)",
              }}
              transition={{
                duration: 0.3,
                type: "spring",
                stiffness: 300,
              }}
              className="relative group rounded-md"
            >
              <Card className="overflow-hidden transition-all duration-300 h-full">
                <CardContent className="p-4 relative">
                  {/* Hover Action Buttons */}
                  <div className="absolute top-2 right-2 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleProductDetails(relProduct)}
                      className="bg-accent/80 hover:bg-accent"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>

                  <Image
                    src={relProduct?.images[0] || placeholderImage}
                    alt={relProduct?.name}
                    height={200}
                    width={200}
                    className="w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-110"
                  />

                  <div className="mt-4">
                    <h3 className="mt-2 font-semibold text-lg line-clamp-2">
                      {relProduct.name}
                    </h3>
                    <p className="text-muted-foreground line-clamp-1">
                      {relProduct.vendor.name}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold text-primary">
                        ${relProduct.price}
                      </span>
                      {relProduct.isFlashSale && (
                        <Badge variant="destructive">Flash Sale</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
