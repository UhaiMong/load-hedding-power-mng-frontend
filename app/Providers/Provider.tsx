"use client";
import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import { makeQueryClient } from "@/lib/query-client";
import { AuthProvider } from "./AuthProvider";
export default function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(makeQueryClient);
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
      <Toaster position="top-right" richColors />
    </SessionProvider>
  );
}
