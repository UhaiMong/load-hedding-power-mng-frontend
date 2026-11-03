"use client";

import { useState } from "react";
import { useAuth } from "@/app/Providers/AuthProvider";
import { Field, Notice } from "@/app/auth/(auth)/_components/auth-ui";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useSubmit } from "@/lib/use-submit";
import { ROLE_HOME } from "@/lib/constants";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { pending, error, run } = useSubmit();
  const [saved, setSaved] = useState("");
  const [form, setForm] = useState({
    name: user?.name ?? "",
    phone: user?.profile?.phone ?? "",
    address: user?.profile?.address ?? "",
  });

  if (!user) return null;
  const set =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved("");
    run(async () => {
      await api.patch("users/me", {
        name: form.name.trim(),
        phone: form.phone.trim() || null,
        address: form.address.trim() || null,
      });
      await refreshUser();
      setSaved("Profile updated");
    });
  };

  const area = user.profile?.area;
  return (
    <div className="mx-auto w-full max-w-lg space-y-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">My profile</h1>
        <p className="text-sm text-muted-foreground">
          {user.email} · {ROLE_HOME[user.role]}
          {area ? ` · ${area.name} (${area.feeder.name})` : ""}
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <Notice error={error} success={saved} />
        <Field
          label="Full name"
          name="name"
          required
          minLength={2}
          value={form.name}
          onChange={set("name")}
          error={error?.fieldError("name")}
        />
        <Field
          label="Phone"
          name="phone"
          type="tel"
          placeholder="+8801XXXXXXXXX"
          value={form.phone}
          onChange={set("phone")}
          error={error?.fieldError("phone")}
        />
        <Field
          label="Address"
          name="address"
          value={form.address}
          onChange={set("address")}
          error={error?.fieldError("address")}
        />
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </div>
  );
}
