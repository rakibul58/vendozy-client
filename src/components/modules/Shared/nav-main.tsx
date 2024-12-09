/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { SidebarGroup, SidebarMenuButton } from "@/components/ui/sidebar";
import { 
  Tag, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  Home, 
  BarChart, 
  LucideIcon 
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
    href: "/admin/manage-categories",
    icon: Tag,
    label: "Manage Categories"
  },
  {
    href: "/admin/manage-products",
    icon: Package,
    label: "Manage Products"
  },
  {
    href: "/admin/users",
    icon: Users,
    label: "User Management"
  },
  {
    href: "/admin/dashboard",
    icon: BarChart,
    label: "Dashboard"
  }
];

const vendorRoutes: RouteItem[] = [
  {
    href: "/vendor/products",
    icon: Package,
    label: "My Products"
  },
  {
    href: "/vendor/orders",
    icon: ShoppingCart,
    label: "Orders"
  },
  {
    href: "/vendor/dashboard",
    icon: Home,
    label: "Vendor Dashboard"
  }
];

const customerRoutes: RouteItem[] = [
  {
    href: "/customer/orders",
    icon: ShoppingCart,
    label: "My Orders"
  },
  {
    href: "/customer/profile",
    icon: Settings,
    label: "Profile Settings"
  }
];

export function NavMain({ role, user }: { role: "ADMIN" | "CUSTOMER" | "VENDOR", user: any }) {
  // Select routes based on role
  const routes = (() => {
    switch (role) {
      case "ADMIN": return adminRoutes;
      case "VENDOR": return  user.isOnboarded ? vendorRoutes : [];
      case "CUSTOMER": return customerRoutes;
      default: return [];
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