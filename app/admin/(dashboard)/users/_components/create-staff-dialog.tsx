"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { FormField, Input, Select } from "@/components/ui/input";
import { api } from "@/lib/api";
import { ROLE_LABEL, ROLES } from "@/lib/constants";
import { useOptions } from "@/lib/use-options";

const staffRoles = ROLES.filter((r) => r !== "CUSTOMER").map((r) => ({ value: r, label: ROLE_LABEL[r] }));

export function CreateStaffDialog({ onClose }: { onClose: () => void }) {
  const zones = useOptions("zones");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "OPERATOR", phone: "", zoneId: "" });

  const create = useMutation({
    mutationFn: () =>
      api.post("admin/users", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        phone: form.phone.trim() || undefined,
        zoneId: form.zoneId || undefined,
      }),
    onSuccess: onClose,
    meta: { success: "Staff account created", invalidates: [["admin/users"]] },
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));
  const err = (n: string) => create.error?.fieldError(n);

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()} title="Create staff account" description="Staff accounts are verified and can log in right away.">
      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          create.mutate();
        }}
      >
        <FormField label="Full name" error={err("name")}>
          <Input required minLength={2} value={form.name} onChange={set("name")} />
        </FormField>
        <FormField label="Email" error={err("email")}>
          <Input type="email" required value={form.email} onChange={set("email")} />
        </FormField>
        <FormField label="Password" error={err("password")}>
          <Input type="password" required minLength={8} autoComplete="new-password" value={form.password} onChange={set("password")} />
        </FormField>
        <FormField label="Phone" error={err("phone")}>
          <Input type="tel" placeholder="+8801XXXXXXXXX" value={form.phone} onChange={set("phone")} />
        </FormField>
        <FormField label="Role" error={err("role")}>
          <Select value={form.role} onChange={set("role")} options={staffRoles} />
        </FormField>
        <FormField label="Zone" error={err("zoneId")}>
          <Select value={form.zoneId} onChange={set("zoneId")} placeholder="No zone" options={zones} />
        </FormField>
        <div className="flex justify-end gap-2 sm:col-span-2">
          <Button type="button" variant="outline" size="lg" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="lg" disabled={create.isPending}>{create.isPending ? "Creating…" : "Create"}</Button>
        </div>
      </form>
    </Dialog>
  );
}
