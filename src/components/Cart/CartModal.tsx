"use client";
import { ShoppingCart } from "lucide-react";

interface CartItemType {
  id: string;
  product: {
    images: string[];
    name: string;
  };
  price: number;
  quantity: number;
}
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { AnimatePresence } from "motion/react";
import { CartItem } from "./CartItem";
import { useCartStore } from "@/store/cart.store";
import { useCart, useClearCart } from "@/hooks/cart.hook";

export const CartModal = () => {
  const { isOpen, setIsOpen } = useCartStore();
  const { data: cart, isPending, isFetching } = useCart();
  const { mutate: clearCart, isPending: clearCartPending } = useClearCart();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-lg z-[2050]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Cart
          </SheetTitle>
        </SheetHeader>
        <div className="mt-8 flex flex-col h-[calc(100vh-12rem)]">
          <div className="flex-1 overflow-y-auto">
            {isPending || isFetching || clearCartPending ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
              </div>
            ) : cart?.items?.length ? (
              <AnimatePresence>
                {cart.items.map((item: CartItemType) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </AnimatePresence>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <ShoppingCart className="h-12 w-12 mb-2" />
                <p>Your cart is empty</p>
              </div>
            )}
          </div>
          {cart?.items?.length > 0 && (
            <div className="border-t pt-4 mt-auto">
              <div className="flex justify-between mb-4">
                <span className="font-medium">Total:</span>
                <span className="font-medium">${cart.total.toString()}</span>
              </div>
              <div className="flex justify-between mb-4 gap-4">
                <Button className="w-full" size="lg">
                  Checkout
                </Button>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => clearCart()}
                >
                  Clear
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
