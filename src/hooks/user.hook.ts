import {
  getAdminDashboard,
  getAllCustomers,
  getAllVendors,
  getCustomerDashboard,
  getNewsletters,
  getVendorDashboard,
  updateCustomerStatus,
  updateVendorStatus,
} from "@/services/UserServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCustomerDashboard = () => {
  return useQuery({
    queryKey: ["customer_dashboard"],
    queryFn: () => getCustomerDashboard(),
  });
};

export const useVendorDashboard = () => {
  return useQuery({
    queryKey: ["vendor_dashboard"],
    queryFn: () => getVendorDashboard(),
  });
};

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ["Admin_dashboard"],
    queryFn: () => getAdminDashboard(),
  });
};

export const useGetNewsletters = (options?: {
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["newsletters", options],
    queryFn: () => getNewsletters(options),
  });
};

export const useVendorList = (options?: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  name?: string;
  description?: string;
}) => {
  return useQuery({
    queryKey: ["vendors", options],
    queryFn: () => getAllVendors(options),
  });
};

export const useCustomerList = (options?: {
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["customers", options],
    queryFn: () => getAllCustomers(options),
  });
};

export const useUpdateVendorStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => updateVendorStatus(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      queryClient.invalidateQueries({ queryKey: ["vendors", data.data.id] });
      toast.success("Vendor updated successfully");
      return data;
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update vendor");
    },
  });
};

export const useUpdateCustomerStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => updateCustomerStatus(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customers", data.data.id] });
      toast.success("Customer updated successfully");
      return data;
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update Customer");
    },
  });
};
