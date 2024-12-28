import { getCustomerDashboard } from "@/services/UserServices";
import { useQuery } from "@tanstack/react-query";

export const useCustomerDashboard = () => {
  return useQuery({
    queryKey: ["customer_dashboard"],
    queryFn: () => getCustomerDashboard(),
  });
};
