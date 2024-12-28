/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ChevronsUpDown, KeyIcon, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUser } from "@/context/user.provider";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { protectedRoutes } from "@/constants";
import { logout } from "@/services/AuthServices";
import Loading from "./LoadingBlur";
import { ModeToggle } from "@/components/ModeToggle";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";

interface UserAvatarDropdownProps {
  user: {
    name: string;
    email: string;
  };
  role: string;
  image?: string;
}

export function NavUser({ user, role, image }: UserAvatarDropdownProps) {
  const { isMobile } = useSidebar();

  const router = useRouter();
  const pathname = usePathname();
  const { setIsLoading: userLoading } = useUser();
  const [isNavigateLoading, setIsNavigateLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    setIsNavigateLoading(true);
    queryClient.invalidateQueries({ queryKey: ["products"] });
    logout();
    userLoading(true);

    if (protectedRoutes.some((route) => pathname.match(route))) {
      router.push("/");
      setIsNavigateLoading(false);
    }

    setIsNavigateLoading(false);
  };

  const getInitials = (name: string) => {
    return (
      name
        ?.split(" ")
        ?.map((word) => word[0])
        ?.join("")
        ?.toUpperCase() || ""
    );
  };

  return (
    <SidebarMenu>
      {isNavigateLoading && <Loading />}
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground z-[105]"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={image} alt={user?.name} />
                <AvatarFallback className="rounded-lg">
                  {getInitials(user?.name) || "CN"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user?.name || "Username"}
                </span>
                <span className="truncate text-xs">
                  {user?.email || "example@gmail.com"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={image} alt={user?.name} />
                  <AvatarFallback className="rounded-lg">
                    {getInitials(user?.name) || "CN"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user?.name || "Username"}
                  </span>
                  <span className="truncate text-xs">
                    {user?.email || "example@gmail.com"}
                  </span>
                </div>
                <ModeToggle />
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href={`/${role?.toLowerCase()}/change-password`}>
                <DropdownMenuItem>
                  <KeyIcon />
                  Change Password
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleLogout()}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
