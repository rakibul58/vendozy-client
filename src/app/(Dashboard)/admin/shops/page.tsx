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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Ban,
  CheckCircle2,
  Loader2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import Image from "next/image";
import Loading from "@/components/modules/Shared/LoadingBlur";
import { useUpdateVendorStatus, useVendorList } from "@/hooks/user.hook";
import CategoryRow from "@/components/Skeletons/CategoryRow";

interface Vendor {
  id: string;
  userId: string;
  logo: string | null;
  name: string;
  email: string;
  phone: string;
  status: "BLACKLISTED" | "ACTIVE";
}

export default function VendorManagementPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<string>("");

  const {
    data: vendorsData,
    isLoading,
    isFetching,
  } = useVendorList({
    page,
    searchTerm,
    limit: 10,
  });

  const updateStatusMutation = useUpdateVendorStatus();

  const handleStatusChange = (vendor: Vendor, action: string) => {
    setSelectedVendor(vendor);
    setActionType(action);
    setIsAlertDialogOpen(true);
  };

  const handleConfirmStatusChange = () => {
    if (selectedVendor) {
      updateStatusMutation.mutate({ id: selectedVendor.userId });
    }
  };

  const handleNextPage = () => {
    if (vendorsData?.meta?.total > page * 10) {
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
      {updateStatusMutation.isPending && <Loading />}

      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search vendors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Logo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        {isFetching || isLoading || updateStatusMutation.isPending ? (
          <TableBody>
            <CategoryRow />
            <CategoryRow />
            <CategoryRow />
          </TableBody>
        ) : (
          <TableBody>
            {vendorsData?.data?.map((vendor: Vendor) => (
              <TableRow key={vendor.id}>
                <TableCell>
                  {vendor.logo && (
                    <Image
                      src={vendor.logo}
                      alt={vendor.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  )}
                </TableCell>
                <TableCell>{vendor.name}</TableCell>
                <TableCell>{vendor.email}</TableCell>
                <TableCell>{vendor.phone}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      vendor.status === "BLACKLISTED"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {vendor.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant={
                      vendor.status === "BLACKLISTED"
                        ? "outline"
                        : "destructive"
                    }
                    size="sm"
                    onClick={() =>
                      handleStatusChange(
                        vendor,
                        vendor.status === "BLACKLISTED"
                          ? "unblacklist"
                          : "blacklist"
                      )
                    }
                    disabled={updateStatusMutation.isPending}
                  >
                    {vendor.status === "BLACKLISTED" ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Unblacklist
                      </>
                    ) : (
                      <>
                        <Ban className="h-4 w-4 mr-2" />
                        Blacklist
                      </>
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500">
          Page {page} of {Math.ceil((vendorsData?.meta?.total || 0) / 10)}
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
            disabled={page * 10 >= (vendorsData?.meta?.total || 0)}
          >
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "blacklist"
                ? "Blacklist Vendor"
                : "Remove from Blacklist"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "blacklist"
                ? "Are you sure you want to blacklist this vendor? They will not be able to sell products while blacklisted."
                : "Are you sure you want to remove this vendor from the blacklist? They will be able to resume selling products."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmStatusChange}
              className={
                actionType === "blacklist" ? "bg-red-600" : "bg-green-600"
              }
            >
              {updateStatusMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : actionType === "blacklist" ? (
                "Blacklist"
              ) : (
                "Remove from Blacklist"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
