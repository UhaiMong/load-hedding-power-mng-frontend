"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useSubmit } from "@/lib/use-submit";
import { AuthShell, Field, Link, linkClass, Notice } from "./auth-ui";

export function RegisterForm() {
  const router = useRouter();
  const { pending, error, run } = useSubmit();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const set =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    run(async () => {
      const email = form.email.trim().toLowerCase();
      await api.post("auth/register", {
        name: form.name.trim(),
        email,
        password: form.password,
        ...(form.phone.trim() ? { phone: form.phone.trim() } : {}),
      });
      router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
    });
  };

  return (
    <AuthShell
      title="Create account"
      description="We'll email you a 6-digit code to verify your address."
      footer={
        <span>
          Already registered?{" "}
          <Link href="/auth/login" className={linkClass}>
            Log in
          </Link>
        </span>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Notice error={error} />
        <Field
          label="Full name"
          name="name"
          autoComplete="name"
          required
          minLength={2}
          value={form.name}
          onChange={set("name")}
          error={error?.fieldError("name")}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={set("email")}
          error={error?.fieldError("email")}
        />
        <Field
          label="Phone (optional)"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+8801XXXXXXXXX"
          value={form.phone}
          onChange={set("phone")}
          error={error?.fieldError("phone")}
        />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={form.password}
          onChange={set("password")}
          error={error?.fieldError("password")}
        />
        <p className="text-xs text-muted-foreground">
          At least 8 characters with a letter and a number.
        </p>
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Creating account…" : "Register"}
        </Button>
      </form>
    </AuthShell>
  );
}
