"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/app/Providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { FormField, Input, Select } from "@/components/ui/input";
import { api } from "@/lib/api";
import type { User } from "@/lib/types";
import { useApi } from "@/lib/use-api";

export function CreateBillDialog({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  // only admins can list users; operators paste the customer id
  const customers = useApi<User[]>(isAdmin ? "admin/users" : null, { role: "CUSTOMER", isActive: true, sortBy: "name", order: "asc", limit: 100 });
  const [form, setForm] = useState({ customerId: "", billingMonth: "", units: "", dueDate: "" });

  const create = useMutation({
    mutationFn: () =>
      api.post("bills", {
        customerId: form.customerId.trim(),
        billingMonth: form.billingMonth,
        units: Number(form.units),
        dueDate: new Date(`${form.dueDate}T00:00:00`).toISOString(),
      }),
    onSuccess: onClose,
    meta: { success: "Bill created", invalidates: [["bills"]] },
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));
  const err = (n: string) => create.error?.fieldError(n);

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()} title="Create bill" description="The amount is calculated from units using the tiered tariff.">
      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          create.mutate();
        }}
      >
        <FormField label="Customer" error={err("customerId")} className="sm:col-span-2">
          {isAdmin ? (
            <Select
              required
              value={form.customerId}
              onChange={set("customerId")}
              placeholder={customers.isPending ? "Loading customers…" : "Select customer…"}
              options={customers.data?.data.map((c) => ({
                value: c.id,
                label: `${c.name} · ${c.profile?.meterNumber ?? c.email}`,
              }))}
            />
          ) : (
            <Input required placeholder="Customer ID" value={form.customerId} onChange={set("customerId")} />
          )}
        </FormField>
        <FormField label="Billing month" error={err("billingMonth")}>
          <Input type="month" required value={form.billingMonth} onChange={set("billingMonth")} />
        </FormField>
        <FormField label="Units (kWh)" error={err("units")}>
          <Input type="number" min={0} step="any" required value={form.units} onChange={set("units")} />
        </FormField>
        <FormField label="Due date" error={err("dueDate")} className="sm:col-span-2">
          <Input type="date" required value={form.dueDate} onChange={set("dueDate")} />
        </FormField>
        <div className="flex justify-end gap-2 sm:col-span-2">
          <Button type="button" variant="outline" size="lg" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="lg" disabled={create.isPending}>{create.isPending ? "Creating…" : "Create bill"}</Button>
        </div>
      </form>
    </Dialog>
  );
}
