/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { SidebarGroup, SidebarMenuButton } from "@/components/ui/sidebar";
import {
  Tag,
  Package,
  ShoppingCart,
  Users,
  LucideIcon,
  View,
  User,
  LayoutDashboardIcon,
  Home,
  Key,
  MessageCircleReply,
  Newspaper,
  HomeIcon,
} from "lucide-react";
import Link from "next/link";

// Define route types for each role
interface RouteItem {
  href: string;
  icon: LucideIcon;
  label: string;
}

const adminRoutes: RouteItem[] = [
  {
    href: "/admin/dashboard",
    icon: LayoutDashboardIcon,
    label: "Dashboard",
  },
  {
    href: "/admin/manage-categories",
    icon: Tag,
    label: "Manage Categories",
  },
  {
    href: "/admin/manage-products",
    icon: Package,
    label: "Manage Products",
  },
  {
    href: "/admin/shops",
    icon: HomeIcon,
    label: "Shop Management",
  },
  {
    href: "/admin/customers",
    icon: Users,
    label: "Customer Management",
  },
  {
    href: "/admin/newsletters",
    icon: Newspaper,
    label: "Newsletters",
  },
];

const vendorRoutes: RouteItem[] = [
  {
    href: "/vendor/dashboard",
    icon: LayoutDashboardIcon,
    label: "Dashboard",
  },
  {
    href: "/vendor",
    icon: Home,
    label: "Shop",
  },
  {
    href: "/vendor/manage-products",
    icon: Package,
    label: "Manage Products",
  },
  {
    href: "/vendor/orders",
    icon: ShoppingCart,
    label: "Orders",
  },
  {
    href: "/vendor/reviews",
    icon: MessageCircleReply,
    label: "Reviews",
  },
  {
    href: "/vendor/change-password",
    icon: Key,
    label: "Change Password",
  },
];

const customerRoutes: RouteItem[] = [
  {
    href: "/customer/dashboard",
    icon: LayoutDashboardIcon,
    label: "Dashboard",
  },
  {
    href: "/customer",
    icon: User,
    label: "Profile",
  },
  {
    href: "/customer/manage-orders",
    icon: ShoppingCart,
    label: "Manage Orders",
  },
  {
    href: "/customer/recent-view",
    icon: View,
    label: "Recent Views",
  },
];

export function NavMain({
  role,
  user,
}: {
  role: "ADMIN" | "CUSTOMER" | "VENDOR";
  user: any;
}) {
  // Select routes based on role
  const routes = (() => {
    switch (role) {
      case "ADMIN":
        return adminRoutes;
      case "VENDOR":
        return user.isOnboarded ? vendorRoutes : [];
      case "CUSTOMER":
        return customerRoutes;
      default:
        return [];
    }
  })();

  return (
    <SidebarGroup className="mt-6 space-y-2">
      {routes.map((route: RouteItem) => (
        <SidebarMenuButton key={route.href}>
          <Link
            href={route.href}
            className="flex items-center gap-2 font-bold w-full"
          >
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm w-full">
              <route.icon className="size-5" />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <h1 className="text-sm truncate">{route.label}</h1>
              </div>
            </div>
          </Link>
        </SidebarMenuButton>
      ))}
    </SidebarGroup>
  );
}

export default NavMain;
