"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { FormField, Select } from "@/components/ui/input";
import { api } from "@/lib/api";
import { ROLE_LABEL, ROLES } from "@/lib/constants";
import type { User } from "@/lib/types";
import { useOptions } from "@/lib/use-options";

const roleOptions = ROLES.map((r) => ({ value: r, label: ROLE_LABEL[r] }));

export function RoleDialog({ user, onClose }: { user: User; onClose: () => void }) {
  const zones = useOptions("zones");
  const [role, setRole] = useState<string>(user.role);
  const [zoneId, setZoneId] = useState(user.profile?.zone?.id ?? "");

  const save = useMutation({
    mutationFn: () => api.patch(`admin/users/${user.id}/role`, { role, zoneId: zoneId || undefined }),
    onSuccess: onClose,
    meta: { success: "Role updated", invalidates: [["admin/users"]] },
  });

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()} title="Change role" description={`${user.name} · ${user.email}`}>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
      >
        <FormField label="Role" error={save.error?.fieldError("role")}>
          <Select value={role} onChange={(e) => setRole(e.target.value)} options={roleOptions} />
        </FormField>
        {role !== "CUSTOMER" && (
          <FormField label="Zone" error={save.error?.fieldError("zoneId")}>
            <Select value={zoneId} onChange={(e) => setZoneId(e.target.value)} placeholder="No zone" options={zones} />
          </FormField>
        )}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" size="lg" onClick={onClose}>Cancel</Button>
          <Button type="submit" size="lg" disabled={save.isPending}>{save.isPending ? "Saving…" : "Save"}</Button>
        </div>
      </form>
    </Dialog>
  );
}
