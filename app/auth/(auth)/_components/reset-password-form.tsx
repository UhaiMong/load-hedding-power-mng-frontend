"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ApiError, api } from "@/lib/api";
import { useCountdown } from "@/lib/use-countdown";
import { useSubmit } from "@/lib/use-submit";
import { AuthShell, Field, Link, linkClass, Notice } from "./auth-ui";

export function ResetPasswordForm() {
  const initialEmail = useSearchParams().get("email") ?? "";
  const router = useRouter();
  const reset = useSubmit();
  const resend = useSubmit();
  const cooldown = useCountdown();
  const [form, setForm] = useState({
    email: initialEmail,
    otp: "",
    newPassword: "",
  });
  const [sent, setSent] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reset.run(async () => {
      await api.post("auth/reset-password", {
        email: form.email.trim().toLowerCase(),
        otp: form.otp,
        newPassword: form.newPassword,
      });
      router.replace("/auth/login?reset=1");
    });
  };

  const onResend = () => {
    setSent("");
    resend.run(async () => {
      try {
        await api.post("auth/forgot-password", {
          email: form.email.trim().toLowerCase(),
        });
        setSent("If an account exists, a new code was sent.");
        cooldown.start(60);
      } catch (err) {
        if (err instanceof ApiError && err.status === 429) {
          const wait = Number(err.errors[0]?.retryAfterSeconds);
          if (wait > 0) cooldown.start(wait);
        }
        throw err;
      }
    });
  };

  return (
    <AuthShell
      title="Reset password"
      description="Enter the code from your email and choose a new password."
      footer={
        <Link href="/auth/login" className={linkClass}>
          Back to login
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Notice error={reset.error ?? resend.error} success={sent} />
        <Field
          label="Email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          error={reset.error?.fieldError("email")}
        />
        <Field
          label="OTP code"
          name="otp"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d{6}"
          maxLength={6}
          placeholder="123456"
          required
          value={form.otp}
          onChange={(e) =>
            setForm((f) => ({ ...f, otp: e.target.value.replace(/\D/g, "") }))
          }
          error={reset.error?.fieldError("otp")}
        />
        <Field
          label="New password"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={form.newPassword}
          onChange={(e) =>
            setForm((f) => ({ ...f, newPassword: e.target.value }))
          }
          error={reset.error?.fieldError("newPassword")}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={reset.pending || form.otp.length !== 6}
        >
          {reset.pending ? "Resetting…" : "Reset password"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onResend}
          disabled={resend.pending || cooldown.left > 0 || !form.email}
        >
          {cooldown.left > 0
            ? `Resend code in ${cooldown.left}s`
            : resend.pending
              ? "Sending…"
              : "Resend code"}
        </Button>
      </form>
    </AuthShell>
  );
}
