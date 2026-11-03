"use client";

import { QueryState } from "@/components/common/states";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { ROLE_LABEL } from "@/lib/constants";
import { fmtDateTime } from "@/lib/format";
import type { User } from "@/lib/types";
import { useApi } from "@/lib/use-api";

export function UserDialog({ id, onClose }: { id: string; onClose: () => void }) {
  const q = useApi<User>(`admin/users/${id}`);
  const u = q.data?.data;
  const p = u?.profile;

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()} title="User details">
      <QueryState query={q}>
        {u && (
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center overflow-hidden rounded-full bg-muted font-semibold">
                {u.image ? <img src={u.image} alt="" className="size-full object-cover" /> : u.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium">{u.name}</p>
                <p className="text-muted-foreground">{u.email}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              <Badge tone="blue">{ROLE_LABEL[u.role] ?? u.role}</Badge>
              <Badge tone={u.isActive !== false ? "green" : "gray"}>{u.isActive !== false ? "Active" : "Inactive"}</Badge>
              <Badge tone={u.emailVerified ? "green" : "yellow"}>{u.emailVerified ? "Verified" : "Unverified"}</Badge>
              {u.role === "TECHNICIAN" && <Badge tone={p?.isAvailable ? "green" : "gray"}>{p?.isAvailable ? "On duty" : "Off duty"}</Badge>}
            </div>
            <dl className="grid gap-3 sm:grid-cols-2">
              {[
                ["Phone", p?.phone],
                ["Address", p?.address],
                ["Meter no.", p?.meterNumber],
                ["Area", p?.area?.name],
                ["Zone", p?.zone?.name],
                ["Joined", fmtDateTime(u.createdAt)],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd>{value || "—"}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </QueryState>
    </Dialog>
  );
}
