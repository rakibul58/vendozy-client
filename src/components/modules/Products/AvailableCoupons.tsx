import React from 'react';
import { motion } from 'motion/react';
import { useAvailableCoupons } from '@/hooks/order.hook';

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minPurchase?: number;
}

interface AvailableCouponsProps {
  onApplyCoupon: (coupon: Coupon) => void;
  appliedCoupon: Coupon | null;
}

export const AvailableCoupons: React.FC<AvailableCouponsProps> = ({
  onApplyCoupon,
  appliedCoupon,
}) => {
  const { data: coupons, isLoading } = useAvailableCoupons({ validNow: true, isActive: true });

  if (isLoading) {
    return <div className="animate-pulse h-20 bg-secondary/20 rounded-lg" />;
  }

  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Available Coupons</h3>
      <div className="grid gap-2">
        {coupons?.data?.map((coupon: Coupon) => (
          <motion.div
            key={coupon.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`p-3 border rounded-lg cursor-pointer transition-colors
              ${
                appliedCoupon?.id === coupon.id
                  ? "bg-primary/10 border-primary"
                  : "hover:bg-secondary/10"
              }`}
            onClick={() => onApplyCoupon(coupon)}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{coupon.code}</p>
                <p className="text-sm text-muted-foreground">
                  {coupon.description}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-primary">
                  {coupon.discountType === "PERCENTAGE"
                    ? `${coupon.discountValue}% OFF`
                    : `$${coupon.discountValue} OFF`}
                </p>
                {coupon.minPurchase && (
                  <p className="text-xs text-muted-foreground">
                    Min. purchase: ${coupon.minPurchase}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
