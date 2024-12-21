import {
  followVendor,
  getFollowStatus,
  getVendorById,
  vendorOnboarding,
} from "@/services/VendorServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export const useGetVendorDetails = (id: string) => {
  return useQuery({
    queryKey: ["vendors", id],
    queryFn: () => getVendorById(id),
    enabled: !!id,
  });
};

export const useGetFollowStatus = (id: string) => {
  return useQuery({
    queryKey: ["vendors", id],
    queryFn: () => getFollowStatus(id),
    enabled: !!id,
  });
};

export const useFollowVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: followVendor,
    onSuccess: (data) => {
      // Invalidate and refetch vendor list
      queryClient.invalidateQueries({ queryKey: ["vendors"], data });
      return data;
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to Follow/Unfollow vendor");
    },
  });
};
