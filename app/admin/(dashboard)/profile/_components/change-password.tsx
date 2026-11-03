"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormField, Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useCountdown } from "@/lib/use-countdown";
import { Section } from "./section";

const empty = { otp: "", currentPassword: "", newPassword: "", confirm: "" };

export function ChangePassword() {
  const [otpSent, setOtpSent] = useState(false);
  const [form, setForm] = useState(empty);
  const cooldown = useCountdown();

  const sendOtp = useMutation({
    mutationFn: () => api.post("auth/change-password/send-otp"),
    onSuccess: () => {
      setOtpSent(true);
      cooldown.start(60);
    },
    meta: { success: "OTP sent to your email" },
  });

  const change = useMutation({
    mutationFn: () =>
      api.post("auth/change-password", {
        otp: form.otp.trim(),
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      }),
    onSuccess: () => {
      setForm(empty);
      setOtpSent(false);
    },
    meta: { success: "Password changed" },
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));
  const err = (name: string) => change.error?.fieldError(name);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword !== form.confirm) return void toast.error("New passwords do not match");
    change.mutate();
  };

  const resend = (
    <Button
      type="button"
      variant="outline"
      size="lg"
      disabled={sendOtp.isPending || cooldown.left > 0}
      onClick={() => sendOtp.mutate()}
    >
      {sendOtp.isPending ? "Sending…" : cooldown.left > 0 ? `Resend in ${cooldown.left}s` : otpSent ? "Resend OTP" : "Send OTP"}
    </Button>
  );

  return (
    <Section title="Change password" description="We'll email you a 6-digit code to confirm the change.">
      {!otpSent ? (
        resend
      ) : (
        <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
          <FormField label="OTP code" error={err("otp")} className="sm:col-span-2">
            <Input required inputMode="numeric" maxLength={6} placeholder="123456" value={form.otp} onChange={set("otp")} />
          </FormField>
          <FormField label="Current password" error={err("currentPassword")} className="sm:col-span-2">
            <Input required type="password" autoComplete="current-password" value={form.currentPassword} onChange={set("currentPassword")} />
          </FormField>
          <FormField label="New password" error={err("newPassword")}>
            <Input required type="password" minLength={8} autoComplete="new-password" value={form.newPassword} onChange={set("newPassword")} />
          </FormField>
          <FormField label="Confirm new password">
            <Input required type="password" autoComplete="new-password" value={form.confirm} onChange={set("confirm")} />
          </FormField>
          <div className="flex flex-wrap gap-2 sm:col-span-2">
            <Button type="submit" size="lg" disabled={change.isPending}>
              {change.isPending ? "Updating…" : "Update password"}
            </Button>
            {resend}
          </div>
        </form>
      )}
    </Section>
  );
}
