"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Store,
  ChevronLeft,
  ChevronRight,
  Search,
  Package,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useVendorList } from "@/hooks/user.hook";
import { Skeleton } from "@/components/ui/skeleton";

interface Vendor {
  id: string;
  userId: string;
  logo: string | null;
  name: string;
  email: string;
  phone: string;
  status: "BLACKLISTED" | "ACTIVE";
  user: {
    createdAt: string;
  };
  _count: {
    products: number;
  };
}

const ShopCardSkeleton = () => {
  return (
    <Card className="h-[200px] p-6">
      <div className="flex items-center space-x-4">
        <Skeleton className="w-16 h-16 rounded-full  animate-pulse" />
        <div className="space-y-3 flex-1">
          <Skeleton className="h-4  rounded animate-pulse w-3/4" />
          <Skeleton className="h-3  rounded animate-pulse w-1/2" />
        </div>
      </div>
      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between items-center">
          <Skeleton className="h-3  rounded animate-pulse w-1/3" />
          <Skeleton className="h-3  rounded animate-pulse w-1/4" />
        </div>
      </div>
    </Card>
  );
};

const ShopCard = ({ shop }: { shop: Vendor }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/shop/${shop.id}`}>
        <Card
          className={`h-full overflow-hidden hover:shadow-xl transition-shadow duration-300 ${
            shop.status === "BLACKLISTED" ? "opacity-75 " : ""
          }`}
        >
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {shop.logo ? (
                  <Image
                    src={shop.logo}
                    alt={shop.name}
                    width={64}
                    height={64}
                    className="rounded-full object-cover ring-2 ring-offset-2 ring-primary/10"
                  />
                ) : (
                  <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center ring-2 ring-offset-2 ring-primary/10">
                    <Store className="w-8 h-8 text-primary/60" />
                  </div>
                )}
              </motion.div>

              <div className="flex-1">
                <h2 className="text-xl font-semibold truncate">{shop.name}</h2>
                <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Joined{" "}
                    {new Date(
                      shop.user?.createdAt || new Date()
                    ).toLocaleDateString()}
                  </span>
                </div>
                {shop.status === "BLACKLISTED" && (
                  <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full mt-2 inline-block">
                    Currently Unavailable
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-primary/60" />
                  <span>Products</span>
                </div>
                <span className="font-semibold bg-primary/5 px-3 py-1 rounded-full">
                  {shop._count?.products || 0}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};

export default function ShopListingPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const limit = 12;

  const {
    data: shopsData,
    isLoading,
    isFetching,
  } = useVendorList({
    page,
    searchTerm: debouncedSearchTerm,
    limit,
  });

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1); // Reset to first page on search
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleNextPage = () => {
    if (shopsData?.meta?.total > page * limit) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold  mb-6">Discover Shops</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <Input
              placeholder="Search shops by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 w-full md:w-1/2 lg:w-1/3"
            />
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {isLoading || isFetching ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {Array.from({ length: limit }).map((_, index) => (
                <ShopCardSkeleton key={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {shopsData?.data?.map((shop: Vendor) => (
                <ShopCard key={shop.id} shop={shop} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0"
        >
          <div className="text-sm text-gray-500">
            Showing page {page} of{" "}
            {Math.ceil((shopsData?.meta?.total || 0) / limit)}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handlePreviousPage}
              disabled={page === 1}
              className="flex items-center"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={handleNextPage}
              disabled={page * limit >= (shopsData?.meta?.total || 0)}
              className="flex items-center"
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
