import {
  getAdminDashboard,
  getCustomerDashboard,
  getNewsletters,
  getVendorDashboard,
} from "@/services/UserServices";
import { useQuery } from "@tanstack/react-query";

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