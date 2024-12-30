/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useGetNewsletters } from "@/hooks/user.hook";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CategoryRow from "@/components/Skeletons/CategoryRow";

const ITEMS_PER_PAGE = 10;

const NewsletterAdmin = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: subscribers,
    isFetching,
    isLoading,
  } = useGetNewsletters({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });

  const handleNextPage = () => {
    if (subscribers?.meta?.total > currentPage * ITEMS_PER_PAGE) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-bold">Newsletter Subscribers</h2>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Subscribed Date</TableHead>
            </TableRow>
          </TableHeader>
          {isFetching || isLoading ? (
            <TableBody>
              <CategoryRow />
              <CategoryRow />
              <CategoryRow />
            </TableBody>
          ) : (
            <TableBody>
              {subscribers?.data?.map(
                (subscriber: {
                  id: string;
                  email: string;
                  status: string;
                  createdAt: string;
                }) => (
                  <TableRow key={subscriber.id}>
                    <TableCell>{subscriber.email}</TableCell>
                    <TableCell>{subscriber.status}</TableCell>
                    <TableCell>
                      {new Date(subscriber.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          )}
        </Table>

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            Page {currentPage} of{" "}
            {Math.ceil((subscribers?.meta?.total || 0) / ITEMS_PER_PAGE)}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <Button
              variant="outline"
              onClick={handleNextPage}
              disabled={currentPage * ITEMS_PER_PAGE >= (subscribers?.meta?.total || 0)}
            >
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NewsletterAdmin;
