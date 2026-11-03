"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/app/Providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { homeFor } from "@/lib/constants";
import { useSubmit } from "@/lib/use-submit";
import { AuthShell, Field, Link, linkClass, Notice } from "./auth-ui";
import { DemoLogin } from "./demo-login";

export function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") ?? undefined;
  const notice = params.get("reset")
    ? "Password updated. Please log in."
    : undefined;
  const { login } = useAuth();
  const router = useRouter();
  const { pending, error, run } = useSubmit();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    run(async () => {
      const me = await login(email.trim(), password);
      // only follow same-site relative paths
      const safe =
        next?.startsWith("/") && !next.startsWith("//")
          ? next
          : homeFor(me.role);
      router.replace(safe);
      router.refresh();
    });
  };

  return (
    <AuthShell
      title="Welcome back"
      description="Log in to manage outages, schedules and bills."
      footer={
        <span>
          No account?{" "}
          <Link href="/auth/register" className={linkClass}>
            Register
          </Link>
        </span>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Notice error={error} success={notice} />
        {error?.code === "EMAIL_NOT_VERIFIED" && (
          <Link
            href={`/auth/verify-email?email=${encodeURIComponent(email)}`}
            className={`${linkClass} text-sm`}
          >
            Verify your email with an OTP →
          </Link>
        )}
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error?.fieldError("email")}
        />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error?.fieldError("password")}
        />
        <div className="text-right text-sm">
          <Link href="/auth/forgot-password" className={linkClass}>
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Logging in…" : "Log in"}
        </Button>
      </form>
      <DemoLogin />
    </AuthShell>
  );
}
