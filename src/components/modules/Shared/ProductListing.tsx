/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronUp, Eye, Columns, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useProductList } from "@/hooks/product.hook";
import { useCategoryList } from "@/hooks/category.hook";
import Image from "next/image";
import { ProductSkeleton } from "@/components/Skeletons/ProductCard";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface IProductParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  category?: string;
  maxPrice?: number;
  minPrice?: number;
  isFlashSale?: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: {
    id: string;
    name: string;
  };
  images: string[];
  vendor: {
    name: string;
  };
  [key: string]: any;
}

const ProductListing: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<IProductParams>({
    limit: 8,
    searchTerm: searchParams.get("searchTerm") || undefined,
    category: searchParams.get("category") || undefined,
    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,
    sortBy: searchParams.get("sortBy") || "createdAt",
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
    isFlashSale: searchParams.get("isFlashSale") || "",
  });

  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const { data: categories } = useCategoryList({ limit: 20 });
  const { data, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useProductList(filters);

  const products = data?.pages.flatMap((page) => page.data) || [];

  // Infinite scroll logic
  useEffect(() => {
    const handleScroll = () => {
      if (isFetching || !hasNextPage) return;
      const scrollPosition = window.innerHeight + window.scrollY;
      const bodyHeight = document.body.offsetHeight;
      if (scrollPosition >= bodyHeight - 500) {
        fetchNextPage();
      }

      setShowScrollToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching, hasNextPage, fetchNextPage]);

  // Reset filters
  const resetFilters = () => {
    setFilters({
      limit: 8,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    router.push("/products");
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);
  const [isCompareDialogOpen, setIsCompareDialogOpen] = useState(false);

  const handleCompareSelect = (product: Product) => {
    // Limit to 3 products for comparison
    if (comparedProducts.length >= 3) {
      toast.error("You can only compare up to 3 products.");
      return;
    }

    // Check if product is already selected
    if (comparedProducts.some((p) => p.id === product.id)) {
      toast.warning("This product is already in your comparison.");
      return;
    }

    // Check category consistency
    if (
      comparedProducts.length > 0 &&
      comparedProducts[0].category?.id !== product.category?.id
    ) {
      toast.error("You can only compare products from the same category.");
      return;
    }

    const updatedComparedProducts = [...comparedProducts, product];
    setComparedProducts(updatedComparedProducts);

    toast.success("Added to comparison list!");

    // Open compare dialog if 2 or more products are selected
    if (updatedComparedProducts.length >= 2) {
      setIsCompareDialogOpen(true);
    }
  };

  const handleProductDetails = (product: Product) => {
    router.push(`/products/${product.id}`);
  };

  // Comparison table columns
  const comparisonColumns = [
    { key: "name", label: "Product Name" },
    { key: "price", label: "Price" },
    { key: "category.name", label: "Category" },
    { key: "vendor.name", label: "Vendor" },
  ];

  return (
    <div className="pb-10">
      {/* Filters Section */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Product Filters
            <Button variant="outline" size="sm" onClick={resetFilters}>
              Clear Filters
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search products..."
            value={filters.searchTerm || ""}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                searchTerm: e.target.value,
              }))
            }
          />

          <Select
            value={filters.category || ""}
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                category: value || undefined,
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">All Categories</SelectItem>
              {categories?.data?.map((cat: { name: string; id: string }) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice || ""}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  minPrice: Number(e.target.value) || undefined,
                }))
              }
            />
            <Input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice || ""}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  maxPrice: Number(e.target.value) || undefined,
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Product Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        <AnimatePresence>
          {products.map((product) => (
            <motion.div
              key={product.id}
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
              className="relative group"
            >
              <Card className="overflow-hidden transition-all duration-300">
                <CardContent className="p-4 relative">
                  {/* Hover Action Buttons */}
                  <div className="absolute top-2 right-2 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleCompareSelect(product)}
                      className="bg-accent/80 hover:bg-accent"
                    >
                      <Columns className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleProductDetails(product)}
                      className="bg-accent/80 hover:bg-accent"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>

                  <Image
                    src={product?.images[0] || "/placeholder-image.png"}
                    alt={product?.name}
                    height={200}
                    width={200}
                    className="w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-110"
                  />

                  <div className="mt-4">
                    <h3 className="mt-2 font-semibold text-lg">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground">
                      {product.vendor.name}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold text-primary">
                        ${product.price}
                      </span>
                      {product.isFlashSale && (
                        <Badge variant="destructive">Flash Sale</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {isFetching &&
            Array.from({ length: 4 }).map((_, idx) => (
              <ProductSkeleton key={idx} />
            ))}
        </AnimatePresence>
      </motion.div>

      {/* No Products Message */}
      {!isLoading && !isFetching && products.length === 0 && (
        <div className="text-center py-4">No products found.</div>
      )}

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <Button
          className="fixed bottom-5 right-5"
          size="icon"
          onClick={scrollToTop}
        >
          <ChevronUp size={24} />
        </Button>
      )}

      <Dialog open={isCompareDialogOpen} onOpenChange={setIsCompareDialogOpen}>
        <DialogContent className="max-w-6xl w-full">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Product Comparison
            </DialogTitle>
            <DialogDescription>
              Compare selected products side by side
            </DialogDescription>
          </DialogHeader>

          {/* Improved Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-card text-card-foreground shadow-md rounded-lg overflow-hidden">
              <thead className="bg-secondary">
                <tr>
                  <th className="p-3 text-left text-xs font-medium text-secondary-foreground uppercase tracking-wider">
                    Attribute
                  </th>
                  {comparedProducts.map((product, index) => (
                    <th
                      key={product.id}
                      className="p-3 text-center text-xs font-medium text-secondary-foreground uppercase tracking-wider"
                    >
                      Product {index + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {comparisonColumns.map((column) => (
                  <tr
                    key={column.key}
                    className="hover:bg-accent/10 transition-colors"
                  >
                    <td className="p-3 font-semibold text-foreground bg-secondary/30">
                      {column.label}
                    </td>
                    {comparedProducts.map((product) => {
                      const value = column.key
                        .split(".")
                        .reduce((obj, key) => obj && obj[key], product as any);
                      return (
                        <td
                          key={product.id}
                          className="p-3 text-center text-foreground"
                        >
                          {column.label === "Price" && "$"}
                          {value ?? "N/A"}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                {/* Image Row */}
                <tr className="hover:bg-accent/10 transition-colors">
                  <td className="p-3 font-semibold text-foreground bg-secondary/30">
                    Image
                  </td>
                  {comparedProducts.map((product) => (
                    <td key={product.id} className="p-3 text-center">
                      <Image
                        src={product?.images[0] || "/placeholder-image.png"}
                        alt={product.name}
                        width={150}
                        height={150}
                        className="mx-auto object-cover rounded-md shadow-sm"
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setComparedProducts([]);
                setIsCompareDialogOpen(false);
              }}
            >
              Clear Comparison
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Comparison Selection Bar */}
      <AnimatePresence>
        {comparedProducts.length >= 1 && (
          <motion.div
            initial={{ opacity: 0, translateY: 100 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: 100 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-md z-50"
          >
            <div className="bg-card border shadow-lg rounded-lg p-4 flex items-start justify-between">
              <div className="flex items-center justify-start flex-wrap gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  {comparedProducts.length} Product
                  {comparedProducts.length > 1 ? "s" : ""} Selected
                </span>
                {comparedProducts.map((product) => (
                  <Badge
                    key={product.id}
                    variant="secondary"
                    className="flex items-center"
                  >
                    {product.name}
                    <X
                      className="ml-2 h-3 w-3 cursor-pointer text-muted-foreground hover:text-destructive"
                      onClick={() => {
                        setComparedProducts(
                          comparedProducts.filter((p) => p.id !== product.id)
                        );
                      }}
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setComparedProducts([]);
                    setIsCompareDialogOpen(false);
                  }}
                >
                  Clear
                </Button>
                <Button size="sm" onClick={() => setIsCompareDialogOpen(true)}>
                  Compare
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductListing;
