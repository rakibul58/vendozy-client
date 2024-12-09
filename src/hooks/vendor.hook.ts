import { vendorOnboarding } from "@/services/VendorServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useVendorOnboarding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: vendorOnboarding,
    onSuccess: (data) => {
      // Invalidate and refetch vendor list
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      toast.success("Vendor onboarded successfully");
      return data;
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to onboard vendor");
    },
  });
};
