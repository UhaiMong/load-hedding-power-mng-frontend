"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useSubmit } from "@/lib/use-submit";
import { AuthShell, Field, Link, linkClass, Notice } from "./auth-ui";

export function ForgotPasswordForm() {
  const router = useRouter();
  const { pending, error, run } = useSubmit();
  const [email, setEmail] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    run(async () => {
      const clean = email.trim().toLowerCase();
      await api.post("auth/forgot-password", { email: clean });
      router.push(`/auth/reset-password?email=${encodeURIComponent(clean)}`);
    });
  };

  return (
    <AuthShell
      title="Forgot password"
      description="Enter your email and we'll send a reset code."
      footer={
        <Link href="/auth/login" className={linkClass}>
          Back to login
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Notice error={error} />
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
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Sending…" : "Send reset code"}
        </Button>
      </form>
    </AuthShell>
  );
}
