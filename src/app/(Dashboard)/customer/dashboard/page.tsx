/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShoppingCart, Package, Star, DollarSign } from "lucide-react";
import { useCustomerDashboard } from "@/hooks/user.hook";
import { Skeleton } from "@/components/ui/skeleton";

interface Activity {
  id: string;
  product: {
    name: string;
  };
  type: string;
  date: string;
  status: string;
}

interface OrderStatus {
  status: string;
  value: number;
}

interface IDashboardData {
  orders: Array<{
    date: string;
    amount: number;
  }>;
  recentViews: Activity[];
  analytics: {
    totalOrders: number;
    totalSpent: number;
    totalProductsViewed: number;
    totalReviews: number;
  };
  ordersByStatus: OrderStatus[];
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

const LoadingSkeleton = () => (
  <div className="p-6 space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    </div>
    <Card>
      <CardContent className="p-6">
        <Skeleton className="h-[200px] w-full" />
      </CardContent>
    </Card>
  </div>
);

const StatsCard = ({ 
  stat, 
  index 
}: { 
  stat: { title: string; value: number | string; icon: JSX.Element; color: string; }; 
  index: number; 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    <Card>
      <CardContent className="flex items-center p-6">
        <div className={`rounded-full p-3 ${stat.color} bg-opacity-10`}>
          {stat.icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{stat.title}</p>
          <h3 className="text-2xl font-bold">{stat.value}</h3>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const CustomerDashboard = () => {
  const { data: dashboardData, isFetched, isFetching } = useCustomerDashboard();

  if (isFetching || !isFetched) {
    return <LoadingSkeleton />;
  }

  const statsCards = [
    {
      title: "Total Orders",
      value: dashboardData?.analytics?.totalOrders ?? 0,
      icon: <ShoppingCart className="h-6 w-6" />,
      color: "text-blue-500",
    },
    {
      title: "Total Spent",
      value: `$${dashboardData?.analytics?.totalSpent ?? "0.00"}`,
      icon: <DollarSign className="h-6 w-6" />,
      color: "text-green-500",
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

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <StatsCard key={stat.title} stat={stat} index={index} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dashboardData.orders}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
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
                    {dashboardData.ordersByStatus.map((entry: OrderStatus, index: number) => (
                      <Cell 
                      key={`cell-${entry.status}`} 
                      fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
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
                {dashboardData.recentViews.map((activity: Activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">
                  {activity.product.name}
                  </TableCell>
                  <TableCell>{activity.type}</TableCell>
                  <TableCell>
                  {new Date(activity.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{activity.status}</TableCell>
                </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDashboard;