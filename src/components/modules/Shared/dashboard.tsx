"use client"
import { motion } from "motion/react";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Customer Dashboard Stats Card
export const StatsCard = ({
  stat,
  index,
}: {
  stat: {
    title: string;
    value: number | string;
    icon: JSX.Element;
    color: string;
    subtitle?: string; // Added for additional context
  };
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
          {stat.subtitle && (
            <p className="text-sm text-gray-500">{stat.subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

// Updated Order Status Badge
export const OrderStatusBadge = ({ status }: { status: string }) => {
  const statusColors = {
    PAID: "bg-green-100 text-green-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  return (
    <Badge className={`${statusColors[status as keyof typeof statusColors]}`}>
      {status}
    </Badge>
  );
};

export const LoadingSkeleton = () => (
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
