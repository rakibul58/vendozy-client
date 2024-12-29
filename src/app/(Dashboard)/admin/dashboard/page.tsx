"use client";

import React from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, Store, Users, ShoppingBag, Star } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminDashboard } from "@/hooks/user.hook";

// Define proper interfaces for type safety
interface Order {
  id: string;
  customer: string;
  vendor: string;
  amount: number;
  status: "PAID" | "PENDING";
}

interface Vendor {
  id: string;
  name: string;
  revenue: number;
  totalOrders: number;
  averageRating: number;
}


interface StatCard {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
}

const LoadingSkeleton = () => (
  <div className="p-6 space-y-6 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={`skeleton-stat-${i}`} className="h-32 rounded-lg" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={`skeleton-chart-${i}`} className="h-80 rounded-lg" />
      ))}
    </div>
  </div>
);

const StatsCard = ({ stat }: { stat: StatCard }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
      <div className={`${stat.color}`}>{stat.icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{stat.value}</div>
      <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
    </CardContent>
  </Card>
);

const VENDOR_STATUS_COLORS = {
  active: "#22c55e",
  pending: "#eab308",
  blacklisted: "#ef4444",
};

export default function AdminDashboard() {
  const { data: dashboardData, isLoading } = useAdminDashboard();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const stats: StatCard[] = [
    {
      title: "Total Revenue",
      value: `$${dashboardData.analytics.totalRevenue.toFixed(2)}`,
      subtitle: "From all paid orders",
      icon: <DollarSign className="h-6 w-6" />,
      color: "text-green-500",
    },
    {
      title: "Active Vendors",
      value: dashboardData.vendorMetrics.activeVendors,
      subtitle: `${dashboardData.vendorMetrics.pendingOnboarding} pending onboarding`,
      icon: <Store className="h-6 w-6" />,
      color: "text-blue-500",
    },
    {
      title: "Total Customers",
      value: dashboardData.analytics.totalCustomers,
      subtitle: `${dashboardData.customerMetrics.active} active buyers`,
      icon: <Users className="h-6 w-6" />,
      color: "text-purple-500",
    },
    {
      title: "Total Orders",
      value: dashboardData.analytics.totalOrders,
      subtitle: `Avg. $${dashboardData.analytics.averageOrderValue.toFixed(2)}`,
      icon: <ShoppingBag className="h-6 w-6" />,
      color: "text-orange-500",
    },
  ];

  const vendorStatusData = [
    {
      name: "Active Vendors",
      value: dashboardData.vendorMetrics.activeVendors,
    },
    {
      name: "Pending Onboarding",
      value: dashboardData.vendorMetrics.pendingOnboarding,
    },
    {
      name: "Blacklisted",
      value: dashboardData.vendorMetrics.blacklisted,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <motion.div
      className="p-6 space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index: number) => (
          <StatsCard key={`stat-${index}`} stat={stat} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.revenueChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Vendor Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Vendor Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={vendorStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {vendorStatusData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={Object.values(VENDOR_STATUS_COLORS)[index]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Vendors */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Orders</TableHead>
                  <TableHead className="text-right">Rating</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardData.topVendors.map((vendor: Vendor, index: number) => (
                  <TableRow key={`vendor-${index}`}>
                    <TableCell className="font-medium">{vendor.name}</TableCell>
                    <TableCell className="text-right">
                      ${vendor.revenue.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {vendor.totalOrders}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        {vendor.averageRating.toFixed(1)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardData.recentOrders.map((order: Order, index: number) => (
                  <TableRow key={`order-${index}`}>
                    <TableCell className="font-medium">
                      {order.customer}
                    </TableCell>
                    <TableCell>{order.vendor}</TableCell>
                    <TableCell className="text-right">
                      ${order.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          order.status === "PAID"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}