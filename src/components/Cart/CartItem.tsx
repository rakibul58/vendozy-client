import { useRemoveFromCart, useUpdateCart } from "@/hooks/cart.hook";
import Image from "next/image";
import { motion } from "motion/react";
import { Button } from "../ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import Loading from "../modules/Shared/LoadingBlur";

interface CartItemProps {
  item: {
    id: string;
    product: {
      images: string[];
      name: string;
    };
    price: number;
    quantity: number;
  };
}

export const CartItem = ({ item }: CartItemProps) => {
  const { mutate: updateCart, isPending: updatePending } = useUpdateCart();
  const { mutate: removeFromCart, isPending: removePending } =
    useRemoveFromCart();

  const handleQuantityChange = (newQuantity: number) => {
    updateCart({
      cartItemId: item.id,
      cartData: { quantity: newQuantity },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-center gap-4 p-4 border-b"
    >
      {(updatePending || removePending) && <Loading />}
      <Image
        src={item.product.images[0] || "/api/placeholder/80/80"}
        alt={item.product.name}
        width={80}
        height={80}
        className="object-cover rounded"
      />
      <div className="flex-1">
        <h3 className="font-medium">{item.product.name}</h3>
        <p className="text-sm">
          ${item.price.toString()} x {item.quantity}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleQuantityChange(-1)}
          disabled={updatePending}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleQuantityChange(1)}
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
