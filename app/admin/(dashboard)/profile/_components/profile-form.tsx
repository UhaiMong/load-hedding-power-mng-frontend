"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/app/Providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { FormField, Input, Select } from "@/components/ui/input";
import { api } from "@/lib/api";
import type { Area, User } from "@/lib/types";
import { useApi } from "@/lib/use-api";
import { Section } from "./section";

export function ProfileForm({ user }: { user: User }) {
  const { refreshUser } = useAuth();
  const isCustomer = user.role === "CUSTOMER";
  const [form, setForm] = useState({
    name: user.name,
    phone: user.profile?.phone ?? "",
    address: user.profile?.address ?? "",
    areaId: user.profile?.area?.id ?? "",
  });
  const areas = useApi<Area[]>(isCustomer ? "areas" : null, { limit: 100, sortBy: "name", order: "asc" });

  const save = useMutation({
    mutationFn: () =>
      api.patch("users/me", {
        name: form.name.trim(),
        phone: form.phone.trim() || null,
        address: form.address.trim() || null,
        ...(isCustomer && form.areaId ? { areaId: form.areaId } : {}),
      }),
    onSuccess: () => refreshUser(),
    meta: { success: "Profile updated" },
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));
  const err = (name: string) => save.error?.fieldError(name);

  return (
    <Section title="Personal information">
      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
      >
        <FormField label="Full name" error={err("name")}>
          <Input required minLength={2} value={form.name} onChange={set("name")} />
        </FormField>
        <FormField label="Phone" error={err("phone")}>
          <Input type="tel" placeholder="+8801XXXXXXXXX" value={form.phone} onChange={set("phone")} />
        </FormField>
        <FormField label="Address" error={err("address")} className="sm:col-span-2">
          <Input value={form.address} onChange={set("address")} />
        </FormField>
        {isCustomer && (
          <FormField label="My area" error={err("areaId")} className="sm:col-span-2">
            <Select
              value={form.areaId}
              onChange={set("areaId")}
              placeholder={areas.isPending ? "Loading areas…" : "Select your area"}
              options={areas.data?.data.map((a) => ({ value: a.id, label: `${a.name} (${a.code})` }))}
            />
          </FormField>
        )}
        <div className="sm:col-span-2">
          <Button type="submit" size="lg" disabled={save.isPending}>
            {save.isPending ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>
    </Section>
  );
}
