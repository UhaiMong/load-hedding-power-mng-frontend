import Link from "next/link";
import { ZapOff } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <ZapOff className="size-12 text-primary" />
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="max-w-sm text-sm text-muted-foreground">Looks like this page lost power. It may have moved or never existed.</p>
      <div className="flex gap-2">
        <Link href="/" className={buttonVariants({ size: "lg" })}>Go home</Link>
        <Link href="/admin" className={buttonVariants({ size: "lg", variant: "outline" })}>Dashboard</Link>
      </div>
    </main>
  );
}
