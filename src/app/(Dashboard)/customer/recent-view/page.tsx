"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useGetRecentViewProducts } from "@/hooks/product.hook";
import { motion, AnimatePresence } from "motion/react";
import RecentViewsSkeleton from "@/components/Skeletons/RecentView";

interface RecentView {
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    vendor: { name: string };
  };
  viewedAt: Date;
}

export default function RecentViewsPage() {
  const { data, isFetching } = useGetRecentViewProducts();

  if (isFetching) {
    return <RecentViewsSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xl font-bold mb-8 text-foreground"
      >
        Recently Viewed Products
      </motion.h1>

      {data?.data?.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-muted-foreground text-center py-12"
        >
          No recently viewed products
        </motion.p>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          >
            {data?.data?.map((view: RecentView, index: number) => (
              <motion.div
                key={index}
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
                <Link href={`/products/${view.product.id}`} className="block">
                  <Card className="group hover:shadow-xl transition-all duration-300 ease-in-out">
                    <CardContent className="p-4">
                      <div className="relative overflow-hidden rounded-lg mb-4">
                        <Image
                          src={view.product.images[0]}
                          alt={view.product.name}
                          width={250}
                          height={250}
                          className="w-full h-[250px] object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg truncate">
                          {view.product.name}
                        </h3>
                        <p className="text-primary font-bold">
                          ${view.product.price}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Viewed on{" "}
                          {new Date(view.viewedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
