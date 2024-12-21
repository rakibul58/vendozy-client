/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";

interface CartStore {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  showVendorAlert: boolean;
  setShowVendorAlert: (show: boolean) => void;
  pendingProduct: any | null;
  setPendingProduct: (product: any | null) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  showVendorAlert: false,
  setShowVendorAlert: (show) => set({ showVendorAlert: show }),
  pendingProduct: null,
  setPendingProduct: (product) => set({ pendingProduct: product }),
}));
