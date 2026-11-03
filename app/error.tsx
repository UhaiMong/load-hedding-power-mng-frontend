"use client";

import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <TriangleAlert className="size-12 text-destructive" />
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="max-w-sm text-sm text-muted-foreground">{error.message || "An unexpected error occurred."}</p>
      <div className="flex gap-2">
        <Button size="lg" onClick={reset}>Try again</Button>
        <Link href="/" className={buttonVariants({ size: "lg", variant: "outline" })}>Go home</Link>
      </div>
    </main>
  );
}
