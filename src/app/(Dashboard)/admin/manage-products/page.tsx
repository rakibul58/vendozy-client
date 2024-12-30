"use client";

import React, { useState } from "react";
import {
  Edit,
  Trash2,
  Copy,
  Loader2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageUploader from "@/components/modules/Shared/imageUploader";
import Loading from "@/components/modules/Shared/LoadingBlur";
import CategoryRow from "@/components/Skeletons/CategoryRow";
import {
  useCreateProduct,
  useDeleteProduct,
  useProductList,
  useUpdateProduct,
} from "@/hooks/product.hook";
import { useCategoryList } from "@/hooks/category.hook";

// Type Definitions
interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  inventoryCount: number;
  images: string[];
  isFlashSale: boolean;
  vendorId: string;
  discount: number;
  category?: Category;
}

// Form Schema
const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be a positive number"),
  categoryId: z.string().min(1, "Category is required"),
  vendorId: z.string(),
  inventoryCount: z
    .number()
    .int()
    .min(0, "Inventory must be a positive number"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  isFlashSale: z.boolean(),
  discount: z.number().min(0).max(99.99).optional().default(0),
});

type FormData = z.infer<typeof productSchema>;

const ITEMS_PER_PAGE = 5;

export default function VendorProductManagement() {
  // State Management
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

 
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const {
    data: productsData,
    isLoading,
    isFetching,
    fetchNextPage,
    fetchPreviousPage,
  } = useProductList({
    searchTerm,
    limit: ITEMS_PER_PAGE,
  });

  const { data: categoryData, isLoading: isCategoryLoading } = useCategoryList({
    limit: 20,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      categoryId: "",
      inventoryCount: 0,
      images: [],
      isFlashSale: false,
      discount: 0,
      vendorId:  "",
    },
  });

  // Derived State
  const products = productsData?.pages[(page || 1) - 1]?.data || [];
  const meta = productsData?.pages[0]?.meta || {
    total: 0,
    limit: ITEMS_PER_PAGE,
  };
  const totalPages = Math.ceil(meta.total / meta.limit);

  const handleOpenDialog = (product: Product | null, duplicate = false) => {
    setSelectedProduct(product);
    setIsDuplicating(duplicate);

    if (product) {
      const formData = {
        ...product,
        // Convert string values to numbers
        price: Number(product.price),
        inventoryCount: Number(product.inventoryCount),
        discount: Number(product.discount || 0),
        images: product.images || [],
        vendorId: product.vendorId  || "",
      };
      form.reset(formData);
    } else {
      form.reset({
        name: "",
        description: "",
        price: 0,
        categoryId: "",
        inventoryCount: 0,
        images: [],
        isFlashSale: false,
        discount: 0,
        vendorId:  "",
      });
    }

    setIsDialogOpen(true);
  };

  const handleNumberInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "price" | "inventoryCount" | "discount"
  ) => {
    const value = e.target.value;
    const numberValue = parseFloat(value);

    if (value === "") {
      form.setValue(field, 0);
    } else if (!isNaN(numberValue)) {
      form.setValue(field, numberValue);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedProduct(null);
    setIsDuplicating(false);
    form.reset();
  };

  const onSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      if (selectedProduct && !isDuplicating) {
        await updateProduct.mutateAsync({
          id: selectedProduct.id,
          data: formData,
        });
        toast.success("Product updated successfully");
      } else {
        await createProduct.mutateAsync(formData);
        toast.success("Product created successfully");
      }
      handleCloseDialog();
    } catch (error) {
      toast.error("An error occurred while saving the product");
      console.error("Product save error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      await deleteProduct.mutateAsync(productId);
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Failed to delete product");
      console.error("Product delete error:", error);
    }
  };

  // Loading States
  const isPageLoading =
    isLoading ||
    isFetching ||
    createProduct.isPending ||
    updateProduct.isPending ||
    deleteProduct.isPending;

  return (
    <div className="p-6 w-full">
      {isSubmitting && <Loading />}

      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 w-full">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Inventory</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPageLoading ? (
              Array(ITEMS_PER_PAGE)
                .fill(null)
                .map((_, index) => <CategoryRow key={index} />)
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              products.map((product: Product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={64}
                      height={64}
                      className="rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {product.description}
                  </TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>{product.inventoryCount}</TableCell>
                  <TableCell>{product.category?.name || "N/A"}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleOpenDialog(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleOpenDialog(product, true)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500">
          Page {page} of {totalPages || 1}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              setPage((p) => p - 1);
              fetchPreviousPage();
            }}
            disabled={page === 1 || isPageLoading}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setPage((p) => p + 1);
              fetchNextPage();
            }}
            disabled={page >= totalPages || isPageLoading}
          >
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Product Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-4xl h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct
                ? isDuplicating
                  ? "Duplicate Product"
                  : "Edit Product"
                : "Add New Product"}
            </DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto p-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Product Name
                  </label>
                  <Input
                    {...form.register("name")}
                    placeholder="Enter product name"
                  />
                  {form.formState.errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category
                  </label>
                  <select
                    {...form.register("categoryId")}
                    className="w-full px-3 py-2 border rounded-lg"
                    disabled={isCategoryLoading}
                  >
                    <option value="">Select a category</option>
                    {categoryData?.data?.map((cat: Category) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {form.formState.errors.categoryId && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.categoryId.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Price
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    onChange={(e) => handleNumberInput(e, "price")}
                    value={Number(form.watch("price"))}
                    placeholder="Enter price"
                  />
                  {form.formState.errors.price && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.price.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Inventory Count
                  </label>
                  <Input
                    type="number"
                    min="0"
                    onChange={(e) => handleNumberInput(e, "inventoryCount")}
                    value={Number(form.watch("inventoryCount"))}
                    placeholder="Enter inventory count"
                  />
                  {form.formState.errors.inventoryCount && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.inventoryCount.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  {...form.register("description")}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={4}
                  placeholder="Enter product description"
                />
                {form.formState.errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Product Images
                </label>
                <ImageUploader
                  type="product"
                  onImageUpload={(url: string) => {
                    const currentImages = form.getValues("images");
                    form.setValue("images", [...currentImages, url]);
                  }}
                  maxImages={5}
                  existingImages={form.watch("images")}
                  onImageRemove={(imageUrl: string) => {
                    const currentImages = form.getValues("images");
                    form.setValue(
                      "images",
                      currentImages.filter((img) => img !== imageUrl)
                    );
                  }}
                />
                {form.formState.errors.images && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.images.message}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  id="isFlashSale"
                  {...form.register("isFlashSale")}
                  className="h-4 w-4"
                />
                <label htmlFor="isFlashSale" className="text-sm">
                  Is this a Flash Sale?
                </label>
              </div>

              {form.watch("isFlashSale") && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Discount Percentage
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="99.99"
                    onChange={(e) => handleNumberInput(e, "discount")}
                    value={Number(form.watch("discount"))}
                    placeholder="Enter discount percentage"
                  />
                  {form.formState.errors.discount && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.discount.message}
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {selectedProduct
                        ? isDuplicating
                          ? "Duplicating..."
                          : "Updating..."
                        : "Creating..."}
                    </div>
                  ) : selectedProduct ? (
                    isDuplicating ? (
                      "Duplicate Product"
                    ) : (
                      "Update Product"
                    )
                  ) : (
                    "Create Product"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
