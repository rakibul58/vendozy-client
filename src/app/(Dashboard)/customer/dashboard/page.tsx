/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { OrderTrendChart } from "@/components/modules/Shared/charts";
import {
  LoadingSkeleton,
  OrderStatusBadge,
  StatsCard,
} from "@/components/modules/Shared/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCustomerDashboard } from "@/hooks/user.hook";
import { DollarSign, Package, ShoppingCart, Star } from "lucide-react";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function CustomerDashboard() {
  const { data: dashboardData, isFetched, isFetching } = useCustomerDashboard();

  if (isFetching || !isFetched) {
    return <LoadingSkeleton />;
  }

  const statsCards = [
    {
      title: "Paid Orders",
      value: dashboardData?.analytics?.totalOrders ?? 0,
      subtitle: "Completed transactions",
      icon: <ShoppingCart className="h-6 w-6" />,
      color: "text-green-500",
    },
    {
      title: "Total Spent",
      value: `$${dashboardData?.analytics?.totalSpent ?? "0.00"}`,
      subtitle: "From paid orders",
      icon: <DollarSign className="h-6 w-6" />,
      color: "text-blue-500",
    },
    {
      title: "Products Viewed",
      value: dashboardData?.analytics?.totalProductsViewed ?? 0,
      icon: <Package className="h-6 w-6" />,
      color: "text-purple-500",
    },
    {
      title: "Reviews Given",
      value: dashboardData?.analytics?.totalReviews ?? 0,
      icon: <Star className="h-6 w-6" />,
      color: "text-yellow-500",
    },
  ];

  // Format order trend data
  interface Order {
    id: string;
    date: string;
    amount: string;
  }

  interface FormattedOrder extends Omit<Order, "amount"> {
    amount: string;
  }

  const formattedOrders: FormattedOrder[] = dashboardData.orders.map(
    (order: Order) => ({
      ...order,
      amount: Number(order.amount).toFixed(2),
    })
  );

  // Define RecentView type
  interface RecentView {
    id: string;
    product: {
      name: string;
    };
    type: string;
    date: string;
    status: string;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <StatsCard key={stat.title} stat={stat} index={index} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrderTrendChart orders={dashboardData?.orders} />

        <Card>
          <CardHeader>
            <CardTitle>All Orders Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dashboardData.ordersByStatus}
                    dataKey="value"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {dashboardData.ordersByStatus.map(
                      (entry: { status: string }, index: number) => (
                        <Cell
                          key={`cell-${entry.status}`}
                          fill={
                            entry.status === "PAID"
                              ? "#22c55e"
                              : entry.status === "PENDING"
                              ? "#eab308"
                              : "#ef4444"
                          }
                        />
                      )
                    )}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dashboardData.recentViews.map((activity: RecentView) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">
                    {activity.product.name}
                  </TableCell>
                  <TableCell>{activity.type}</TableCell>
                  <TableCell>
                    {new Date(activity.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={activity.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
