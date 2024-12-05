"use client";

import { SidebarGroup, SidebarMenuButton } from "@/components/ui/sidebar";
import { LucideIcon } from "lucide-react";

export function NavMain({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarMenuButton className="px-4">Platform</SidebarMenuButton>
    </SidebarGroup>
  );
}
