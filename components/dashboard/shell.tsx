"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/app/Providers/AuthProvider";
import { AuthNav } from "@/components/auth-nav";
import { companyName, ROLE_LABEL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { navFor } from "./nav-items";
import { NotificationBell } from "./notification-bell";

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { user } = useAuth();
  const pathname = usePathname();
  if (!user) return null;

  return (
    <nav className="flex h-full flex-col gap-1 p-3">
      <Link href="/" className="mb-4 flex items-center gap-2 px-2 py-1" onClick={onNavigate}>
        <Image src="/logo/logo.png" alt={companyName} width={32} height={32} className="h-8 w-auto" />
        <span className="truncate text-sm font-semibold">Power Portal</span>
      </Link>
      {navFor(user.role).map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm",
              active ? "bg-primary text-primary-foreground" : "hover:bg-muted",
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        );
      })}
      <p className="mt-auto px-3 pt-4 text-xs text-muted-foreground">
        Signed in as {ROLE_LABEL[user.role]}
      </p>
    </nav>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r bg-background md:block">
        <Sidebar />
      </aside>

      {/* mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="relative h-full w-64 bg-background shadow-lg">
            <button
              type="button"
              aria-label="Close menu"
              className="absolute top-3 right-3 rounded p-1 hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              <X className="size-4" />
            </button>
            <Sidebar onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b bg-background px-4">
          <button
            type="button"
            aria-label="Open menu"
            className="rounded p-1 hover:bg-muted md:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" />
          </button>
          <div className="ml-auto flex items-center gap-3">
            <NotificationBell />
            <AuthNav />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
