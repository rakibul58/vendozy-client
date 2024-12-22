"use client";

import { ShoppingCart } from "lucide-react";
import { Button, ButtonProps } from "../ui/button";
import { useUser } from "@/context/user.provider";
import { useAddToCart, useCart } from "@/hooks/cart.hook";
import { useCartStore } from "@/store/cart.store";

interface AddToCartButtonProps extends ButtonProps {
  product: {
    id: string;
    vendorId: string;
  };
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  iconOnly?: boolean;
}

export const AddToCartButton = ({
  product,
  variant = "default",
  size = "default",
  className = "",
  iconOnly = false,
  ...props
}: AddToCartButtonProps) => {
  const { user } = useUser();
  const { setIsOpen, setShowVendorAlert, setPendingProduct } = useCartStore();
  const { data: currentCart } = useCart();
  const { mutate: addToCart, isPending } = useAddToCart();

  const handleAddToCart = async () => {
    console.log({ currentCart, product, items: !!currentCart?.items?.length });
    if (
      currentCart?.vendor &&
      !!currentCart?.items?.length &&
      currentCart?.vendorId !== product?.vendorId
    ) {
      setPendingProduct(product);
      setShowVendorAlert(true);
    } else {
      addToCart(
        {
          productId: product.id,
          quantity: 1,
          vendorId: product.vendorId,
        },
        {
          onSuccess: () => {
            setIsOpen(true);
          },
        }
      );
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleAddToCart}
      disabled={user?.role !== "CUSTOMER" || isPending}
      className={className}
      {...props}
    >
      {isPending ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
      ) : (
        <>
          <ShoppingCart className={`h-4 w-4 ${!iconOnly ? "mr-2" : ""}`} />
          {!iconOnly && "Add to Cart"}
        </>
      )}
    </Button>
  );
};
