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
import {
  Ban,
  CheckCircle2,
  Loader2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import Image from "next/image";
import Loading from "@/components/modules/Shared/LoadingBlur";
import { useCustomerList, useUpdateCustomerStatus } from "@/hooks/user.hook";
import CategoryRow from "@/components/Skeletons/CategoryRow";

interface customer {
  id: string;
  customer: {
    userId: string;
    profileImg: string | null;
    name: string;
    phone?: string;
  };
  email: string;
  status: "SUSPENDED" | "ACTIVE";
}

export default function Customer() {
  const [page, setPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<customer | null>(
    null
  );
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<string>("");

  const {
    data: customersData,
    isLoading,
    isFetching,
  } = useCustomerList({
    page,
    limit: 10,
  });

  const updateCustomerStatus = useUpdateCustomerStatus();

  const handleStatusChange = (customer: customer, action: string) => {
    setSelectedCustomer(customer);
    setActionType(action);
    setIsAlertDialogOpen(true);
  };

  const handleConfirmStatusChange = () => {
    if (selectedCustomer) {
      updateCustomerStatus.mutate({ id: selectedCustomer.customer.userId });
    }
  };

  const handleNextPage = () => {
    if (customersData?.meta?.total > page * 10) {
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
      {updateCustomerStatus.isPending && <Loading />}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Img</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        {isFetching || isLoading || updateCustomerStatus.isPending ? (
          <TableBody>
            <CategoryRow />
            <CategoryRow />
            <CategoryRow />
          </TableBody>
        ) : (
          <TableBody>
            {customersData?.data?.map((customer: customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  {customer.customer.profileImg && (
                    <Image
                      src={customer.customer.profileImg}
                      alt={customer.customer.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  )}
                </TableCell>
                <TableCell>{customer.customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.customer.phone}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      customer.status === "SUSPENDED"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {customer.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant={
                      customer.status === "SUSPENDED"
                        ? "outline"
                        : "destructive"
                    }
                    size="sm"
                    onClick={() =>
                      handleStatusChange(
                        customer,
                        customer.status === "SUSPENDED"
                          ? "unsuspend"
                          : "Suspend"
                      )
                    }
                    disabled={updateCustomerStatus.isPending}
                  >
                    {customer.status === "SUSPENDED" ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Unsuspend
                      </>
                    ) : (
                      <>
                        <Ban className="h-4 w-4 mr-2" />
                        Suspend
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
          Page {page} of {Math.ceil((customersData?.meta?.total || 0) / 10)}
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
            disabled={page * 10 >= (customersData?.meta?.total || 0)}
          >
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "Suspend"
                ? "Suspend customer"
                : "Remove from Suspend"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "Suspend"
                ? "Are you sure you want to Suspend this customer? They will not be able to sell products while Suspended."
                : "Are you sure you want to remove this customer from the Suspend? They will be able to resume selling products."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmStatusChange}
              className={
                actionType === "Suspend" ? "bg-red-600" : "bg-green-600"
              }
            >
              {updateCustomerStatus.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : actionType === "Suspend" ? (
                "Suspend"
              ) : (
                "Remove from Suspend"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
