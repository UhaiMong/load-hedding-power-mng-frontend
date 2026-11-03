"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/app/Providers/AuthProvider";
import { Loading } from "@/components/common/states";
import { homeFor } from "@/lib/constants";

/** /admin → the signed-in role's dashboard. */
export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (user) router.replace(homeFor(user.role));
  }, [user, router]);
  return <Loading />;
}
