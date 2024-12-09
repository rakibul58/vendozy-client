"use client";

import * as React from "react";
import { Store } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import Link from "next/link";
import { useUser } from "@/context/user.provider";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarContent>
          <Link href="/" className="flex items-center gap-2 font-bold">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Store />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <h1 className="font-serif italic text-lg truncate">Vendozy</h1>
              </div>
            </div>
          </Link>
        </SidebarContent>
      </SidebarHeader>
      <SidebarContent>
        <NavMain role={user?.role} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={user?.user}
          role={user?.role}
          image={
            user?.role === "VENDOR" ? user?.user?.logo : user?.user?.profileImg
          }
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
