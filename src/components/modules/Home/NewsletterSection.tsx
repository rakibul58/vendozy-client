/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import envConfig from "@/config/envConfig";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${envConfig.baseApi}/users/newsletter/subscribe`,
        { email }
      );

      toast.success("Subscribed Successfully!");
      setEmail("");
    } catch (error: any) {
      toast.error("Failed to Subscribe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full py-16 bg-gradient-to-r from-accent/90 to-primary/90 my-20 rounded-xl shadow-2xl mx-auto">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight mb-4 text-white ">
            Stay Updated with Our Newsletter
          </h2>
          <p className="mb-8 text-white ">
            Subscribe to get the latest products, offers, and inspiring stories
            delivered to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-white"
            />
            <Button
              type="submit"
              disabled={loading}
              className="bg-white hover:bg-gray-100 text-accent font-bold"
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
