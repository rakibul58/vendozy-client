/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef } from "react";
import {
  useCategoryList,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/category.hook";
import { useImageUpload } from "@/hooks/imageUpload.hook";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Edit,
  Trash2,
  Copy,
  Plus,
  ImagePlus,
  X,
  Loader2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";
import Loading from "@/components/modules/Shared/LoadingBlur";
import CategoryRow from "@/components/Skeletons/CategoryRow";

interface CategoryFormInputs {
  name: string;
  description?: string;
  image?: string;
}

export default function CategoryManagementPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Ref for file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Queries and Mutations
  const { data: categoriesData, isLoading: isFetchLoading } = useCategoryList({
    page,
    searchTerm,
  });
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  // Image Upload Hook
  const {
    previewUrl,
    isUploading,
    uploadedImageUrl,
    handleImageChange,
    resetImage,
  } = useImageUpload();

  // React Hook Form
  const { register, handleSubmit, reset, setValue } =
    useForm<CategoryFormInputs>();

  // Trigger file input when button is clicked
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Open dialog for create/edit
  const handleOpenDialog = (category?: any) => {
    if (category) {
      // Editing existing category
      setSelectedCategory(category);
      setValue("name", category.name);
      setValue("description", category.description);
      setValue("image", category.image);
      // Reset image upload state
      resetImage();
    } else {
      // Creating new category
      setSelectedCategory(null);
      reset();
      resetImage();
    }
    setIsDialogOpen(true);
  };

  // Submit handler
  const onSubmit: SubmitHandler<CategoryFormInputs> = (formData) => {
    // Use uploaded image URL if available, otherwise use existing image
    const imageToSubmit = uploadedImageUrl || formData.image;

    const submitData = {
      ...formData,
      image: imageToSubmit,
    };

    if (selectedCategory) {
      // Update existing category
      updateMutation.mutate(
        {
          id: selectedCategory.id,
          data: submitData,
        },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            resetImage();
          },
        }
      );
    } else {
      // Create new category
      createMutation.mutate(submitData, {
        onSuccess: () => {
          setIsDialogOpen(false);
          resetImage();
        },
      });
    }
  };

  // Pagination Handlers
  const handleNextPage = () => {
    if (categoriesData?.meta?.total > page * 5) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="p-6">
      {(createMutation.isPending ||
        updateMutation.isPending ||
        deleteMutation.isPending) && <Loading />}

      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3"
        />
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2" /> Add Category
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categoriesData?.data?.map((category: any) => (
            <TableRow key={category.id}>
              <TableCell>
                {category.image && (
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={50}
                    height={50}
                    className="object-cover rounded-md"
                  />
                )}
              </TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.description}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleOpenDialog(category)}
                    disabled={
                      updateMutation.isPending || deleteMutation.isPending
                    }
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteMutation.mutate(category.id)}
                    disabled={
                      updateMutation.isPending || deleteMutation.isPending
                    }
                  >
                    {deleteMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {isFetchLoading && <CategoryRow />}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500">
          Page {page} of {Math.ceil((categoriesData?.meta?.total || 0) / 5)}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handlePreviousPage}
            disabled={page === 1}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <Button
            variant="outline"
            onClick={handleNextPage}
            disabled={page * 5 >= (categoriesData?.meta?.total || 0)}
          >
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              placeholder="Category Name"
              {...register("name", { required: true })}
            />
            <Input
              placeholder="Description (Optional)"
              {...register("description")}
            />

            {/* Image Upload Section */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Category Image
              </label>
              <div className="flex items-center">
                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />

                {/* File Input Trigger Button */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={triggerFileInput}
                >
                  <ImagePlus className="h-4 w-4" />
                  Upload Image
                </Button>

                {/* Preview Section */}
                {(previewUrl || selectedCategory?.image) && (
                  <div className="relative ml-4">
                    <Image
                      src={previewUrl || selectedCategory.image}
                      alt="Category Preview"
                      width={100}
                      height={100}
                      className="object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-0 right-0"
                      onClick={resetImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Optional manual image URL input */}
              <Input placeholder="Or paste image URL" {...register("image")} />
            </div>

            <Button
              type="submit"
              disabled={
                isUploading ||
                createMutation.isPending ||
                updateMutation.isPending
              }
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {selectedCategory ? "Updating..." : "Creating..."}
                </>
              ) : selectedCategory ? (
                "Update Category"
              ) : (
                "Create Category"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
