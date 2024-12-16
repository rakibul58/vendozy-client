"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Flame } from "lucide-react";

const FlashSaleCTA = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
        repeatType: "reverse",
      }}
      className="bg-gradient-to-r from-primary to-accent p-12 rounded-xl shadow-2xl w-full mx-auto my-10"
    >
      <div className="flex items-center flex-wrap justify-between space-y-4">
        <div className="flex items-center space-x-4">
          <Flame className="text-white w-12 h-12 animate-pulse" />
          <div>
            <h2 className="text-2xl font-bold text-white">Flash Sale Alert!</h2>
            <p className="text-white/80 mt-2">
              Limited time offers - Up to 70% off on select items
            </p>
          </div>
        </div>

        <Link href="/products?isFlashSale=true" passHref>
          <Button
            variant="secondary"
            className="bg-white text-accent hover:bg-gray-100 transition-all duration-300 font-bold"
          >
            Shop Flash Sale Now
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default FlashSaleCTA;
