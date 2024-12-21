"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import ShopProducts from "./ShopProducts";
import { useFollowVendor, useGetFollowStatus } from "@/hooks/vendor.hook";
import { useUser } from "@/context/user.provider";

interface Vendor {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  followerCount: number;
  productCount: number;
}

export default function ShopPage({ shop }: { shop: Vendor }) {
  const { data, isFetching: followStatusFetching } = useGetFollowStatus(
    shop?.id
  );
  const { mutate: followVendor, isPending } = useFollowVendor();
  const [followerCount, setFollowerCount] = useState(shop?.followerCount || 0);
  const { user } = useUser();

  const handleFollowToggle = () => {
    if (user?.role == "CUSTOMER") {
      if (data?.isFollowing) {
        setFollowerCount(shop?.followerCount - 1);
      } else {
        setFollowerCount(shop?.followerCount + 1);
      }
      followVendor(shop?.id);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Shop Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-center mb-12 space-y-4 md:space-y-0 md:space-x-8"
      >
        <Image
          src={shop?.logo || "/default-shop-logo.png"}
          alt={shop?.name || "Shop Logo"}
          width={150}
          height={150}
          className="rounded-full shadow-lg"
        />
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold mb-2">{shop?.name}</h1>
          <p className="text-muted-foreground mb-4">{shop?.description}</p>
          <div className="flex items-center justify-center md:justify-start space-x-4">
            <Button
              onClick={handleFollowToggle}
              variant={data?.isFollowing ? "outline" : "default"}
              className="flex items-center"
              disabled={
                isPending || followStatusFetching || user?.role !== "CUSTOMER"
              }
            >
              <Heart className="mr-2 h-4 w-4" />
              {data?.isFollowing ? "Unfollow" : "Follow"}
              {isPending && "..."}
            </Button>
            <span className="text-muted-foreground">
              {followerCount} Followers
            </span>
            <span className="text-muted-foreground">
              {shop?.productCount} Product{shop?.productCount > 0 ? "s" : ""}
            </span>
          </div>
        </div>
      </motion.div>

      <ShopProducts vendor={shop.name} />
    </div>
  );
}
