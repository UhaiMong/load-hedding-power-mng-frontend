"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/app/Providers/AuthProvider";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <Button
      variant="outline"
      onClick={async () => {
        await logout();
        router.replace("/auth/login");
        router.refresh();
      }}
    >
      Log out
    </Button>
  );
}
