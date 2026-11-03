"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/app/Providers/AuthProvider";
import type { Role } from "@/lib/constants";
import { homeFor } from "@/lib/constants";

/** Client-side gate for dashboards: needs a loaded user (and optionally one of `roles`). */
export function AuthGuard({ roles, children }: { roles?: Role[]; children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const allowed = !!user && (!roles || roles.includes(user.role));

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/auth/login");
    else if (!allowed) router.replace(homeFor(user.role));
  }, [loading, user, allowed, router]);

  if (loading || !allowed) return <p className="p-6 text-sm text-muted-foreground">Loading…</p>;
  return <>{children}</>;
}
