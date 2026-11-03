"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import type { Role } from "@/lib/constants";
import { homeFor } from "@/lib/constants";
import { canAccess } from "@/lib/routes";
import { useAuth } from "@/app/Providers/AuthProvider";
import { Loading } from "@/components/common/states";

/** Client-side gate for dashboards: needs a loaded user allowed on this path (or one of `roles`). */
export function AuthGuard({
  roles,
  children,
}: {
  roles?: Role[];
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const allowed =
    !!user && (roles ? roles.includes(user.role) : canAccess(pathname, user.role));

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace(`/auth/login?next=${encodeURIComponent(pathname)}`);
    else if (!allowed) router.replace(homeFor(user.role));
  }, [loading, user, allowed, router, pathname]);

  if (loading || !allowed) return <Loading className="min-h-screen" />;
  return <>{children}</>;
}
