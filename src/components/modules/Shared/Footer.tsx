"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Facebook, Twitter, Instagram, Github } from "lucide-react";

const Footer = () => {
  const categories = [
    "Sports & Outdoors",
    "Fashion",
    "Books",
    "Electronics",
    "Home and Living",
  ];

  const customerServices = [
    { href: "/help", label: "Help Center" },
    { href: "/returns", label: "Returns" },
    { href: "/shipping", label: "Shipping Info" },
    { href: "/faq", label: "FAQs" },
  ];

  const aboutLinks = [
    { href: "/about", label: "About Us" },
    { href: "/careers", label: "Careers" },
    { href: "/press", label: "Press" },
    { href: "/contact", label: "Contact Us" },
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

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-primary text-foreground mt-10 border-t border-muted-foreground"
    >
      <div className="container mx-auto px-4 py-10 grid gap-8 grid-cols-1 md:grid-cols-4">
        {/* Shop by Category */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Shop by Category</h3>
          <ul className="space-y-2">
            {categories.map((category, index) => (
              <li
                key={index}
                className="text-sm hover:text-muted-foreground transition"
              >
                <Link href={`/products?category=${category}`}>
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
          <ul className="space-y-2">
            {customerServices.map((service) => (
              <li
                key={service.href}
                className="text-sm hover:text-muted-foreground transition"
              >
                <Link href={service.href}>{service.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* About */}
        <div>
          <h3 className="text-lg font-semibold mb-4">About</h3>
          <ul className="space-y-2">
            {aboutLinks.map((link) => (
              <li
                key={link.href}
                className="text-sm hover:text-muted-foreground transition"
              >
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Media & App Download */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex gap-4 mb-6">
            {socialLinks.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="transition-transform hover:scale-110"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-accent py-4 text-center text-sm text-foreground">
        <p>&copy; {new Date().getFullYear()} Vendozy. All rights reserved.</p>
      </div>
    </motion.footer>
  );
};

export default Footer;
