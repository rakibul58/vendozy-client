"use client";


import { ThemeProvider } from "@/components/theme-provider";
import UserProvider from "@/context/user.provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

export interface ProvidersProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <ThemeProvider>
          <Toaster />
          {children}
        </ThemeProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}
