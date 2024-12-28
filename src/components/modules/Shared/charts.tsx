/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const getYAxisDomain = (data: any[], key: string, padding: number = 1.1) => {
  if (!data || data.length === 0) return [0, 100];
  const maxValue = Math.max(...data.map((item) => Number(item[key])));
  return [0, maxValue * padding]; // Add 10% padding to the top
};

// Helper function to format dates consistently
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export const OrderTrendChart = ({ orders }: { orders: any[] }) => {
  // Process and sort the data by date
  const processedData = orders
    .map((order) => ({
      date: formatDate(order.date),
      amount: Number(order.amount),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const yDomain = getYAxisDomain(processedData, "amount", 1.2);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paid Orders Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          {" "}
          {/* Increased height for better visibility */}
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={processedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
              />
              <YAxis domain={yDomain} tickFormatter={(value) => `$${value}`} />
              <Tooltip
                formatter={(value: number) => [
                  `$${value.toFixed(2)}`,
                  "Amount",
                ]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="amount"
                name="Order Amount"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export const RevenueTrendChart = ({ revenueData }: { revenueData: any[] }) => {
  const processedData = revenueData
    .map((item) => ({
      month: item.month,
      amount: Number(item.amount),
    }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

  const yDomain = getYAxisDomain(processedData, "amount", 1.2);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue from Paid Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          {" "}
          {/* Increased height for better visibility */}
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={processedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
              />
              <YAxis domain={yDomain} tickFormatter={(value) => `$${value}`} />
              <Tooltip
                formatter={(value: number) => [
                  `$${value.toFixed(2)}`,
                  "Revenue",
                ]}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="amount"
                name="Revenue"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
