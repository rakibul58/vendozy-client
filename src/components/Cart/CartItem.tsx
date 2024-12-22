import { useRemoveFromCart, useUpdateCart } from "@/hooks/cart.hook";
import Image from "next/image";
import { motion } from "motion/react";
import { Button } from "../ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import CartItemSkeleton from "../Skeletons/CartItem";

interface CartItemProps {
  item: {
    id: string;
    product: {
      images: string[];
      name: string;
      discount: string;
    };
    price: number;
    quantity: number;
  };
}

export const CartItem = ({ item }: CartItemProps) => {
  const { mutate: updateCart, isPending: updatePending } = useUpdateCart();
  const { mutate: removeFromCart, isPending: removePending } =
    useRemoveFromCart();

  console.log({ item });

  const handleQuantityChange = (newQuantity: number) => {
    updateCart({
      cartItemId: item.id,
      cartData: { quantity: newQuantity },
    });
  };

  // Calculate discount and savings
  const discountPercent = parseFloat(item.product.discount) || 0;
  const originalPrice = Number(item.price);
  const discountedPrice = originalPrice * (1 - discountPercent / 100);
  const savings = originalPrice - discountedPrice;
  const totalSavings = savings * item.quantity;

  if (updatePending || removePending) return <CartItemSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-center gap-4 p-4 border-b"
    >
      <Image
        src={item.product.images[0] || "/api/placeholder/80/80"}
        alt={item.product.name}
        width={80}
        height={80}
        className="object-cover rounded"
      />
      <div className="flex-1">
        <h3 className="font-medium">{item.product.name}</h3>
        <div className="space-y-1">
          {discountPercent > 0 ? (
            <>
              <p className="text-sm text-gray-600">
                <span className="line-through">
                  ${originalPrice.toFixed(2)}
                </span>
                <span className="ml-2 text-green-600">
                  ${discountedPrice.toFixed(2)}
                </span>
                <span className="ml-2 text-red-500">-{discountPercent}%</span>
              </p>
              <p className="text-sm">
                Total: ${(discountedPrice * item.quantity).toFixed(2)}
                {item.quantity > 1 && (
                  <span className="text-gray-500 ml-2">
                    (${discountedPrice.toFixed(2)} x {item.quantity})
                  </span>
                )}
              </p>
              <p className="text-sm text-green-600">
                You save: ${totalSavings.toFixed(2)}
              </p>
            </>
          ) : (
            <p className="text-sm">
              ${originalPrice.toFixed(2)} x {item.quantity}
              {item.quantity > 1 && (
                <span className="ml-2">
                  = ${(originalPrice * item.quantity).toFixed(2)}
                </span>
              )}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleQuantityChange(Number(item.quantity) - 1)}
          disabled={updatePending}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleQuantityChange(Number(item.quantity) + 1)}
          disabled={updatePending}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500"
          onClick={() => removeFromCart(item.id)}
          disabled={removePending}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};
