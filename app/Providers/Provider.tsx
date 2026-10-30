"use client";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
export default function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      {children}
      <Toaster position="top-right" />
    </SessionProvider>
  );
}
