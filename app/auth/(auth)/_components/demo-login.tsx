"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/app/Providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { DEMO_ACCOUNTS, DEMO_PASSWORD, homeFor, ROLE_LABEL, type Role } from "@/lib/constants";
import { useSubmit } from "@/lib/use-submit";
import { Notice } from "./auth-ui";

/** One-click login with the backend seed accounts, then go to that role's dashboard. */
export function DemoLogin() {
  const { login } = useAuth();
  const router = useRouter();
  const { pending, error, run } = useSubmit();
  const [active, setActive] = useState<Role | null>(null);

  const demo = (role: Role, email: string) => {
    setActive(role);
    run(async () => {
      const me = await login(email, DEMO_PASSWORD);
      router.replace(homeFor(me.role));
      router.refresh();
    }).finally(() => setActive(null));
  };

  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> OR <span className="h-px flex-1 bg-border" />
      </div>
      <p className="text-center text-sm font-medium">🚀 Quick Demo Login</p>
      <Notice error={error} />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {DEMO_ACCOUNTS.map(({ role, email, emoji }) => (
          <div key={role} className="flex flex-col items-center gap-2 rounded-lg border p-3 text-center">
            <span className="text-sm font-medium">
              {emoji} {ROLE_LABEL[role]}
            </span>
            <Button size="sm" variant="outline" className="w-full" disabled={pending} onClick={() => demo(role, email)}>
              {active === role ? "Logging in…" : "Demo Login"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
