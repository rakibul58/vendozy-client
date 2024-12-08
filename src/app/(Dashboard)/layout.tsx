"use client";

import { AppSidebar } from "@/components/modules/Shared/AppSidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import React from "react";

// Mapping to convert route segments to readable titles
const routeTitles: { [key: string]: string } = {
  dashboard: "Dashboard",
  "data-fetching": "Data Fetching",
  "building-application": "Building Your Application",
  // Add more route-to-title mappings as needed
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Split the pathname and filter out empty segments
  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  // Generate breadcrumb items
  const breadcrumbItems = pathSegments.map((segment, index) => {
    // Convert kebab-case to title case
    const title =
      routeTitles[segment] ||
      segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    // Check if this is the last segment (current page)
    const isLastSegment = index === pathSegments.length - 1;

    // Construct the href for the link (cumulative path)
    const href = "/" + pathSegments.slice(0, index + 1).join("/");

    if (isLastSegment) {
      return (
        <BreadcrumbItem key={segment}>
          <BreadcrumbPage>{title}</BreadcrumbPage>
        </BreadcrumbItem>
      );
    }

    return (
      <React.Fragment key={segment}>
        <BreadcrumbItem>
          <BreadcrumbLink href={href}>{title}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
      </React.Fragment>
    );
  });

  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {/* Home link (optional) */}
                {pathSegments.length > 0 && (
                  <>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </>
                )}
                {breadcrumbItems}
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
