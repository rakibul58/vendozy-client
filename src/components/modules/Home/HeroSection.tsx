"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Shirt, Laptop, Headphones, Sofa, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const categories = [
  {
    name: "Fashion",
    icon: Shirt,
    color: "text-primary",
    products: [
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZmFzaGlvbnxlbnwwfDB8MHx8fDI%3D",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmFzaGlvbnxlbnwwfDB8MHx8fDI%3D",
      "https://images.unsplash.com/photo-1507297448044-a99b358cd06e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGZhc2hpb258ZW58MHwwfDB8fHwy",
    ],
  },
  {
    name: "Electronics",
    icon: Laptop,
    color: "text-accent",
    products: [
      "https://images.unsplash.com/photo-1635514569146-9a9607ecf303?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=2042&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
  },
  {
    name: "Accessories",
    icon: Headphones,
    color: "text-secondary",
    products: [
      "https://images.unsplash.com/photo-1614860243518-c12eb2fdf66c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/3/www.madebyvadim.com.jpg?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YWNjZXNzb3JpZXMlMjBoZWFkcGhvbmV8ZW58MHx8MHx8fDI%3D",
      "https://images.unsplash.com/photo-1625480860390-16e060eac591?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGFjY2Vzc29yaWVzJTIwaGVhZHBob25lfGVufDB8fDB8fHwy",
    ],
  },
  {
    name: "Home & Living",
    icon: Sofa,
    color: "text-muted-foreground",
    products: [
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG9tZSUyMGRlY29yfGVufDB8MHwwfHx8Mg%3D%3D",
      "https://images.unsplash.com/photo-1593498208655-b1f7ddabaffa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aG9tZSUyMGFuZCUyMGxpdmluZ3xlbnwwfHwwfHx8Mg%3D%3D",
      "https://images.unsplash.com/photo-1604062529349-84280dbff887?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG9tZSUyMGFuZCUyMGxpdmluZ3xlbnwwfHwwfHx8Mg%3D%3D",
    ],
  },
];

const HeroSection = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  return (
    <div className="bg-background text-foreground min-h-[70vh] flex items-center">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Side - Category Selection */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 z-10 order-2 md:order-1"
        >
          <div className="space-y-4 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight">
              Discover <span className="text-primary">Infinite</span> Choices
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed">
              Your ultimate marketplace connecting you with thousands of vendors
              across multiple categories.
            </p>
          </div>

          {/* Category Buttons */}
          <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-4">
            {categories.map((category) => (
              <motion.button
                key={category.name}
                onClick={() => setActiveCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  flex items-center space-x-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full 
                  ${
                    activeCategory.name === category.name
                      ? `bg-primary text-primary-foreground`
                      : `bg-secondary text-secondary-foreground border border-border`
                  }
                  transition-all duration-300 ease-in-out text-sm md:text-base
                `}
              >
                <category.icon
                  className={`${category.color} ${
                    activeCategory.name === category.name
                      ? "text-primary-foreground"
                      : ""
                  }`}
                  size={16}
                />
                <span className="font-medium">{category.name}</span>
              </motion.button>
            ))}
          </div>

          <div className="flex justify-center md:justify-start">
            <Button
              variant="default"
              className="group flex items-center space-x-2"
            >
              Explore All Vendors
              <ChevronRight
                className="ml-2 transition-transform group-hover:translate-x-1"
                size={20}
              />
            </Button>
          </div>
        </motion.div>

        {/* Right Side - Product Carousel */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative order-1 md:order-2"
        >
          <div className="absolute -inset-6 bg-primary/10 rounded-3xl blur-2xl"></div>

          <div className="relative z-10">
            <Carousel className="w-full max-w-md mx-auto">
              <CarouselContent>
                {activeCategory.products.map((product, index) => (
                  <CarouselItem key={index}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="p-1"
                    >
                      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px]">
                        <Image
                          src={product}
                          alt={`${activeCategory.name} Product ${index + 1}`}
                          fill
                          className="rounded-2xl shadow-lg object-cover border border-border"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>

          {/* Vendor Stats Overlay */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="md:absolute -bottom-6 left-1/5 transform -translate-x-1/2 
                        bg-card/90 backdrop-blur-sm shadow-lg rounded-xl 
                        px-4 py-3 md:px-6 md:py-4 flex space-x-4 md:space-x-8 items-center 
                        border border-border max-w-md w-[90%] md:w-full z-[10000]"
          >
            <div className="text-center flex-1">
              <p className="text-2xl md:text-3xl font-bold text-primary">1,200+</p>
              <p className="text-xs md:text-sm text-muted-foreground">Vendors</p>
            </div>
            <div className="h-6 md:h-8 w-px bg-border"></div>
            <div className="text-center flex-1">
              <p className="text-2xl md:text-3xl font-bold text-accent">50,000+</p>
              <p className="text-xs md:text-sm text-muted-foreground">Products</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;