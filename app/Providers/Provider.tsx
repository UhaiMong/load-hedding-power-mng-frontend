"use client";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "./AuthProvider";
export default function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <AuthProvider>{children}</AuthProvider>
      <Toaster position="top-right" />
    </SessionProvider>
  );
}
