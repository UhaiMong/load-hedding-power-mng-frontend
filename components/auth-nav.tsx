"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/app/Providers/AuthProvider";
import { homeFor, ROLE_HOME } from "@/lib/constants";

const itemClass =
  "block w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-muted";

/** Navbar slot: Login/Register when logged out, avatar menu (Dashboard, Profile, Logout) when logged in. */
export function AuthNav() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (loading)
    return (
      <div
        className="h-9 w-9 animate-pulse rounded-full bg-muted"
        aria-hidden
      />
    );

  if (!user) {
    return (
      <div className="flex items-center gap-4 text-sm">
        <Link href="/auth/login" className="font-medium hover:underline">
          Login
        </Link>
        <Link
          href="/auth/register"
          className="rounded-md bg-primary px-3 py-1.5 font-medium text-primary-foreground"
        >
          Register
        </Link>
      </div>
    );
  }

  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border bg-muted text-sm font-semibold"
      >
        {user.image ? (
          <img src={user.image} alt="" className="h-full w-full object-cover" />
        ) : (
          initials
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-56 rounded-md border bg-background p-1 shadow-md"
        >
          <div className="border-b px-3 py-2">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {ROLE_HOME[user.role]}
            </p>
          </div>
          <Link
            role="menuitem"
            href={homeFor(user.role)}
            onClick={() => setOpen(false)}
            className={itemClass}
          >
            Dashboard
          </Link>
          <Link
            role="menuitem"
            href="/admin/profile"
            onClick={() => setOpen(false)}
            className={itemClass}
          >
            Profile
          </Link>
          <button
            type="button"
            role="menuitem"
            className={`${itemClass} text-destructive`}
            onClick={async () => {
              setOpen(false);
              await logout();
              router.replace("/");
              router.refresh();
            }}
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
