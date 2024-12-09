import { z } from "zod";

// Comprehensive validation schema
const vendorOnboardingSchema = z.object({
  name: z.string().min(3, "Shop name must be at least 3 characters"),
  description: z
    .string()
    .min(10, "Shop description must be at least 10 characters")
    .max(500, "Description too long"),
  logo: z.string().url("Please upload a valid logo"),
  products: z
    .array(
      z.object({
        name: z.string({ required_error: "Product name is required!" }),
        description: z.string({ required_error: "Description is required!" }),
        price: z
          .number({ required_error: "Price is required!" })
          .min(0, "Price must be a positive number"),
        categoryId: z.string().nullable().optional(),
        vendorId: z.string({ required_error: "Vendor ID is required!" }),
        inventoryCount: z
          .number({ required_error: "Inventory count is required!" })
          .min(0, "Inventory count must be a non-negative number"),
        discount: z.number().min(0).max(99.99).nullable().optional(),
        isFlashSale: z.boolean().optional(),
        averageRating: z.number().min(0).max(5).optional(),
        images: z
          .array(z.string().url())
          .min(1, "At least one image required")
          .max(5, "Max 5 images"),
      })
    )
    .min(1, "Add at least one product")
    .max(1, "Only one product allowed"),
});

export const VendorValidations = {
  vendorOnboardingSchema,
};
