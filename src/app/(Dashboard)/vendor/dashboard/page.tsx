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
import {
  StatsCard,
  LoadingSkeleton,
} from "@/components/modules/Shared/dashboard";
import { useVendorDashboard } from "@/hooks/user.hook";
import { Star, DollarSign, ShoppingBag, Package, Users } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { RevenueTrendChart } from "@/components/modules/Shared/charts";
interface ProductPerformance {
  name: string;
  revenue: number;
  units: number;
  rating: number;
}

export default function VendorDashboard() {
  const { data: dashboardData, isLoading } = useVendorDashboard();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const stats = [
    {
      title: "Revenue (Paid Orders)",
      value: `$${dashboardData.analytics.totalRevenue.toFixed(2)}`,
      subtitle: "From completed transactions",
      icon: <DollarSign className="h-6 w-6" />,
      color: "text-green-500",
    },
    {
      title: "Paid Orders",
      value: dashboardData.analytics.totalOrders,
      subtitle: "Successfully completed",
      icon: <ShoppingBag className="h-6 w-6" />,
      color: "text-blue-500",
    },
    {
      title: "Active Products",
      value: dashboardData.analytics.totalProducts,
      subtitle: "Currently listed",
      icon: <Package className="h-6 w-6" />,
      color: "text-purple-500",
    },
    {
      title: "Paying Customers",
      value: dashboardData.analytics.totalCustomers,
      subtitle: "With completed orders",
      icon: <Users className="h-6 w-6" />,
      color: "text-yellow-500",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const chartVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      className="p-6 space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatsCard key={stat.title} stat={stat} index={index} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueTrendChart revenueData={dashboardData.revenueChart} />

        <motion.div variants={chartVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Customer Purchase Behavior</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: "One-time Buyers",
                        value: dashboardData.customerRetention.oneTime,
                      },
                      {
                        name: "Repeat Customers",
                        value: dashboardData.customerRetention.repeat,
                      },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#22c55e" />
                    <Cell fill="#3b82f6" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={chartVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products (Paid Orders)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Units Sold</TableHead>
                    <TableHead className="text-right">Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardData.productPerformance.map(
                    (product: ProductPerformance) => (
                      <TableRow key={product.name}>
                        <TableCell className="font-medium">
                          {product.name}
                        </TableCell>
                        <TableCell className="text-right">
                          ${product.revenue.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          {product.units}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            {product.rating.toFixed(1)}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={chartVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Review Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData.reviewDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="rating" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
