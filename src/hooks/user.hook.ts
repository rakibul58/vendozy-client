import { getCustomerDashboard, getVendorDashboard } from "@/services/UserServices";
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
