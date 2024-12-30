/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Facebook,
  Twitter,
  Instagram,
  Github,
  Store,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import envConfig from "@/config/envConfig";
import axios from "axios";

const Footer = () => {
  const categories = [
    "Sports & Outdoors",
    "Fashion",
    "Books",
    "Electronics",
    "Home and Living",
  ];

  const customerServices = [
    { href: "/terms-and-conditions", label: "General Terms" },
    { href: "/terms-and-conditions", label: "Privacy and Data" },
    { href: "/terms-and-conditions", label: "Usage Rules" },
    { href: "/terms-and-conditions", label: "Your Rights" },
  ];

  const aboutLinks = [
    { href: "/about", label: "About Us" },
    { href: "/about", label: "Why Choose Us" },
    { href: "/about", label: "Our Mission" },
    { href: "/about", label: "Team" },
  ];

  const socialLinks = [
    {
      href: "https://facebook.com",
      icon: <Facebook className="h-5 w-5" />,
      label: "Facebook",
    },
    {
      href: "https://twitter.com",
      icon: <Twitter className="h-5 w-5" />,
      label: "Twitter",
    },
    {
      href: "https://instagram.com",
      icon: <Instagram className="h-5 w-5" />,
      label: "Instagram",
    },
    {
      href: "https://github.com",
      icon: <Github className="h-5 w-5" />,
      label: "GitHub",
    },
  ];

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

      setEmail("");
      toast.success("Subscribed Successfully!");
    } catch (error: any) {
      toast.error("Failed to Subscribe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-primary mt-10"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Newsletter Section */}
        <div className="py-12 border-b border-primary-foreground/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-2">
                Subscribe to our newsletter
              </h2>
              <p className="text-primary-foreground/80">
                Stay updated with our latest deals and products
              </p>
            </div>
            <form
              onSubmit={handleSubmit}
              className="flex w-full max-w-md gap-2"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="bg-primary-foreground/10 border-primary-foreground/20 text-white placeholder:text-primary-foreground/50"
              />
              <Button type="submit" disabled={loading} variant={"secondary"}>
                {loading ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-white">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Store className="h-6 w-6" />
              <span className="font-bold text-xl">Vendozy</span>
            </div>
            <div className="space-y-3 text-primary-foreground/80">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Colonel Hat, Chattogram
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> +8801850415714
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> rhrahi14@gmail.com
              </p>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.map((category, index) => (
                <li key={index}>
                  <Link
                    href={`/products?category=${category}`}
                    className="text-primary-foreground/80 hover:text-white transition-colors"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[...customerServices, ...aboutLinks].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="bg-primary-foreground/10 p-2 rounded-full hover:bg-primary-foreground/20 transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="py-4 border-t border-primary-foreground/10 text-center text-primary-foreground/80">
          <p>&copy; {new Date().getFullYear()} Vendozy. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
