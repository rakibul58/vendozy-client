/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Edit,
  Trash2,
  Plus,
  Loader2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import Loading from "@/components/modules/Shared/LoadingBlur";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAvailableCoupons,
  useCreateCoupon,
  useDeleteCoupon,
  useUpdateCoupon,
} from "@/hooks/order.hook";
import { toast } from "sonner";

// Types
type DiscountType = "PERCENTAGE" | "FIXED_AMOUNT";

interface BaseCoupon {
  id: string;
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: string;
  startDate: string;
  endDate: string;
  minPurchase: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

type CouponFormInputs = Omit<BaseCoupon, "id" | "createdAt" | "updatedAt">;

interface CouponsResponse {
  success: boolean;
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  data: BaseCoupon[];
}

interface MutationError {
  message: string;
}

const CouponRowSkeleton: React.FC = () => {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-32" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-16 rounded-full" />
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </TableCell>
    </TableRow>
  );
};

const CouponManagementPage: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCoupon, setSelectedCoupon] = useState<BaseCoupon | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const createMutation = useCreateCoupon();
  const updateMutation = useUpdateCoupon();
  const deleteMutation = useDeleteCoupon();

  const {
    data: couponsData,
    isFetching,
    isLoading,
  } = useAvailableCoupons({
    page,
    limit: 5,
    searchTerm,
  });

  const { register, handleSubmit, reset, setValue, watch } =
    useForm<CouponFormInputs>({
      defaultValues: {
        isActive: true,
        discountType: "PERCENTAGE",
      },
    });

  const formatDateForAPI = (dateString: string): string => {
    // Converts YYYY-MM-DD to ISO-8601 DateTime format
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    return date.toISOString();
  };

  const onSubmit: SubmitHandler<CouponFormInputs> = async (formData) => {
    try {
      // Format dates for API
      const formattedData = {
        ...formData,
        startDate: formatDateForAPI(formData.startDate),
        endDate: formatDateForAPI(formData.endDate),
        // Ensure discountValue and minPurchase are numbers
        discountValue: Number(formData.discountValue),
        minPurchase: formData.minPurchase ? Number(formData.minPurchase) : null,
      };

      if (selectedCoupon) {
        await updateMutation.mutateAsync({
          id: selectedCoupon.id,
          data: formattedData,
        });
        toast.success("Coupon updated successfully");
      } else {
        await createMutation.mutateAsync(formattedData);
        toast.success("Coupon created successfully");
      }
      setIsDialogOpen(false);
    } catch (error) {
      const err = error as MutationError;
      toast.error(err.message || "An error occurred. Please try again.");
    }
  };

  const handleOpenDialog = (coupon?: BaseCoupon): void => {
    if (coupon) {
      setSelectedCoupon(coupon);
      const { id, createdAt, updatedAt, ...couponWithoutId } = coupon;
      // Convert ISO dates to YYYY-MM-DD format for input fields
      const formattedStartDate = new Date(couponWithoutId.startDate)
        .toISOString()
        .split("T")[0];
      const formattedEndDate = new Date(couponWithoutId.endDate)
        .toISOString()
        .split("T")[0];

      Object.entries({
        ...couponWithoutId,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        // Convert string values to numbers for the form
        discountValue: String(couponWithoutId.discountValue),
        minPurchase: couponWithoutId.minPurchase
          ? String(couponWithoutId.minPurchase)
          : "",
      }).forEach(([key, value]) => {
        setValue(key as keyof CouponFormInputs, value);
      });
    } else {
      setSelectedCoupon(null);
      reset({
        isActive: true,
        discountType: "PERCENTAGE",
        discountValue: "",
        minPurchase: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      });
    }
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    try {
      deleteMutation.mutate(id);
      //       toast.success("Coupon deleted successfully");
    } catch (error) {
      const err = error as MutationError;
      toast.error(err.message || "An error occurred while deleting the coupon");
    }
  };

  const handleNextPage = (): void => {
    if (
      couponsData &&
      page < Math.ceil(couponsData.meta.total / couponsData.meta.limit)
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = (): void => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const discountType = watch("discountType");

  return (
    <div className="p-6">
      {(createMutation.isPending ||
        updateMutation.isPending ||
        deleteMutation.isPending) && <Loading />}

      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search coupons..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
          className="w-1/3"
        />
        <Button
          onClick={() => handleOpenDialog()}
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          <Plus className="mr-2" /> Add Coupon
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Valid Period</TableHead>
            <TableHead>Min Purchase</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        {isFetching || isLoading ? (
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <CouponRowSkeleton key={index} />
            ))}
          </TableBody>
        ) : (
          <TableBody>
            {(couponsData as CouponsResponse)?.data.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell className="font-medium">{coupon.code}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {coupon.description || "-"}
                </TableCell>
                <TableCell>
                  {coupon.discountType === "PERCENTAGE"
                    ? "Percentage"
                    : "Fixed Amount"}
                </TableCell>
                <TableCell>
                  {coupon.discountType === "PERCENTAGE"
                    ? `${coupon.discountValue}%`
                    : `$${coupon.discountValue}`}
                </TableCell>
                <TableCell>
                  {new Date(coupon.startDate).toLocaleDateString()} -{" "}
                  {new Date(coupon.endDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {coupon.minPurchase ? `$${coupon.minPurchase}` : "None"}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      coupon.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {coupon.isActive ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleOpenDialog(coupon)}
                      disabled={
                        updateMutation.isPending || deleteMutation.isPending
                      }
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(coupon.id)}
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
          </TableBody>
        )}
      </Table>

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500">
          Page {page} of{" "}
          {couponsData
            ? Math.ceil(couponsData.meta.total / couponsData.meta.limit)
            : 1}
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
            disabled={
              !couponsData ||
              page >= Math.ceil(couponsData.meta.total / couponsData.meta.limit)
            }
          >
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedCoupon ? "Edit Coupon" : "Add New Coupon"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              placeholder="Coupon Code"
              {...register("code", {
                required: "Coupon code is required",
              })}
            />
            <Input
              placeholder="Description (Optional)"
              {...register("description")}
            />
            <Select
              onValueChange={(value: string) =>
                setValue("discountType", value as DiscountType)
              }
              defaultValue={watch("discountType")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select discount type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                <SelectItem value="FIXED_AMOUNT">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              step={discountType === "PERCENTAGE" ? "1" : "0.01"}
              placeholder="Discount Value"
              {...register("discountValue", {
                required: true,
                min: 0,
                max: discountType === "PERCENTAGE" ? 100 : undefined,
              })}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm">Start Date</label>
                <Input
                  type="date"
                  {...register("startDate", { required: true })}
                />
              </div>
              <div>
                <label className="text-sm">End Date</label>
                <Input
                  type="date"
                  {...register("endDate", { required: true })}
                />
              </div>
            </div>
            <Input
              type="number"
              step="0.01"
              placeholder="Minimum Purchase Amount (Optional)"
              {...register("minPurchase")}
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register("isActive")}
                className="w-4 h-4"
              />
              <label className="text-sm">Active</label>
            </div>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {selectedCoupon ? "Updating..." : "Creating..."}
                </>
              ) : selectedCoupon ? (
                "Update Coupon"
              ) : (
                "Create Coupon"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CouponManagementPage;
