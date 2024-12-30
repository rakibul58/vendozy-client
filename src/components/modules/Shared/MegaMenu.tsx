"use client";
import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { getCategoryWithProduct } from "@/services/CategoryServices";

interface Category {
  id: string;
  name: string;
  image: string;
  subcategories: {
    name: string;
    items: {
      id: string;
      name: string;
      price: number;
    }[];
  }[];
}

const MegaMenu = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategoryWithProduct,
  });

  const LoadingState = () => (
    <div className="w-[600px] p-4 md:w-[800px]">
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-6 w-24" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <div className="space-y-1">
                {[1, 2, 3].map((j) => (
                  <Skeleton key={j} className="h-4 w-28" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              "transition-colors hover:text-foreground bg-transparent",
              "data-[state=open]:bg-transparent data-[state=open]:text-foreground",
              "hover:bg-transparent focus:bg-transparent",
              "h-auto px-0"
            )}
          >
            Categories
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            {isLoading ? (
              <LoadingState />
            ) : (
              <div className="w-full p-4 md:w-[35vw] bg-popover">
                <div className="grid grid-cols-3 gap-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
                  {categories?.data?.map((category: Category) => (
                    <div key={category.id} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Image
                          src={category.image}
                          alt={category.name}
                          className="w-5 h-5 object-cover rounded"
                          height={100}
                          width={100}
                        />
                        <h3 className="font-medium">{category.name}</h3>
                      </div>
                      {category.subcategories.slice(0, 2).map((subcategory) => (
                        <div key={subcategory.name} className="space-y-1">
                          <h4 className="text-sm font-medium text-muted-foreground">
                            {subcategory.name}
                          </h4>
                          <ul className="space-y-1">
                            {subcategory.items.slice(0, 3).map((item) => (
                              <li key={item.id}>
                                <Link
                                  href={`/products/${item.id}`}
                                  className="text-sm hover:underline flex items-center justify-between group"
                                >
                                  <span className="truncate mr-2">
                                    {item.name}
                                  </span>
                                  <span className="text-muted-foreground group-hover:text-foreground text-xs">
                                    ${Number(item.price).toFixed(2)}
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      <Link
                        href={`/products?category=${category.name}`}
                        className="block text-sm text-primary hover:underline pt-1"
                      >
                        View all {category.name}...
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MegaMenu;
