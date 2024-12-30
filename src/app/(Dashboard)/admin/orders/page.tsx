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
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminOrderList } from "@/hooks/order.hook";

// Types remain the same...
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  profileImg?: string;
}

interface Order {
  id: string;
  customerId: string;
  vendorId: string;
  totalAmount: string;
  status: "PAID" | "PENDING";
  couponCode: string | null;
  createdAt: string;
  updatedAt: string;
  customer: Customer;
}

// EmptyState component remains the same...
const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <ShoppingBag className="w-16 h-16  mb-4" />
      <h3 className="text-xl font-semibold  mb-2">No Orders Yet</h3>
      <p className=" text-center mb-6 max-w-sm">
        You haven&apos;t received any orders yet. Orders will appear here when
        customers make purchases.
      </p>
    </div>
  );
};

const LoadingTableRows: React.FC = () => (
  <>
    {[1, 2, 3].map((index) => (
      <TableRow key={index}>
        {Array(6)
          .fill(0)
          .map((_, cellIndex) => (
            <TableCell key={cellIndex}>
              <Skeleton className="h-4 rounded animate-pulse w-24"></Skeleton>
            </TableCell>
          ))}
      </TableRow>
    ))}
  </>
);

const VendorOrdersPage: React.FC = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const {
    data: ordersData,
    isLoading,
    error,
  } = useAdminOrderList({
    limit: 10,
    page,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const navigateToCustomer = (customerId: string) => {
    router.push(`/vendor/customers/${customerId}`);
  };

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold mb-6">
          Orders Management
        </h1>
        <div className="text-center py-8 text-red-500">
          Error loading orders. Please try again later.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold mb-6">
          Orders Management
        </h1>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[100px]">Order ID</TableHead>
                <TableHead className="min-w-[150px]">Date</TableHead>
                <TableHead className="min-w-[200px]">Customer</TableHead>
                <TableHead className="min-w-[100px]">Amount</TableHead>
                <TableHead className="min-w-[100px]">Status</TableHead>
                <TableHead className="min-w-[120px]">Coupon</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <LoadingTableRows />
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (!ordersData?.data || ordersData.data.length === 0) {
    return (
      <div className="p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold mb-6">
          Orders Management
        </h1>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-6">Orders Management</h1>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[100px]">Order ID</TableHead>
              <TableHead className="min-w-[150px]">Date</TableHead>
              <TableHead className="min-w-[200px]">Customer</TableHead>
              <TableHead className="min-w-[100px]">Amount</TableHead>
              <TableHead className="min-w-[100px]">Status</TableHead>
              <TableHead className="min-w-[120px]">Coupon</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordersData.data.map((order: Order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium whitespace-nowrap">
                  {order.id.slice(0, 8)}...
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatDate(order.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    {order.customer.profileImg && (
                      <div className="hidden sm:block">
                        <Image
                          src={order.customer.profileImg}
                          alt={order.customer.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <button
                        onClick={() => navigateToCustomer(order.customer.id)}
                        className="text-blue-600 hover:underline font-medium text-sm md:text-base truncate block"
                      >
                        {order.customer.name}
                      </button>
                      <p className="text-xs md:text-sm  truncate">
                        {order.customer.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  ${Number(order.totalAmount).toFixed(2)}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs md:text-sm whitespace-nowrap ${
                      order.status === "PAID"
                        ? "bg-green-100 text-green-800"
                        : order.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {order.couponCode ? (
                    <span className="text-purple-600 font-medium text-sm">
                      {order.couponCode}
                    </span>
                  ) : (
                    <span className="">-</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
        <div className="text-sm  order-2 sm:order-1">
          Page {page} of {Math.ceil((ordersData?.meta?.total || 0) / 10)}
        </div>
        <div className="flex space-x-2 w-full sm:w-auto order-1 sm:order-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex-1 sm:flex-none"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={
              !ordersData?.meta?.total || page * 10 >= ordersData.meta.total
            }
            className="flex-1 sm:flex-none"
          >
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VendorOrdersPage;
