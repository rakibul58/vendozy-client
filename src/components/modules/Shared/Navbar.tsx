/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Search, ShoppingCart, Store, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/ModeToggle";
import { useUser } from "@/context/user.provider";
import { useCartStore } from "@/store/cart.store";
import UserAvatarDropdown from "./UserAvatarDropdown";
import MegaMenu from "./MegaMenu";
import { useQueryClient } from "@tanstack/react-query";
import { logout } from "@/services/AuthServices";
import { protectedRoutes } from "@/constants";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, setIsLoading: userLoading } = useUser();
  const { isOpen: cartModalIsOpen, setIsOpen: cartModalSetIsOpen } =
    useCartStore();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
    await logout();
    userLoading(true);
    if (protectedRoutes.some((route) => pathname.match(route))) {
      router.push("/");
    }
  };

  const handleSearch = (e: any) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?searchTerm=${encodeURIComponent(searchQuery)}`);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mainMenu = [
    { href: "/products", label: "Products" },
    { href: "/shop", label: "Shops" },
    { href: "/products?isFlashSale=true", label: "Flash Sale" },
    { href: "/about", label: "About" },
  ];

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 w-full z-[100] bg-background transition-all duration-300 ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="bg-primary/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-1.5">
          <p className="text-center text-white text-sm font-medium">
            Free Express Shipping on All Orders
          </p>
        </div>
      </div>

      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-6xl mx-auto">
          <div className="flex h-16 items-center px-4">
            <Link href="/" className="flex items-center gap-2 mr-6">
              <Store className="h-6 w-6" />
              <span className="font-bold text-xl">Vendozy</span>
            </Link>

            <div className="hidden md:flex items-center gap-6 mr-6">
              <MegaMenu />
              {mainMenu.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-1 items-center justify-end gap-4">
              <form
                onSubmit={handleSearch}
                className="hidden md:flex w-full max-w-sm"
              >
                <div className="relative w-full">
                  <Input
                    type="search"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-8"
                  />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </form>

              <div className="flex items-center gap-4">
                {user?.role === "CUSTOMER" && (
                  <>
                    <Button
                      onClick={() => cartModalSetIsOpen(!cartModalIsOpen)}
                      variant="ghost"
                      size="icon"
                      className="relative"
                    >
                      <ShoppingCart className="h-5 w-5" />
                    </Button>
                  </>
                )}

                <ModeToggle />

                {user ? (
                  <UserAvatarDropdown
                    user={user.user}
                    onLogout={handleLogout}
                    role={user.role}
                    image={
                      user.role === "VENDOR"
                        ? user.user.logo
                        : user.user.profileImg
                    }
                  />
                ) : (
                  <Link href="/login">
                    <Button>Login</Button>
                  </Link>
                )}

                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild className="md:hidden">
                    <Button variant="ghost" size="icon">
                      <Menu className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="z-[105]">
                    <SheetTitle />
                    <div className="flex flex-col gap-4 mt-8">
                      <form onSubmit={handleSearch} className="flex mb-4">
                        <Input
                          placeholder="Search products..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </form>
                      {mainMenu.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="text-sm font-medium py-2"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Navbar;
