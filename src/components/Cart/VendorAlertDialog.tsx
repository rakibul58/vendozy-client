"use client"
import { useAddToCart } from "@/hooks/cart.hook";
import { useCartStore } from "@/store/cart.store";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../ui/alert-dialog";
import Loading from "../modules/Shared/LoadingBlur";

export const VendorAlertDialog = () => {
  const {
    showVendorAlert,
    setShowVendorAlert,
    pendingProduct,
    setPendingProduct,
    setIsOpen,
  } = useCartStore();

  const { mutate: addToCartMutation, isPending } = useAddToCart();

  const handleConfirm = () => {
    if (pendingProduct) {
      addToCartMutation(
        {
          productId: pendingProduct.id,
          quantity: 1,
          vendorId: pendingProduct.vendorId,
        },
        {
          onSuccess: () => {
            setIsOpen(true);
          },
        }
      );
    }
  };

  const handleCancel = () => {
    setShowVendorAlert(false);
    setPendingProduct(null);
  };

  return (
    <AlertDialog open={showVendorAlert} onOpenChange={setShowVendorAlert}>
      {isPending && <Loading />}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Replace Cart Items?</AlertDialogTitle>
          <AlertDialogDescription>
            Your cart contains items from a different vendor. Adding this item
            will remove the current items from your cart.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            Keep Current Cart
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            Replace Cart
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
