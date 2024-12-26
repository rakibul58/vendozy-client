/* eslint-disable @typescript-eslint/no-explicit-any */
// CheckoutPage.tsx
"use client";

import React, { useCallback } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { Package, Tags, CreditCard, AlertCircle, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CartItem,
  useCheckoutData,
  useCheckoutProcess,
} from "@/hooks/order.hook";
import {
  AvailableCoupons,
  Coupon,
} from "@/components/modules/Products/AvailableCoupons";
import CheckoutSkeleton from "@/components/Skeletons/CheckoutSkeleton";

const CartItemComponent: React.FC<{ item: CartItem; index: number }> = ({
  item,
  index,
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
    className="flex items-center gap-4 p-4 bg-secondary/10 rounded-lg"
  >
    <div className="w-16 h-16 bg-secondary/20 rounded-md">
      <Image
        src={item?.product?.images[0] || "/api/placeholder/64/64"}
        alt={item?.product?.name}
        className="w-full h-full object-cover rounded-md"
        height={100}
        width={100}
      />
    </div>
    <div className="flex-1">
      <h3 className="font-semibold">{item?.product?.name}</h3>
      <p className="text-sm text-muted-foreground">
        Quantity: {item?.quantity}
      </p>
      <p className="text-sm">
        Price: ${Number(item.price).toFixed(2)}
        {(item?.product?.discount as number) > 0 && (
          <span className="ml-2 text-green-600">
            (-{item.product.discount}%)
          </span>
        )}
      </p>
    </div>
  </motion.div>
);

const PaymentSummary: React.FC<{
  subtotal: number;
  discount: number;
  total: number;
  appliedCoupon: Coupon | null;
  setAppliedCoupon: (coupon: Coupon | null) => void;
  setCouponError: (error: string) => void;
  checkoutMutation: any;
}> = ({
  subtotal,
  discount,
  total,
  appliedCoupon,
  setAppliedCoupon,
  setCouponError,
  checkoutMutation,
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <CreditCard className="w-5 h-5" />
        Payment Summary
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {appliedCoupon && (
          <div className="flex justify-between items-center text-green-600">
            <div className="flex items-center gap-2">
              <span>Coupon Discount</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setAppliedCoupon(null);
                  setCouponError("");
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
        <Separator />
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <Button
        className="w-full"
        size="lg"
        onClick={() => checkoutMutation.mutate({})}
        disabled={checkoutMutation.isPending}
      >
        {checkoutMutation.isPending ? (
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
        ) : (
          "Proceed to Payment"
        )}
      </Button>
    </CardContent>
  </Card>
);

const CheckoutPage: React.FC = () => {
  
  const {
    data: checkoutData,
    isLoading,
    error,
  } = useCheckoutData();

  const {
    appliedCoupon,
    couponError,
    checkoutMutation,
    setAppliedCoupon,
    setCouponError,
    calculateTotals,
  } = useCheckoutProcess();

  const handleApplyCoupon = useCallback(
    (coupon: Coupon, subtotal: number) => {
      if (coupon.minPurchase && subtotal < coupon.minPurchase) {
        setCouponError(
          `Minimum purchase amount of $${coupon.minPurchase} required`
        );
        return;
      }
      setCouponError("");
      setAppliedCoupon(coupon);
    },
    [setCouponError, setAppliedCoupon]
  );

  // Safeguard against undefined checkoutData
  const items = checkoutData?.items || [];
  const { subtotal, discount, total } = calculateTotals(items);

  if (isLoading) {
    return <CheckoutSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load checkout data. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  // Guard against missing checkout data
  if (!checkoutData) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No items in cart. Please add some items first.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 w-full"
    >
      <CardHeader>
        <CardTitle className="text-3xl font-bold">
          {checkoutData.isSingleProduct ? "Quick Checkout" : "Cart Checkout"}
        </CardTitle>
      </CardHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <CartItemComponent
                    key={`${item.product.id}-${index}`}
                    item={item}
                    index={index}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tags className="w-5 h-5" />
                Discount Coupons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AvailableCoupons
                onApplyCoupon={(coupon) => handleApplyCoupon(coupon, subtotal)}
                appliedCoupon={appliedCoupon}
              />

              {couponError && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{couponError}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <PaymentSummary
            subtotal={subtotal}
            discount={discount}
            total={total}
            appliedCoupon={appliedCoupon}
            setAppliedCoupon={setAppliedCoupon}
            setCouponError={setCouponError}
            checkoutMutation={checkoutMutation}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default CheckoutPage;
