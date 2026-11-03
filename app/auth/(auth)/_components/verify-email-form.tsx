"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/app/Providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { ApiError, api } from "@/lib/api";
import { homeFor } from "@/lib/constants";
import { useCountdown } from "@/lib/use-countdown";
import { useSubmit } from "@/lib/use-submit";
import { AuthShell, Field, Link, linkClass, Notice } from "./auth-ui";

export function VerifyEmailForm() {
  const initialEmail = useSearchParams().get("email") ?? "";
  const { refreshUser } = useAuth();
  const router = useRouter();
  const verify = useSubmit();
  const resend = useSubmit();
  const cooldown = useCountdown();
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verify.run(async () => {
      await api.post("auth/verify-email", {
        email: email.trim().toLowerCase(),
        otp,
      }); // also logs the user in
      const me = await refreshUser();
      if (!me)
        throw new ApiError(
          500,
          "Verified, but your profile could not be loaded. Please log in",
        );
      router.replace(homeFor(me.role));
      router.refresh();
    });
  };

  const onResend = () => {
    setSent("");
    resend.run(async () => {
      try {
        await api.post("auth/resend-otp", {
          email: email.trim().toLowerCase(),
        });
        setSent("If the account needs verification, a new code was sent.");
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
      title="Verify your email"
      description="Enter the 6-digit code we emailed you. It expires in 10 minutes."
      footer={
        <Link href="/auth/login" className={linkClass}>
          Back to login
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Notice error={verify.error ?? resend.error} success={sent} />
        <Field
          label="Email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={verify.error?.fieldError("email")}
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
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          error={verify.error?.fieldError("otp")}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={verify.pending || otp.length !== 6}
        >
          {verify.pending ? "Verifying…" : "Verify email"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onResend}
          disabled={resend.pending || cooldown.left > 0 || !email}
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
