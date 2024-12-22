/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ImageUploader from "@/components/modules/Shared/imageUploader";
import { VendorValidations } from "@/schemas/vendor.validation";
import { useUser } from "@/context/user.provider";
import { useCategoryList } from "@/hooks/category.hook";
import { useVendorOnboarding } from "@/hooks/vendor.hook";
import { useRouter } from "next/navigation";
import Loading from "@/components/modules/Shared/LoadingBlur";

type VendorOnboardingData = z.infer<
  typeof VendorValidations.vendorOnboardingSchema
>;

export default function VendorOnboardingPage() {
  const router = useRouter();
  const { user, isLoading: userLoading, setIsLoading } = useUser();
  const { data: categoriesData } = useCategoryList({ limit: 10 });
  const [formData, setFormData] = useState<VendorOnboardingData>({
    name: "",
    description: "",
    logo: "",
    products: [
      {
        name: "",
        description: "",
        price: 0,
        images: [],
        categoryId: "",
        inventoryCount: 0,
        vendorId: user?.user?.id || "", // Automatically set vendorId
        isFlashSale: false,
        discount: 0,
      },
    ],
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Update vendorId when user changes
    if (user?.user?.id) {
      updateProduct(0, "vendorId", user?.user?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const updateField = (field: keyof VendorOnboardingData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateProduct = (
    index: number,
    field: keyof VendorOnboardingData["products"][0],
    value: any
  ) => {
    const newProducts = [...formData.products];
    newProducts[index] = {
      ...newProducts[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      products: newProducts,
    }));
  };

  const removeProductImage = (productIndex: number, imageUrl: string) => {
    const updatedProducts = formData.products.map((product, index) =>
      index === productIndex
        ? {
            ...product,
            images: product.images.filter((img) => img !== imageUrl),
          }
        : product
    );

    setFormData((prev) => ({
      ...prev,
      products: updatedProducts,
    }));
  };

  const createMutation = useVendorOnboarding();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setValidationErrors({});

    try {
      // Validate entire form
      // console.log(formData, user);
      VendorValidations.vendorOnboardingSchema.parse(formData);

      const submitData = {
        vendor: {
          name: formData.name,
          logo: formData.logo,
          description: formData.description,
        },
        product: formData.products[0],
      };

      createMutation.mutate(submitData, {
        onSuccess: () => {
          setIsLoading(true);
        },
      });

      // toast.success("Vendor profile created successfully!");
      // Optionally redirect or update state
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Convert Zod errors to a more readable format
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          errors[err.path.join(".")] = err.message;
        });

        setValidationErrors(errors);
        toast.error("Please fix the form errors");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // console.log("object 1");
    if (!createMutation.isPending && createMutation.isSuccess) {
      router.push("/vendor");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createMutation.isPending, createMutation.isSuccess, userLoading, user]);

  return (
    <div className="mx-auto px-4 py-8 w-full">
      {createMutation.isPending && <Loading />}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-8 rounded-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Shop Details Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Shop Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                className={`
                  w-full px-3 py-2 border rounded-md
                  focus:outline-none focus:ring-2
                  ${validationErrors.name ? "border-red-500" : ""}
                `}
                placeholder="Enter your shop name"
              />
              {validationErrors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Shop Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                className={`
                  w-full px-3 py-2 border rounded-md 
                  focus:outline-none focus:ring-2
                  ${validationErrors.description ? "border-red-500" : ""}
                  h-24
                `}
                placeholder="Tell us about your shop"
              />
              {validationErrors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.description}
                </p>
              )}
            </div>
          </div>

          {/* Shop Logo */}
          <div>
            <label className="block text-sm font-medium mb-2">Shop Logo</label>
            <ImageUploader
              type="logo"
              onImageUpload={(url) => {
                updateField("logo", url);
              }}
              maxImages={1}
            />
            {validationErrors.logo && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.logo}
              </p>
            )}
            {formData.logo && (
              <div className="mt-4 flex justify-center">
                <Image
                  src={formData.logo}
                  alt="Shop Logo"
                  width={150}
                  height={150}
                  className="object-contain rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Single Product Section */}
          <div className="border rounded-lg p-6 mb-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={formData.products[0]?.name}
                  onChange={(e) => updateProduct(0, "name", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    validationErrors[`products.0.name`] ? "border-red-500" : ""
                  }`}
                  placeholder="Enter product name"
                />
                {validationErrors[`products.0.name`] && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors[`products.0.name`]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Product Category
                </label>
                <select
                  value={formData.products[0]?.categoryId as string}
                  onChange={(e) =>
                    updateProduct(0, "categoryId", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    validationErrors[`products.0.categoryId`]
                      ? "border-red-500"
                      : ""
                  }`}
                >
                  <option value="">Select a category</option>
                  {categoriesData?.data?.map(
                    (category: { id: string; name: string }) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    )
                  )}
                </select>
                {validationErrors[`products.0.categoryId`] && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors[`products.0.categoryId`]}
                  </p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-4">
              <div>
                <label className="block text-sm font-medium mb-2">Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.products[0].price}
                  onChange={(e) =>
                    updateProduct(0, "price", parseFloat(e.target.value))
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    validationErrors[`products.0.price`] ? "border-red-500" : ""
                  }`}
                  placeholder="Enter price"
                />
                {validationErrors[`products.0.price`] && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors[`products.0.price`]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Inventory Count
                </label>
                <input
                  type="number"
                  value={formData.products[0].inventoryCount}
                  onChange={(e) =>
                    updateProduct(0, "inventoryCount", parseInt(e.target.value))
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    validationErrors[`products.0.inventoryCount`]
                      ? "border-red-500"
                      : ""
                  }`}
                  placeholder="Enter inventory count"
                />
                {validationErrors[`products.0.inventoryCount`] && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors[`products.0.inventoryCount`]}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">
                Product Description
              </label>
              <textarea
                value={formData.products[0].description}
                onChange={(e) =>
                  updateProduct(0, "description", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  validationErrors[`products.0.description`]
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Enter product description"
              />
              {validationErrors[`products.0.description`] && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors[`products.0.description`]}
                </p>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">
                Product Images
              </label>
              <ImageUploader
                type="product"
                onImageUpload={(url) => {
                  const updatedImages = [...formData.products[0].images, url];
                  updateProduct(0, "images", updatedImages);
                }}
                maxImages={5}
                existingImages={formData.products[0].images}
                onImageRemove={(imageUrl) => removeProductImage(0, imageUrl)}
              />
              {validationErrors[`products.0.images`] && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors[`products.0.images`]}
                </p>
              )}
            </div>

            <div className="mt-4 flex items-center space-x-4">
              <input
                type="checkbox"
                id="isFlashSale"
                checked={formData.products[0].isFlashSale}
                onChange={(e) =>
                  updateProduct(0, "isFlashSale", e.target.checked)
                }
                className="h-4 w-4"
              />
              <label htmlFor="isFlashSale" className="text-sm">
                Is this a Flash Sale?
              </label>
            </div>

            {formData.products[0].isFlashSale && (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">
                  Discount Percentage
                </label>
                <input
                  type="number"
                  step="0.01"
                  max="99.99"
                  value={formData.products[0].discount || 0}
                  onChange={(e) =>
                    updateProduct(0, "discount", parseFloat(e.target.value))
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  placeholder="Enter discount percentage"
                />
              </div>
            )}
          </div>

          <div className="flex space-x-4">
            <Button type="submit" disabled={isSubmitting} className=" py-5">
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <span className="mr-2">Submitting...</span>
                  <CheckCircle2 className="animate-pulse" />
                </div>
              ) : (
                "Create Vendor Profile"
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
