"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { Menu, ShoppingCart, Store } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";
import { useUser } from "@/context/user.provider";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/services/AuthServices";
import Loading from "./LoadingBlur";
import { protectedRoutes } from "@/constants";
import UserAvatarDropdown from "./UserAvatarDropdown";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, setIsLoading: userLoading } = useUser();
  const [isNavigateLoading, setIsNavigateLoading] = useState(false);

  const handleLogout = async () => {
    setIsNavigateLoading(true);
    logout();
    userLoading(true);

    if (protectedRoutes.some((route) => pathname.match(route))) {
      router.push("/");
      setIsNavigateLoading(false);
    }

    setIsNavigateLoading(false);
  };

  const menuItems = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
  ];

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-[1000] bg-background"
    >
      {isNavigateLoading && <Loading />}
      <header className="flex items-center justify-between px-4 py-3 md:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold justify-center"
        >
          <Store />
          <h1 className="font-serif italic text-lg">Vendozy</h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground transition-colors hover:text-foreground font-medium"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Navigation Toggle */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-4">
            <SheetTitle></SheetTitle>
            <SheetDescription></SheetDescription>
            <nav className="flex flex-col gap-4">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground text-lg font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Theme Toggle & Additional Icons */}
        <div className="flex items-center gap-4">
          {user?.role === "CUSTOMER" && (
            <Link href="/cart">
              <Button variant="outline" size="icon" className="rounded-full">
                <ShoppingCart className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
              </Button>
            </Link>
          )}
          <ModeToggle />
          {user ? (
            <UserAvatarDropdown
              user={user?.user}
              onLogout={handleLogout}
              role={user?.role}
              image={
                user?.role === "VENDOR" ? user.user.logo : user.user.profileImg
              }
            />
          ) : (
            <Link href="/login">
              <Button variant={"outline"}>Login</Button>
            </Link>
          )}
        </div>
      </header>
    </motion.div>
  );
};

export default Navbar;
